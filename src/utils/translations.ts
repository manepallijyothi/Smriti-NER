import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  tabs: {
    home: string;
    games: string;
    culture: string;
    memories: string;
    routine: string;
    garden: string;
    caregiver: string;
  };
  greeting: {
    morning: string;
    afternoon: string;
    evening: string;
    welcomeBack: string;
  };
  actions: {
    playGame: string;
    myMemories: string;
    nerCulture: string;
    todaysRoutine: string;
    readAloud: string;
    stopVoice: string;
    largeFont: string;
    normalFont: string;
    difficultyGentle: string;
    difficultyMedium: string;
  };
  progress: {
    title: string;
    memoryActivities: string;
    attentionFocus: string;
    dailyRoutine: string;
    streak: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'SMRITI NER',
    appSubtitle: 'North East Memory Assistance',
    tagline: 'Cognitive Gaming & Reminiscence for North East India',
    tabs: {
      home: 'Home',
      games: 'Games',
      culture: 'NER Culture',
      memories: 'Memories',
      routine: 'Routine',
      garden: 'Garden',
      caregiver: 'Caregiver',
    },
    greeting: {
      morning: 'Good Morning 👋',
      afternoon: 'Good Afternoon ☀️',
      evening: 'Good Evening 🌙',
      welcomeBack: 'Welcome back to your companion for today.',
    },
    actions: {
      playGame: 'Play Game',
      myMemories: 'My Memories',
      nerCulture: 'NER Culture',
      todaysRoutine: "Today's Routine",
      readAloud: 'Read Aloud',
      stopVoice: 'Stop Voice',
      largeFont: 'Large Font',
      normalFont: 'Normal Font',
      difficultyGentle: 'Gentle (Adaptive)',
      difficultyMedium: 'Medium (Adaptive)',
    },
    progress: {
      title: "Today's Progress",
      memoryActivities: 'Memory Activities',
      attentionFocus: 'Attention & Focus',
      dailyRoutine: 'Daily Routine',
      streak: 'Day Streak',
    },
  },
  hi: {
    appName: 'स्मृति NER',
    appSubtitle: 'पूर्वोत्तर स्मृति सहायक',
    tagline: 'पूर्वोत्तर भारत के लिए संज्ञानात्मक खेल और स्मृति सहायता',
    tabs: {
      home: 'होम',
      games: 'खेल',
      culture: 'पूर्वोत्तर संस्कृति',
      memories: 'यादें',
      routine: 'दिनचर्या',
      garden: 'बगीचा',
      caregiver: 'देखभालकर्ता',
    },
    greeting: {
      morning: 'शुभ प्रभात 👋',
      afternoon: 'शुभ दोपहर ☀️',
      evening: 'शुभ संध्या 🌙',
      welcomeBack: 'आज के दिन के लिए आपके साथी में आपका स्वागत है।',
    },
    actions: {
      playGame: 'खेल खेलें',
      myMemories: 'मेरी यादें',
      nerCulture: 'पूर्वोत्तर संस्कृति',
      todaysRoutine: 'आज की दिनचर्या',
      readAloud: 'पढ़कर सुनाएं',
      stopVoice: 'आवाज़ रोकें',
      largeFont: 'बड़ा फ़ॉन्ट',
      normalFont: 'सामान्य फ़ॉन्ट',
      difficultyGentle: 'सरल (अनुकूली)',
      difficultyMedium: 'मध्यम (अनुकूली)',
    },
    progress: {
      title: 'आज की प्रगति',
      memoryActivities: 'स्मृति गतिविधियाँ',
      attentionFocus: 'ध्यान और एकाग्रता',
      dailyRoutine: 'दैनिक दिनचर्या',
      streak: 'दिनों की लड़ी',
    },
  },
  as: {
    appName: 'স্মৃতি NER',
    appSubtitle: 'উত্তৰ-পূৰ্বাঞ্চল স্মৃতি সহায়ক',
    tagline: 'উত্তৰ-পূৰ্বাঞ্চলৰ বাবে জ্ঞানীয় খেল আৰু স্মৃতি সহায়',
    tabs: {
      home: 'ঘৰ',
      games: 'খেল',
      culture: 'উত্তৰ-পূৰ্ব সংস্কৃতি',
      memories: 'স্মৃতি',
      routine: 'নিয়মীয়া কাম',
      garden: 'বাগিচা',
      caregiver: 'যত্নশীল পৰ্টেল',
    },
    greeting: {
      morning: 'শুভ প্ৰভাত 👋',
      afternoon: 'শুভ অপৰাহ্ন ☀️',
      evening: 'শুভ সন্ধ্যা 🌙',
      welcomeBack: 'আজিৰ দিনটোৰ বাবে আপোনাৰ সংগীলৈ স্বাগতম।',
    },
    actions: {
      playGame: 'খেল খেলক',
      myMemories: 'মোৰ স্মৃতিবোৰ',
      nerCulture: 'উত্তৰ-পূৰ্ব সংস্কৃতি',
      todaysRoutine: 'আজিৰ নিয়মীয়া কাম',
      readAloud: 'পঢ়ি শুনক',
      stopVoice: 'কণ্ঠ বন্ধ কৰক',
      largeFont: 'ডাঙৰ আখৰ',
      normalFont: 'সাধাৰণ আখৰ',
      difficultyGentle: 'সহজ (অভিযোজিত)',
      difficultyMedium: 'মধ্যম (অভিযোজিত)',
    },
    progress: {
      title: 'আজিৰ অগ্ৰগতি',
      memoryActivities: 'স্মৃতি কাৰ্যকলাপ',
      attentionFocus: 'মনোযোগ আৰু একাগ্ৰতা',
      dailyRoutine: 'দৈনন্দিন কাম',
      streak: 'ধাৰাবাহিক দিন',
    },
  },
};
