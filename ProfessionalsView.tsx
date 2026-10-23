import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  Video,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Building2,
} from 'lucide-react';
import { Appointment } from '../types';
import { getAppointments, saveAppointments } from '../utils/storage';

interface ProfessionalsViewProps {
  showToast: (msg: string) => void;
}

const DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Eleanor Vance, MD',
    specialty: 'Board Certified Psychiatrist',
    hospital: 'University Health Center & Hospital Wellness',
    experience: '14 years clinical experience',
    availableTime: 'Tomorrow at 10:00 AM',
    mode: 'Telehealth & In-Person',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Chen, PsyD',
    specialty: 'Clinical Psychologist (CBT & Mindfulness)',
    hospital: 'Metropolitan Behavioral Institute',
    experience: '11 years clinical experience',
    availableTime: 'Friday at 2:30 PM',
    mode: 'Telehealth',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'doc-3',
    name: 'Sarah Jenkins, LMHC',
    specialty: 'Licensed Mental Health Counselor',
    hospital: 'Community Wellness Center',
    experience: '8 years clinical experience',
    availableTime: 'Monday at 11:00 AM',
    mode: 'In-Person',
    imageUrl: 'https://images.unsplash.com/photo-1594824813639-509f6e522961?w=800&auto=format&fit=crop&q=80',
  },
];

export const ProfessionalsView: React.FC<ProfessionalsViewProps> = ({ showToast }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => getAppointments());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0].name);
  const [selectedType, setSelectedType] = useState('Psychiatrist');
  const [bookingDate, setBookingDate] = useState('2026-09-15');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [mode, setMode] = useState<'Telehealth' | 'In-Person'>('Telehealth');
  const [reason, setReason] = useState('Review screening report and discuss stress coping strategies.');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      providerName: selectedDoctor,
      providerType: selectedType as any,
      date: bookingDate,
      time: bookingTime,
      mode,
      reason,
      status: 'Confirmed',
    };

    const updated = [newAppt, ...appointments];
    setAppointments(updated);
    saveAppointments(updated);
    showToast('✓ Appointment booked and added to schedule');
    setShowBookingModal(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>👨‍⚕️</span>
            Healthcare Professional Support & Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect your MindCare screening reports with licensed psychiatrists, clinical psychologists, and therapists.
          </p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition"
        >
          <Plus className="h-4 w-4" />
          Schedule Consultation
        </button>
      </div>

      {/* Verified Clinicians Directory */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Affiliated Healthcare Providers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="h-14 w-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                    <span className="text-[11px] font-medium text-teal-700 block">
                      {doc.specialty}
                    </span>
                    <span className="text-[10px] text-slate-400">{doc.experience}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-slate-400" />
                    <span className="line-clamp-1">{doc.hospital}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>Next Slot: {doc.availableTime}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDoctor(doc.name);
                  setShowBookingModal(true);
                }}
                className="w-full rounded-xl bg-teal-50 py-2 text-xs font-bold text-teal-700 hover:bg-teal-600 hover:text-white transition"
              >
                Book with {doc.name.split(' ')[1]}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Appointments List */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-600" />
            Your Scheduled Appointments
          </h3>
          <span className="text-xs text-slate-400">{appointments.length} scheduled</span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No consultations scheduled yet.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{appt.providerName}</span>
                    <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                      {appt.providerType}
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {appt.date} at {appt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-3.5 w-3.5 text-slate-400" />
                      {appt.mode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic mt-0.5">"{appt.reason}"</p>
                </div>

                <div className="text-right shrink-0">
                  <button
                    onClick={() => {
                      alert('Reminder notification set for this session.');
                      showToast('Notification alert set for appointment');
                    }}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    Set Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Book Clinician Consultation</h3>

            <form onSubmit={handleBook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Provider</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                >
                  {DOCTORS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('Telehealth')}
                    className={`rounded-xl p-2 text-xs font-bold border transition ${
                      mode === 'Telehealth'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Telehealth (Secure Video)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('In-Person')}
                    className={`rounded-xl p-2 text-xs font-bold border transition ${
                      mode === 'In-Person'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    In-Person Clinic Visit
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Visit / Clinical Notes
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
