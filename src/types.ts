export type NavigationTab = 'home' | 'games' | 'culture' | 'memories' | 'routine' | 'garden' | 'caregiver';

export type Language = 'en' | 'hi' | 'as';

export type UserRole = 'patient' | 'caregiver';

export interface UserSession {
  role: UserRole;
  name: string;
  assignedPatientName?: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  icon: string;
  timeHint: string;
  completed: boolean;
  isImportant?: boolean;
}

export interface MemoryItem {
  id: string;
  title: string;
  person?: string;
  relationship?: string;
  year: string;
  notes: string;
  emoji: string;
  imageUrl?: string;
}

export interface CaregiverActivityLog {
  id: string;
  name: string;
  status: 'Completed' | 'Missed' | 'Started';
  timestamp: string;
  details?: string;
}

export interface AppState {
  memoryActivitiesCount: number;
  attentionActivitiesCount: number;
  routine: RoutineItem[];
  memories: MemoryItem[];
  activityLogs: CaregiverActivityLog[];
  streakDays: number;
  lastActivityTime: string;
  caregiverNote: string;
  gameDifficulty: 'gentle' | 'medium';
  consecutiveCorrect: number;
  gardenWateredToday: boolean;
  language: Language;
}

