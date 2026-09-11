import { useState, useEffect } from 'react';
import { NavigationTab, AppState, Language, UserSession } from './types';
import { loadAppState, saveAppState, loadUserSession, saveUserSession } from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { GamesView } from './components/GamesView';
import { NERCultureView } from './components/NERCultureView';
import { GardenView } from './components/GardenView';
import { RoutineView } from './components/RoutineView';
import { MemoriesView } from './components/MemoriesView';
import { CaregiverView } from './components/CaregiverView';
import { LoginView } from './components/LoginView';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => loadUserSession());
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    const savedSession = loadUserSession();
    return savedSession?.role === 'caregiver' ? 'caregiver' : 'home';
  });
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [largeText, setLargeText] = useState<boolean>(false);

  // Synchronize state with localStorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Synchronize user session with localStorage
  useEffect(() => {
    saveUserSession(session);
  }, [session]);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => updater(prev));
  };

  const handleSetLanguage = (lang: Language) => {
    updateState((prev) => ({ ...prev, language: lang }));
  };

  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    setActiveTab(newSession.role === 'caregiver' ? 'caregiver' : 'home');
  };

  const handleLogout = () => {
    setSession(null);
    setActiveTab('home');
  };

  // If user is not logged in, show Login Screen (Section 2)
  if (!session) {
    return (
      <LoginView
        onLogin={handleLogin}
        language={state.language || 'en'}
        setLanguage={handleSetLanguage}
      />
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-emerald-200 ${
        largeText ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        largeText={largeText}
        setLargeText={setLargeText}
        language={state.language || 'en'}
        setLanguage={handleSetLanguage}
        session={session}
        onLogout={handleLogout}
      />

      {/* Caregiver Preview Banner (When Caregiver is testing Patient Experience) */}
      {session.role === 'caregiver' && activeTab !== 'caregiver' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>👁️</span>
            <span>
              <strong>Caregiver Preview:</strong> You are viewing the app as Deuta sees it.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('caregiver')}
            className="inline-flex items-center space-x-1 bg-white hover:bg-stone-50 text-stone-900 px-2.5 py-1 rounded border border-amber-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Caregiver Portal</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 pb-24 md:pb-12">
        {activeTab === 'home' && (
          <DashboardView
            state={state}
            setActiveTab={setActiveTab}
            onStartActivity={() => setActiveTab('games')}
            largeText={largeText}
          />
        )}

        {activeTab === 'games' && (
          <GamesView
            state={state}
            updateState={updateState}
            largeText={largeText}
          />
        )}

        {activeTab === 'culture' && (
          <NERCultureView
            state={state}
            updateState={updateState}
            largeText={largeText}
          />
        )}

        {activeTab === 'memories' && (
          <MemoriesView
            state={state}
            updateState={updateState}
            largeText={largeText}
          />
        )}

        {activeTab === 'routine' && (
          <RoutineView
            state={state}
            updateState={updateState}
            largeText={largeText}
          />
        )}

        {activeTab === 'garden' && (
          <GardenView
            state={state}
            updateState={updateState}
            largeText={largeText}
          />
        )}

        {activeTab === 'caregiver' && (
          <CaregiverView
            state={state}
            updateState={updateState}
            largeText={largeText}
            onPreviewPatient={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Realistic Student Hackathon Project Footer */}
      <footer className="hidden md:block py-3.5 border-t border-stone-200 text-center text-xs text-stone-500 bg-white">
        <p className="font-normal text-stone-600">
          SMRITI NER • AI-Based Cognitive Gaming & Memory Assistance Platform for North Eastern Region
        </p>
        <p className="text-[11px] text-stone-400 mt-0.5">
          Built for Elderly Dementia Care • Assam, Meghalaya, Nagaland, Manipur, Sikkim & Eastern Himalayas
        </p>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={state.language || 'en'}
        session={session}
      />
    </div>
  );
}
