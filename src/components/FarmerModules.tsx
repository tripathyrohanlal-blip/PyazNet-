import React, { useState } from 'react';
import {
  Thermometer,
  Droplets,
  AlertTriangle,
  Fan,
  Wind,
  CheckCircle2,
  FlaskConical,
  CloudRain,
  Sun,
  Sprout,
  Calculator,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Wrench,
  Send,
  Plus,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type {
  AgriLabReport,
  DirectMessage,
  ExchangeListing,
  ForumPost,
  IrrigationZone,
  Language,
  OnionBatch,
  StorageChamber,
  UserProfile,
  WeatherSnapshot,
} from '../types';

/* 01. Storage & Shelf-Life Telemetry */
export const StorageSection: React.FC<{
  chambers: StorageChamber[];
  language: Language;
  token: string;
  onRefresh: () => Promise<void>;
}> = ({ chambers, language, token, onRefresh }) => {
  const t = TRANSLATIONS[language];
  const [busyId, setBusyId] = useState<string | null>(null);

  const totalTonnes = chambers.reduce((sum, c) => sum + c.stockTonnes, 0);
  const avgRh = Math.round(chambers.reduce((sum, c) => sum + c.humidityPct, 0) / Math.max(1, chambers.length));
  const alertCount = chambers.filter((c) => c.alertLevel !== 'NOMINAL').length;
  const avgShelf = Math.round(chambers.reduce((sum, c) => sum + c.shelfLifeDays, 0) / Math.max(1, chambers.length));

  async function controlChamber(id: string, body: Record<string, boolean>) {
    setBusyId(id);
    try {
      await fetch(`/api/storage/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111815]">{t.storage.title}</h2>
        <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.storage.subtitle}</p>
      </div>

      {/* 4-column unboxed KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-[#DFE4DC] rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-[#EAEFEA]">
        <div className="p-5">
          <div className="text-xs text-[#526056]">{t.storage.totalStock}</div>
          <div className="text-2xl font-bold text-[#111815] font-mono-nums mt-1">
            {totalTonnes.toFixed(1)} MT
          </div>
        </div>
        <div className="p-5">
          <div className="text-xs text-[#526056]">{t.storage.avgHumidity}</div>
          <div className="text-2xl font-bold text-[#111815] font-mono-nums mt-1">{avgRh}% RH</div>
        </div>
        <div className="p-5">
          <div className="text-xs text-[#526056]">{t.storage.activeAlerts}</div>
          <div
            className={`text-2xl font-bold font-mono-nums mt-1 ${
              alertCount > 0 ? 'text-amber-700' : 'text-emerald-700'
            }`}
          >
            {alertCount}
          </div>
        </div>
        <div className="p-5">
          <div className="text-xs text-[#526056]">{t.storage.avgShelfLife}</div>
          <div className="text-2xl font-bold text-[#111815] font-mono-nums mt-1">
            {avgShelf} {t.storage.daysLeft}
          </div>
        </div>
      </div>

      {/* Ochratoxin A Prevention Threshold Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs sm:text-sm text-[#3F2E0C]">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p>{t.storage.ochratoxinRiskNote}</p>
      </div>

      {/* Chamber Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {chambers.map((ch) => {
          const isCritical = ch.alertLevel === 'CRITICAL';
          const isWarning = ch.alertLevel === 'WARNING';

          return (
            <div key={ch.id} className="bg-white border border-[#DFE4DC] rounded-xl p-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EAEFEA]">
                  <div>
                    <div className="text-xs text-[#526056]">
                      <span>{ch.location}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{ch.stockTonnes} MT</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#111815] mt-0.5">{ch.name}</h3>
                    <div className="text-xs text-[#526056] mt-0.5">{ch.variety}</div>
                  </div>
                  <div
                    className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                      isCritical ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {ch.alertLevel === 'NOMINAL' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span>{ch.alertLevel}</span>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-lg bg-[#F6F8F5] border border-[#E5EAE3]">
                    <div className="text-xs text-[#526056] flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>{t.storage.temperature}</span>
                    </div>
                    <div className="text-lg font-bold font-mono-nums text-[#111815] mt-0.5">
                      {ch.temperatureC.toFixed(1)} °C
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg border ${
                      ch.humidityPct >= 72
                        ? 'bg-red-50/70 border-red-200'
                        : 'bg-[#F6F8F5] border-[#E5EAE3]'
                    }`}
                  >
                    <div className="text-xs text-[#526056] flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>{t.storage.humidity}</span>
                    </div>
                    <div className="text-lg font-bold font-mono-nums text-[#111815] mt-0.5">
                      {ch.humidityPct}% RH
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F6F8F5] border border-[#E5EAE3]">
                    <div className="text-xs text-[#526056]">{t.storage.moisture}</div>
                    <div className="text-base font-bold font-mono-nums text-[#111815] mt-0.5">
                      {ch.moisturePct}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F6F8F5] border border-[#E5EAE3]">
                    <div className="text-xs text-[#526056]">{t.storage.shelfLife}</div>
                    <div className="text-base font-bold font-mono-nums text-emerald-800 mt-0.5">
                      {ch.shelfLifeDays}d <span className="text-xs font-normal text-[#526056]">(-{ch.weightLossPct}% wt)</span>
                    </div>
                  </div>
                </div>

                {/* Mini 24h RH SVG sparkline */}
                <div className="mt-4 pt-3 border-t border-[#EAEFEA]">
                  <div className="flex items-center justify-between text-[11px] text-[#526056] mb-1.5">
                    <span>{t.storage.humidityHistory}</span>
                    <span className="font-mono-nums">Limit: 68% RH</span>
                  </div>
                  <svg viewBox="0 0 240 54" className="w-full h-14 overflow-visible">
                    <line x1="0" y1="22" x2="240" y2="22" stroke="#D97706" strokeDasharray="3 3" strokeWidth="1" />
                    <polyline
                      fill="none"
                      stroke={ch.humidityPct >= 72 ? '#DC2626' : '#15803D'}
                      strokeWidth="2"
                      points={ch.history
                        .map((pt, i) => {
                          const x = (i / Math.max(1, ch.history.length - 1)) * 230 + 5;
                          const y = 50 - ((Math.min(95, Math.max(40, pt.humidity)) - 40) / 55) * 44;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>

                <p className="text-xs text-[#424E46] mt-2 leading-relaxed">{ch.alertReason}</p>
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-[#EAEFEA] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busyId === ch.id}
                    onClick={() => controlChamber(ch.id, { toggleFan: true })}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      ch.fanActive
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-[#111815] border-[#D4DBD1]'
                    }`}
                  >
                    <Fan className="w-3.5 h-3.5" />
                    <span>{t.storage.exhaustFan}: {ch.fanActive ? 'ON' : 'OFF'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={busyId === ch.id}
                    onClick={() => controlChamber(ch.id, { toggleDehumidifier: true })}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      ch.dehumidifierActive
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-[#111815] border-[#D4DBD1]'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>{t.storage.dehumidifier}: {ch.dehumidifierActive ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busyId === ch.id}
                    onClick={() => controlChamber(ch.id, { simulateSpike: true })}
                    className="py-1.5 px-2.5 rounded-lg text-xs font-medium border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 whitespace-nowrap cursor-pointer"
                  >
                    {t.storage.simulateSpike}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === ch.id}
                    onClick={() => controlChamber(ch.id, { stabilize: true })}
                    className="py-1.5 px-2.5 rounded-lg text-xs font-medium border border-[#D4DBD1] text-[#111815] bg-[#F6F8F5] hover:bg-[#EAEFEA] whitespace-nowrap cursor-pointer"
                  >
                    {t.storage.stabilizeChamber}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* 04. Onion Quality, Grading & Inventory Publishing */
export const QualitySection: React.FC<{
  batches: OnionBatch[];
  language: Language;
  token: string;
  onRefresh: () => Promise<void>;
}> = ({ batches, language, token, onRefresh }) => {
  const t = TRANSLATIONS[language];
  const [variety, setVariety] = useState('Bhima Super Red');
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Export'>('Grade A');
  const [quantityKg, setQuantityKg] = useState('1500');
  const [pricePerKg, setPricePerKg] = useState('33');
  const [originDistrict, setOriginDistrict] = useState('Nashik · Pimpalgaon');
  const [curingPct, setCuringPct] = useState('95');
  const [dryMatterPct, setDryMatterPct] = useState('14.6');
  const [bulbDiameterMm, setBulbDiameterMm] = useState('56');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variety,
          grade,
          quantityKg: Number(quantityKg),
          pricePerKg: Number(pricePerKg),
          originDistrict,
          curingPct: Number(curingPct),
          dryMatterPct: Number(dryMatterPct),
          bulbDiameterMm: Number(bulbDiameterMm),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`Published ${data.batch.batchCode} to Buyer Marketplace & Blockchain.`);
        await onRefresh();
      } else {
        setMsg(data.error || 'Failed to publish lot.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111815]">{t.quality.title}</h2>
        <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.quality.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Publish Lot Form */}
        <form
          onSubmit={handlePublish}
          className="lg:col-span-4 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4"
        >
          <h3 className="font-display text-lg font-bold text-[#111815]">{t.quality.publishLot}</h3>

          <div>
            <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.quality.variety}</label>
            <input
              type="text"
              required
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.quality.grade}</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as 'Grade A' | 'Grade B' | 'Export')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white"
              >
                <option value="Grade A">Grade A</option>
                <option value="Export">Export</option>
                <option value="Grade B">Grade B</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.quality.district}</label>
              <input
                type="text"
                value={originDistrict}
                onChange={(e) => setOriginDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.quality.quantityKg}</label>
              <input
                type="number"
                min={10}
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.quality.pricePerKg}</label>
              <input
                type="number"
                min={5}
                required
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white font-mono-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.quality.curingPct}</label>
              <input
                type="number"
                value={curingPct}
                onChange={(e) => setCuringPct(e.target.value)}
                className="w-full px-2.5 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.quality.dryMatterPct}</label>
              <input
                type="number"
                step="0.1"
                value={dryMatterPct}
                onChange={(e) => setDryMatterPct(e.target.value)}
                className="w-full px-2.5 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.quality.bulbDiameter}</label>
              <input
                type="number"
                value={bulbDiameterMm}
                onChange={(e) => setBulbDiameterMm(e.target.value)}
                className="w-full px-2.5 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white font-mono-nums"
              />
            </div>
          </div>

          {msg && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.quality.submitLot}</span>
          </button>
        </form>

        {/* Live Quality & Inventory Table */}
        <div className="lg:col-span-8 bg-white border border-[#DFE4DC] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EAEFEA] bg-[#FAFBF9] text-xs font-semibold text-[#526056]">
                  <th className="py-3 px-4">Batch &amp; Variety</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 text-right">Stock</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Curing / DM</th>
                  <th className="py-3 px-4">Ochratoxin QA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEFEA] text-sm">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAFBF9]">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs font-semibold text-emerald-800">{b.batchCode}</div>
                      <div className="font-semibold text-[#111815]">{b.variety}</div>
                      <div className="text-xs text-[#526056]">{b.originDistrict}, {b.originState}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[#111815]">
                      {b.grade} · {b.bulbDiameterMm}mm
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-nums font-semibold text-[#111815]">
                      {b.quantityKg.toLocaleString()} kg
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-nums font-semibold text-[#111815]">
                      ₹{b.pricePerKg}/kg
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-nums text-xs text-[#424E46]">
                      {b.curingPct}% · {b.dryMatterPct}% DM
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Free</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 05. All-Stage Crop Growth Labs */
export const LabsSection: React.FC<{
  reports: AgriLabReport[];
  language: Language;
  token: string;
  onRefresh: () => Promise<void>;
}> = ({ reports, language, token, onRefresh }) => {
  const t = TRANSLATIONS[language];
  const [labName, setLabName] = useState('DOGR Rajgurunagar Crop Growth Lab');
  const [growthStage, setGrowthStage] = useState<AgriLabReport['growthStage']>('Bulb Initiation');
  const [nVal, setNVal] = useState('110');
  const [pVal, setPVal] = useState('48');
  const [kVal, setKVal] = useState('78');
  const [phVal, setPhVal] = useState('6.8');
  const [submitting, setSubmitting] = useState(false);

  const growthStages = [
    {
      stage: '01. Nursery & Seedling (Days 1–40)',
      focus: 'Root vigor & damping-off suppression',
      target: 'pH 6.5–7.2 · Trichoderma viride drench · Raised bed moisture 62%',
    },
    {
      stage: '02. Vegetative Foliage (Days 41–65)',
      focus: 'Leaf count (9–11 leaves) & Thrips protection',
      target: 'Nitrogen split top-dress · Blue sticky traps · Purple Blotch scouting',
    },
    {
      stage: '03. Bulb Initiation & Enlargement (Days 66–105)',
      focus: 'Potassium & Sulfur translocation for TSS & dry matter',
      target: 'K2O + Sulfur fertigation · Drip moisture 52–55% · Boron foliar pass',
    },
    {
      stage: '04. Neck Fall, Curing & Storage Lab (Days 106+)',
      focus: 'Neck seal tightness & ELISA Ochratoxin A assay',
      target: 'Stop irrigation 15d pre-harvest · Solar cure 12d · ELISA < 2 ppb',
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/labs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          labName,
          growthStage,
          nitrogenKgHa: Number(nVal),
          phosphorusKgHa: Number(pVal),
          potassiumKgHa: Number(kVal),
          soilPh: Number(phVal),
        }),
      });
      await onRefresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111815]">{t.labs.title}</h2>
        <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.labs.subtitle}</p>
      </div>

      {/* All Crop Growth Labs Overview + Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 bg-white border border-[#DFE4DC] rounded-xl overflow-hidden flex flex-col">
          <img
            src="/src/assets/images/agri_lab_sample_1795352576270.jpg"
            alt="Onion pathology and soil nutrient testing laboratory"
            referrerPolicy="no-referrer"
            className="w-full h-56 object-cover"
          />
          <div className="p-6 flex-1 space-y-3">
            <h3 className="font-display text-lg font-bold text-[#111815]">{t.labs.stageGuide}</h3>
            <div className="space-y-3">
              {growthStages.map((item) => (
                <div key={item.stage} className="pb-2.5 border-b border-[#F0F3EE] last:border-0">
                  <div className="text-xs font-bold text-emerald-800">{item.stage}</div>
                  <div className="text-xs font-medium text-[#111815] mt-0.5">{item.focus}</div>
                  <div className="text-xs text-[#526056] mt-0.5">{item.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {/* Submit Sample Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              <h3 className="font-display text-lg font-bold text-[#111815]">{t.labs.logSample}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.labs.labName}</label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.labs.growthStage}</label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value as AgriLabReport['growthStage'])}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white"
                >
                  <option value="Nursery">Nursery</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Bulb Initiation">Bulb Initiation</option>
                  <option value="Maturity & Curing">Maturity &amp; Curing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#3B473F] mb-1">N (kg/ha)</label>
                <input
                  type="number"
                  value={nVal}
                  onChange={(e) => setNVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3B473F] mb-1">P (kg/ha)</label>
                <input
                  type="number"
                  value={pVal}
                  onChange={(e) => setPVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3B473F] mb-1">K (kg/ha)</label>
                <input
                  type="number"
                  value={kVal}
                  onChange={(e) => setKVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3B473F] mb-1">Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={phVal}
                  onChange={(e) => setPhVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              {t.labs.submitSample}
            </button>
          </form>

          {/* Lab Reports List */}
          <div className="bg-white border border-[#DFE4DC] rounded-xl divide-y divide-[#EAEFEA]">
            {reports.map((rep) => (
              <div key={rep.id} className="p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-[#526056]">
                    <span className="font-mono font-bold text-[#111815]">{rep.sampleCode}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="font-semibold text-emerald-800">{rep.growthStage}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{rep.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 font-mono-nums">
                    Ochratoxin A: {rep.ochratoxinPpb} ppb
                  </div>
                </div>
                <div className="text-sm font-bold text-[#111815]">{rep.labName}</div>
                <div className="text-xs text-[#424E46] font-mono-nums">
                  NPK: {rep.nitrogenKgHa}-{rep.phosphorusKgHa}-{rep.potassiumKgHa} kg/ha · pH {rep.soilPh}
                </div>
                <div className="text-xs text-[#2F3A32]">{rep.pathogenCheck}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 06. Smart Weather & Automated Soil-Feedback Irrigation */
export const IrrigationSection: React.FC<{
  zones: IrrigationZone[];
  weather: WeatherSnapshot;
  language: Language;
  token: string;
  onRefresh: () => Promise<void>;
}> = ({ zones, weather, language, token, onRefresh }) => {
  const t = TRANSLATIONS[language];
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateZone(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      await fetch(`/api/irrigation/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      await onRefresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111815]">{t.irrigation.title}</h2>
        <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.irrigation.subtitle}</p>
      </div>

      {/* Weather & Rain-Scheduling Banner */}
      <div className="bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAEFEA]">
          <div>
            <div className="text-xs text-[#526056]">{t.irrigation.weatherTitle}</div>
            <h3 className="font-display text-xl font-bold text-[#111815] mt-0.5">{weather.location}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono-nums text-sm">
            <div>
              <span className="text-xs text-[#526056] block">Temp</span>
              <span className="font-bold text-[#111815]">{weather.tempC}°C</span>
            </div>
            <div>
              <span className="text-xs text-[#526056] block">Humidity</span>
              <span className="font-bold text-[#111815]">{weather.humidityPct}%</span>
            </div>
            <div>
              <span className="text-xs text-[#526056] block">Wind</span>
              <span className="font-bold text-[#111815]">{weather.windKmh} km/h</span>
            </div>
            <div>
              <span className="text-xs text-[#526056] block">Rain Prob</span>
              <span className="font-bold text-amber-700">{weather.rainProbPct}%</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-[#3F2E0C] flex items-start gap-2.5">
          <CloudRain className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <span>{weather.advisory}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weather.forecast.map((f) => (
            <div key={f.day} className="p-3 rounded-lg bg-[#F6F8F5] border border-[#E2E7DF]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#111815]">
                <span>{f.day}</span>
                {f.rainPct > 30 ? (
                  <CloudRain className="w-4 h-4 text-amber-700" />
                ) : (
                  <Sun className="w-4 h-4 text-emerald-700" />
                )}
              </div>
              <div className="font-mono-nums text-sm font-bold text-[#111815] mt-1">
                {f.highC}° / {f.lowC}°
              </div>
              <div className="text-xs text-[#526056] mt-0.5">
                {f.condition} · {f.rainPct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Irrigation Zone Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {zones.map((z) => (
          <div key={z.id} className="bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4">
            <div className="pb-3 border-b border-[#EAEFEA]">
              <div className="text-xs text-[#526056]">{z.cropStage}</div>
              <h3 className="font-display text-lg font-bold text-[#111815] mt-0.5">{z.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono-nums">
              <div className="p-3 rounded-lg bg-[#F6F8F5] border border-[#E2E7DF]">
                <div className="text-xs text-[#526056]">{t.irrigation.soilMoisture}</div>
                <div className="text-lg font-bold text-[#111815]">{z.soilMoisturePct}%</div>
              </div>
              <div className="p-3 rounded-lg bg-[#F6F8F5] border border-[#E2E7DF]">
                <div className="text-xs text-[#526056]">{t.irrigation.flowRate}</div>
                <div className="text-lg font-bold text-[#111815]">{z.flowLpm} L/m</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[#526056] mb-1">
                <span>{t.irrigation.targetMoisture}</span>
                <span className="font-mono-nums font-bold text-[#111815]">{z.targetMoisturePct}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={75}
                value={z.targetMoisturePct}
                onChange={(e) => updateZone(z.id, { targetMoisturePct: Number(e.target.value) })}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="text-xs text-[#424E46]">
              EC: <span className="font-mono-nums font-semibold">{z.ecDsM} dS/m</span> · {z.nextSchedule}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EAEFEA]">
              <button
                type="button"
                disabled={busyId === z.id || z.weatherPauseActive}
                onClick={() => updateZone(z.id, { toggleValve: true })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border whitespace-nowrap cursor-pointer disabled:opacity-50 ${
                  z.valveOpen
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-[#111815] border-[#D4DBD1]'
                }`}
              >
                {t.irrigation.valveControl}: {z.valveOpen ? 'OPEN' : 'CLOSED'}
              </button>
              <button
                type="button"
                disabled={busyId === z.id}
                onClick={() => updateZone(z.id, { toggleWeatherPause: true })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border whitespace-nowrap cursor-pointer ${
                  z.weatherPauseActive
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-[#F6F8F5] text-[#111815] border-[#D4DBD1]'
                }`}
              >
                {t.irrigation.rainPause}: {z.weatherPauseActive ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 07. Yield Prediction Analytics & Profit Calculator */
export const YieldProfitSection: React.FC<{ language: Language }> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [acres, setAcres] = useState(4);
  const [yieldQPerAcre, setYieldQPerAcre] = useState(115);
  const [seedCost, setSeedCost] = useState(18000);
  const [fertCost, setFertCost] = useState(26000);
  const [powerCost, setPowerCost] = useState(11000);
  const [laborStorageCost, setLaborStorageCost] = useState(42000);
  const [salePricePerQ, setSalePricePerQ] = useState(2850);

  const totalQuintals = acres * yieldQPerAcre;
  const totalKg = totalQuintals * 100;
  const grossRevenue = totalQuintals * salePricePerQ;
  const totalCost = seedCost + fertCost + powerCost + laborStorageCost;
  const netProfit = grossRevenue - totalCost;
  const breakEvenPerKg = totalKg > 0 ? totalCost / totalKg : 0;
  const roiPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  const monthlyCurve = [
    { label: 'W2 (Nursery)', projected: 18, baseline: 15 },
    { label: 'W6 (Vegetative)', projected: 44, baseline: 36 },
    { label: 'W10 (Bulbing)', projected: 78, baseline: 63 },
    { label: 'W14 (Maturity)', projected: 106, baseline: 86 },
    { label: 'W16 (Cured)', projected: yieldQPerAcre, baseline: 92 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111815]">{t.yieldProfit.title}</h2>
        <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.yieldProfit.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Yield Prediction Chart */}
        <div className="lg:col-span-5 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-[#111815] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>{t.yieldProfit.yieldChartTitle}</span>
            </h3>
            <span className="text-xs font-mono-nums font-semibold text-emerald-700">
              +{Math.max(0, Math.round(((yieldQPerAcre - 92) / 92) * 100))}% vs Mandi Avg
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {monthlyCurve.map((pt) => (
              <div key={pt.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#2F3A32]">{pt.label}</span>
                  <span className="font-mono-nums font-semibold text-[#111815]">
                    {pt.projected} Q/ac <span className="text-[#6E7C72]">(Avg {pt.baseline})</span>
                  </span>
                </div>
                <div className="h-2.5 bg-[#EEF1EC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-700 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (pt.projected / 160) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-[#F6F8F5] border border-[#E2E7DF] text-xs text-[#424E46] leading-relaxed">
            Smart drip scheduling and Ochratoxin-free chawl curing reduce post-harvest weight loss from 14% to 3.8%, preserving ~{Math.round(totalKg * 0.1).toLocaleString()} extra marketable kg.
          </div>
        </div>

        {/* Interactive Onion Profit Calculator */}
        <div className="lg:col-span-7 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            <h3 className="font-display text-lg font-bold text-[#111815]">{t.yieldProfit.calcTitle}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.yieldProfit.acreage}</label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={acres}
                onChange={(e) => setAcres(Math.max(0.5, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.yieldProfit.expectedYieldQ}</label>
              <input
                type="number"
                min={20}
                value={yieldQPerAcre}
                onChange={(e) => setYieldQPerAcre(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.yieldProfit.expectedPriceQ}</label>
              <input
                type="number"
                min={200}
                step={50}
                value={salePricePerQ}
                onChange={(e) => setSalePricePerQ(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.yieldProfit.seedCost}</label>
              <input
                type="number"
                value={seedCost}
                onChange={(e) => setSeedCost(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.yieldProfit.fertilizerCost}</label>
              <input
                type="number"
                value={fertCost}
                onChange={(e) => setFertCost(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.yieldProfit.irrigationPower}</label>
              <input
                type="number"
                value={powerCost}
                onChange={(e) => setPowerCost(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.yieldProfit.laborStorage}</label>
              <input
                type="number"
                value={laborStorageCost}
                onChange={(e) => setLaborStorageCost(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-[#EAEFEA]">
            <div>
              <div className="text-xs text-[#526056]">{t.yieldProfit.grossRevenue}</div>
              <div className="text-lg font-bold font-mono-nums text-[#111815] mt-0.5">
                ₹{grossRevenue.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#526056]">{t.yieldProfit.totalCost}</div>
              <div className="text-lg font-bold font-mono-nums text-[#111815] mt-0.5">
                ₹{totalCost.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#526056]">{t.yieldProfit.netProfit}</div>
              <div
                className={`text-lg font-bold font-mono-nums mt-0.5 ${
                  netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                ₹{netProfit.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#526056]">{t.yieldProfit.breakEvenKg}</div>
              <div className="text-lg font-bold font-mono-nums text-[#111815] mt-0.5">
                ₹{breakEvenPerKg.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#526056]">{t.yieldProfit.roiPct}</div>
              <div className="text-lg font-bold font-mono-nums text-emerald-700 mt-0.5">
                {roiPct.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 10. Community Forum, P2P Resource Exchange & Personalized Expert Consultation */
export const CommunitySection: React.FC<{
  forumPosts: ForumPost[];
  exchangeListings: ExchangeListing[];
  messages: DirectMessage[];
  user: UserProfile;
  language: Language;
  token: string;
  onRefresh: () => Promise<void>;
}> = ({ forumPosts, exchangeListings, messages, user, language, token, onRefresh }) => {
  const t = TRANSLATIONS[language];
  const [tab, setTab] = useState<'forum' | 'exchange' | 'expert' | 'inbox'>('forum');
  const [buyerReply, setBuyerReply] = useState('');
  const [replyRecipient, setReplyRecipient] = useState('FreshCart Wholesale');

  // Forum state
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  // Exchange state
  const [exTitle, setExTitle] = useState('');
  const [exCategory, setExCategory] = useState<ExchangeListing['category']>('Equipment');
  const [exRate, setExRate] = useState('450');
  const [exUnit, setExUnit] = useState('day');

  // Expert Consult state
  const [expertQ, setExpertQ] = useState('');
  const [expertAnswer, setExpertAnswer] = useState<string | null>(null);
  const [expertLoading, setExpertLoading] = useState(false);
  const [expertError, setExpertError] = useState<string | null>(null);

  async function submitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!postTitle.trim() || !postBody.trim()) return;
    await fetch('/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: postTitle, body: postBody, category: 'Agronomy & Storage' }),
    });
    setPostTitle('');
    setPostBody('');
    await onRefresh();
  }

  async function upvotePost(id: string) {
    await fetch(`/api/forum/${id}/upvote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    await onRefresh();
  }

  async function sendReply(postId: string) {
    const body = replyMap[postId];
    if (!body?.trim()) return;
    await fetch(`/api/forum/${postId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ body }),
    });
    setReplyMap((prev) => ({ ...prev, [postId]: '' }));
    await onRefresh();
  }

  async function submitExchange(e: React.FormEvent) {
    e.preventDefault();
    if (!exTitle.trim()) return;
    await fetch('/api/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: exTitle,
        category: exCategory,
        rateInr: Number(exRate),
        unit: exUnit,
      }),
    });
    setExTitle('');
    await onRefresh();
  }

  async function toggleBooking(id: string) {
    await fetch(`/api/exchange/${id}/book`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    await onRefresh();
  }

  async function askExpert(e: React.FormEvent) {
    e.preventDefault();
    if (!expertQ.trim()) return;
    setExpertLoading(true);
    setExpertError(null);
    try {
      const res = await fetch('/api/expert/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: expertQ, language, stateContext: user.state }),
      });
      const data = await res.json();
      if (!res.ok) {
        setExpertError(data.error || 'Consultation failed.');
      } else {
        setExpertAnswer(data.answer);
      }
    } catch {
      setExpertError('Network error while contacting agronomy specialist.');
    } finally {
      setExpertLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111815]">{t.community.title}</h2>
        <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.community.subtitle}</p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EAEFEA] rounded-lg border border-[#DFE4DC] w-fit">
        {(
          [
            { id: 'forum', label: t.community.forumTab },
            { id: 'exchange', label: t.community.exchangeTab },
            { id: 'expert', label: t.community.expertTab },
            { id: 'inbox', label: t.buyerNav.messages },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === item.id
                ? 'bg-white text-[#111815] shadow-xs border border-[#DFE4DC]'
                : 'text-[#526056] hover:text-[#111815]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'forum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={submitPost}
            className="lg:col-span-4 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4"
          >
            <h3 className="font-display text-lg font-bold text-[#111815] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>{t.community.askForum}</span>
            </h3>
            <input
              type="text"
              required
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder={t.community.postTitle}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1]"
            />
            <textarea
              required
              rows={4}
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              placeholder={t.community.postBody}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1]"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              {t.community.publishPost}
            </button>
          </form>

          <div className="lg:col-span-8 space-y-4">
            {forumPosts.map((post) => (
              <div key={post.id} className="bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs text-[#526056]">
                  <div>
                    <span className="font-semibold text-[#111815]">{post.author}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{post.state}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{post.category}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{post.createdAt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => upvotePost(post.id)}
                    className="px-2.5 py-1 rounded-md border border-[#D4DBD1] hover:border-emerald-700 text-xs font-semibold text-[#111815] flex items-center gap-1 font-mono-nums cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{post.upvotes}</span>
                  </button>
                </div>

                <h4 className="font-display text-lg font-bold text-[#111815]">{post.title}</h4>
                <p className="text-sm text-[#2F3A32] leading-relaxed">{post.body}</p>

                {post.replies.length > 0 && (
                  <div className="pt-3 border-t border-[#EAEFEA] space-y-2.5">
                    {post.replies.map((rep) => (
                      <div key={rep.id} className="p-3 rounded-lg bg-[#F6F8F5] text-xs">
                        <span className="font-semibold text-[#111815]">{rep.author}</span>
                        <span className="text-[#526056]"> · {rep.createdAt}</span>
                        <p className="text-[#2F3A32] mt-1">{rep.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={replyMap[post.id] || ''}
                    onChange={(e) => setReplyMap((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder={t.community.replyPlaceholder}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#D4DBD1]"
                  />
                  <button
                    type="button"
                    onClick={() => sendReply(post.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#111815] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'exchange' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={submitExchange}
            className="lg:col-span-4 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4"
          >
            <h3 className="font-display text-lg font-bold text-[#111815] flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-700" />
              <span>{t.community.listResource}</span>
            </h3>
            <input
              type="text"
              required
              value={exTitle}
              onChange={(e) => setExTitle(e.target.value)}
              placeholder="e.g. Tractor Bed Planter / Solar Dryer"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1]"
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={exCategory}
                onChange={(e) => setExCategory(e.target.value as ExchangeListing['category'])}
                className="px-2.5 py-2 text-xs rounded-lg border border-[#D4DBD1] bg-white"
              >
                <option value="Equipment">Equipment</option>
                <option value="Storage">Storage</option>
                <option value="Seeds">Seeds</option>
                <option value="Bio-Inputs">Bio-Inputs</option>
              </select>
              <input
                type="number"
                value={exRate}
                onChange={(e) => setExRate(e.target.value)}
                className="px-2.5 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
              />
              <input
                type="text"
                value={exUnit}
                onChange={(e) => setExUnit(e.target.value)}
                placeholder="day/kit"
                className="px-2.5 py-2 text-sm rounded-lg border border-[#D4DBD1]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              {t.community.listResource}
            </button>
          </form>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exchangeListings.map((item) => (
              <div key={item.id} className="bg-white border border-[#DFE4DC] rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs text-[#526056]">
                    <span>{item.category}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{item.state}</span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[#111815] mt-1">{item.title}</h4>
                  <div className="text-xs text-[#526056] mt-1">Owner: {item.ownerName}</div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EAEFEA]">
                  <div className="font-mono-nums font-bold text-sm text-[#111815]">
                    ₹{item.rateInr} <span className="text-xs font-normal text-[#526056]">/ {item.unit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleBooking(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      item.available
                        ? 'bg-[#15803D] hover:bg-[#166534] text-white'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {item.available ? t.community.bookResource : `${t.community.releaseResource} (${item.bookedBy || 'Booked'})`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'expert' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/farmer_avatar_rajesh_1795352575927.jpg"
                alt="Regional onion agronomy specialist"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-[#DFE4DC]"
              />
              <div>
                <div className="font-display font-bold text-sm text-[#111815]">NHRDF &amp; DOGR Agronomy Desk</div>
                <div className="text-xs text-[#526056]">Multilingual Advisory (EN / HI / OR)</div>
              </div>
            </div>
            <p className="text-xs text-[#424E46] leading-relaxed">
              Ask tailored questions about your state ({user.state}), drip fertigation schedules, thrips/fungal thresholds, or halting Ochratoxin A during monsoon storage.
            </p>
            <div className="space-y-1.5 pt-2 border-t border-[#EAEFEA]">
              {[
                'How do I stop Aspergillus niger in 78% RH chawl storage?',
                'Best NPK fertigation ratio during Bulb Initiation stage?',
                'Organic thrips control threshold in Kharif onions?',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setExpertQ(q)}
                  className="w-full text-left text-xs text-emerald-800 hover:underline py-1 cursor-pointer"
                >
                  → {q}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4">
            <form onSubmit={askExpert} className="space-y-3">
              <label className="block text-xs font-semibold text-[#3B473F]">{t.community.expertTab}</label>
              <textarea
                rows={3}
                required
                value={expertQ}
                onChange={(e) => setExpertQ(e.target.value)}
                placeholder={t.community.expertPrompt}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#D4DBD1]"
              />
              <button
                type="submit"
                disabled={expertLoading}
                className="px-5 py-2.5 rounded-lg bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{expertLoading ? 'Consulting Specialist...' : t.community.askExpertBtn}</span>
              </button>
            </form>

            {expertError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                {expertError}
              </div>
            )}

            {expertAnswer && (
              <div className="p-5 rounded-lg bg-[#F6F8F5] border border-[#DFE4DC] space-y-2">
                <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4" />
                  <span>Agronomist Recommendation ({t.languages[language]})</span>
                </div>
                <div className="text-sm text-[#111815] whitespace-pre-line leading-relaxed">
                  {expertAnswer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!buyerReply.trim()) return;
              await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ recipientName: replyRecipient, text: buyerReply }),
              });
              setBuyerReply('');
              await onRefresh();
            }}
            className="lg:col-span-5 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4"
          >
            <h3 className="font-display text-lg font-bold text-[#111815]">Reply to Buyer Inquiry</h3>
            <input
              type="text"
              value={replyRecipient}
              onChange={(e) => setReplyRecipient(e.target.value)}
              placeholder="Buyer Name"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1]"
            />
            <textarea
              rows={3}
              required
              value={buyerReply}
              onChange={(e) => setBuyerReply(e.target.value)}
              placeholder="Confirm grading, Ochratoxin-free certificate, or transport slot..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1]"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              {t.buyer.sendMessage}
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-[#DFE4DC] rounded-xl divide-y divide-[#EAEFEA]">
            {messages.map((m) => (
              <div key={m.id} className="p-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#526056]">
                  <div>
                    <span className="font-semibold text-[#111815]">{m.senderName}</span>
                    <span aria-hidden="true"> → </span>
                    <span className="font-medium text-[#111815]">{m.recipientName}</span>
                    {m.batchCode && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span className="font-mono text-emerald-800">{m.batchCode}</span>
                      </>
                    )}
                  </div>
                  <span className="font-mono-nums">{new Date(m.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-[#1E2923] leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
