import React, { useState } from 'react';
import { Sprout, ShoppingBag, ShieldCheck, ArrowRight, Globe, AlertCircle } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, UserProfile, UserRole } from '../types';

interface AuthGateProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onAuthenticated: (user: UserProfile, token: string) => void;
}

const INDIAN_STATES = [
  'Maharashtra',
  'Odisha',
  'Madhya Pradesh',
  'Gujarat',
  'Karnataka',
  'Rajasthan',
  'Bihar',
  'Uttar Pradesh',
  'West Bengal',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Punjab',
  'Haryana & Delhi NCR',
];

export const AuthGate: React.FC<AuthGateProps> = ({ language, onLanguageChange, onAuthenticated }) => {
  const t = TRANSLATIONS[language];
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        mode === 'login'
          ? { email, password }
          : { name, email, password, role, state, organization };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
        return;
      }
      onAuthenticated(data.user, data.token);
    } catch {
      setError('Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo(demoRole: UserRole) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: demoRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unable to start preview session.');
        return;
      }
      onAuthenticated(data.user, data.token);
    } catch {
      setError('Connection failed. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7F4] text-[#111815] flex flex-col">
      {/* Top Bar Contract: Brand | Quiet Context | Language Switcher */}
      <header className="w-full border-b border-[#DFE4DC] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <div className="font-display text-xl font-bold tracking-tight text-[#111815] whitespace-nowrap shrink-0">
            {t.brand}
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-[#526056] whitespace-nowrap shrink-0">
            <span>Allium Cepa Supply Chain</span>
            <span aria-hidden="true">·</span>
            <span>Ochratoxin A Vision</span>
            <span aria-hidden="true">·</span>
            <span>Blockchain Verified</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F0F3EE] rounded-lg border border-[#DFE4DC] shrink-0">
            <Globe className="w-3.5 h-3.5 text-[#526056] ml-2 mr-1 hidden sm:block" />
            {(['en', 'hi', 'or'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === lang
                    ? 'bg-white text-[#111815] shadow-xs border border-[#DFE4DC]'
                    : 'text-[#526056] hover:text-[#111815]'
                }`}
              >
                {t.languages[lang]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Split Auth + Editorial Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Editorial Visual & Value Panel */}
        <section className="lg:col-span-7 flex flex-col justify-between bg-white border border-[#DFE4DC] rounded-xl overflow-hidden">
          <div className="relative h-64 sm:h-80 lg:h-96 bg-[#1B2A21] overflow-hidden">
            {!heroImgFailed ? (
              <img
                src="/src/assets/images/onion_harvest_hero_1795352576415.jpg"
                alt="Freshly cured red onions in ventilated wooden storage crates"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B2A21] to-[#2B4234] text-white/80">
                <Sprout className="w-16 h-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <p className="text-xs font-medium text-emerald-300 tracking-wide mb-2">
                {t.tagline}
              </p>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight max-w-2xl text-balance">
                {t.auth.welcomeTitle}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-sm sm:text-base text-[#424E46] leading-relaxed max-w-2xl">
              {t.auth.welcomeSubtitle}
            </p>

            {/* Clean unboxed 3-column capability strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#EAEFEA]">
              <div>
                <div className="text-xs text-[#526056] mb-1">Mycotoxin Defense</div>
                <div className="text-sm font-semibold text-[#111815]">
                  Aspergillus niger &amp; Ochratoxin A ML Camera
                </div>
              </div>
              <div>
                <div className="text-xs text-[#526056] mb-1">Chawl Automation</div>
                <div className="text-sm font-semibold text-[#111815]">
                  Live RH / Moisture Alerts &amp; Drip Irrigation
                </div>
              </div>
              <div>
                <div className="text-xs text-[#526056] mb-1">Direct Trade</div>
                <div className="text-sm font-semibold text-[#111815]">
                  SHA-256 Farm-to-Table Ledger &amp; Buyer Scanner
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section: 2-Section Login & Register Card */}
        <section className="lg:col-span-5 bg-white border border-[#DFE4DC] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* 2 Sections: Login / Register Segmented Control */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#F0F3EE] rounded-lg border border-[#DFE4DC] mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-2.5 px-4 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#111815] shadow-xs border border-[#DFE4DC]'
                    : 'text-[#526056] hover:text-[#111815]'
                }`}
              >
                {t.auth.loginTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-2.5 px-4 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-[#111815] shadow-xs border border-[#DFE4DC]'
                    : 'text-[#526056] hover:text-[#111815]'
                }`}
              >
                {t.auth.registerTab}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#3B473F] mb-2">
                      {t.auth.rolePrompt}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('farmer')}
                        className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          role === 'farmer'
                            ? 'border-emerald-700 bg-emerald-50/70 text-[#111815]'
                            : 'border-[#DFE4DC] bg-white text-[#526056] hover:border-[#BFC9BC]'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-semibold text-sm text-[#111815]">
                          <Sprout className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{t.auth.farmerRole}</span>
                        </div>
                        <p className="text-xs text-[#526056] mt-1 leading-snug">{t.auth.farmerDesc}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('buyer')}
                        className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          role === 'buyer'
                            ? 'border-emerald-700 bg-emerald-50/70 text-[#111815]'
                            : 'border-[#DFE4DC] bg-white text-[#526056] hover:border-[#BFC9BC]'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-semibold text-sm text-[#111815]">
                          <ShoppingBag className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{t.auth.buyerRole}</span>
                        </div>
                        <p className="text-xs text-[#526056] mt-1 leading-snug">{t.auth.buyerDesc}</p>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#3B473F] mb-1">
                        {t.auth.fullName}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rajesh Deshmukh"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3B473F] mb-1">
                        {t.auth.state}
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white focus:outline-none focus:border-emerald-700"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#3B473F] mb-1">
                      {t.auth.organization}
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={role === 'farmer' ? 'Lasalgaon Onion FPO' : 'FreshCart Direct'}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-[#3B473F] mb-1">{t.auth.email}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@farm-or-market.in"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3B473F] mb-1">
                  {t.auth.password}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#D4DBD1] bg-white focus:outline-none focus:border-emerald-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#15803D] hover:bg-[#166534] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>{mode === 'login' ? t.auth.signInBtn : t.auth.createAccountBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Instant Preview Access for Farmer or Buyer */}
          <div className="mt-6 pt-6 border-t border-[#EAEFEA]">
            <div className="flex items-center justify-between text-xs text-[#526056] mb-3">
              <span className="font-medium">{t.auth.instantDemoTitle}</span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3 Languages Active</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemo('farmer')}
                className="py-2 px-3 rounded-lg border border-[#D4DBD1] hover:border-emerald-700 hover:bg-emerald-50/50 text-xs font-semibold text-[#111815] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{t.auth.demoFarmerBtn}</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemo('buyer')}
                className="py-2 px-3 rounded-lg border border-[#D4DBD1] hover:border-emerald-700 hover:bg-emerald-50/50 text-xs font-semibold text-[#111815] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{t.auth.demoBuyerBtn}</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
