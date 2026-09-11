import React, { useState } from 'react';
import { AppState, RoutineItem } from '../types';
import { speakText } from '../utils/speech';
import { Check, Plus, Volume2, Sparkles, Clock } from 'lucide-react';

interface RoutineViewProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  largeText: boolean;
}

export const RoutineView: React.FC<RoutineViewProps> = ({ state, updateState, largeText }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  const completedCount = state.routine.filter((r) => r.completed).length;
  const totalCount = state.routine.length;

  const toggleItem = (id: string) => {
    const targetItem = state.routine.find((r) => r.id === id);
    if (!targetItem) return;

    const newCompletedState = !targetItem.completed;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    updateState((prev) => {
      const updatedRoutine = prev.routine.map((r) =>
        r.id === id ? { ...r, completed: newCompletedState } : r
      );

      // Add to caregiver activity logs if marked completed
      const newLogs = newCompletedState
        ? [
            {
              id: 'log_' + Date.now(),
              name: targetItem.title,
              status: 'Completed' as const,
              timestamp: now,
            },
            ...prev.activityLogs,
          ]
        : prev.activityLogs;

      return {
        ...prev,
        routine: updatedRoutine,
        activityLogs: newLogs,
        lastActivityTime: 'Just now',
      };
    });
  };

  const handleReadRemaining = () => {
    const uncompleted = state.routine.filter((r) => !r.completed);
    if (uncompleted.length === 0) {
      speakText('Wonderful news! You have completed all your routine tasks for today.');
    } else {
      const taskList = uncompleted.map((t) => `${t.title} around ${t.timeHint}`).join(', ');
      speakText(`You have ${uncompleted.length} routine items remaining today: ${taskList}.`);
    }
  };

  const handleAddRoutineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: RoutineItem = {
      id: 'rt_' + Date.now(),
      title: newTitle.trim(),
      timeHint: newTime.trim() || 'Anytime',
      icon: '⭐',
      completed: false,
    };

    updateState((prev) => ({
      ...prev,
      routine: [...prev.routine, newItem],
    }));

    setNewTitle('');
    setNewTime('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Routine Header */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
          <div>
            <h2 className={`${largeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-bold text-stone-900 flex items-center gap-2`}>
              <span>✅</span>
              <span>Daily Routine</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Gentle reminders to keep your day healthy and peaceful.
            </p>
          </div>
          <button
            onClick={handleReadRemaining}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            title="Read remaining routine tasks"
            aria-label="Read remaining routine tasks"
          >
            <Volume2 className="w-5 h-5 text-emerald-800" />
          </button>
        </div>

        {/* Progress Display */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-sm sm:text-base font-semibold mb-1.5">
            <span className="text-stone-800">
              Completed Today:{' '}
              <span className="text-emerald-800">
                {completedCount} of {totalCount}
              </span>
            </span>
            <span className="text-xs sm:text-sm text-stone-500 font-normal">
              {Math.round((completedCount / (totalCount || 1)) * 100)}% done
            </span>
          </div>

          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
            <div
              className="bg-[#1f4737] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((completedCount / (totalCount || 1)) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Routine Checklist */}
      <div className="space-y-2.5">
        {state.routine.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3.5 sm:p-4 rounded-lg border transition-colors flex items-center justify-between cursor-pointer select-none ${
              item.completed
                ? 'bg-stone-50 border-stone-200 text-stone-600'
                : 'bg-white border-stone-200 hover:border-stone-300 text-stone-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Checkbox button */}
              <div
                className={`w-7 h-7 rounded border flex items-center justify-center transition-colors ${
                  item.completed
                    ? 'bg-[#1f4737] border-[#1f4737] text-white'
                    : 'border-stone-300 bg-white'
                }`}
                aria-hidden="true"
              >
                {item.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span
                    className={`${largeText ? 'text-lg sm:text-xl' : 'text-base'} font-medium ${
                      item.completed ? 'line-through text-stone-500' : 'text-stone-900'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                {item.timeHint && (
                  <div className="flex items-center space-x-1 text-xs text-stone-500 mt-0.5 ml-6">
                    <Clock className="w-3 h-3" />
                    <span>Suggested time: {item.timeHint}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  item.completed
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {item.completed ? 'Completed' : 'To Do'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Routine Item */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 border border-dashed border-stone-300 hover:border-stone-400 rounded-lg text-stone-700 hover:text-stone-900 font-medium text-sm flex items-center justify-center space-x-2 transition-colors bg-white cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-800" />
          <span>Add Custom Routine Reminder</span>
        </button>
      ) : (
        <form
          onSubmit={handleAddRoutineItem}
          className="bg-white rounded-lg p-4 sm:p-5 border border-stone-200 space-y-3"
        >
          <h3 className="font-semibold text-stone-900 text-base">New Routine Reminder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Activity Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Afternoon Walk, Water Plants"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Time (optional)
              </label>
              <input
                type="text"
                placeholder="e.g., 4:00 PM"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-stone-300 rounded-md text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1f4737] hover:bg-[#18392c] text-white rounded-md text-xs sm:text-sm font-medium cursor-pointer"
            >
              Add Item
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
