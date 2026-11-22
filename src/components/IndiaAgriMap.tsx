import React, { useState } from 'react';
import { MapPin, Bug, TrendingUp, Droplets, Search } from 'lucide-react';
import {
  INDIA_STATES_AGRI,
  coordsToSvgPath,
  getPolygonCentroid,
  type IndiaStateAgriData,
} from '../data/indiaStates';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language } from '../types';

interface IndiaAgriMapProps {
  language: Language;
  defaultStateName?: string;
}

export const IndiaAgriMap: React.FC<IndiaAgriMapProps> = ({ language, defaultStateName }) => {
  const t = TRANSLATIONS[language];
  const initialState =
    INDIA_STATES_AGRI.find((s) => s.name.toLowerCase().includes((defaultStateName || 'maharashtra').toLowerCase())) ||
    INDIA_STATES_AGRI.find((s) => s.id === 'MH')!;

  const [hoveredState, setHoveredState] = useState<IndiaStateAgriData | null>(null);
  const [pinnedState, setPinnedState] = useState<IndiaStateAgriData>(initialState);
  const [query, setQuery] = useState('');

  const activeState = hoveredState || pinnedState;

  const filteredStates = INDIA_STATES_AGRI.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.nameHi.toLowerCase().includes(q) ||
      s.nameOr.toLowerCase().includes(q) ||
      s.onionBelts.toLowerCase().includes(q)
    );
  });

  const getLocalizedStateName = (s: IndiaStateAgriData) => {
    if (language === 'hi') return s.nameHi;
    if (language === 'or') return s.nameOr;
    return s.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#111815]">{t.indiaMap.title}</h2>
          <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.indiaMap.subtitle}</p>
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-[#526056] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search state or belt (e.g. Odisha, Nashik)..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white focus:outline-none focus:border-emerald-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SVG India Map */}
        <div className="lg:col-span-7 bg-white border border-[#DFE4DC] rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between text-xs text-[#526056] mb-3 pb-3 border-b border-[#EAEFEA]">
            <span>{t.indiaMap.hoverPrompt}</span>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700 inline-block" />
                <span>Active / Selected</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-100 border border-amber-400 inline-block" />
                <span>High Humidity Risk</span>
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-[560/610] max-h-[580px] mx-auto">
            <svg
              viewBox="0 0 560 610"
              className="w-full h-full select-none"
              role="img"
              aria-label="Interactive Agricultural Map of India"
            >
              {/* Subtle latitude/longitude grid lines */}
              <g stroke="#EEF1EC" strokeWidth="1" strokeDasharray="3 3">
                <line x1="20" y1="150" x2="540" y2="150" />
                <line x1="20" y1="300" x2="540" y2="300" />
                <line x1="20" y1="450" x2="540" y2="450" />
                <line x1="150" y1="18" x2="150" y2="590" />
                <line x1="280" y1="18" x2="280" y2="590" />
                <line x1="410" y1="18" x2="410" y2="590" />
              </g>

              {INDIA_STATES_AGRI.map((state) => {
                const isActive = activeState.id === state.id;
                const isMatch = filteredStates.some((f) => f.id === state.id);
                const pathD = coordsToSvgPath(state.coords);
                const [cx, cy] = getPolygonCentroid(state.coords);

                let fill = '#E8EFE7';
                let stroke = '#8FA595';
                if (!isMatch) {
                  fill = '#F4F5F3';
                  stroke = '#D3DBD2';
                } else if (isActive) {
                  fill = '#15803D';
                  stroke = '#0D4F26';
                } else if (state.humidityRisk === 'High') {
                  fill = '#FEF3C7';
                  stroke = '#D97706';
                } else if (state.id === 'MH' || state.id === 'MP' || state.id === 'GJ' || state.id === 'KA') {
                  fill = '#CFE4D2';
                  stroke = '#567B62';
                }

                return (
                  <g
                    key={state.id}
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => setPinnedState(state)}
                    className="cursor-pointer transition-colors duration-150"
                  >
                    <path
                      d={pathD}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isActive ? 2 : 1.1}
                      strokeLinejoin="round"
                    />
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="9"
                      fontWeight={isActive ? '700' : '600'}
                      fill={isActive ? '#FFFFFF' : '#1E2D24'}
                      className="pointer-events-none select-none font-mono"
                    >
                      {state.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right State Intelligence Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EAEFEA]">
              <div>
                <div className="text-xs text-[#526056] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{activeState.primarySeason}</span>
                  <span aria-hidden="true">·</span>
                  <span>Code {activeState.id}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#111815] mt-1">
                  {getLocalizedStateName(activeState)}
                </h3>
                {language !== 'en' && (
                  <div className="text-xs text-[#526056] mt-0.5">{activeState.name}</div>
                )}
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-[#526056]">{t.indiaMap.humidityRisk}</div>
                <div
                  className={`text-sm font-semibold mt-0.5 ${
                    activeState.humidityRisk === 'High'
                      ? 'text-red-700'
                      : activeState.humidityRisk === 'Moderate'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                  }`}
                >
                  {activeState.humidityRisk}
                </div>
              </div>
            </div>

            {/* Agriculture Synopsis */}
            <div>
              <div className="text-xs font-semibold text-[#526056] mb-1.5">
                {t.indiaMap.synopsis}
              </div>
              <p className="text-sm text-[#1E2923] leading-relaxed">{activeState.synopsis}</p>
            </div>

            {/* Key Onion Belts */}
            <div className="pt-3 border-t border-[#EAEFEA]">
              <div className="text-xs font-semibold text-[#526056] mb-1">
                {t.indiaMap.onionBelts}
              </div>
              <p className="text-sm font-medium text-[#111815]">{activeState.onionBelts}</p>
            </div>

            {/* Real-Time Crop Yield Forecast */}
            <div className="p-4 rounded-lg bg-[#F6F8F5] border border-[#E2E7DF]">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-[#526056] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.indiaMap.yieldForecast}</span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 font-mono-nums">
                  {activeState.yieldDelta}
                </span>
              </div>
              <div className="text-lg font-bold text-[#111815] font-mono-nums">
                {activeState.yieldForecast}
              </div>
            </div>

            {/* Localized Pest Control Advice */}
            <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200/80">
              <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5 mb-1.5">
                <Bug className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.indiaMap.pestAdvice}</span>
              </div>
              <p className="text-sm text-[#2D2412] leading-relaxed">{activeState.pestAdvice}</p>
            </div>
          </div>

          {/* Quick State Selector Grid */}
          <div className="bg-white border border-[#DFE4DC] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-[#526056] mb-3">
              <span className="font-semibold">All Indian States ({filteredStates.length})</span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                <span>Click to pin</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
              {filteredStates.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onMouseEnter={() => setHoveredState(s)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setPinnedState(s)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeState.id === s.id
                      ? 'bg-[#15803D] text-white border-[#15803D]'
                      : 'bg-[#F6F8F5] text-[#2F3A32] border-[#DFE4DC] hover:border-emerald-700'
                  }`}
                >
                  {s.id} · {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
