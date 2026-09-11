import React, { useState } from 'react';
import { AppState } from '../types';
import { speakText } from '../utils/speech';
import { Droplet, Sparkles, Volume2, Sun } from 'lucide-react';

interface GardenViewProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  largeText: boolean;
}

export const GardenView: React.FC<GardenViewProps> = ({ state, updateState, largeText }) => {
  const [wateringEffect, setWateringEffect] = useState(false);

  const completedRoutine = state.routine.filter((r) => r.completed).length;
  const totalActivities = state.memoryActivitiesCount + state.attentionActivitiesCount + completedRoutine;

  // Determine stage (1 to 4)
  let stage = 1;
  let stageLabel = 'Sprout Stage';
  let stageDesc = 'Your seeds have sprouted in the fertile Brahmaputra soil.';
  let mainPlantEmoji = '🌱';

  if (totalActivities >= 9) {
    stage = 4;
    stageLabel = 'Flourishing Hill Sanctuary';
    stageDesc = 'Your sanctuary is in full bloom with tall Himalayan pines, blooming Kopou orchids, and fragrant mountain flowers!';
    mainPlantEmoji = '🌳';
  } else if (totalActivities >= 6) {
    stage = 3;
    stageLabel = 'Orchids & Rhododendron Bloom';
    stageDesc = 'Bright red rhododendrons and delicate foxtail orchids are blooming today.';
    mainPlantEmoji = '🌸';
  } else if (totalActivities >= 3) {
    stage = 2;
    stageLabel = 'Healthy Tea & Bamboo Shoots';
    stageDesc = 'Fresh green bamboo shoots and tender Assam tea leaves are soaking up the sunshine.';
    mainPlantEmoji = '🌿';
  }

  // Interactive watering action
  const handleWaterGarden = () => {
    setWateringEffect(true);
    setTimeout(() => setWateringEffect(false), 1200);

    updateState((prev) => ({
      ...prev,
      gardenWateredToday: true,
      lastActivityTime: 'Just now',
    }));
  };

  const handleReadGarden = () => {
    speakText(
      `Welcome to your North East Memory Garden. You are at the ${stageLabel}. You have completed ${totalActivities} activities today. ${stageDesc}`
    );
  };

  // 8 regional botanical patches of North East India
  const regionalFlora = [
    { name: 'Kopou Orchid', state: 'Assam', emoji: '🌸', threshold: 1 },
    { name: 'Red Rhododendron', state: 'Sikkim & Nagaland', emoji: '🌺', threshold: 2 },
    { name: 'Assam Tea Bush', state: 'Assam', emoji: '🍃', threshold: 3 },
    { name: 'Shirui Lily', state: 'Manipur', emoji: '🌷', threshold: 4 },
    { name: 'Blue Vanda', state: 'Meghalaya', emoji: '🪻', threshold: 6 },
    { name: 'Golden Marigold', state: 'Tripura', emoji: '🌼', threshold: 7 },
    { name: 'Wild Bamboo', state: 'Mizoram', emoji: '🎋', threshold: 8 },
    { name: 'Himalayan Cedar', state: 'Arunachal', emoji: '🌳', threshold: 9 },
  ];

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Garden Header */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
          <div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Cognitive Reward & Nature Sanctuary
            </span>
            <h2 className={`${largeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-bold text-stone-900 mt-1 flex items-center gap-2`}>
              <span>🌱</span>
              <span>North East Memory Garden</span>
            </h2>
          </div>
          <button
            onClick={handleReadGarden}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            title="Read garden status aloud"
            aria-label="Read garden status aloud"
          >
            <Volume2 className="w-5 h-5 text-emerald-800" />
          </button>
        </div>

        {/* Current status description */}
        <div className="mt-3.5 flex items-center justify-between">
          <div>
            <p className="text-base sm:text-lg font-semibold text-stone-900 flex items-center space-x-2">
              <span className="text-emerald-900">{stageLabel}</span>
              <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium border border-stone-200">
                Level {stage} of 4
              </span>
            </p>
            <p className="text-stone-600 text-sm sm:text-base mt-0.5">{stageDesc}</p>
          </div>
        </div>

        {/* Progression bar */}
        <div className="mt-3.5 bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
          <div
            className="bg-[#1f4737] h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round((totalActivities / 9) * 100))}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-500 mt-1.5 font-normal">
          <span>0 Activities</span>
          <span>{totalActivities} completed today</span>
          <span>9+ Full Bloom</span>
        </div>
      </div>

      {/* Visual Garden Display */}
      <div className="bg-stone-50 rounded-lg p-5 border border-stone-200 flex flex-col justify-between space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-md border border-stone-200 text-xs text-stone-700 font-medium">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>Gentle Hill Breeze • Soil Moist</span>
          </div>

          <button
            onClick={handleWaterGarden}
            className="inline-flex items-center space-x-1.5 bg-[#1f4737] hover:bg-[#18392c] text-white px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <Droplet className={`w-3.5 h-3.5 ${wateringEffect ? 'animate-bounce' : ''}`} />
            <span>{state.gardenWateredToday ? 'Water Plants Again' : 'Water Garden'}</span>
          </button>
        </div>

        {/* Centerpiece Plants Display */}
        <div className="my-4 text-center">
          <div className="inline-block relative">
            <span className="text-6xl sm:text-7xl select-none inline-block">
              {mainPlantEmoji}
            </span>
            {wateringEffect && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-2xl animate-ping">💧</span>
              </div>
            )}
          </div>
          <p className="text-stone-800 font-medium text-sm sm:text-base mt-2">
            {totalActivities >= 9
              ? 'A flourishing hillside sanctuary bringing peace and clear focus'
              : 'Nourished by your daily cognitive exercises and routine'}
          </p>
        </div>

        {/* Regional Flora Bed */}
        <div className="bg-white rounded-lg p-3.5 border border-stone-200">
          <div className="text-xs text-stone-700 font-medium mb-2.5 flex items-center justify-between pb-1.5 border-b border-stone-100">
            <span>Regional Botanical Bed (8 North Eastern Flora)</span>
            <span className="text-emerald-900 font-semibold">{regionalFlora.filter((f) => totalActivities >= f.threshold).length} / 8 Bloomed</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {regionalFlora.map((flower, idx) => {
              const hasBloomed = totalActivities >= flower.threshold;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-2 rounded-md border transition-all ${
                    hasBloomed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                  title={`${flower.name} (${flower.state}): ${hasBloomed ? 'Bloomed!' : 'Unlocks at ' + flower.threshold + ' activities'}`}
                >
                  <span className={`text-xl select-none ${hasBloomed ? '' : 'filter grayscale'}`}>
                    {hasBloomed ? flower.emoji : '🌱'}
                  </span>
                  <span className="text-[10px] text-stone-700 truncate mt-1 w-full text-center">
                    {hasBloomed ? flower.name : 'Waiting'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Flower Diary */}
      <div className="bg-white rounded-lg p-5 border border-stone-200">
        <h3 className={`${largeText ? 'text-2xl' : 'text-lg'} font-bold text-stone-900 mb-2 flex items-center space-x-2`}>
          <Sparkles className="w-4 h-4 text-emerald-800" />
          <span>How Daily Tasks Nourish Your Garden</span>
        </h3>

        <p className="text-stone-600 text-sm leading-relaxed mb-3">
          In SMRITI NER, cognitive games and routine check-ins are linked to calming, positive visual reinforcement. Each completed task nurtures another native flower bed.
        </p>

        <div className="space-y-1.5 text-xs sm:text-sm text-stone-700">
          <div className="flex items-center justify-between p-2 bg-stone-50 rounded-md border border-stone-100">
            <span>1 Task Completed</span>
            <span className="font-medium text-stone-900">🌸 Kopou Orchid opens</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-stone-50 rounded-md border border-stone-100">
            <span>3 Tasks Completed</span>
            <span className="font-medium text-stone-900">🍃 Tender Assam tea leaves sprout</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-stone-50 rounded-md border border-stone-100">
            <span>6 Tasks Completed</span>
            <span className="font-medium text-stone-900">🌺 Red Rhododendrons & Blue Vandas bloom</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-stone-50 rounded-md border border-stone-100">
            <span>9 Tasks Completed</span>
            <span className="font-medium text-stone-900">🌳 Full Himalayan hillside canopy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
