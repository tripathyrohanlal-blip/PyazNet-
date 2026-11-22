import React, { useMemo, useState } from 'react';
import { ShieldCheck, Link2, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { BlockchainBlock, Language } from '../types';

interface BlockchainLedgerProps {
  blocks: BlockchainBlock[];
  language: Language;
  initialBatchFilter?: string;
}

const STAGE_LABELS: Record<BlockchainBlock['stage'], string> = {
  HARVEST_LOT: 'Harvest Lot Minted',
  CURING_SENSOR: 'Chawl Curing Telemetry',
  OCHRATOXIN_ML_PASS: 'Ochratoxin A ML Lab Pass',
  COLD_STORAGE: 'Climate Storage Log',
  BUYER_ORDER_DISPATCH: 'Buyer Direct Order Dispatch',
  DELIVERED: 'Consumer Delivery Verified',
};

export const BlockchainLedger: React.FC<BlockchainLedgerProps> = ({
  blocks,
  language,
  initialBatchFilter = 'ALL',
}) => {
  const t = TRANSLATIONS[language];
  const [selectedBatch, setSelectedBatch] = useState<string>(initialBatchFilter);

  const batchCodes = useMemo(
    () => Array.from(new Set(blocks.map((b) => b.batchCode))),
    [blocks]
  );

  const filtered = useMemo(() => {
    const list = selectedBatch === 'ALL' ? blocks : blocks.filter((b) => b.batchCode === selectedBatch);
    return [...list].reverse();
  }, [blocks, selectedBatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#111815]">{t.blockchain.title}</h2>
          <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.blockchain.subtitle}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg whitespace-nowrap">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.blockchain.verifiedChain}</span>
          </div>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            aria-label={t.blockchain.filterBatch}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#D4DBD1] bg-white text-[#111815] focus:outline-none focus:border-emerald-700"
          >
            <option value="ALL">{t.blockchain.allBatches}</option>
            {batchCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#DFE4DC] rounded-xl divide-y divide-[#EAEFEA]">
        {filtered.map((block) => (
          <div key={block.index} className="p-5 sm:p-6 hover:bg-[#FAFBF9] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#526056]">
                <span className="font-mono-nums font-bold text-[#111815]">
                  Block #{String(block.index).padStart(3, '0')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-semibold text-emerald-800">{block.batchCode}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#111815] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{STAGE_LABELS[block.stage]}</span>
                </span>
              </div>

              <div className="text-xs text-[#526056] font-mono-nums flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(block.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <p className="text-sm font-medium text-[#111815] mb-3">{block.details}</p>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[#526056] pt-3 border-t border-[#F0F3EE]">
              <div className="flex flex-wrap items-center gap-3">
                <span>Actor: <strong className="text-[#111815] font-medium">{block.actor}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{block.location}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 font-mono-nums text-[11px]">
                <span className="flex items-center gap-1 text-[#66746A]">
                  <Link2 className="w-3 h-3" />
                  <span>{t.blockchain.prevHash}: {block.prevHash.slice(0, 12)}…</span>
                </span>
                <span className="text-[#111815] font-semibold">
                  {t.blockchain.blockHash}: {block.hash.slice(0, 18)}…
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
