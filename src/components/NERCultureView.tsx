import React, { useState } from 'react';
import { AppState } from '../types';
import { NER_CULTURE_ITEMS, NERCultureItem } from '../data/nerCulture';
import { speakText } from '../utils/speech';
import { Volume2, Heart, Sparkles, Filter, MapPin } from 'lucide-react';

interface NERCultureViewProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  largeText: boolean;
}

export const NERCultureView: React.FC<NERCultureViewProps> = ({
  state: _state,
  updateState,
  largeText,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'festivals' | 'places' | 'music_crafts'>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [rememberedIds, setRememberedIds] = useState<Record<string, boolean>>({});

  const statesList = [
    'Assam',
    'Meghalaya',
    'Nagaland',
    'Manipur',
    'Arunachal Pradesh',
    'Sikkim',
    'Mizoram',
  ];

  const filteredItems = NER_CULTURE_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesState = selectedState === 'all' || item.state.includes(selectedState);
    return matchesCategory && matchesState;
  });

  const handleReadAloud = (item: NERCultureItem) => {
    const speech = `${item.title} from ${item.state}. ${item.description}. Memory question: ${item.reminiscenceQuestion}`;
    speakText(speech);
  };

  const handleMarkRemembered = (item: NERCultureItem) => {
    if (rememberedIds[item.id]) return;
    setRememberedIds((prev) => ({ ...prev, [item.id]: true }));

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateState((prev) => ({
      ...prev,
      memoryActivitiesCount: prev.memoryActivitiesCount + 1,
      lastActivityTime: 'Just now',
      activityLogs: [
        {
          id: 'log_' + Date.now(),
          name: `Cultural Reminiscence: ${item.title}`,
          status: 'Completed',
          timestamp: now,
          details: `Reflected on ${item.state} heritage`,
        },
        ...prev.activityLogs,
      ],
    }));
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* View Header */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
          <div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              North Eastern Heritage & Reminiscence
            </span>
            <h2 className={`${largeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-bold text-stone-900 mt-1 flex items-center gap-2`}>
              <span>🌾</span>
              <span>NER Cultural Explorer</span>
            </h2>
          </div>
          <button
            onClick={() =>
              speakText(
                "NER Cultural Explorer. Explore familiar food, festivals, places, and music of North East India. Listening to memories helps bring back comforting thoughts."
              )
            }
            className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            title="Read instructions aloud"
            aria-label="Read culture instructions"
          >
            <Volume2 className="w-5 h-5 text-emerald-800" />
          </button>
        </div>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
          Culturally familiar sensory memories from Assam, Meghalaya, Nagaland, Manipur, Sikkim, and the Eastern Himalayas to stimulate long-term memory and bring comfort.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs sm:text-sm">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium border ${
            selectedCategory === 'all'
              ? 'bg-[#1f4737] text-white border-[#1f4737]'
              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
          }`}
        >
          All Items ({NER_CULTURE_ITEMS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('food')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium border flex items-center space-x-1.5 ${
            selectedCategory === 'food'
              ? 'bg-[#1f4737] text-white border-[#1f4737]'
              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <span>🍲</span>
          <span>Food & Dishes</span>
        </button>
        <button
          onClick={() => setSelectedCategory('festivals')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium border flex items-center space-x-1.5 ${
            selectedCategory === 'festivals'
              ? 'bg-[#1f4737] text-white border-[#1f4737]'
              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <span>🎉</span>
          <span>Festivals</span>
        </button>
        <button
          onClick={() => setSelectedCategory('places')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium border flex items-center space-x-1.5 ${
            selectedCategory === 'places'
              ? 'bg-[#1f4737] text-white border-[#1f4737]'
              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <span>🏔️</span>
          <span>Familiar Places</span>
        </button>
        <button
          onClick={() => setSelectedCategory('music_crafts')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium border flex items-center space-x-1.5 ${
            selectedCategory === 'music_crafts'
              ? 'bg-[#1f4737] text-white border-[#1f4737]'
              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <span>🎵</span>
          <span>Music & Crafts</span>
        </button>
      </div>

      {/* State Filter */}
      <div className="flex items-center space-x-2 bg-stone-50 border border-stone-200 p-2.5 rounded-lg text-xs font-medium text-stone-700">
        <Filter className="w-3.5 h-3.5 text-stone-500" />
        <span>Filter by State:</span>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-white border border-stone-300 rounded-md px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
        >
          <option value="all">All North Eastern States</option>
          {statesList.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
        <span className="text-stone-300">|</span>
        <span className="text-stone-500">{filteredItems.length} items shown</span>
      </div>

      {/* Culture Cards List */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => {
          const isRemembered = !!rememberedIds[item.id];

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg p-5 border border-stone-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className="text-3xl p-2.5 bg-stone-50 border border-stone-200 rounded-lg select-none shrink-0">
                    {item.emoji}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className={`${largeText ? 'text-2xl' : 'text-lg'} font-bold text-stone-900`}>
                        {item.title}
                      </h3>
                      <span className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span>{item.state}</span>
                      </span>
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-stone-700 text-sm sm:text-base mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleReadAloud(item)}
                  className="p-1.5 text-stone-500 hover:text-emerald-900 rounded-md hover:bg-stone-100 shrink-0 transition-colors"
                  title="Read story aloud"
                  aria-label={`Read story for ${item.title}`}
                >
                  <Volume2 className="w-5 h-5 text-emerald-800" />
                </button>
              </div>

              {/* Reminiscence Prompt Box */}
              <div className="mt-3.5 p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Reminiscence Prompt</span>
                </div>
                <p className="text-sm font-medium text-stone-800 italic">
                  "{item.reminiscenceQuestion}"
                </p>
              </div>

              {/* Action row */}
              <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handleMarkRemembered(item)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isRemembered
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 cursor-default'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isRemembered ? 'fill-emerald-700 text-emerald-700' : 'text-stone-400'}`} />
                  <span>{isRemembered ? 'Memory Acknowledged' : 'This Brings Back a Memory'}</span>
                </button>

                <button
                  onClick={() => handleReadAloud(item)}
                  className="text-xs font-medium text-emerald-900 hover:underline inline-flex items-center space-x-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Story</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
