import React from 'react';
import { AppState, NavigationTab } from '../types';
import { speakText } from '../utils/speech';
import { TRANSLATIONS } from '../utils/translations';
import { Play, Sparkles, Volume2, ArrowRight, Heart, Brain, BookOpen, CheckSquare, Compass } from 'lucide-react';

interface DashboardViewProps {
  state: AppState;
  setActiveTab: (tab: NavigationTab) => void;
  onStartActivity: () => void;
  largeText: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  setActiveTab,
  onStartActivity,
  largeText,
}) => {
  const t = TRANSLATIONS[state.language || 'en'];
  const completedRoutineCount = state.routine.filter((r) => r.completed).length;
  const totalRoutineCount = state.routine.length;
  const totalActivitiesToday = state.memoryActivitiesCount + state.attentionActivitiesCount + completedRoutineCount;

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greeting.morning;
    if (hour < 17) return t.greeting.afternoon;
    return t.greeting.evening;
  };

  const handleReadSummary = () => {
    const summaryText = `${getGreeting()} ${t.appName} daily overview. You have completed ${state.memoryActivitiesCount} memory activities, ${state.attentionActivitiesCount} attention exercises, and ${completedRoutineCount} of ${totalRoutineCount} daily routine tasks. Your recommended activity today is Memory Match with North Eastern cultural symbols.`;
    speakText(summaryText);
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Top Greeting Header */}
      <div className="bg-white rounded-lg p-5 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`${largeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-bold text-stone-900`}>
            {getGreeting()}
          </h2>
          <p className="text-stone-600 mt-1 text-sm sm:text-base">
            {t.greeting.welcomeBack}
          </p>
        </div>
        <button
          onClick={handleReadSummary}
          className="inline-flex items-center space-x-2 self-start sm:self-auto bg-stone-50 hover:bg-stone-100 text-stone-800 px-3.5 py-2 rounded-lg text-sm font-medium border border-stone-300 transition-colors"
          aria-label="Read today's summary aloud"
        >
          <Volume2 className="w-4 h-4 text-emerald-800" />
          <span>Read Daily Summary</span>
        </button>
      </div>

      {/* Caregiver Note Banner if present */}
      {state.caregiverNote && (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex items-start space-x-3 text-stone-800">
          <Heart className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-stone-900 block mb-0.5">Note from Caregiver / Family:</span>
            <p className="text-stone-700 leading-relaxed">{state.caregiverNote}</p>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveTab('games')}
          className="bg-white hover:bg-stone-50 p-4 rounded-lg border border-stone-200 transition-colors text-left flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-md bg-stone-100 flex items-center justify-center text-lg mb-2">
            <Brain className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 text-sm">{t.actions.playGame}</h4>
            <p className="text-xs text-stone-500 mt-0.5">3 Cognitive Puzzles</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('culture')}
          className="bg-white hover:bg-stone-50 p-4 rounded-lg border border-stone-200 transition-colors text-left flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-md bg-stone-100 flex items-center justify-center text-lg mb-2">
            <Compass className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 text-sm">{t.actions.nerCulture}</h4>
            <p className="text-xs text-stone-500 mt-0.5">Food, Music, Heritage</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('memories')}
          className="bg-white hover:bg-stone-50 p-4 rounded-lg border border-stone-200 transition-colors text-left flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-md bg-stone-100 flex items-center justify-center text-lg mb-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 text-sm">{t.actions.myMemories}</h4>
            <p className="text-xs text-stone-500 mt-0.5">Family & Recall</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('routine')}
          className="bg-white hover:bg-stone-50 p-4 rounded-lg border border-stone-200 transition-colors text-left flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-md bg-stone-100 flex items-center justify-center text-lg mb-2">
            <CheckSquare className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 text-sm">{t.actions.todaysRoutine}</h4>
            <p className="text-xs text-stone-500 mt-0.5">{completedRoutineCount}/{totalRoutineCount} Done</p>
          </div>
        </button>
      </div>

      {/* Recommended Activity: Memory Match with North East Theme */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Recommended Activity
          </span>
          <span className="text-xs text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded">
            Difficulty: {state.gameDifficulty === 'medium' ? t.actions.difficultyMedium : t.actions.difficultyGentle}
          </span>
        </div>

        <h3 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 mt-2 flex items-center space-x-2`}>
          <span>🦏</span>
          <span>NER Cultural Memory Match</span>
        </h3>

        <p className="text-stone-600 text-sm sm:text-base mt-1.5 leading-relaxed">
          Match pairs of familiar regional items: Kaziranga rhino, Assam tea, Bihu dhol, bamboo crafts, and Kopou orchids.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            onClick={onStartActivity}
            className="flex-1 min-w-[180px] inline-flex items-center justify-center space-x-2 bg-[#1f4737] hover:bg-[#18392c] text-white px-5 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className="inline-flex items-center justify-center space-x-1 px-4 py-3 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-colors"
          >
            <span>All Activities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <h3 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100`}>
          {t.progress.title}
        </h3>

        <div className="space-y-3 text-stone-800">
          <div className="flex items-center justify-between text-sm sm:text-base py-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-base">🧠</span>
              <span className="font-medium text-stone-700">{t.progress.memoryActivities}</span>
            </div>
            <span className="font-semibold text-emerald-800">
              {state.memoryActivitiesCount} completed
            </span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base py-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-base">🎯</span>
              <span className="font-medium text-stone-700">{t.progress.attentionFocus}</span>
            </div>
            <span className="font-semibold text-emerald-800">
              {state.attentionActivitiesCount} completed
            </span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base py-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-base">✅</span>
              <span className="font-medium text-stone-700">{t.progress.dailyRoutine}</span>
            </div>
            <span className="font-semibold text-stone-900">
              {completedRoutineCount} / {totalRoutineCount} completed
            </span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base py-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-base">🔥</span>
              <span className="font-medium text-stone-700">{t.progress.streak}</span>
            </div>
            <span className="font-semibold text-stone-900">
              {state.streakDays} days active
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-stone-100 rounded-full h-2 mt-2 overflow-hidden border border-stone-200">
            <div
              className="bg-[#1f4737] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((completedRoutineCount / (totalRoutineCount || 1)) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Memory Garden Preview */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <div className="flex items-center space-x-2 text-stone-900 mb-1.5">
          <span className="text-xl">🌱</span>
          <h3 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold`}>North East Memory Garden</h3>
        </div>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          You have completed <span className="font-semibold text-stone-900">{totalActivitiesToday} cognitive tasks</span> today.
          Your rhododendrons and kopou orchids are nourished with every daily activity.
        </p>

        {/* Visual stages mini preview */}
        <div className="flex items-center justify-around bg-stone-50 border border-stone-200 rounded-lg py-3 px-3 my-3 text-center">
          <div>
            <div className="text-xl mb-0.5">🌱</div>
            <div className="text-xs text-stone-600">Sprout</div>
          </div>
          <span className="text-stone-400">→</span>
          <div>
            <div className="text-xl mb-0.5">🌿</div>
            <div className="text-xs text-stone-600">Shoots</div>
          </div>
          <span className="text-stone-400">→</span>
          <div>
            <div className="text-xl mb-0.5">🌸</div>
            <div className="text-xs text-stone-600">Orchids</div>
          </div>
          <span className="text-stone-400">→</span>
          <div>
            <div className="text-xl mb-0.5">🌳</div>
            <div className="text-xs text-emerald-800 font-medium">Hill Cedar</div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('garden')}
          className="w-full inline-flex items-center justify-center space-x-2 bg-stone-50 hover:bg-stone-100 text-stone-800 px-4 py-2.5 rounded-lg text-sm font-medium border border-stone-300 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-800" />
          <span>Water & Visit Memory Garden</span>
        </button>
      </div>
    </div>
  );
};
