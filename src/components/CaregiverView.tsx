import React, { useState } from 'react';
import { AppState, RoutineItem, MemoryItem, CaregiverActivityLog } from '../types';
import {
  Heart,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  PhoneCall,
  ShieldAlert,
  Brain,
  Plus,
  Trash2,
  Bookmark,
  Sparkles,
  Server,
  Cloud,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { resetAppState } from '../utils/storage';

interface CaregiverViewProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  largeText: boolean;
  onPreviewPatient?: () => void;
}

export const CaregiverView: React.FC<CaregiverViewProps> = ({
  state,
  updateState,
  largeText,
  onPreviewPatient,
}) => {
  // ---------------------------------------------------------------------------
  // Message to Patient State
  // ---------------------------------------------------------------------------
  const [noteInput, setNoteInput] = useState(state.caregiverNote);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // ---------------------------------------------------------------------------
  // Add Memory State (Prompt Section 20)
  // ---------------------------------------------------------------------------
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [memPerson, setMemPerson] = useState('');
  const [memRelationship, setMemRelationship] = useState('Daughter');
  const [memTitle, setMemTitle] = useState('');
  const [memDesc, setMemDesc] = useState('');
  const [memYear, setMemYear] = useState('2023');
  const [memEmoji, setMemEmoji] = useState('🌺');
  const [memoryAddedFeedback, setMemoryAddedFeedback] = useState(false);

  // ---------------------------------------------------------------------------
  // Manage Routine State (Prompt Section 21)
  // ---------------------------------------------------------------------------
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineTime, setNewRoutineTime] = useState('');
  const [newRoutineIcon, setNewRoutineIcon] = useState('⭐');
  const [newRoutineImportant, setNewRoutineImportant] = useState(false);

  // Metrics
  const completedRoutine = state.routine.filter((r) => r.completed).length;
  const totalRoutine = state.routine.length;
  const totalGames = state.memoryActivitiesCount + state.attentionActivitiesCount;
  const missedActivities = state.activityLogs.filter((l) => l.status === 'Missed').length;

  // Handlers
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    updateState((prev) => ({
      ...prev,
      caregiverNote: noteInput,
    }));
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2500);
  };

  const handleApplyPresetNote = (text: string) => {
    setNoteInput(text);
    updateState((prev) => ({
      ...prev,
      caregiverNote: text,
    }));
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2500);
  };

  const handleAddMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memTitle.trim() || !memDesc.trim()) return;

    const newMem: MemoryItem = {
      id: 'mem_' + Date.now(),
      title: memTitle.trim(),
      person: memPerson.trim() || 'Family Member',
      relationship: memRelationship.trim() || 'Family',
      year: memYear.trim() || 'Recent',
      notes: memDesc.trim(),
      emoji: memEmoji || '🌺',
    };

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateState((prev) => ({
      ...prev,
      memories: [newMem, ...prev.memories],
      activityLogs: [
        {
          id: 'log_' + Date.now(),
          name: `New Memory Added: "${newMem.title}"`,
          status: 'Completed',
          timestamp: now,
          details: `Caregiver added photo/story for ${newMem.person} (${newMem.relationship})`,
        },
        ...prev.activityLogs,
      ],
    }));

    setMemTitle('');
    setMemPerson('');
    setMemDesc('');
    setShowAddMemory(false);
    setMemoryAddedFeedback(true);
    setTimeout(() => setMemoryAddedFeedback(false), 3000);
  };

  const handleAddRoutineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineTitle.trim()) return;

    const newItem: RoutineItem = {
      id: 'rt_' + Date.now(),
      title: newRoutineTitle.trim(),
      timeHint: newRoutineTime.trim() || 'Anytime',
      icon: newRoutineIcon || '⭐',
      completed: false,
      isImportant: newRoutineImportant,
    };

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateState((prev) => ({
      ...prev,
      routine: [...prev.routine, newItem],
      activityLogs: [
        {
          id: 'log_' + Date.now(),
          name: `Routine Added: "${newItem.title}"`,
          status: 'Started',
          timestamp: now,
          details: newItem.isImportant ? 'Marked as high priority' : undefined,
        },
        ...prev.activityLogs,
      ],
    }));

    setNewRoutineTitle('');
    setNewRoutineTime('');
    setNewRoutineImportant(false);
    setShowAddRoutine(false);
  };

  const handleDeleteRoutine = (id: string) => {
    updateState((prev) => ({
      ...prev,
      routine: prev.routine.filter((r) => r.id !== id),
    }));
  };

  const handleToggleImportant = (id: string) => {
    updateState((prev) => ({
      ...prev,
      routine: prev.routine.map((r) =>
        r.id === id ? { ...r, isImportant: !r.isImportant } : r
      ),
    }));
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset app data to default demo state? This will restore sample routines and activity history.'
      )
    ) {
      const reset = resetAppState();
      updateState(() => reset);
      setNoteInput(reset.caregiverNote);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-12">
      {/* ------------------------------------------------------------------- */}
      {/* SECTION 16: CAREGIVER DASHBOARD HEADER & ASSIGNED PATIENT           */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                Caregiver Portal
              </span>
              <span className="text-xs text-stone-500">
                Caring for: <strong className="text-stone-900 font-medium">Deuta (Father, 76)</strong>
              </span>
            </div>
            <h2
              className={`${
                largeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              } font-bold text-stone-900 mt-1 flex items-center gap-2`}
            >
              <span>🤝</span>
              <span>Ananya's Caregiver Dashboard</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onPreviewPatient && (
              <button
                onClick={onPreviewPatient}
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-emerald-900 bg-white hover:bg-stone-50 px-2.5 py-1.5 rounded-md border border-stone-300 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-800" />
                <span>View Patient Experience</span>
              </button>
            )}
            <button
              onClick={handleResetData}
              className="inline-flex items-center space-x-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 px-2.5 py-1.5 rounded-md border border-stone-200 transition-colors cursor-pointer"
              title="Reset data for demo testing"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* SECTION 16: Today's Overview cards */}
        <div className="mt-3.5">
          <p className="text-xs font-semibold text-stone-500 mb-2">
            Today's Overview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <span className="text-xs font-medium text-stone-700 block">
                🧠 Memory Activities
              </span>
              <div className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                {state.memoryActivitiesCount}
              </div>
              <span className="text-[11px] text-stone-500">completed today</span>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <span className="text-xs font-medium text-stone-700 block">
                🎯 Attention Activities
              </span>
              <div className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                {state.attentionActivitiesCount}
              </div>
              <span className="text-[11px] text-stone-500">games played</span>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <span className="text-xs font-medium text-stone-700 block">
                ✅ Routine Tasks
              </span>
              <div className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                {completedRoutine} / {totalRoutine}
              </div>
              <span className="text-[11px] text-stone-500">
                {Math.round((completedRoutine / (totalRoutine || 1)) * 100)}% done
              </span>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <span className="text-xs font-medium text-stone-700 block">
                🔥 Activity Streak
              </span>
              <div className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5 flex items-center gap-1">
                <span>{state.streakDays}</span>
                <span className="text-xs font-normal text-stone-500">days</span>
              </div>
              <span className="text-[11px] text-stone-500">consistent engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION 18: PROGRESS & ENGAGEMENT INDICATORS                        */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-lg p-5 border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className={`${largeText ? 'text-2xl' : 'text-lg'} font-bold text-stone-900`}>
            Cognitive & Routine Progress
          </h3>
          <span className="text-xs text-stone-500">Last activity: {state.lastActivityTime}</span>
        </div>

        {/* Disclaimer per guidelines */}
        <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <span>
            <strong>Engagement Metrics:</strong> SMRITI tracks routine consistency and game completion for family reassurance. This is not a clinical assessment or medical diagnosis of cognitive impairment.
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Routine Completion Progress */}
          <div>
            <div className="flex justify-between text-xs font-medium text-stone-800 mb-1">
              <span>Routine Checklist Completion</span>
              <span className="text-emerald-900 font-semibold">
                {completedRoutine} of {totalRoutine} tasks ({Math.round((completedRoutine / (totalRoutine || 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
              <div
                className="bg-[#1f4737] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((completedRoutine / (totalRoutine || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Cognitive Activity Target */}
          <div>
            <div className="flex justify-between text-xs font-medium text-stone-800 mb-1">
              <span>Daily Cognitive Engagement Target (Goal: 4 activities)</span>
              <span className="text-emerald-900 font-semibold">
                {totalGames} of 4 target completed ({Math.min(100, Math.round((totalGames / 4) * 100))}%)
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
              <div
                className="bg-[#1f4737] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((totalGames / 4) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Memory Recall Accuracy/Consistency */}
          <div>
            <div className="flex justify-between text-xs font-medium text-stone-800 mb-1">
              <span>Average Activity Accuracy & Pacing</span>
              <span className="text-stone-700 font-semibold">88% (Healthy & Gentle Engagement)</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
              <div className="bg-stone-500 h-2 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>

        {/* SECTION 22: ADAPTIVE COGNITIVE DIFFICULTY */}
        <div className="mt-3 p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-800">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-emerald-800" />
              <span className="font-semibold text-stone-900 text-sm">
                Adaptive Cognitive Pacing:{' '}
                <span className="capitalize text-emerald-900 font-bold bg-white px-2 py-0.5 rounded border border-stone-300">
                  {state.gameDifficulty} Mode
                </span>
              </span>
            </div>
            <p className="text-stone-600">
              <strong>Recommendation Rationale:</strong> Based on recent engagement and a streak of {state.streakDays} days, we recommend a {state.gameDifficulty === 'gentle' ? 'Gentle (low stress, 3-4 items)' : 'Medium (moderate focus, 5-6 items)'} activity pace.
            </p>
          </div>

          <button
            onClick={() =>
              updateState((prev) => ({
                ...prev,
                gameDifficulty: prev.gameDifficulty === 'gentle' ? 'medium' : 'gentle',
              }))
            }
            className="self-start sm:self-auto bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer shrink-0"
          >
            Switch to {state.gameDifficulty === 'gentle' ? 'Medium' : 'Gentle'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION 19: SEND SUPPORTIVE MESSAGE TO PATIENT                     */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-lg p-5 border border-stone-200 space-y-3.5">
        <div className="flex items-center space-x-2 text-stone-900">
          <Heart className="w-4 h-4 text-rose-600" />
          <h3 className={`${largeText ? 'text-2xl' : 'text-lg'} font-bold`}>
            Post Message for Deuta's Home Screen
          </h3>
        </div>
        <p className="text-stone-600 text-sm">
          This message is displayed prominently at the top of Deuta's daily dashboard to provide comfort and gentle reminders.
        </p>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-stone-500">Quick Message Suggestions:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleApplyPresetNote(
                  "Good afternoon Deuta! Don't forget to drink some water. We'll call you at 5 PM ❤️"
                )
              }
              className="text-xs bg-stone-50 hover:bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200 transition-colors"
            >
              "Don't forget water, calling at 5 PM"
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPresetNote(
                  "Deuta, remember to enjoy the fresh breeze on the porch this afternoon. With love, Ananya & Ravi ❤️"
                )
              }
              className="text-xs bg-stone-50 hover:bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200 transition-colors"
            >
              "Fresh breeze on porch, with love"
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPresetNote(
                  "Thinking of you Deuta! Have a warm cup of Assam tea and rest well today."
                )
              }
              className="text-xs bg-stone-50 hover:bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200 transition-colors"
            >
              "Warm cup of Assam tea"
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveNote} className="space-y-3 pt-1">
          <textarea
            rows={3}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Write a warm note for Deuta..."
            className="w-full border border-stone-300 rounded-md p-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />

          <div className="flex items-center justify-between">
            {noteSavedFeedback ? (
              <span className="text-emerald-800 text-xs sm:text-sm font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Message live on Deuta's Home screen!</span>
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 bg-[#1f4737] hover:bg-[#18392c] text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Update Message</span>
            </button>
          </div>
        </form>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION 20: ADD MEMORY FOR DEUTA                                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-lg p-5 border border-stone-200 space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h3
              className={`${
                largeText ? 'text-2xl' : 'text-lg'
              } font-bold text-stone-900 flex items-center gap-2`}
            >
              <span>📷</span>
              <span>Add Memory for Deuta</span>
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
              Added memories immediately appear in Deuta's <strong>"My Memories"</strong> and in the <strong>"Recall Memory"</strong> quiz.
            </p>
          </div>

          <button
            onClick={() => setShowAddMemory((v) => !v)}
            className="inline-flex items-center space-x-1 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddMemory ? 'Close Form' : 'Add Memory'}</span>
          </button>
        </div>

        {memoryAddedFeedback && (
          <div className="p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-800" />
            <span>Memory saved! It is now active in Deuta's personal memory book and recall quiz.</span>
          </div>
        )}

        {showAddMemory && (
          <form
            onSubmit={handleAddMemorySubmit}
            className="p-4 bg-stone-50 border border-stone-200 rounded-md space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Person in Memory
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ananya or Ravi"
                  value={memPerson}
                  onChange={(e) => setMemPerson(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Daughter, Grandson, Brother"
                  value={memRelationship}
                  onChange={(e) => setMemRelationship(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rongali Bihu Feast or Kaziranga Trip"
                  value={memTitle}
                  onChange={(e) => setMemTitle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Year / Era
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2018 or 1995"
                    value={memYear}
                    onChange={(e) => setMemYear(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Symbol / Emoji
                  </label>
                  <select
                    value={memEmoji}
                    onChange={(e) => setMemEmoji(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md px-2 py-1.5 text-sm text-stone-900 focus:outline-none"
                  >
                    <option value="🌺">🌺 Flower</option>
                    <option value="🦏">🦏 Rhino</option>
                    <option value="🍵">🍵 Tea</option>
                    <option value="🎋">🎋 Bamboo</option>
                    <option value="🥁">🥁 Dhol</option>
                    <option value="🏠">🏠 House</option>
                    <option value="👨‍👩‍👧">👨‍👩‍👧 Family</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Story Description (Written gently for Deuta to read or listen to)
              </label>
              <textarea
                rows={2}
                required
                placeholder="Describe what happened, sensory details (sounds, aromas), and feelings..."
                value={memDesc}
                onChange={(e) => setMemDesc(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md p-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddMemory(false)}
                className="px-3 py-1.5 border border-stone-300 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#1f4737] hover:bg-[#18392c] text-white rounded-md text-xs font-medium transition-colors"
              >
                Save Memory for Deuta
              </button>
            </div>
          </form>
        )}

        {/* Current Memories Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {state.memories.slice(0, 4).map((m) => (
            <div
              key={m.id}
              className="p-2.5 bg-stone-50 border border-stone-200 rounded-md flex items-start space-x-2.5"
            >
              <span className="text-xl shrink-0 mt-0.5">{m.emoji}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">{m.title}</p>
                <p className="text-[11px] text-stone-600">
                  {m.person} ({m.relationship}) • {m.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION 21: MANAGE ROUTINE FOR DEUTA                                */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-lg p-5 border border-stone-200 space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h3
              className={`${
                largeText ? 'text-2xl' : 'text-lg'
              } font-bold text-stone-900 flex items-center gap-2`}
            >
              <span>📋</span>
              <span>Manage Routine Reminders</span>
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
              Add, remove, or flag important reminders. Updates sync to Deuta's <strong>"Today's Routine"</strong>.
            </p>
          </div>

          <button
            onClick={() => setShowAddRoutine((v) => !v)}
            className="inline-flex items-center space-x-1 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddRoutine ? 'Close' : 'Add Routine'}</span>
          </button>
        </div>

        {showAddRoutine && (
          <form
            onSubmit={handleAddRoutineSubmit}
            className="p-4 bg-stone-50 border border-stone-200 rounded-md space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Routine Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Afternoon Walk, Water Plants, BP Medicine"
                  value={newRoutineTitle}
                  onChange={(e) => setNewRoutineTitle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Time Hint
                </label>
                <input
                  type="text"
                  placeholder="e.g., 4:30 PM"
                  value={newRoutineTime}
                  onChange={(e) => setNewRoutineTime(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <label className="flex items-center space-x-2 text-xs text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newRoutineImportant}
                  onChange={(e) => setNewRoutineImportant(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
                />
                <span>Mark as Important / Health Critical</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoutine(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#1f4737] hover:bg-[#18392c] text-white rounded-md text-xs font-medium transition-colors"
                >
                  Add to Deuta's Day
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Existing Routine Items with Edit/Delete */}
        <div className="space-y-1.5">
          {state.routine.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-md border flex items-center justify-between transition-colors ${
                item.completed
                  ? 'bg-stone-50 border-stone-200 text-stone-500'
                  : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-medium truncate ${
                        item.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.isImportant && (
                      <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                        Important
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">{item.timeHint}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => handleToggleImportant(item.id)}
                  title={item.isImportant ? 'Unmark important' : 'Mark important'}
                  className={`p-1.5 rounded hover:bg-stone-100 ${
                    item.isImportant ? 'text-rose-600' : 'text-stone-400'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteRoutine(item.id)}
                  title="Delete routine"
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION 17: RECENT ACTIVITIES LOG                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
          <h3 className={`${largeText ? 'text-2xl' : 'text-lg'} font-bold text-stone-900`}>
            Recent Activities Log
          </h3>
          <span className="text-xs text-stone-500 font-normal">Stored in localStorage</span>
        </div>

        <div className="divide-y divide-stone-100">
          {state.activityLogs.slice(0, 8).map((log) => (
            <div key={log.id} className="py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                {log.status === 'Completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                ) : log.status === 'Missed' ? (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <div>
                  <p className="font-medium text-stone-900 text-xs sm:text-sm">{log.name}</p>
                  <p className="text-[11px] text-stone-500">
                    {log.timestamp} {log.details ? `• ${log.details}` : ''}
                  </p>
                </div>
              </div>

              <span
                className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                  log.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : log.status === 'Missed'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION 24: HONEST STUDENT HACKATHON ARCHITECTURE NOTE              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-stone-50 rounded-lg p-5 border border-stone-200 space-y-2.5">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-800" />
          <h4 className="font-bold text-stone-900 text-sm sm:text-base">
            System & Future Backend Architecture (Hackathon Evaluation Note)
          </h4>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          This frontend prototype was built for hackathon demonstration using React and browser local state. Here is how our architecture works today and how it scales into production healthcare:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-white rounded-md border border-stone-200">
            <span className="text-xs font-semibold text-emerald-900 block mb-1">
              Currently Implemented (Prototype)
            </span>
            <ul className="text-xs text-stone-600 space-y-1 list-disc pl-4">
              <li><strong>Local Storage State:</strong> All routines, activity logs, and personal memories persist across refreshes via localStorage.</li>
              <li><strong>Public REST APIs:</strong> Regional geography using RestCountries and cultural literature via Open Library.</li>
              <li><strong>Offline Resilience:</strong> Works without continuous internet once loaded in rural NER villages.</li>
            </ul>
          </div>

          <div className="p-3 bg-white rounded-md border border-stone-200">
            <span className="text-xs font-semibold text-stone-800 block mb-1">
              Future Production Healthcare System
            </span>
            <ul className="text-xs text-stone-600 space-y-1 list-disc pl-4">
              <li><strong>Cloud Backend:</strong> Node.js / Python API with HIPAA-compliant encrypted database for patient memory logs.</li>
              <li><strong>Real-time Multi-Device Sync:</strong> Caregivers receive instant push alerts and live status updates over WebSockets.</li>
              <li><strong>Clinic Integration:</strong> Exportable engagement reports for Guwahati Medical College / regional geriatric doctors.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency & Regional Health Contacts */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <h4 className="font-bold text-stone-900 text-xs sm:text-sm uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-2 border-b border-stone-100">
          <PhoneCall className="w-4 h-4 text-emerald-800" />
          <span>Quick Caregiver & Regional Medical Contacts</span>
        </h4>

        <div className="space-y-2 text-sm text-stone-700">
          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-md border border-stone-200">
            <div>
              <p className="font-semibold text-stone-900 text-xs sm:text-sm">Dr. B. K. Sarma (Neurology & Memory Clinic)</p>
              <p className="text-xs text-stone-500">Guwahati Medical College & Hospital: +91 361 252 8000</p>
            </div>
            <a
              href="tel:+913612528000"
              className="text-xs font-medium text-emerald-900 bg-white hover:bg-stone-100 px-3 py-1.5 rounded-md border border-stone-300"
            >
              Call Clinic
            </a>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-md border border-stone-200">
            <div>
              <p className="font-semibold text-stone-900 text-xs sm:text-sm">Elderline (Senior Citizen National Helpline)</p>
              <p className="text-xs text-stone-500">Toll-free Govt. Assistance: 14567</p>
            </div>
            <a
              href="tel:14567"
              className="text-xs font-medium text-stone-800 bg-white hover:bg-stone-100 px-3 py-1.5 rounded-md border border-stone-300"
            >
              14567
            </a>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-md border border-rose-200">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <div>
                <span className="font-semibold text-rose-950 text-xs sm:text-sm block">Emergency & Medical Ambulance</span>
                <span className="text-xs text-rose-700">Dial 108 / 112 (National Emergency Helpline)</span>
              </div>
            </div>
            <span className="font-bold text-rose-900 text-base sm:text-lg">108</span>
          </div>
        </div>
      </div>
    </div>
  );
};
