import { useCallback, useEffect, useState } from 'react';
import {
  Thermometer,
  ScanLine,
  Bug,
  Award,
  FlaskConical,
  CloudRain,
  TrendingUp,
  Map,
  Link2,
  Users,
  ShoppingBag,
  ShieldCheck,
  MessageSquare,
  PackageCheck,
  LogOut,
  RefreshCw,
  ArrowLeftRight,
} from 'lucide-react';
import { AuthGate } from './components/AuthGate';
import { VisionScanner } from './components/VisionScanner';
import { IndiaAgriMap } from './components/IndiaAgriMap';
import { BlockchainLedger } from './components/BlockchainLedger';
import {
  StorageSection,
  QualitySection,
  LabsSection,
  IrrigationSection,
  YieldProfitSection,
  CommunitySection,
} from './components/FarmerModules';
import { BuyerWorkspace, type BuyerTab } from './components/BuyerWorkspace';
import { TRANSLATIONS } from './i18n/translations';
import type { AppStatePayload, Language, UserProfile } from './types';

type FarmerTab =
  | 'storage'
  | 'ochratoxin'
  | 'pest'
  | 'quality'
  | 'labs'
  | 'irrigation'
  | 'yieldProfit'
  | 'indiaMap'
  | 'blockchain'
  | 'community';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppStatePayload | null>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [stateError, setStateError] = useState<string | null>(null);

  const [farmerTab, setFarmerTab] = useState<FarmerTab>('storage');
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('marketplace');

  const t = TRANSLATIONS[language];

  const fetchState = useCallback(async (authToken: string) => {
    setLoadingState(true);
    setStateError(null);
    try {
      const res = await fetch('/api/state', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        throw new Error('Failed to load workspace telemetry.');
      }
      const data = (await res.json()) as AppStatePayload;
      setAppState(data);
    } catch (err: unknown) {
      setStateError(err instanceof Error ? err.message : 'Unable to sync data.');
    } finally {
      setLoadingState(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchState(token);
    }
  }, [token, fetchState]);

  function handleAuthenticated(profile: UserProfile, authToken: string) {
    setUser(profile);
    setToken(authToken);
  }

  async function handleRoleSwitch() {
    if (!user) return;
    const nextRole = user.role === 'farmer' ? 'buyer' : 'farmer';
    const res = await fetch('/api/auth/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: nextRole }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
    }
  }

  function handleSignOut() {
    setUser(null);
    setToken(null);
    setAppState(null);
  }

  if (!user || !token) {
    return (
      <AuthGate
        language={language}
        onLanguageChange={setLanguage}
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  const farmerNavItems: Array<{ id: FarmerTab; label: string; icon: typeof Thermometer }> = [
    { id: 'storage', label: t.farmerNav.storage, icon: Thermometer },
    { id: 'ochratoxin', label: t.farmerNav.ochratoxin, icon: ScanLine },
    { id: 'pest', label: t.farmerNav.pest, icon: Bug },
    { id: 'quality', label: t.farmerNav.quality, icon: Award },
    { id: 'labs', label: t.farmerNav.labs, icon: FlaskConical },
    { id: 'irrigation', label: t.farmerNav.irrigation, icon: CloudRain },
    { id: 'yieldProfit', label: t.farmerNav.yieldProfit, icon: TrendingUp },
    { id: 'indiaMap', label: t.farmerNav.indiaMap, icon: Map },
    { id: 'blockchain', label: t.farmerNav.blockchain, icon: Link2 },
    { id: 'community', label: t.farmerNav.community, icon: Users },
  ];

  const buyerNavItems: Array<{ id: BuyerTab; label: string; icon: typeof ShoppingBag }> = [
    { id: 'marketplace', label: t.buyerNav.marketplace, icon: ShoppingBag },
    { id: 'scanner', label: t.buyerNav.scanner, icon: ScanLine },
    { id: 'traceability', label: t.buyerNav.traceability, icon: ShieldCheck },
    { id: 'messages', label: t.buyerNav.messages, icon: MessageSquare },
    { id: 'ordersMap', label: t.buyerNav.ordersMap, icon: PackageCheck },
  ];

  const refreshState = async () => {
    if (token) await fetchState(token);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F4] text-[#111815] flex flex-col">
      {/* Top Bar Contract: Brand / Breadcrumb | Controls | Primary Sign Out */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#DFE4DC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-lg font-bold tracking-tight text-[#111815] whitespace-nowrap shrink-0">
              {t.brand}
            </span>
            <span className="text-[#B8C2B5] hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-emerald-800 truncate hidden sm:inline">
              {user.role === 'farmer' ? t.topbar.farmerPortal : t.topbar.buyerPortal}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 3-Language Switcher */}
            <div className="flex items-center gap-0.5 p-0.5 bg-[#F0F3EE] rounded-lg border border-[#DFE4DC]">
              {(['en', 'hi', 'or'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    language === lang
                      ? 'bg-white text-[#111815] shadow-xs border border-[#DFE4DC]'
                      : 'text-[#526056] hover:text-[#111815]'
                  }`}
                >
                  {t.languages[lang]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRoleSwitch}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4DBD1] hover:border-emerald-700 text-xs font-semibold text-[#111815] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.topbar.switchPortal}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111815] hover:bg-[#24332B] text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.topbar.signOut}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Canvas: 264px Sidebar + Main Viewport */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 lg:shrink-0 bg-white lg:bg-transparent border-b lg:border-b-0 lg:border-r border-[#DFE4DC] p-4">
          <div className="mb-4 pb-3 border-b border-[#EAEFEA] hidden lg:block">
            <div className="text-sm font-bold text-[#111815] truncate">{user.name}</div>
            <div className="text-xs text-[#526056] truncate">
              {user.organization} · {user.state}
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
            {user.role === 'farmer'
              ? farmerNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = farmerTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFarmerTab(item.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer ${
                        active
                          ? 'bg-[#15803D] text-white'
                          : 'text-[#3B473F] hover:bg-[#EAEFEA] hover:text-[#111815]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })
              : buyerNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = buyerTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBuyerTab(item.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer ${
                        active
                          ? 'bg-[#15803D] text-white'
                          : 'text-[#3B473F] hover:bg-[#EAEFEA] hover:text-[#111815]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
          </nav>

          <div className="hidden lg:block mt-6 pt-4 border-t border-[#EAEFEA]">
            <button
              type="button"
              onClick={refreshState}
              disabled={loadingState}
              className="w-full py-2 px-3 rounded-lg border border-[#D4DBD1] bg-white hover:border-emerald-700 text-xs font-semibold text-[#111815] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${loadingState ? 'animate-spin' : ''}`} />
              <span>{t.topbar.liveSync}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {stateError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
              {stateError}
            </div>
          )}

          {!appState ? (
            <div className="space-y-4">
              <div className="h-8 bg-[#E4E9E2] rounded w-1/3 animate-pulse" />
              <div className="h-64 bg-white border border-[#DFE4DC] rounded-xl animate-pulse" />
            </div>
          ) : user.role === 'farmer' ? (
            <>
              {farmerTab === 'storage' && (
                <StorageSection
                  chambers={appState.chambers}
                  language={language}
                  token={token}
                  onRefresh={refreshState}
                />
              )}
              {farmerTab === 'ochratoxin' && (
                <VisionScanner mode="ochratoxin" language={language} token={token} />
              )}
              {farmerTab === 'pest' && (
                <VisionScanner mode="pest" language={language} token={token} />
              )}
              {farmerTab === 'quality' && (
                <QualitySection
                  batches={appState.batches}
                  language={language}
                  token={token}
                  onRefresh={refreshState}
                />
              )}
              {farmerTab === 'labs' && (
                <LabsSection
                  reports={appState.labReports}
                  language={language}
                  token={token}
                  onRefresh={refreshState}
                />
              )}
              {farmerTab === 'irrigation' && (
                <IrrigationSection
                  zones={appState.irrigationZones}
                  weather={appState.weather}
                  language={language}
                  token={token}
                  onRefresh={refreshState}
                />
              )}
              {farmerTab === 'yieldProfit' && <YieldProfitSection language={language} />}
              {farmerTab === 'indiaMap' && (
                <IndiaAgriMap language={language} defaultStateName={user.state} />
              )}
              {farmerTab === 'blockchain' && (
                <BlockchainLedger blocks={appState.blockchain} language={language} />
              )}
              {farmerTab === 'community' && (
                <CommunitySection
                  forumPosts={appState.forumPosts}
                  exchangeListings={appState.exchangeListings}
                  messages={appState.messages}
                  user={user}
                  language={language}
                  token={token}
                  onRefresh={refreshState}
                />
              )}
            </>
          ) : (
            <BuyerWorkspace
              activeTab={buyerTab}
              state={appState}
              user={user}
              language={language}
              token={token}
              onRefresh={refreshState}
            />
          )}
        </main>
      </div>
    </div>
  );
}
