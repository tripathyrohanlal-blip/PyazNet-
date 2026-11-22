export type Language = 'en' | 'hi' | 'or';
export type UserRole = 'farmer' | 'buyer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  state: string;
  organization: string;
}

export interface StorageHistoryPoint {
  time: string;
  humidity: number;
  temp: number;
}

export interface StorageChamber {
  id: string;
  name: string;
  location: string;
  variety: string;
  stockTonnes: number;
  temperatureC: number;
  humidityPct: number;
  moisturePct: number;
  weightLossPct: number;
  shelfLifeDays: number;
  fanActive: boolean;
  dehumidifierActive: boolean;
  alertLevel: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  alertReason: string;
  lastUpdated: string;
  history: StorageHistoryPoint[];
}

export interface OnionBatch {
  id: string;
  batchCode: string;
  variety: string;
  grade: 'Grade A' | 'Grade B' | 'Export';
  farmerId: string;
  farmerName: string;
  originState: string;
  originDistrict: string;
  quantityKg: number;
  pricePerKg: number;
  curingPct: number;
  dryMatterPct: number;
  bulbDiameterMm: number;
  ochratoxinStatus: 'VERIFIED_FREE' | 'PENDING_SCAN' | 'QUARANTINED';
  harvestDate: string;
  shelfLifeDays: number;
  imageUrl: string;
  blockchainHash: string;
}

export interface BlockchainBlock {
  index: number;
  timestamp: string;
  batchCode: string;
  stage:
    | 'HARVEST_LOT'
    | 'CURING_SENSOR'
    | 'OCHRATOXIN_ML_PASS'
    | 'COLD_STORAGE'
    | 'BUYER_ORDER_DISPATCH'
    | 'DELIVERED';
  actor: string;
  location: string;
  details: string;
  prevHash: string;
  hash: string;
}

export interface IrrigationZone {
  id: string;
  name: string;
  cropStage: string;
  soilMoisturePct: number;
  targetMoisturePct: number;
  ecDsM: number;
  valveOpen: boolean;
  weatherPauseActive: boolean;
  nextSchedule: string;
  flowLpm: number;
  dailyWaterLiters: number;
}

export interface WeatherSnapshot {
  location: string;
  tempC: number;
  humidityPct: number;
  windKmh: number;
  rainProbPct: number;
  uvIndex: number;
  dewPointC: number;
  advisory: string;
  forecast: Array<{
    day: string;
    highC: number;
    lowC: number;
    rainPct: number;
    condition: string;
  }>;
}

export interface AgriLabReport {
  id: string;
  sampleCode: string;
  labName: string;
  growthStage: 'Nursery' | 'Vegetative' | 'Bulb Initiation' | 'Maturity & Curing';
  nitrogenKgHa: number;
  phosphorusKgHa: number;
  potassiumKgHa: number;
  soilPh: number;
  ochratoxinPpb: number;
  pathogenCheck: string;
  status: 'Completed' | 'Analyzing';
  date: string;
}

export interface ForumReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: UserRole;
  state: string;
  title: string;
  body: string;
  category: string;
  upvotes: number;
  createdAt: string;
  replies: ForumReply[];
}

export interface ExchangeListing {
  id: string;
  title: string;
  category: 'Equipment' | 'Seeds' | 'Bio-Inputs' | 'Storage';
  ownerName: string;
  state: string;
  rateInr: number;
  unit: string;
  available: boolean;
  bookedBy?: string;
}

export interface DirectMessage {
  id: string;
  senderName: string;
  senderRole: UserRole;
  recipientName: string;
  batchCode?: string;
  text: string;
  timestamp: string;
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  buyerName: string;
  batchCode: string;
  variety: string;
  quantityKg: number;
  totalAmountInr: number;
  status: 'Confirmed' | 'In Transit' | 'Delivered';
  blockchainHash: string;
  createdAt: string;
}

export interface VisionAnalysisResult {
  classification: string;
  riskLevel: 'LOW' | 'MODERATE' | 'CRITICAL';
  confidencePct: number;
  markersDetected: string[];
  affectedAreaPct: number;
  summary: string;
  actionSteps: string[];
  safeForMarket: boolean;
}

export interface AppStatePayload {
  chambers: StorageChamber[];
  batches: OnionBatch[];
  blockchain: BlockchainBlock[];
  irrigationZones: IrrigationZone[];
  weather: WeatherSnapshot;
  labReports: AgriLabReport[];
  forumPosts: ForumPost[];
  exchangeListings: ExchangeListing[];
  messages: DirectMessage[];
  orders: OrderRecord[];
}
