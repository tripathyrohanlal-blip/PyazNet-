import React, { useState } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Send,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { VisionScanner } from './VisionScanner';
import { BlockchainLedger } from './BlockchainLedger';
import { IndiaAgriMap } from './IndiaAgriMap';
import type {
  AppStatePayload,
  Language,
  OnionBatch,
  UserProfile,
} from '../types';

export type BuyerTab = 'marketplace' | 'scanner' | 'traceability' | 'messages' | 'ordersMap';

interface BuyerWorkspaceProps {
  activeTab: BuyerTab;
  state: AppStatePayload;
  user: UserProfile;
  language: Language;
  token: string;
  onRefresh: () => Promise<void>;
}

export const BuyerWorkspace: React.FC<BuyerWorkspaceProps> = ({
  activeTab,
  state,
  user,
  language,
  token,
  onRefresh,
}) => {
  const t = TRANSLATIONS[language];
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [orderingId, setOrderingId] = useState<string | null>(null);
  const [orderNotice, setOrderNotice] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [recipient, setRecipient] = useState('Rajesh Deshmukh');
  const [batchRef, setBatchRef] = useState(state.batches[0]?.batchCode || '');
  const [msgText, setMsgText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  async function placeOrder(batch: OnionBatch) {
    const qty = qtyMap[batch.id] || 50;
    setOrderingId(batch.id);
    setOrderNotice(null);
    setOrderError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ batchId: batch.id, quantityKg: qty }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error || 'Order failed.');
      } else {
        setOrderNotice(
          `Order ${data.order.orderCode} confirmed for ${qty} kg (${batch.batchCode}). Blockchain block #${data.block.index} recorded.`
        );
        await onRefresh();
      }
    } catch {
      setOrderError('Network error while placing order.');
    } finally {
      setOrderingId(null);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msgText.trim()) return;
    setSendingMsg(true);
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientName: recipient,
          batchCode: batchRef || undefined,
          text: msgText,
        }),
      });
      setMsgText('');
      await onRefresh();
    } finally {
      setSendingMsg(false);
    }
  }

  if (activeTab === 'scanner') {
    return <VisionScanner mode="buyer_adulteration" language={language} token={token} />;
  }

  if (activeTab === 'traceability') {
    return <BlockchainLedger blocks={state.blockchain} language={language} />;
  }

  if (activeTab === 'ordersMap') {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#111815]">{t.buyer.ordersTitle}</h2>
          <div className="bg-white border border-[#DFE4DC] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAEFEA] bg-[#FAFBF9] text-xs font-semibold text-[#526056]">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Batch &amp; Variety</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Blockchain Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEFEA] text-sm">
                  {state.orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAFBF9]">
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#111815]">
                        {ord.orderCode}
                        <div className="text-[11px] text-[#526056] font-sans">{ord.createdAt}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs text-emerald-800">{ord.batchCode}</div>
                        <div className="font-medium text-[#111815]">{ord.variety}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-nums font-semibold">
                        {ord.quantityKg} kg
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-nums font-semibold">
                        ₹{ord.totalAmountInr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">
                        <span className="flex items-center gap-1">
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>{ord.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-nums text-xs text-[#526056]">
                        {ord.blockchainHash.slice(0, 16)}…
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <IndiaAgriMap language={language} defaultStateName={user.state} />
      </div>
    );
  }

  if (activeTab === 'messages') {
    const farmerNames = Array.from(new Set(state.batches.map((b) => b.farmerName)));

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#111815]">{t.buyer.chatTitle}</h2>
          <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.buyer.chatSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={sendMessage}
            className="lg:col-span-5 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-4"
          >
            <h3 className="font-display text-lg font-bold text-[#111815] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Message Verified Grower</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">Farmer / FPO</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white"
              >
                {farmerNames.map((fn) => (
                  <option key={fn} value={fn}>
                    {fn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">Batch Reference</label>
              <select
                value={batchRef}
                onChange={(e) => setBatchRef(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white font-mono"
              >
                {state.batches.map((b) => (
                  <option key={b.id} value={b.batchCode}>
                    {b.batchCode} ({b.variety})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3B473F] mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Ask about mesh bag packaging, moisture lab certificate, or delivery schedule..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1]"
              />
            </div>

            <button
              type="submit"
              disabled={sendingMsg}
              className="w-full py-2.5 px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.buyer.sendMessage}</span>
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-[#DFE4DC] rounded-xl divide-y divide-[#EAEFEA]">
            {state.messages.map((m) => (
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
      </div>
    );
  }

  /* Default: Direct-to-Consumer Marketplace */
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111815]">{t.buyer.marketTitle}</h2>
        <p className="text-sm text-[#526056] mt-1 max-w-3xl">{t.buyer.marketSubtitle}</p>
      </div>

      {orderNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{orderNotice}</span>
        </div>
      )}

      {orderError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {state.batches.map((batch) => {
          const orderQty = qtyMap[batch.id] ?? 50;
          return (
            <article
              key={batch.id}
              className="bg-white border border-[#DFE4DC] rounded-xl overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="sm:w-52 h-52 sm:h-auto bg-[#EEF1EC] shrink-0 overflow-hidden">
                <img
                  src={batch.imageUrl}
                  alt={batch.variety}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#526056]">
                    <span className="font-mono font-semibold text-emerald-800">{batch.batchCode}</span>
                    <span>{batch.grade} · {batch.bulbDiameterMm}mm</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#111815] mt-1">{batch.variety}</h3>

                  <div className="text-xs text-[#526056] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{batch.farmerName} · {batch.originDistrict}, {batch.originState}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mt-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{t.buyer.ochratoxinVerified} · {batch.shelfLifeDays}d shelf-life</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAEFEA] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-bold font-mono-nums text-[#111815]">
                        ₹{batch.pricePerKg}
                      </span>
                      <span className="text-xs text-[#526056]"> / kg</span>
                    </div>
                    <div className="text-xs text-[#526056] font-mono-nums">
                      {t.buyer.availableKg}: <strong className="text-[#111815]">{batch.quantityKg.toLocaleString()} kg</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={batch.quantityKg}
                      value={orderQty}
                      onChange={(e) =>
                        setQtyMap((prev) => ({
                          ...prev,
                          [batch.id]: Math.max(1, Number(e.target.value)),
                        }))
                      }
                      aria-label={t.buyer.orderQty}
                      className="w-24 px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] font-mono-nums"
                    />
                    <button
                      type="button"
                      disabled={orderingId === batch.id || batch.quantityKg <= 0}
                      onClick={() => placeOrder(batch)}
                      className="flex-1 py-2 px-4 rounded-lg bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {batch.quantityKg <= 0
                          ? 'Sold Out'
                          : `${t.buyer.buyNow} (₹${(orderQty * batch.pricePerKg).toLocaleString('en-IN')})`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
