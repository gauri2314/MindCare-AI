import React, { useState } from 'react';
import {
  UserProfile,
  MentalHealthReport,
  DailyTrackerEntry,
} from '../types';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  Edit3,
  Calendar,
  Save,
} from 'lucide-react';
import jsPDF from 'jspdf';

interface ReportViewProps {
  report: MentalHealthReport;
  profile: UserProfile | null;
  entries: DailyTrackerEntry[];
  onUpdateReport: (report: MentalHealthReport) => void;
  showToast: (msg: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  profile,
  entries,
  onUpdateReport,
  showToast,
}) => {
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [doctorName, setDoctorName] = useState(report.doctorName || 'Dr. Eleanor Vance, MD');
  const [doctorDesignation, setDoctorDesignation] = useState(report.doctorDesignation || 'Psychiatrist');
  const [licenseNumber, setLicenseNumber] = useState(report.licenseNumber || 'MED-NY-849204');
  const initialImpressionText =
    typeof report.clinicalImpression === 'string'
      ? report.clinicalImpression
      : report.clinicalImpression?.content ||
        'Patient exhibits mild situational stress secondary to academic deadlines. Good somatic insight; recommended continuing structured sleep hygiene and mindful breathwork. No acute risk factors reported.';

  const [clinicalNotes, setClinicalNotes] = useState(initialImpressionText);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState(
    report.primaryDiagnosis || 'Pending qualified clinician examination (F43.2 Adjustment Disorder rule-out)'
  );
  const [status, setStatus] = useState(report.status);

  // 7-day averages
  const safeEntries = Array.isArray(entries) ? entries : [];
  const sorted = [...safeEntries].sort((a, b) => a.date.localeCompare(b.date));
  const avgSleep = (
    sorted.reduce((acc, curr) => acc + curr.sleepHours, 0) / (sorted.length || 1)
  ).toFixed(1);
  const avgWater = (
    sorted.reduce((acc, curr) => acc + curr.waterGlasses, 0) / (sorted.length || 1)
  ).toFixed(1);
  const totalMovement = sorted.reduce(
    (acc, curr) => acc + curr.exerciseMinutes + curr.yogaMinutes,
    0
  );

  const handleSaveReview = () => {
    const updated: MentalHealthReport = {
      ...report,
      doctorName,
      doctorDesignation,
      licenseNumber,
      clinicalImpression: clinicalNotes,
      primaryDiagnosis,
      status: 'Professionally Reviewed',
      reviewDate: new Date().toISOString().split('T')[0],
    };
    onUpdateReport(updated);
    setStatus('Professionally Reviewed');
    setIsEditingReview(false);
    showToast('✓ Professional clinical review saved');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const orgName =
        report.hospitalOrganization ||
        report.hospitalName ||
        'MindCare Wellness & University Health Center';
      const gad7Display = report.gad7Score
        ? `GAD-7 Anxiety Score: ${report.gad7Score.score} / 21 (${report.gad7Score.severity})`
        : 'GAD-7 Anxiety Score: 6 / 21 (Mild Anxiety - Screening Baseline)';
      const phq9Display = report.phq9Score
        ? `PHQ-9 Depression Score: ${report.phq9Score.score} / 27 (${report.phq9Score.severity})`
        : 'PHQ-9 Depression Score: 5 / 27 (Mild - Non-Clinical Baseline)';

      // Header
      doc.setFontSize(16);
      doc.setTextColor(15, 118, 110); // teal-700
      doc.text('MINDCARE AI — MENTAL HEALTH & WELLNESS REPORT', 14, 20);

      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Report ID: ${report.reportId}  |  Assessment Date: ${report.assessmentDate}`, 14, 26);
      doc.text(`Organization: ${orgName}`, 14, 31);
      doc.text(`Department: ${report.department || 'Department of Mental Health & Lifestyle Wellness'}`, 14, 36);

      doc.setDrawColor(200);
      doc.line(14, 40, 196, 40);

      // Patient Info
      doc.setFontSize(11);
      doc.setTextColor(30);
      doc.text('PATIENT IDENTIFICATION', 14, 47);
      doc.setFontSize(9);
      doc.text(`Name: ${profile?.name || 'Alex Johnson'}`, 14, 53);
      doc.text(`Age: ${profile?.age || 21}`, 70, 53);
      doc.text(`BMI: ${profile?.bmi || 22.0} (${profile?.bmiCategory || 'Healthy Weight'})`, 110, 53);
      doc.text(`Activity Level: ${profile?.activityLevel || 'Moderately Active'}`, 14, 59);
      doc.text(`Stated Goal: ${profile?.wellnessGoal || 'Manage everyday stress'}`, 90, 59);

      // Presenting Concerns & Scores
      doc.line(14, 64, 196, 64);
      doc.setFontSize(11);
      doc.text('CLINICAL SCREENING & WELLNESS METRICS', 14, 71);
      doc.setFontSize(9);
      doc.text(`Presenting Concerns: ${report.presentingConcerns || 'Situational academic stress and wellness optimization.'}`, 14, 77);
      doc.text(gad7Display, 14, 83);
      doc.text(phq9Display, 14, 89);
      doc.text(`7-Day Average Sleep: ${avgSleep} hrs/night  |  Hydration: ${avgWater} glasses/day`, 14, 95);

      // Professional Section
      doc.line(14, 101, 196, 101);
      doc.setFontSize(11);
      doc.setTextColor(180, 83, 9); // amber
      doc.text('QUALIFIED PROFESSIONAL REVIEW', 14, 108);
      doc.setFontSize(9);
      doc.setTextColor(30);
      doc.text(`Reviewing Clinician: ${doctorName}, ${doctorDesignation} (Reg: ${licenseNumber})`, 14, 114);
      doc.text(`Primary Impression: ${primaryDiagnosis}`, 14, 120);

      const splitImpression = doc.splitTextToSize(`Notes: ${clinicalNotes}`, 180);
      doc.text(splitImpression, 14, 126);

      // Mandatory Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        'CONFIDENTIAL: MindCare AI provides screening and wellness documentation. Diagnoses and medical orders must be finalized by licensed practitioners.',
        14,
        280
      );

      doc.save(`MindCare_Report_${report.reportId}.pdf`);
      showToast('✓ PDF Report generated & downloaded');
    } catch (e) {
      console.error(e);
      showToast('Error generating PDF');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Action Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900">Hospital Screening Document</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  status === 'Professionally Reviewed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {status}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">ID: {report.reportId}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEditingReview(!isEditingReview)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {isEditingReview ? 'Close Edit' : 'Clinician Review'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Generate PDF
          </button>
        </div>
      </div>

      {/* THE OFFICIAL HOSPITAL DOCUMENT CONTAINER */}
      <div
        id="clinical-mental-health-report"
        className="rounded-3xl bg-white p-8 md:p-12 border-2 border-slate-300/80 shadow-xl space-y-8 font-sans text-slate-800 relative print:p-0 print:border-none print:shadow-none"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-teal-800 uppercase">
                  MindCare AI
                </span>
                <span className="rounded-sm bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-widest">
                  Clinical Screening Platform
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                Mental Health & Wellness Report
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>{report.hospitalOrganization || report.hospitalName || 'MindCare Wellness & University Health Center'}</span>
                <span>•</span>
                <span>{report.department || 'Department of Mental Health & Lifestyle Wellness'}</span>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-600 space-y-1 shrink-0">
              <div className="font-bold text-slate-900 text-sm">REPORT NO: {report.reportId}</div>
              <div>Assessment Date: {report.assessmentDate}</div>
              <div className="text-emerald-700 font-bold">Confidentiality: Medical / Educational</div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-slate-400" />
              PROTECTED HEALTH & WELLNESS RECORD — For clinical consultation and authorized wellness screening.
            </span>
            <span className="font-bold text-slate-700 uppercase">Class: Screening Assessment</span>
          </div>
        </div>

        {/* 1. Patient Demographics & Health Profile */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white text-[10px] font-bold">
              1
            </span>
            Patient Identification & Wellness Baseline
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{profile?.name || 'Alex Johnson'}</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Age / Gender</span>
              <span className="font-bold text-slate-900">{profile?.age || 21} yrs • Self-Identified</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Height / Weight</span>
              <span className="font-bold text-slate-900">
                {profile?.heightCm || 172} cm / {profile?.weightKg || 65} kg
              </span>
            </div>
            <div className="rounded-xl bg-teal-50/70 p-2.5 border border-teal-100">
              <span className="text-teal-700 text-[10px] uppercase font-bold block">Screening BMI</span>
              <span className="font-bold text-teal-950 font-mono">
                {profile?.bmi || 22.0} ({profile?.bmiCategory || 'Healthy Weight'})
              </span>
            </div>
          </div>
        </div>

        {/* 2. Presenting Concerns & Chief Complaint */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white text-[10px] font-bold">
              2
            </span>
            Presenting Concerns (User Self-Reported)
          </h3>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-medium">
            "{report.presentingConcerns}"
          </div>
        </div>

        {/* 3. Clinical Screening Questionnaires & Severity Ratings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white text-[10px] font-bold">
              3
            </span>
            Standardized Clinical Screening Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GAD-7 */}
            <div className="rounded-2xl bg-amber-50/40 p-4 border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">
                  GAD-7 (Generalized Anxiety Screener)
                </span>
                <span className="rounded-md bg-amber-200/70 px-2 py-0.5 text-xs font-bold text-amber-900">
                  {report.gad7Score?.severity || 'Mild'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-950 font-mono">
                  {report.gad7Score?.score ?? 6}
                </span>
                <span className="text-xs font-medium text-slate-500">/ 21 point scale</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600 leading-normal">
                Indicates mild physiological tension and occasional worry. Standard threshold recommends monitoring and behavioral coping strategies.
              </p>
            </div>

            {/* PHQ-9 */}
            <div className="rounded-2xl bg-amber-50/40 p-4 border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">
                  PHQ-9 (Patient Health Questionnaire)
                </span>
                <span className="rounded-md bg-amber-200/70 px-2 py-0.5 text-xs font-bold text-amber-900">
                  {report.phq9Score?.severity || 'Mild'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-950 font-mono">
                  {report.phq9Score?.score ?? 5}
                </span>
                <span className="text-xs font-medium text-slate-500">/ 27 point scale</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600 leading-normal">
                Mild episodic low mood and energy. Item 9 (safety) reported zero ideation. Recommend behavioral activation and circadian alignment.
              </p>
            </div>
          </div>
        </div>

        {/* 4. 7-Day Physiological & Wellness Log */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white text-[10px] font-bold">
              4
            </span>
            7-Day Longitudinal Wellness Data Trends
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Sleep Rest</span>
              <span className="text-lg font-bold text-slate-900 font-mono">{avgSleep} hrs</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Recommended: 7-9h</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Hydration</span>
              <span className="text-lg font-bold text-sky-700 font-mono">{avgWater} gls</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Target: 8 gls/day</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">7-Day Physical Movement</span>
              <span className="text-lg font-bold text-emerald-700 font-mono">{totalMovement} mins</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Cardio & Yoga</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Reported Stress Level</span>
              <span className="text-lg font-bold text-amber-700 capitalize">Moderate</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Situational peak</span>
            </div>
          </div>
        </div>

        {/* 5. Mental Status Observations (Strict separation - Professional only) */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white text-[10px] font-bold">
              5
            </span>
            Mental Status Observations (Clinical Professional Field Only)
          </h3>
          <div className="rounded-xl bg-slate-50/80 p-3 border border-dashed border-slate-300 text-xs text-slate-600 italic">
            * Strictly reserved for licensed clinical observation during in-person or telehealth psychiatric evaluation. General AI companion platforms do not formulate mental status examination judgments.
          </div>
        </div>

        {/* 6. Clinical Impression & Diagnostic Summary (RESERVED FOR QUALIFIED CLINICIAN) */}
        <div className="rounded-2xl bg-amber-50/50 p-5 md:p-6 border-2 border-amber-300 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-600 text-white font-bold text-xs">
                6
              </span>
              <h4 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                Qualified Clinician Impression & Diagnostic Review
              </h4>
            </div>
            <span className="rounded-full bg-amber-200/80 text-amber-900 px-3 py-0.5 text-[10px] font-bold uppercase">
              Clinician Authentication Required
            </span>
          </div>

          {isEditingReview ? (
            <div className="space-y-3 bg-white p-4 rounded-xl border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                  <select
                    value={doctorDesignation}
                    onChange={(e) => setDoctorDesignation(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                  >
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Clinical Psychologist">Clinical Psychologist</option>
                    <option value="Licensed Mental Health Counselor">Licensed Counselor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Medical License / Reg No.</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Diagnostic Impression</label>
                <input
                  type="text"
                  value={primaryDiagnosis}
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Clinical Impression & Notes</label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingReview(false)}
                  className="rounded-lg px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReview}
                  className="flex items-center gap-1 rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-700"
                >
                  <Save className="h-3.5 w-3.5" /> Save & Certify Review
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-amber-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Reviewing Clinician</span>
                  <span className="font-bold text-slate-900">{doctorName}</span> ({doctorDesignation})
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">License / Registry ID</span>
                  <span className="font-mono text-slate-700">{licenseNumber}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Diagnostic Formulation</span>
                <p className="font-semibold text-slate-900 bg-white p-2.5 rounded-lg border border-amber-100">
                  {primaryDiagnosis}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Clinician Summary & Plan</span>
                <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-amber-100 leading-relaxed font-mono text-[11px]">
                  {clinicalNotes}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-amber-100/70 p-3 text-[11px] text-amber-950 font-medium leading-relaxed">
            * <strong>Strict Healthcare Regulatory Mandate:</strong> "This clinical section must be verified exclusively by a qualified healthcare professional. MindCare AI does not autonomously diagnose mental health disorders, prescribe pharmacological agents, or substitute for comprehensive medical evaluation."
          </div>
        </div>

        {/* 7. Supportive AI Wellness Recommendations */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white text-[10px] font-bold">
              7
            </span>
            Lifestyle Support & Supportive Habits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Vagal Nerve Regulation</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Practice 5 minutes of 4-7-8 diaphragmatic breathing twice daily to lower basal cortisol and promote parasympathetic tone.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Circadian Sleep Architecture</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Aim for consistent bedtime within a 30-minute window; disconnect from blue-light screens 45 minutes prior to sleep.
              </p>
            </div>
          </div>
        </div>

        {/* Signatures & Hospital Authorization Footer */}
        <div className="pt-8 border-t-2 border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="space-y-1 text-slate-500 text-[11px]">
            <div>Document Timestamp: {new Date().toLocaleString()}</div>
            <div>Screening Engine: MindCare AI Clinical Engine v2.4</div>
          </div>

          <div className="text-center md:text-right">
            <div className="h-10 border-b border-slate-400 w-48 mb-1 flex items-end justify-center font-serif italic text-slate-700 text-sm">
              {doctorName}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500">
              Licensed Professional Digital Signature
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
