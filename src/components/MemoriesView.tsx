import React, { useState, useEffect } from 'react';
import { AppState, MemoryItem } from '../types';
import { speakText } from '../utils/speech';
import { Plus, BookOpen, Volume2, X, Heart, Sparkles, UserCheck, HelpCircle } from 'lucide-react';

interface MemoriesViewProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  largeText: boolean;
}

interface OpenLibraryBook {
  key: string;
  title: string;
  authors?: { name: string }[];
  cover_id?: number;
  first_publish_year?: number;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ state, updateState, largeText }) => {
  const [activeTab, setActiveTab] = useState<'family' | 'recall' | 'books'>('family');

  // Form for adding new memory
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPerson, setNewPerson] = useState('');
  const [newRelationship, setNewRelationship] = useState('Son');
  const [newYear, setNewYear] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newEmoji, setNewEmoji] = useState('📸');

  // Interactive Person Recall State
  const [currentRecallIdx, setCurrentRecallIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Open Library API state
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);

  const EMOJI_OPTIONS = ['🦏', '🥟', '⛵', '🧵', '📸', '🍵', '🎋', '🏡', '🎵', '🌸'];

  const fetchClassicBooks = async () => {
    setLoadingBooks(true);
    setBooksError(null);
    try {
      // Using Open Library Subject API for classic literature & folk tales
      const res = await fetch('https://openlibrary.org/subjects/folklore.json?limit=6');
      if (!res.ok) {
        throw new Error('Network error fetching books');
      }
      const data = await res.json();
      if (data.works && Array.isArray(data.works)) {
        setBooks(data.works);
      } else {
        throw new Error('No books found');
      }
      setLoadingBooks(false);
    } catch (err) {
      console.error('Failed to load books:', err);
      setBooksError('Could not load books. Please check your connection.');
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'books' && books.length === 0) {
      fetchClassicBooks();
    }
  }, [activeTab, books.length]);

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMemory: MemoryItem = {
      id: 'm_' + Date.now(),
      title: newTitle.trim(),
      person: newPerson.trim() || undefined,
      relationship: newRelationship.trim() || undefined,
      year: newYear.trim() || new Date().getFullYear().toString(),
      notes: newNotes.trim() || 'A cherished family moment.',
      emoji: newEmoji,
    };

    updateState((prev) => ({
      ...prev,
      memories: [newMemory, ...prev.memories],
      memoryActivitiesCount: prev.memoryActivitiesCount + 1,
      lastActivityTime: 'Just now',
    }));

    setNewTitle('');
    setNewPerson('');
    setNewYear('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const currentRecallMemory = state.memories[currentRecallIdx] || state.memories[0];

  const handleNextRecall = () => {
    setIsRevealed(false);
    setCurrentRecallIdx((prev) => (prev + 1) % state.memories.length);
  };

  const handleReadRecallAloud = () => {
    if (!currentRecallMemory) return;
    if (isRevealed) {
      const speech = `${currentRecallMemory.person ? currentRecallMemory.person + ' is your ' + currentRecallMemory.relationship + '.' : ''} Memory: ${currentRecallMemory.title}. ${currentRecallMemory.notes}`;
      speakText(speech);
    } else {
      const speech = currentRecallMemory.person
        ? `Who is ${currentRecallMemory.person}? Tap Reveal to see the relationship.`
        : `Memory: ${currentRecallMemory.title}. Tap Reveal to remember.`;
      speakText(speech);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* View Switcher Tabs */}
      <div className="bg-stone-100 p-1 rounded-lg border border-stone-200 flex gap-1 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('family')}
          className={`flex-1 py-2 px-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-1.5 ${
            activeTab === 'family'
              ? 'bg-white text-stone-900 border border-stone-300 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span>Family Moments ({state.memories.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('recall');
            setIsRevealed(false);
          }}
          className={`flex-1 py-2 px-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-1.5 ${
            activeTab === 'recall'
              ? 'bg-white text-stone-900 border border-stone-300 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>Person Recall Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('books')}
          className={`flex-1 py-2 px-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-1.5 ${
            activeTab === 'books'
              ? 'bg-white text-stone-900 border border-stone-300 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>Folk Stories</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FAMILY MEMORIES */}
      {/* ========================================================================= */}
      {activeTab === 'family' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-5 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900`}>
                Family Memories & Reminiscence
              </h2>
              <p className="text-stone-600 text-sm mt-0.5">
                Saved memories of family members, trips, and loved ones.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-1.5 bg-[#1f4737] hover:bg-[#18392c] text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add a Memory</span>
            </button>
          </div>

          {/* Add Memory Form */}
          {showAddForm && (
            <div className="bg-white border border-stone-300 rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                <h3 className="text-base font-semibold text-stone-900">Add a New Family Memory</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMemory} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Family Member's Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Ravi, Ananya, Bina"
                      value={newPerson}
                      onChange={(e) => setNewPerson(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Relationship
                    </label>
                    <select
                      value={newRelationship}
                      onChange={(e) => setNewRelationship(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Grandchild">Grandchild</option>
                      <option value="Friend">Close Friend</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Memory Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Family Trip to Kaziranga, Making Bihu Pitha"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Year or Period
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2018 or Autumn 1980"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Choose an Icon
                    </label>
                    <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                      {EMOJI_OPTIONS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setNewEmoji(em)}
                          className={`text-lg p-1 rounded border ${
                            newEmoji === em
                              ? 'bg-stone-100 border-stone-600'
                              : 'bg-white border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Describe the story or memory
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write a few soothing sentences describing what happened, who was there, and how it felt..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-md bg-[#1f4737] hover:bg-[#18392c] text-white font-medium text-xs sm:text-sm cursor-pointer"
                  >
                    Save Memory
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Memory List */}
          <div className="space-y-3">
            {state.memories.map((mem) => (
              <div
                key={mem.id}
                className="bg-white rounded-lg p-4 sm:p-5 border border-stone-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    <span className="text-2xl p-2 bg-stone-50 border border-stone-200 rounded-md select-none shrink-0">
                      {mem.emoji}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className={`${largeText ? 'text-2xl' : 'text-lg'} font-bold text-stone-900`}>
                          {mem.title}
                        </h3>
                        {mem.person && (
                          <span className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium px-2 py-0.5 rounded">
                            {mem.person} ({mem.relationship || 'Family'})
                          </span>
                        )}
                        {mem.year && (
                          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                            {mem.year}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-700 text-sm sm:text-base mt-2 leading-relaxed">
                        {mem.notes}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      speakText(
                        `${mem.title}. ${mem.person ? mem.person + ' is your ' + mem.relationship + '.' : ''} ${mem.notes}`
                      )
                    }
                    className="p-1.5 text-stone-500 hover:text-emerald-900 rounded-md hover:bg-stone-100 shrink-0 ml-2 transition-colors"
                    title="Read memory aloud"
                    aria-label={`Read aloud memory ${mem.title}`}
                  >
                    <Volume2 className="w-5 h-5 text-emerald-800" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PERSON RECALL MODE */}
      {/* ========================================================================= */}
      {activeTab === 'recall' && currentRecallMemory && (
        <div className="bg-white rounded-lg p-5 sm:p-6 border border-stone-200 text-center space-y-5">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
            <div className="text-left">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Reminiscence Quiz
              </span>
              <h2 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 mt-1 flex items-center gap-2`}>
                <span>👤</span>
                <span>Person & Memory Recall</span>
              </h2>
            </div>
            <button
              onClick={handleReadRecallAloud}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
              title="Read prompt aloud"
              aria-label="Read prompt aloud"
            >
              <Volume2 className="w-5 h-5 text-emerald-800" />
            </button>
          </div>

          {/* Question Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 max-w-md mx-auto space-y-4">
            <div className="text-5xl select-none">{currentRecallMemory.emoji}</div>
            
            <div>
              <p className="text-stone-500 text-xs font-medium uppercase tracking-wide">
                Do you recognize this person?
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                Who is <span className="text-emerald-900">{currentRecallMemory.person || 'this family member'}</span>?
              </h3>
            </div>

            {!isRevealed ? (
              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsRevealed(true);
                    handleReadRecallAloud();
                  }}
                  className="inline-flex items-center space-x-2 bg-[#1f4737] hover:bg-[#18392c] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Tap to Reveal Connection</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-lg border border-stone-200 text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-base">💖</span>
                  <p className="text-base font-semibold text-stone-900">
                    {currentRecallMemory.person} is your{' '}
                    <span className="text-emerald-900 font-bold underline">{currentRecallMemory.relationship}</span>.
                  </p>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  <strong>Memory Story:</strong> {currentRecallMemory.notes}
                </p>
                {currentRecallMemory.year && (
                  <p className="text-xs text-stone-500 font-medium">
                    Time: {currentRecallMemory.year}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation between memories */}
          <div className="flex justify-center gap-3 pt-1">
            <button
              onClick={handleNextRecall}
              className="bg-stone-50 hover:bg-stone-100 text-stone-800 px-5 py-2 rounded-lg text-sm font-medium border border-stone-300 transition-colors"
            >
              Next Family Member →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FOLK STORIES (Open Library API) */}
      {/* ========================================================================= */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-5 border border-stone-200">
            <h2 className={`${largeText ? 'text-2xl' : 'text-xl'} font-bold text-stone-900 flex items-center gap-2`}>
              <BookOpen className="w-5 h-5 text-emerald-800" />
              <span>Reading & Folk Tales (Open Library API)</span>
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Familiar traditional tales that evoke nostalgia, peace, and pleasant conversation.
            </p>
          </div>

          {loadingBooks && (
            <div className="bg-white rounded-lg p-8 border border-stone-200 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-stone-700">Loading folk tales & classic stories…</p>
            </div>
          )}

          {booksError && !loadingBooks && (
            <div className="bg-white rounded-lg p-6 border border-stone-200 text-center space-y-3">
              <p className="text-sm font-medium text-stone-800">Could not load books.</p>
              <p className="text-xs text-stone-500">Please check your internet connection or try again.</p>
              <button
                onClick={fetchClassicBooks}
                className="inline-flex items-center space-x-1.5 bg-[#1f4737] hover:bg-[#18392c] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                <span>Try Again</span>
              </button>
            </div>
          )}

          {!loadingBooks && !booksError && books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {books.map((book) => {
                const authorName = book.authors && book.authors[0] ? book.authors[0].name : 'Traditional Storyteller';
                const coverUrl = book.cover_id
                  ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                  : null;

                return (
                  <div
                    key={book.key}
                    className="bg-white rounded-lg p-3.5 border border-stone-200 flex space-x-3 items-start"
                  >
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={`Cover of ${book.title}`}
                        className="w-14 h-20 object-cover rounded border border-stone-200 shrink-0 bg-stone-100"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-20 bg-stone-50 border border-stone-200 rounded flex items-center justify-center text-2xl shrink-0">
                        📖
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">{authorName}</p>
                      {book.first_publish_year && (
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Published: {book.first_publish_year}
                        </p>
                      )}

                      <button
                        onClick={() =>
                          speakText(
                            `Story: ${book.title}, recorded by ${authorName}. Do you remember listening to traditional folk stories like this?`
                          )
                        }
                        className="mt-2 inline-flex items-center space-x-1 text-xs text-emerald-900 font-medium hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Read title</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
