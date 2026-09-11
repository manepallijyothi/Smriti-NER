import React, { useState, useEffect, useCallback } from 'react';
import { AppState } from '../types';
import { speakText } from '../utils/speech';
import { Volume2, RotateCcw, CheckCircle2, Globe, Brain, Sparkles, Eye, Info, ListOrdered, ArrowRight, Undo2 } from 'lucide-react';

interface GamesViewProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  largeText: boolean;
}

// Cultural cards specifically honoring North East India
const NER_CARD_SYMBOLS = [
  { emoji: '🦏', name: 'Kaziranga Rhino' },
  { emoji: '🍵', name: 'Assam Tea' },
  { emoji: '🎋', name: 'Bamboo Craft' },
  { emoji: '🥁', name: 'Bihu Dhol' },
  { emoji: '🦜', name: 'Hornbill Bird' },
  { emoji: '🌶️', name: 'Bhut Jolokia' },
  { emoji: '🧵', name: 'Muga Silk' },
  { emoji: '🌸', name: 'Kopou Orchid' },
];

interface Card {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface CountryData {
  name: { common: string };
  capital?: string[];
  flags: { png: string; svg?: string; alt?: string };
  continents?: string[];
  borders?: string[];
}

export const GamesView: React.FC<GamesViewProps> = ({ state, updateState, largeText }) => {
  const [selectedGame, setSelectedGame] = useState<'memory' | 'recall' | 'spot' | 'pattern' | 'countries'>('memory');

  // =========================================================================
  // GAME 1: MEMORY MATCH (Culturally adapted for North East India)
  // =========================================================================
  const pairCount = state.gameDifficulty === 'medium' ? 6 : 4;
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const initMemoryGame = useCallback(() => {
    const selectedSymbols = NER_CARD_SYMBOLS.slice(0, pairCount);
    const deck = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setScore(0);
    setMoves(0);
    setIsGameOver(false);
    setIsLocked(false);
  }, [pairCount]);

  useEffect(() => {
    initMemoryGame();
  }, [initMemoryGame]);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        // Matched!
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          setFlippedIndices([]);
          setScore((s) => s + 25);
          setIsLocked(false);

          const remaining = cards.filter(
            (c, i) => !c.isMatched && i !== firstIdx && i !== secondIdx
          ).length;

          if (remaining === 0) {
            setIsGameOver(true);
            const finalScore = score + 25;
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Adaptive difficulty update: increment consecutive correct
            updateState((prev) => {
              const newStreak = prev.consecutiveCorrect + 1;
              const nextDiff = newStreak >= 2 ? 'medium' : prev.gameDifficulty;
              return {
                ...prev,
                memoryActivitiesCount: prev.memoryActivitiesCount + 1,
                consecutiveCorrect: newStreak,
                gameDifficulty: nextDiff,
                lastActivityTime: 'Just now',
                activityLogs: [
                  {
                    id: 'log_' + Date.now(),
                    name: 'Memory Match (NER Cultural Cards)',
                    status: 'Completed',
                    timestamp: now,
                    details: `Score: ${finalScore}, Moves: ${moves + 1} (${pairCount} pairs)`,
                  },
                  ...prev.activityLogs,
                ],
              };
            });
          }
        }, 450);
      } else {
        // Not a match
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  // =========================================================================
  // GAME 2: REMEMBER & RECALL (Specific prompt requirement)
  // Shows 3 items for a few seconds, hides them, asks user to identify them
  // =========================================================================
  const [recallItems, setRecallItems] = useState<{ emoji: string; name: string }[]>([]);
  const [recallOptions, setRecallOptions] = useState<{ emoji: string; name: string }[]>([]);
  const [selectedRecall, setSelectedRecall] = useState<string[]>([]);
  const [recallStage, setRecallStage] = useState<'intro' | 'memorize' | 'recall' | 'result'>('intro');
  const [countdown, setCountdown] = useState<number>(5);

  const startRecallGame = () => {
    // Pick 3 target items
    const shuffled = [...NER_CARD_SYMBOLS].sort(() => Math.random() - 0.5);
    const count = state.gameDifficulty === 'medium' ? 4 : 3;
    const target = shuffled.slice(0, count);
    
    // Pick 3 distractors
    const distractors = shuffled.slice(count, count + 3);
    const options = [...target, ...distractors].sort(() => Math.random() - 0.5);

    setRecallItems(target);
    setRecallOptions(options);
    setSelectedRecall([]);
    setRecallStage('memorize');
    setCountdown(5);

    speakText(`Look closely at these ${count} items and remember them. ${target.map((t) => t.name).join(', ')}.`);
  };

  // Countdown timer during memorize phase
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recallStage === 'memorize' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (recallStage === 'memorize' && countdown === 0) {
      setRecallStage('recall');
      speakText("Now, tap the items you just saw.");
    }
    return () => clearTimeout(timer);
  }, [recallStage, countdown]);

  const toggleRecallOption = (name: string) => {
    if (recallStage !== 'recall') return;
    if (selectedRecall.includes(name)) {
      setSelectedRecall((prev) => prev.filter((i) => i !== name));
    } else {
      setSelectedRecall((prev) => [...prev, name]);
    }
  };

  const checkRecallAnswers = () => {
    setRecallStage('result');
    const targetNames = recallItems.map((i) => i.name);
    const correctCount = selectedRecall.filter((name) => targetNames.includes(name)).length;
    const isSuccess = correctCount >= recallItems.length && selectedRecall.length === recallItems.length;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateState((prev) => ({
      ...prev,
      attentionActivitiesCount: prev.attentionActivitiesCount + 1,
      consecutiveCorrect: isSuccess ? prev.consecutiveCorrect + 1 : 0,
      lastActivityTime: 'Just now',
      activityLogs: [
        {
          id: 'log_' + Date.now(),
          name: 'Remember & Recall Game',
          status: isSuccess ? 'Completed' : 'Started',
          timestamp: now,
          details: `Identified ${correctCount}/${recallItems.length} items correctly`,
        },
        ...prev.activityLogs,
      ],
    }));

    if (isSuccess) {
      speakText("Wonderful job! You remembered all the items correctly.");
    } else {
      speakText("Good effort! Memory takes practice. You can try again anytime.");
    }
  };

  // =========================================================================
  // GAME 3: SPOT THE CHANGE (Specific prompt requirement)
  // Shows a sequence of objects, changes one, asks which one changed
  // =========================================================================
  const [spotStage, setSpotStage] = useState<'intro' | 'initial' | 'changed' | 'result'>('intro');
  const [initialSpotSet, setInitialSpotSet] = useState<{ emoji: string; name: string }[]>([]);
  const [changedSpotSet, setChangedSpotSet] = useState<{ emoji: string; name: string }[]>([]);
  const [changedIndex, setChangedIndex] = useState<number>(0);
  const [chosenSpotIndex, setChosenSpotIndex] = useState<number | null>(null);

  const startSpotGame = () => {
    const shuffled = [...NER_CARD_SYMBOLS].sort(() => Math.random() - 0.5);
    const setSize = state.gameDifficulty === 'medium' ? 4 : 3;
    const originalSet = shuffled.slice(0, setSize);
    
    // Pick an index to change and a replacement not already in set
    const changeIdx = Math.floor(Math.random() * setSize);
    const replacement = shuffled[setSize]; // New item

    const modified = [...originalSet];
    modified[changeIdx] = replacement;

    setInitialSpotSet(originalSet);
    setChangedSpotSet(modified);
    setChangedIndex(changeIdx);
    setChosenSpotIndex(null);
    setSpotStage('initial');

    speakText("Look at these objects carefully. In a moment, one object will change.");
  };

  const handleRevealChange = () => {
    setSpotStage('changed');
    speakText("One object has changed. Which one is different or new?");
  };

  const handleSelectSpotItem = (index: number) => {
    if (spotStage !== 'changed') return;
    setChosenSpotIndex(index);
    setSpotStage('result');

    const isCorrect = index === changedIndex;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    updateState((prev) => ({
      ...prev,
      attentionActivitiesCount: prev.attentionActivitiesCount + 1,
      consecutiveCorrect: isCorrect ? prev.consecutiveCorrect + 1 : 0,
      lastActivityTime: 'Just now',
      activityLogs: [
        {
          id: 'log_' + Date.now(),
          name: 'Spot the Change Game',
          status: isCorrect ? 'Completed' : 'Started',
          timestamp: now,
          details: isCorrect ? 'Found the changed object!' : 'Keep practicing attention',
        },
        ...prev.activityLogs,
      ],
    }));

    if (isCorrect) {
      speakText("Correct! You spotted the changed object.");
    } else {
      speakText(`That was a good try! The changed object was ${changedSpotSet[changedIndex].name}.`);
    }
  };

  // =========================================================================
  // GAME 4: PATTERN MEMORY (Specific prompt requirement)
  // Shows a simple sequence: e.g. 🌸 → 🥁 → 🍵 → 🌿, hides it, asks user to reproduce
  // =========================================================================
  const [patternStage, setPatternStage] = useState<'intro' | 'memorize' | 'reproduce' | 'result'>('intro');
  const [targetPattern, setTargetPattern] = useState<{ emoji: string; name: string }[]>([]);
  const [userPattern, setUserPattern] = useState<{ emoji: string; name: string }[]>([]);
  const [patternCountdown, setPatternCountdown] = useState<number>(5);

  const PATTERN_SYMBOLS = [
    { emoji: '🌸', name: 'Kopou Orchid' },
    { emoji: '🥁', name: 'Bihu Dhol' },
    { emoji: '🍵', name: 'Assam Tea' },
    { emoji: '🌿', name: 'Bamboo Shoot' },
    { emoji: '🦏', name: 'Kaziranga Rhino' },
    { emoji: '🦜', name: 'Hornbill Bird' },
  ];

  const startPatternGame = () => {
    // Gentle: 3 items, Medium: 4 items
    const len = state.gameDifficulty === 'medium' ? 4 : 3;
    const shuffled = [...PATTERN_SYMBOLS].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, len);

    setTargetPattern(chosen);
    setUserPattern([]);
    setPatternStage('memorize');
    setPatternCountdown(5);

    speakText(`Remember this pattern: ${chosen.map((item) => item.name).join(', then ')}.`);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (patternStage === 'memorize' && patternCountdown > 0) {
      timer = setTimeout(() => {
        setPatternCountdown((c) => c - 1);
      }, 1000);
    } else if (patternStage === 'memorize' && patternCountdown === 0) {
      setPatternStage('reproduce');
      speakText('Now, tap the symbols in the same order you saw them.');
    }
    return () => clearTimeout(timer);
  }, [patternStage, patternCountdown]);

  const handleTapPatternSymbol = (sym: { emoji: string; name: string }) => {
    if (patternStage !== 'reproduce') return;
    if (userPattern.length >= targetPattern.length) return;
    setUserPattern((prev) => [...prev, sym]);
  };

  const handleRemoveLastPatternSymbol = () => {
    setUserPattern((prev) => prev.slice(0, prev.length - 1));
  };

  const handleClearPattern = () => {
    setUserPattern([]);
  };

  const checkPatternAnswers = () => {
    setPatternStage('result');
    const isCorrect =
      userPattern.length === targetPattern.length &&
      userPattern.every((item, idx) => item.emoji === targetPattern[idx].emoji);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateState((prev) => ({
      ...prev,
      attentionActivitiesCount: prev.attentionActivitiesCount + 1,
      consecutiveCorrect: isCorrect ? prev.consecutiveCorrect + 1 : 0,
      lastActivityTime: 'Just now',
      activityLogs: [
        {
          id: 'log_' + Date.now(),
          name: 'Pattern Memory Game',
          status: isCorrect ? 'Completed' : 'Started',
          timestamp: now,
          details: isCorrect
            ? `Reproduced sequence of ${targetPattern.length} items correctly`
            : 'Pattern memory exercise attempt',
        },
        ...prev.activityLogs,
      ],
    }));

    if (isCorrect) {
      speakText('Wonderful job! You reproduced the exact pattern.');
    } else {
      speakText('Good try! Observing sequences takes gentle practice.');
    }
  };

  // =========================================================================
  // GAME 5: PLACES & NEIGHBORS (RestCountries API - NE Neighbors: Bhutan, Nepal, etc.)
  // =========================================================================
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [quizQuestion, setQuizQuestion] = useState<{
    country: CountryData;
    options: string[];
    correctAnswer: string;
  } | null>(null);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    setCountryError(null);
    setQuizQuestion(null);
    setQuizSelected(null);
    setQuizAnswered(false);

    try {
      // Fetch neighbors and world countries from public API
      const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,continents,borders');
      if (!res.ok) throw new Error('Network response was not ok');
      const data: CountryData[] = await res.json();
      
      const valid = data.filter((c) => c.capital && c.capital.length > 0 && c.name?.common);
      setCountries(valid);
      generateQuiz(valid);
      setLoadingCountries(false);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setCountryError('Could not load places. Please check your internet connection.');
      setLoadingCountries(false);
    }
  };

  const generateQuiz = (list: CountryData[]) => {
    if (list.length < 4) return;
    
    // Prefer India and immediate North East neighbors (Bhutan, Nepal, Bangladesh, Myanmar)
    const neighborNames = ['India', 'Bhutan', 'Nepal', 'Bangladesh', 'Myanmar', 'Sri Lanka', 'Japan', 'Thailand'];
    const regionalPool = list.filter((c) => neighborNames.includes(c.name.common));
    const pool = regionalPool.length >= 2 && Math.random() > 0.3 ? regionalPool : list;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const target = pool[randomIndex];

    const distractors: string[] = [];
    while (distractors.length < 2) {
      const randomWrong = list[Math.floor(Math.random() * list.length)];
      if (
        randomWrong.name.common !== target.name.common &&
        randomWrong.capital?.[0] &&
        !distractors.includes(randomWrong.capital[0])
      ) {
        distractors.push(randomWrong.capital[0]);
      }
    }

    const correctAnswer = target.capital![0];
    const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

    setQuizQuestion({
      country: target,
      options,
      correctAnswer,
    });
    setQuizSelected(null);
    setQuizAnswered(false);
  };

  const handleSelectQuizOption = (opt: string) => {
    if (quizAnswered || !quizQuestion) return;
    setQuizSelected(opt);
    setQuizAnswered(true);

    if (opt === quizQuestion.correctAnswer) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      updateState((prev) => ({
        ...prev,
        attentionActivitiesCount: prev.attentionActivitiesCount + 1,
        lastActivityTime: 'Just now',
        activityLogs: [
          {
            id: 'log_' + Date.now(),
            name: 'Geography & Neighbor Memory Quiz',
            status: 'Completed',
            timestamp: now,
            details: `Identified capital of ${quizQuestion.country.name.common}`,
          },
          ...prev.activityLogs,
        ],
      }));
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Game Selector Tabs */}
      <div className="bg-white rounded-xl p-2 border border-stone-200 shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-1">
        <button
          onClick={() => setSelectedGame('memory')}
          className={`py-2.5 px-2 rounded-lg font-bold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-1 ${
            selectedGame === 'memory'
              ? 'bg-[#2d6a4f] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Brain className="w-4 h-4 shrink-0" />
          <span>Memory Match</span>
        </button>

        <button
          onClick={() => setSelectedGame('recall')}
          className={`py-2.5 px-2 rounded-lg font-bold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-1 ${
            selectedGame === 'recall'
              ? 'bg-[#2d6a4f] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Remember & Recall</span>
        </button>

        <button
          onClick={() => setSelectedGame('spot')}
          className={`py-2.5 px-2 rounded-lg font-bold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-1 ${
            selectedGame === 'spot'
              ? 'bg-[#2d6a4f] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Eye className="w-4 h-4 shrink-0" />
          <span>Spot the Change</span>
        </button>

        <button
          onClick={() => setSelectedGame('pattern')}
          className={`py-2.5 px-2 rounded-lg font-bold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-1 ${
            selectedGame === 'pattern'
              ? 'bg-[#2d6a4f] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <ListOrdered className="w-4 h-4 shrink-0" />
          <span>Pattern Memory</span>
        </button>

        <button
          onClick={() => {
            setSelectedGame('countries');
            if (countries.length === 0) fetchCountries();
          }}
          className={`py-2.5 px-2 rounded-lg font-bold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-1 col-span-2 sm:col-span-1 ${
            selectedGame === 'countries'
              ? 'bg-[#2d6a4f] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>Places & Neighbors</span>
        </button>
      </div>

      {/* Cognitive Adaptation Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Adaptive Cognitive Level:</strong> {state.gameDifficulty === 'medium' ? 'Medium (6 pairs / 4 items)' : 'Gentle (4 pairs / 3 items)'}.
            SMRITI dynamically adapts pacing to keep games stress-free.
          </span>
        </div>
        <button
          onClick={() =>
            updateState((prev) => ({
              ...prev,
              gameDifficulty: prev.gameDifficulty === 'gentle' ? 'medium' : 'gentle',
            }))
          }
          className="ml-2 underline font-bold hover:text-emerald-950 shrink-0"
        >
          Switch to {state.gameDifficulty === 'gentle' ? 'Medium' : 'Gentle'}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* GAME 1: MEMORY MATCH VIEW */}
      {/* ========================================================================= */}
      {selectedGame === 'memory' && (
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div className="text-left">
              <h2 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 flex items-center gap-2`}>
                <span>🦏</span>
                <span>NER Cultural Memory Match</span>
              </h2>
              <p className="text-stone-600 text-sm mt-0.5">Find matching pairs of familiar North Eastern cultural symbols.</p>
            </div>
            <button
              onClick={() => speakText("Memory Match. Find the matching pairs. Tap a card to flip it over.")}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              title="Read instructions"
              aria-label="Read game instructions"
            >
              <Volume2 className="w-5 h-5 text-emerald-800" />
            </button>
          </div>

          {/* Score & Moves */}
          <div className="flex justify-center space-x-8 mb-5 text-stone-700 text-base font-semibold">
            <span>Score: <strong className="text-emerald-800 text-lg">{score}</strong></span>
            <span>Moves: <strong className="text-stone-900 text-lg">{moves}</strong></span>
          </div>

          {/* Cards Grid */}
          <div
            className={`grid gap-3 mx-auto max-w-sm sm:max-w-md ${
              pairCount === 4 ? 'grid-cols-4' : 'grid-cols-4'
            }`}
          >
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={card.isFlipped || card.isMatched || isLocked}
                aria-label={card.isFlipped || card.isMatched ? `Card shows ${card.name}` : 'Hidden card'}
                className={`h-20 sm:h-24 rounded-xl text-3xl sm:text-4xl flex flex-col items-center justify-center font-bold transition-all border-2 select-none ${
                  card.isFlipped || card.isMatched
                    ? 'bg-amber-50 border-amber-300 shadow-xs'
                    : 'bg-[#2d6a4f] border-[#245740] text-emerald-100 hover:bg-emerald-700 active:scale-95 shadow-sm'
                } ${card.isMatched ? 'opacity-90 border-emerald-500 bg-emerald-50/80' : ''}`}
              >
                <span>{card.isFlipped || card.isMatched ? card.emoji : '🌿'}</span>
                {(card.isFlipped || card.isMatched) && (
                  <span className="text-[9px] text-stone-700 font-semibold truncate max-w-[65px] mt-0.5">
                    {card.name}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Game Over notification */}
          {isGameOver && (
            <div className="mt-6 bg-amber-50 border border-amber-300 rounded-xl p-5 text-stone-900 animate-fadeIn">
              <div className="text-3xl mb-1">🎉</div>
              <h3 className="text-xl font-bold text-amber-950">Wonderful Job!</h3>
              <p className="text-stone-700 mt-1">
                You matched all pairs in <strong>{moves} moves</strong> with a score of <strong>{score}</strong>.
              </p>
              <p className="text-xs text-emerald-800 font-medium mt-1">
                🌱 Your memory garden received fresh watering!
              </p>
            </div>
          )}

          {/* Reset / Try Again */}
          <div className="mt-6">
            <button
              onClick={initMemoryGame}
              className="inline-flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-6 py-2.5 rounded-lg text-sm font-bold border border-stone-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isGameOver ? 'Play Again' : 'Shuffle & Restart'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 2: REMEMBER & RECALL VIEW */}
      {/* ========================================================================= */}
      {selectedGame === 'recall' && (
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div className="text-left">
              <h2 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 flex items-center gap-2`}>
                <span>✨</span>
                <span>Remember & Recall</span>
              </h2>
              <p className="text-stone-600 text-sm mt-0.5">Observe the items, memorize them, and pick them out.</p>
            </div>
            <button
              onClick={() => speakText("Remember and Recall. Take your time to observe the items, then tap which ones you saw.")}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              title="Read instructions"
              aria-label="Read recall instructions"
            >
              <Volume2 className="w-5 h-5 text-emerald-800" />
            </button>
          </div>

          {/* Intro stage */}
          {recallStage === 'intro' && (
            <div className="py-8 space-y-4">
              <p className="text-stone-700 text-base leading-relaxed max-w-md mx-auto">
                A gentle exercise for short-term working memory. You will see {state.gameDifficulty === 'medium' ? '4' : '3'} culturally familiar items for 5 seconds.
                Then, choose which items were in the group.
              </p>
              <button
                onClick={startRecallGame}
                className="bg-[#2d6a4f] hover:bg-[#245740] text-white px-8 py-3 rounded-lg text-base font-bold shadow-sm transition-colors cursor-pointer"
              >
                Start Recall Exercise
              </button>
            </div>
          )}

          {/* Memorize stage */}
          {recallStage === 'memorize' && (
            <div className="py-4 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full font-bold text-sm">
                <span>👀 Look closely and remember ({countdown}s)</span>
              </div>

              <div className="flex justify-center items-center gap-4 py-4">
                {recallItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex flex-col items-center justify-center shadow-md animate-bounce-short"
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-emerald-950 mt-2">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recall Selection stage */}
          {recallStage === 'recall' && (
            <div className="py-4 space-y-4">
              <p className="text-base font-bold text-stone-800">
                👇 Which of these items did you just see? (Select {recallItems.length})
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
                {recallOptions.map((opt, idx) => {
                  const isSelected = selectedRecall.includes(opt.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleRecallOption(opt.name)}
                      className={`p-3.5 rounded-xl border-2 font-bold text-sm flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 text-stone-900 shadow-xs'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <span className="text-3xl mb-1">{opt.emoji}</span>
                      <span>{opt.name}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={checkRecallAnswers}
                disabled={selectedRecall.length === 0}
                className="mt-4 bg-[#2d6a4f] hover:bg-[#245740] disabled:opacity-50 text-white px-8 py-2.5 rounded-lg text-base font-bold shadow-sm transition-colors cursor-pointer"
              >
                Check My Answer
              </button>
            </div>
          )}

          {/* Result stage */}
          {recallStage === 'result' && (
            <div className="py-6 space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl max-w-md mx-auto">
                <h3 className="text-lg font-bold text-emerald-950">Memory Check Summary</h3>
                <p className="text-sm text-stone-700 mt-1">
                  The items shown were:{' '}
                  <strong>{recallItems.map((i) => i.name).join(', ')}</strong>.
                </p>
              </div>

              <button
                onClick={startRecallGame}
                className="bg-[#2d6a4f] hover:bg-[#245740] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                Play Another Round
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 3: SPOT THE CHANGE VIEW */}
      {/* ========================================================================= */}
      {selectedGame === 'spot' && (
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div className="text-left">
              <h2 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 flex items-center gap-2`}>
                <span>🔍</span>
                <span>Spot the Change</span>
              </h2>
              <p className="text-stone-600 text-sm mt-0.5">Observe the items, then detect which one transforms.</p>
            </div>
            <button
              onClick={() => speakText("Spot the Change. Look at the objects, notice which one changes, and tap it.")}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              title="Read instructions"
              aria-label="Read spot instructions"
            >
              <Volume2 className="w-5 h-5 text-emerald-800" />
            </button>
          </div>

          {spotStage === 'intro' && (
            <div className="py-8 space-y-4">
              <p className="text-stone-700 text-base leading-relaxed max-w-md mx-auto">
                Sharpens visual attention and focus. You will examine a row of familiar objects, then one will change into something new. Tap the changed object!
              </p>
              <button
                onClick={startSpotGame}
                className="bg-[#2d6a4f] hover:bg-[#245740] text-white px-8 py-3 rounded-lg text-base font-bold shadow-sm transition-colors"
              >
                Start Spot the Change
              </button>
            </div>
          )}

          {spotStage === 'initial' && (
            <div className="py-4 space-y-4">
              <div className="inline-block bg-emerald-100 text-emerald-900 px-4 py-1.5 rounded-full font-bold text-sm">
                Step 1: Notice these {initialSpotSet.length} items
              </div>

              <div className="flex justify-center items-center gap-4 py-4">
                {initialSpotSet.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 bg-stone-50 border-2 border-stone-300 rounded-2xl flex flex-col items-center justify-center shadow-xs"
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-stone-800 mt-2">{item.name}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleRevealChange}
                className="bg-[#2d6a4f] hover:bg-[#245740] text-white px-8 py-2.5 rounded-lg text-base font-bold shadow-sm transition-colors"
              >
                I am Ready! Make the Change →
              </button>
            </div>
          )}

          {spotStage === 'changed' && (
            <div className="py-4 space-y-4">
              <div className="inline-block bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full font-bold text-sm">
                Step 2: Tap the object that is DIFFERENT or NEW!
              </div>

              <div className="flex justify-center items-center gap-4 py-4">
                {changedSpotSet.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSpotItem(idx)}
                    className="p-4 sm:p-5 bg-white border-2 border-amber-400 hover:border-emerald-600 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer"
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-stone-900 mt-2">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {spotStage === 'result' && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl max-w-md mx-auto">
                <h3 className="text-lg font-bold text-emerald-950">
                  {chosenSpotIndex === changedIndex ? '🎉 Excellent Observation!' : 'Good Effort!'}
                </h3>
                <p className="text-sm text-stone-700 mt-1">
                  The changed item was <strong>{changedSpotSet[changedIndex].name}</strong> ({changedSpotSet[changedIndex].emoji}).
                </p>
              </div>

              <button
                onClick={startSpotGame}
                className="bg-[#2d6a4f] hover:bg-[#245740] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                Play Another Round
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 4: PATTERN MEMORY (Prompt Requirement) */}
      {/* ========================================================================= */}
      {selectedGame === 'pattern' && (
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div className="text-left">
              <h2 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 flex items-center gap-2`}>
                <span>🌸</span>
                <span>Pattern Memory</span>
              </h2>
              <p className="text-stone-600 text-sm mt-0.5">
                Observe the sequence of cultural symbols, then tap them in the exact order.
              </p>
            </div>
            <button
              onClick={() =>
                speakText(
                  'Pattern Memory. Watch the sequence of symbols carefully, then tap the items in the exact order.'
                )
              }
              className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100"
              title="Read Instructions"
            >
              <Volume2 className="w-5 h-5 text-emerald-800" />
            </button>
          </div>

          {/* Intro Stage */}
          {patternStage === 'intro' && (
            <div className="py-8 space-y-5">
              <div className="flex justify-center items-center space-x-2 text-2xl sm:text-3xl bg-amber-50 border border-amber-200 p-4 rounded-xl max-w-md mx-auto">
                <span>🌸</span>
                <ArrowRight className="w-5 h-5 text-amber-700" />
                <span>🥁</span>
                <ArrowRight className="w-5 h-5 text-amber-700" />
                <span>🍵</span>
                <ArrowRight className="w-5 h-5 text-amber-700" />
                <span>🌿</span>
              </div>

              <div className="max-w-md mx-auto text-left text-sm text-stone-700 space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <p className="font-bold text-stone-900">How to play:</p>
                <ol className="list-decimal pl-5 space-y-1 text-stone-600 text-xs sm:text-sm">
                  <li>We will show you a sequence of {state.gameDifficulty === 'medium' ? '4' : '3'} cultural symbols.</li>
                  <li>Observe carefully for 5 seconds before they are hidden.</li>
                  <li>Tap the symbols below in the exact sequence you observed.</li>
                </ol>
              </div>

              <button
                onClick={startPatternGame}
                className="bg-[#2d6a4f] hover:bg-[#245740] text-white px-8 py-3 rounded-xl font-bold text-base shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                Start Pattern Exercise
              </button>
            </div>
          )}

          {/* Memorize Stage */}
          {patternStage === 'memorize' && (
            <div className="py-8 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse">
                <span>⏳ Memorize this sequence ({patternCountdown}s)</span>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-3 py-4">
                {targetPattern.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center p-3 sm:p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl shadow-xs min-w-[75px] sm:min-w-[90px]">
                      <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                      <span className="text-xs font-bold text-emerald-900 mt-1">{item.name}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">#{idx + 1}</span>
                    </div>
                    {idx < targetPattern.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <p className="text-sm text-stone-600">
                The sequence will be hidden in a few seconds...
              </p>
            </div>
          )}

          {/* Reproduce Stage */}
          {patternStage === 'reproduce' && (
            <div className="py-4 space-y-5">
              <div className="text-stone-800 font-bold text-base">
                Tap the symbols in the order you saw them:
              </div>

              {/* User sequence slots */}
              <div className="flex justify-center items-center gap-2 sm:gap-3 py-2">
                {targetPattern.map((_, idx) => {
                  const filled = userPattern[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        filled
                          ? 'bg-amber-50 border-amber-500 shadow-xs'
                          : 'border-dashed border-stone-300 bg-stone-50 text-stone-400'
                      }`}
                    >
                      {filled ? (
                        <>
                          <span className="text-2xl sm:text-3xl">{filled.emoji}</span>
                          <span className="text-[10px] font-bold text-stone-800 mt-1 truncate max-w-[60px]">
                            {filled.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-stone-400">Slot {idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* User control buttons */}
              <div className="flex justify-center items-center gap-2">
                <button
                  type="button"
                  onClick={handleRemoveLastPatternSymbol}
                  disabled={userPattern.length === 0}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearPattern}
                  disabled={userPattern.length === 0}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Available symbol choices */}
              <div className="pt-2 border-t border-stone-100">
                <p className="text-xs text-stone-500 mb-2">Select from these symbols:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-lg mx-auto">
                  {PATTERN_SYMBOLS.map((sym, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTapPatternSymbol(sym)}
                      className="p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-500 rounded-xl transition-all flex flex-col items-center cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <span className="text-2xl sm:text-3xl">{sym.emoji}</span>
                      <span className="text-[10px] text-stone-700 font-semibold mt-1 truncate max-w-[70px]">
                        {sym.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={checkPatternAnswers}
                  disabled={userPattern.length < targetPattern.length}
                  className="bg-[#2d6a4f] hover:bg-[#245740] disabled:bg-stone-300 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  Check My Sequence
                </button>
              </div>
            </div>
          )}

          {/* Result Stage */}
          {patternStage === 'result' && (
            <div className="py-6 space-y-5">
              {userPattern.length === targetPattern.length &&
              userPattern.every((item, idx) => item.emoji === targetPattern[idx].emoji) ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl max-w-md mx-auto space-y-1">
                  <div className="text-3xl">🎉</div>
                  <h3 className="text-lg font-bold text-emerald-950">
                    Excellent Memory!
                  </h3>
                  <p className="text-xs text-emerald-800">
                    You matched all {targetPattern.length} symbols in the exact order! Great cognitive exercise.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-md mx-auto space-y-2">
                  <div className="text-3xl">🌱</div>
                  <h3 className="text-lg font-bold text-amber-950">
                    Good Effort!
                  </h3>
                  <p className="text-xs text-amber-900">
                    Pattern sequences are great practice for visual working memory. Here was the target sequence:
                  </p>
                  <div className="flex justify-center items-center gap-1.5 text-xl py-1">
                    {targetPattern.map((item, idx) => (
                      <span key={idx} className="bg-white px-2 py-1 rounded border border-amber-200 text-sm font-bold">
                        {item.emoji} {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={startPatternGame}
                  className="bg-[#2d6a4f] hover:bg-[#245740] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Try Another Pattern
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 5: PLACES & NEIGHBORS (RestCountries API) */}
      {/* ========================================================================= */}
      {selectedGame === 'countries' && (
        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm text-center">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div className="text-left">
              <h2 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 flex items-center gap-2`}>
                <span>🌍</span>
                <span>Regional Geography & Neighbors</span>
              </h2>
              <p className="text-stone-600 text-sm mt-0.5">Recall capitals of India and neighboring countries bordering the North East.</p>
            </div>
            <button
              onClick={() =>
                speakText(
                  quizQuestion
                    ? `What is the capital city of ${quizQuestion.country.name.common}? Choose from the options below.`
                    : 'Regional geography quiz.'
                )
              }
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              title="Read question"
              aria-label="Read quiz question"
            >
              <Volume2 className="w-5 h-5 text-emerald-800" />
            </button>
          </div>

          {loadingCountries && (
            <div className="py-12 text-center text-stone-600 space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-base font-medium">Loading places from around the region...</p>
            </div>
          )}

          {countryError && !loadingCountries && (
            <div className="py-8 bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-900 space-y-3">
              <p className="text-base font-medium">{countryError}</p>
              <button
                onClick={fetchCountries}
                className="bg-red-800 hover:bg-red-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!loadingCountries && !countryError && quizQuestion && (
            <div className="space-y-6">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                <div className="flex justify-center mb-3">
                  <img
                    src={quizQuestion.country.flags.png}
                    alt={quizQuestion.country.flags.alt || `Flag of ${quizQuestion.country.name.common}`}
                    className="w-28 h-auto object-cover rounded shadow-xs border border-stone-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Geography & Reminiscence</p>
                <h3 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 mt-1`}>
                  What is the capital of{' '}
                  <span className="text-emerald-800 underline decoration-emerald-400">
                    {quizQuestion.country.name.common}
                  </span>
                  ?
                </h3>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                {quizQuestion.options.map((option, idx) => {
                  const isChosen = quizSelected === option;
                  const isCorrect = option === quizQuestion.correctAnswer;
                  let btnStyle = 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300';

                  if (quizAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(option)}
                      disabled={quizAnswered}
                      className={`w-full py-3 px-4 text-left rounded-xl border-2 font-medium text-base flex items-center justify-between transition-all ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {quizAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div className="pt-2">
                  <p className="text-sm text-stone-700 font-medium mb-3">
                    {quizSelected === quizQuestion.correctAnswer
                      ? '🎉 Correct! That is the capital city.'
                      : `The correct capital is ${quizQuestion.correctAnswer}.`}
                  </p>
                  <button
                    onClick={() => generateQuiz(countries)}
                    className="bg-[#2d6a4f] hover:bg-[#245740] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors"
                  >
                    Next Question
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
