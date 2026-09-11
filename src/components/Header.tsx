import React, { useState } from 'react';
import { NavigationTab, Language, UserSession } from '../types';
import { Volume2, VolumeX, Type, Languages, LogOut } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';
import { TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  largeText: boolean;
  setLargeText: (val: boolean | ((prev: boolean) => boolean)) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  session: UserSession;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  largeText,
  setLargeText,
  language,
  setLanguage,
  session,
  onLogout,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = TRANSLATIONS[language];

  // Role-specific navigation tabs (Strict separation between Patient and Caregiver)
  const patientTabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'home', label: t.tabs.home, icon: '🏠' },
    { id: 'games', label: t.tabs.games, icon: '🧠' },
    { id: 'culture', label: t.tabs.culture, icon: '🌾' },
    { id: 'memories', label: t.tabs.memories, icon: '📷' },
    { id: 'routine', label: t.tabs.routine, icon: '✅' },
    { id: 'garden', label: t.tabs.garden, icon: '🌱' },
  ];

  const caregiverTabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'caregiver', label: 'Caregiver Portal', icon: '🤝' },
    { id: 'home', label: "Patient's Home", icon: '🏠' },
    { id: 'routine', label: 'Routine Tasks', icon: '✅' },
    { id: 'memories', label: 'Photo Memories', icon: '📷' },
    { id: 'games', label: 'Cognitive Games', icon: '🧠' },
    { id: 'garden', label: 'Memory Garden', icon: '🌱' },
  ];

  const visibleTabs = session.role === 'patient' ? patientTabs : caregiverTabs;

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const roleText =
        session.role === 'patient'
          ? `You are logged in as ${session.name}. Current screen is ${activeTab}.`
          : `Caregiver session active for ${session.name}, supporting ${session.assignedPatientName || 'patient'}.`;
      const textToRead = `SMRITI NER. ${roleText} Use the menu to access daily routine, games, cultural memories, and support features.`;
      speakText(textToRead, () => setIsSpeaking(false));
    }
  };

  return (
    <header className="bg-[#1f4737] text-white border-b border-[#18392c] sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Role Badge */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab(session.role === 'caregiver' ? 'caregiver' : 'home')}
            className="flex items-center space-x-2.5 text-left focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-lg"
            aria-label="Go to Home"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-900 border border-emerald-700/60 flex items-center justify-center text-lg">
              🌱
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  {t.appName}
                </h1>
                <span className="text-[10px] uppercase font-semibold bg-emerald-900 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-700">
                  NER
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </button>

          {/* Logged in User Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md text-xs font-medium">
            <span>{session.role === 'patient' ? '👴' : '🤝'}</span>
            <span className="text-emerald-100">
              {session.name} <span className="text-emerald-300 font-normal">({session.role === 'patient' ? 'Patient' : 'Caregiver'})</span>
            </span>
          </div>
        </div>

        {/* Accessibility Buttons & Logout */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="flex items-center bg-emerald-950/70 border border-emerald-800 rounded-md p-0.5 text-xs">
            <Languages className="w-3.5 h-3.5 ml-1 text-emerald-300 hidden sm:inline" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded transition-colors font-medium ${
                language === 'en'
                  ? 'bg-white text-stone-900'
                  : 'text-emerald-200 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded transition-colors font-medium ${
                language === 'hi'
                  ? 'bg-white text-stone-900'
                  : 'text-emerald-200 hover:text-white'
              }`}
              title="Hindi"
            >
              हिं
            </button>
            <button
              onClick={() => setLanguage('as')}
              className={`px-2 py-1 rounded transition-colors font-medium ${
                language === 'as'
                  ? 'bg-white text-stone-900'
                  : 'text-emerald-200 hover:text-white'
              }`}
              title="Assamese"
            >
              অসমীয়া
            </button>
          </div>

          {/* Large text toggle */}
          <button
            onClick={() => setLargeText((prev) => !prev)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              largeText
                ? 'bg-white text-stone-900 border-white'
                : 'bg-emerald-900/60 text-emerald-100 border-emerald-700/80 hover:bg-emerald-800'
            }`}
            title="Toggle Larger Text"
            aria-label="Toggle larger text size"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{largeText ? t.actions.normalFont : t.actions.largeFont}</span>
          </button>

          {/* Read Aloud button */}
          <button
            onClick={handleReadAloud}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              isSpeaking
                ? 'bg-white text-stone-900 border-white'
                : 'bg-emerald-900/60 text-emerald-100 border-emerald-700/80 hover:bg-emerald-800'
            }`}
            title="Read screen aloud"
            aria-label="Read screen aloud"
          >
            {isSpeaking ? (
              <VolumeX className="w-3.5 h-3.5 text-stone-900" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline">{isSpeaking ? t.actions.stopVoice : t.actions.readAloud}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-emerald-950/70 hover:bg-stone-800 text-emerald-100 hover:text-white border border-emerald-800 transition-colors cursor-pointer"
            title="Logout of current session"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="bg-[#18392c] border-t border-emerald-900/60 px-4 hidden md:block">
        <div className="max-w-5xl mx-auto flex space-x-2 overflow-x-auto py-1">
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  stopSpeaking();
                  setIsSpeaking(false);
                  setActiveTab(tab.id);
                }}
                className={`py-2 px-3 rounded-md font-medium text-sm transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-900/80 text-white font-semibold'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
