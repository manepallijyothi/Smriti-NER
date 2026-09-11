import { AppState, RoutineItem, MemoryItem, CaregiverActivityLog, UserSession } from '../types';

const STORAGE_KEY = 'smriti_ner_app_state_v2';
const SESSION_KEY = 'smriti_user_session_v2';

export const DEMO_PATIENT: UserSession = {
  role: 'patient',
  name: 'Deuta',
};

export const DEMO_CAREGIVER: UserSession = {
  role: 'caregiver',
  name: 'Ananya',
  assignedPatientName: 'Deuta',
};

export const DEFAULT_ROUTINE: RoutineItem[] = [
  { id: '1', title: 'Morning Health & BP Medicine', icon: '💊', timeHint: '8:00 AM', completed: true },
  { id: '2', title: 'Drink Warm Water & Assam Tea', icon: '🍵', timeHint: '9:00 AM', completed: true },
  { id: '3', title: 'Cognitive Memory Game in SMRITI', icon: '🧠', timeHint: '10:30 AM', completed: true },
  { id: '4', title: 'Gentle Porch Walk & Fresh Air', icon: '👟', timeHint: '3:30 PM', completed: true },
  { id: '5', title: 'Family Call with Children (Ravi & Ananya)', icon: '📞', timeHint: '5:00 PM', completed: false },
  { id: '6', title: 'Evening Medicine & Rest Routine', icon: '🩺', timeHint: '7:30 PM', completed: false },
];

export const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'm1',
    title: 'Family Trip to Kaziranga National Park',
    person: 'Ravi',
    relationship: 'Son',
    year: '2018',
    notes: 'We watched the one-horned rhinos grazing peacefully in the morning mist from the tower, then shared hot tea and fresh pitha from our tiffin box.',
    emoji: '🦏',
  },
  {
    id: 'm2',
    title: 'Rolling Til Pitha for Rongali Bihu',
    person: 'Ananya',
    relationship: 'Daughter',
    year: '2012',
    notes: 'Ananya helped roast the sweet black sesame seeds while listening to the radio. The courtyard smelled of warm jaggery and roasted rice all morning.',
    emoji: '🥟',
  },
  {
    id: 'm3',
    title: 'Crossing the Mighty Brahmaputra River',
    person: 'Deepen',
    relationship: 'Brother',
    year: '1978',
    notes: 'Taking the wooden ferry boat across to Umananda temple island on a clear autumn morning. River waves rocked the boat gently.',
    emoji: '⛵',
  },
  {
    id: 'm4',
    title: 'Weaving Golden Muga Silk in the Courtyard',
    person: 'Bina',
    relationship: 'Mother',
    year: '1965',
    notes: 'The steady clicking sound of the wooden handloom as mother wove red floral muga borders before the spring festival.',
    emoji: '🧵',
  },
];

export const DEFAULT_LOGS: CaregiverActivityLog[] = [
  { id: 'l1', name: 'Morning Health & BP Medicine', status: 'Completed', timestamp: '8:15 AM' },
  { id: 'l2', name: 'Memory Match Game (NER Cultural Cards)', status: 'Completed', timestamp: '9:30 AM', details: 'Score: 100 • 0 errors' },
  { id: 'l3', name: 'Drink Warm Water & Assam Tea', status: 'Completed', timestamp: '9:40 AM' },
  { id: 'l4', name: 'Remember & Recall Activity', status: 'Completed', timestamp: '10:45 AM', details: 'Identified 3/3 items' },
  { id: 'l5', name: 'Spot the Change Game', status: 'Completed', timestamp: '11:15 AM', details: 'Solved in 1 attempt' },
  { id: 'l6', name: 'Gentle Porch Walk & Fresh Air', status: 'Completed', timestamp: '3:35 PM' },
];

export const DEFAULT_APP_STATE: AppState = {
  memoryActivitiesCount: 4,
  attentionActivitiesCount: 3,
  routine: DEFAULT_ROUTINE,
  memories: DEFAULT_MEMORIES,
  activityLogs: DEFAULT_LOGS,
  streakDays: 5,
  lastActivityTime: '10 minutes ago',
  caregiverNote: 'Deuta (Father), remember to enjoy the fresh breeze on the porch this afternoon. We will call you on video at 5:00 PM! With love, Ananya & Ravi ❤️',
  gameDifficulty: 'gentle',
  consecutiveCorrect: 3,
  gardenWateredToday: true,
  language: 'en',
};

export function loadAppState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_APP_STATE;
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_APP_STATE,
      ...parsed,
      routine: Array.isArray(parsed.routine) ? parsed.routine : DEFAULT_ROUTINE,
      memories: Array.isArray(parsed.memories) ? parsed.memories : DEFAULT_MEMORIES,
      activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : DEFAULT_LOGS,
    };
  } catch (err) {
    console.warn('Failed to load app state from localStorage, using defaults', err);
    return DEFAULT_APP_STATE;
  }
}

export function saveAppState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save app state to localStorage', err);
  }
}

export function resetAppState(): AppState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear localStorage', err);
  }
  return DEFAULT_APP_STATE;
}

export function loadUserSession(): UserSession | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as UserSession;
  } catch (err) {
    console.warn('Failed to load user session', err);
    return null;
  }
}

export function saveUserSession(session: UserSession | null) {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (err) {
    console.warn('Failed to save user session', err);
  }
}

