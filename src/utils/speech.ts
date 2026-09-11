/**
 * Simple Web Speech API helper for elderly-first accessibility.
 * Reads text aloud clearly and calmly.
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export function speakText(text: string, onEnd?: () => void) {
  if (!synth) {
    console.warn('Speech synthesis is not supported on this browser.');
    return;
  }

  // Cancel any ongoing speech
  synth.cancel();

  const cleanText = text.replace(/[🌱🌿🌸🌳🍎🍌🍓🍇🥑🍊🍉🍒❓👋💊💧👟📞🍵📖❤️]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.85; // Slightly slower, calm cadence for elderly listeners
  utterance.pitch = 1.0;
  
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  synth.speak(utterance);
}

export function stopSpeaking() {
  if (synth) {
    synth.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
