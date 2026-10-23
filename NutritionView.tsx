import React, { useState } from 'react';
import {
  UserProfile,
  MealEntry,
  MealType,
  HealthClassification,
} from '../types';
import {
  Salad,
  Plus,
  Trash2,
  AlertCircle,
  Apple,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { getMeals, saveMeals } from '../utils/storage';

interface NutritionViewProps {
  profile: UserProfile | null;
  showToast: (msg: string) => void;
}

const CLASSIFICATION_COLORS: Record<HealthClassification, { badge: string; label: string }> = {
  Healthy: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Healthy' },
  Normal: { badge: 'bg-teal-50 text-teal-700 border-teal-200', label: 'Balanced' },
  Poor: { badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Modest' },
  Unhealthy: { badge: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Indulgent' },
};

export const NutritionView: React.FC<NutritionViewProps> = ({ profile, showToast }) => {
  const [meals, setMeals] = useState<MealEntry[]>(() => getMeals());
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [selectedMealType, setSelectedMealType] = useState<MealType>('Breakfast');
  const [foodItems, setFoodItems] = useState('');
  const [quantity, setQuantity] = useState('');
  const [classification, setClassification] = useState<HealthClassification>('Healthy');
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItems.trim()) return;

    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      date: todayStr,
      mealType: selectedMealType,
      foodItems: foodItems.trim(),
      quantity: quantity.trim() || '1 standard serving',
      classification,
      notes: notes.trim() || undefined,
    };

    const updated = [newMeal, ...meals];
    setMeals(updated);
    saveMeals(updated);
    showToast(`✓ Logged ${selectedMealType}`);

    // Reset
    setFoodItems('');
    setQuantity('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleDeleteMeal = (id: string) => {
    const updated = meals.filter((m) => m.id !== id);
    setMeals(updated);
    saveMeals(updated);
    showToast('Meal removed');
  };

  // Personalized General Diet Plan based on user profile & goal
  const userGoal = profile?.wellnessGoal || 'Manage everyday stress';
  const bmiCategory = profile?.bmiCategory || 'Healthy Weight';

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>🥗</span>
            Nutrition & Nourishment Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nourish your brain and body with non-restrictive, wholesome foods. Track meals and view supportive guidance.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Close Form' : 'Log a Meal'}
        </button>
      </div>

      {/* Non-Shaming Supportive Feedback Banner */}
      <div className="rounded-2xl bg-teal-50/70 p-4 border border-teal-200/80 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-950 leading-relaxed">
          <span className="font-bold block mb-0.5">Mindful Nourishment Philosophy:</span>
          "Food is fuel and comfort for both mind and body. If a meal felt less balanced, there is never any guilt—consider balancing your next meal with vegetables, lean protein, whole grains, or crisp fresh fruit."
        </div>
      </div>

      {/* ADD MEAL FORM */}
      {showAddForm && (
        <form
          onSubmit={handleAddMeal}
          className="rounded-3xl bg-white p-5 md:p-6 border border-teal-200 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Add Meal Entry</h3>
            <span className="text-xs text-slate-400">Date: {todayStr}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Meal Timing</label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value as MealType)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Health Quality Classification
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as HealthClassification)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
              >
                <option value="Healthy">Healthy (Whole foods, high nutrient density)</option>
                <option value="Normal">Balanced (Mixed, everyday meal)</option>
                <option value="Poor">Modest (Lower micronutrients, quick bite)</option>
                <option value="Unhealthy">Indulgent (Fried, ultra-processed, sugary)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Consumed Food Items <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={foodItems}
                onChange={(e) => setFoodItems(e.target.value)}
                placeholder="e.g. Oatmeal with berries, walnuts and cinnamon"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity / Portion</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 1 medium bowl, 1 glass"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Optional Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Felt energized and light afterwards"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
            >
              Save Meal
            </button>
          </div>
        </form>
      )}

      {/* MEALS LOG TABLE */}
      <div className="rounded-3xl bg-white p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Salad className="h-4 w-4 text-teal-600" />
            Logged Meals & Nourishment History
          </h3>
          <span className="text-[11px] text-slate-400">{meals.length} total entries</span>
        </div>

        {meals.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No meals logged yet. Click "Log a Meal" to record your food intake.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Meal</th>
                  <th className="py-2.5 px-3">Consumed Food Items</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {meals.map((meal) => {
                  const conf = CLASSIFICATION_COLORS[meal.classification] || CLASSIFICATION_COLORS.Normal;
                  return (
                    <tr key={meal.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-medium text-slate-500 whitespace-nowrap">
                        {meal.date}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {meal.mealType}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">{meal.foodItems}</td>
                      <td className="py-3 px-3 text-slate-600">{meal.quantity}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${conf.badge}`}
                        >
                          {conf.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate">
                        {meal.notes || '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete meal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PERSONALIZED GENERAL DIET PLAN */}
      <div className="rounded-3xl bg-linear-to-br from-teal-50/40 via-white to-sky-50/30 p-6 md:p-8 border border-teal-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Apple className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                🥗 My General Nutrition Plan
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Aligned with your profile goal: <strong>"{userGoal}"</strong> ({bmiCategory})
            </p>
          </div>

          <span className="rounded-full bg-teal-100/70 text-teal-800 text-[11px] font-semibold px-3 py-1 self-start sm:self-auto">
            Whole-Food Focus
          </span>
        </div>

        {/* Meal Times Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {/* Morning */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              Morning (7–8 AM)
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Energizing Breakfast</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Warm water with lemon, followed by steel-cut oatmeal with blueberries, pumpkin seeds, and Greek yogurt or plant-based kefir.
            </p>
          </div>

          {/* Mid-Morning */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              Mid-Morning (10:30 AM)
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Brain Fuel Snack</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Handful of raw almonds, walnuts, and green tea or chamomile infusion to stabilize blood glucose.
            </p>
          </div>

          {/* Afternoon */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              Afternoon (1–2 PM)
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Balanced Nourish Lunch</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Rainbow salad bowl: quinoa or brown rice, leafy greens, chickpeas, steamed vegetables, and avocado tahini dressing.
            </p>
          </div>

          {/* Evening */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              Evening (4:30 PM)
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Light Recharging Snack</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Crisp apple slices with natural almond butter or roasted spiced edamame with 1 large glass of water.
            </p>
          </div>

          {/* Night */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              Night (7–8 PM)
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Restorative Dinner</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Warm lentil or vegetable stew with steamed broccoli and roasted sweet potato. Finish with warm turmeric golden milk before bed.
            </p>
          </div>
        </div>

        {/* Mandatory Nutrition Disclaimer */}
        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200/70 text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Clinical & Nutritional Notice:</strong> "These are general nutrition suggestions and are not a personalized medical diet prescription. Individuals with diabetes, food allergies, renal conditions, or gastrointestinal disorders should consult a registered dietitian (RD) or primary care physician before modifying dietary patterns."
          </p>
        </div>
      </div>
    </div>
  );
};
