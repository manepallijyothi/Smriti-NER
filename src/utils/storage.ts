import type { AppState } from "./types";

const STORAGE_KEY = "appState";
const PATIENT_ID_KEY = "patientId";

// -------------------------
// App state
// -------------------------
export function saveAppState(state: AppState) {
  try {
    // Patient ID ni persistent localStorage lo save cheyyakunda
    // app state nunchi separate ga maintain cheyyali.
    const { patientId, ...safeState } = state as AppState & {
      patientId?: string;
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeState));
  } catch (err) {
    console.warn("Failed to save app state", err);
  }
}

export function loadAppState(): AppState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved) as AppState;
  } catch (err) {
    console.warn("Failed to load app state", err);
    return null;
  }
}

// -------------------------
// Patient ID
// -------------------------
export function savePatientId(patientId: string) {
  try {
    sessionStorage.setItem(PATIENT_ID_KEY, patientId);
  } catch (err) {
    console.warn("Failed to save patient ID", err);
  }
}

export function getPatientId(): string | null {
  try {
    return sessionStorage.getItem(PATIENT_ID_KEY);
  } catch (err) {
    console.warn("Failed to get patient ID", err);
    return null;
  }
}

export function clearPatientId() {
  try {
    sessionStorage.removeItem(PATIENT_ID_KEY);
  } catch (err) {
    console.warn("Failed to clear patient ID", err);
  }
}

// -------------------------
// Clear all app data
// -------------------------
export function clearAppStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(PATIENT_ID_KEY);
  } catch (err) {
    console.warn("Failed to clear storage", err);
  }
}