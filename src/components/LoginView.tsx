import React, { useState } from 'react';
import { UserSession, Language } from '../types';
import { DEMO_PATIENT, DEMO_CAREGIVER } from '../utils/storage';
import { Heart, Brain, ShieldCheck, Languages } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface LoginViewProps {
  onLogin: (session: UserSession) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, language, setLanguage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'caregiver'>('patient');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Please enter your name or email.');
      return;
    }

    const session: UserSession = {
      role: selectedRole,
      name: username.trim(),
      assignedPatientName: selectedRole === 'caregiver' ? 'Deuta' : undefined,
    };

    onLogin(session);
  };

  const handleDemoLogin = (type: 'patient' | 'caregiver') => {
    if (type === 'patient') {
      onLogin(DEMO_PATIENT);
    } else {
      onLogin(DEMO_CAREGIVER);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center px-4 py-8">
      {/* Language Bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-stone-500" />
          <span>Language:</span>
        </span>
        <div className="flex items-center bg-stone-200/70 rounded-md p-0.5 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded transition-colors font-medium ${
              language === 'en' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded transition-colors font-medium ${
              language === 'hi' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            हिं
          </button>
          <button
            onClick={() => setLanguage('as')}
            className={`px-2 py-1 rounded transition-colors font-medium ${
              language === 'as' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            অসমীয়া
          </button>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-7 space-y-5">
        {/* Branding Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 text-2xl">
            🌱
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 flex items-center justify-center gap-1.5">
              <span>SMRITI NER</span>
              <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                NER
              </span>
            </h1>
            <p className="text-sm font-medium text-emerald-900 mt-0.5">
              North East Memory Assistance
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              Student healthcare project for elderly dementia care and cognitive exercises
            </p>
          </div>
        </div>

        {/* Demo Login Quick Select Buttons */}
        <div className="space-y-2 pt-1">
          <p className="text-xs font-medium text-stone-500 text-center">
            Quick 1-Click Demo Login
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('patient')}
              className="p-3 bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">👴</span>
                <span className="text-[10px] font-semibold uppercase bg-emerald-800 text-white px-1.5 py-0.5 rounded">
                  Patient
                </span>
              </div>
              <p className="font-semibold text-stone-900 text-sm">Deuta</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Daily routine, memories & gentle games
              </p>
            </button>

            <button
              onClick={() => handleDemoLogin('caregiver')}
              className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-lg text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">🤝</span>
                <span className="text-[10px] font-semibold uppercase bg-stone-700 text-white px-1.5 py-0.5 rounded">
                  Caregiver
                </span>
              </div>
              <p className="font-semibold text-stone-900 text-sm">Ananya</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Support Deuta, notes & routine management
              </p>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-0.5 items-center">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-3 text-xs text-stone-400">or login with details</span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Name or Email
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Deuta or Ananya"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center space-x-1.5 ${
                  selectedRole === 'patient'
                    ? 'bg-[#1f4737] text-white border-[#1f4737]'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span>👴</span>
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('caregiver')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center space-x-1.5 ${
                  selectedRole === 'caregiver'
                    ? 'bg-[#1f4737] text-white border-[#1f4737]'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span>🤝</span>
                <span>Caregiver</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1f4737] hover:bg-[#18392c] text-white font-medium rounded-lg text-sm transition-colors cursor-pointer mt-1"
          >
            Login
          </button>
        </form>

        {/* Student Hackathon Transparency Footer */}
        <div className="pt-2 border-t border-stone-100 text-center space-y-0.5">
          <div className="flex items-center justify-center space-x-1.5 text-xs text-stone-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Student Prototype (Local State Demonstration)</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Client-side prototype designed for regional healthcare demonstration.
          </p>
        </div>
      </div>
    </div>
  );
};
