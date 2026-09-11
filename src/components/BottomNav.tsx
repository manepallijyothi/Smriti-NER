import React from 'react';
import { NavigationTab, Language, UserSession } from '../types';
import { stopSpeaking } from '../utils/speech';
import { TRANSLATIONS } from '../utils/translations';

interface BottomNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  language: Language;
  session: UserSession;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  language,
  session,
}) => {
  const t = TRANSLATIONS[language];

  // Patient tabs (Caregiver tab is strictly excluded from Patient view)
  const patientTabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'home', label: t.tabs.home, icon: '🏠' },
    { id: 'games', label: t.tabs.games, icon: '🧠' },
    { id: 'culture', label: t.tabs.culture, icon: '🌾' },
    { id: 'memories', label: t.tabs.memories, icon: '📷' },
    { id: 'routine', label: t.tabs.routine, icon: '✅' },
    { id: 'garden', label: t.tabs.garden, icon: '🌱' },
  ];

  // Caregiver tabs
  const caregiverTabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'caregiver', label: 'Portal', icon: '🤝' },
    { id: 'home', label: 'Patient', icon: '🏠' },
    { id: 'routine', label: 'Routine', icon: '✅' },
    { id: 'memories', label: 'Memories', icon: '📷' },
    { id: 'games', label: 'Games', icon: '🧠' },
    { id: 'garden', label: 'Garden', icon: '🌱' },
  ];

  const visibleTabs = session.role === 'patient' ? patientTabs : caregiverTabs;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-[#18392c] border-t border-[#132c22] z-30 pb-safe shadow-sm"
      aria-label="Mobile Navigation"
    >
      <div
        className={`grid ${
          visibleTabs.length === 6 ? 'grid-cols-6' : 'grid-cols-5'
        } h-14`}
      >
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                stopSpeaking();
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                isActive
                  ? 'bg-emerald-900/90 text-white font-semibold'
                  : 'text-emerald-200/80 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              <span className="text-[11px] mt-1 tracking-tight truncate max-w-[52px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
