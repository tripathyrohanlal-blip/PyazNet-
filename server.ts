import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import type {
  AppStatePayload,
  BlockchainBlock,
  OnionBatch,
  StorageChamber,
  UserProfile,
  UserRole,
} from './src/types';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const STORE_PATH = path.join(DATA_DIR, 'pyaznet-store.json');
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

interface StoredUser extends UserProfile {
  passwordHash: string;
  passwordSalt: string;
}

interface StoreData {
  users: StoredUser[];
  state: AppStatePayload;
}

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { hash: derived, salt: actualSalt };
}

function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  const bufA = Buffer.from(hash, 'hex');
  const bufB = Buffer.from(storedHash, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function signToken(payload: UserProfile): string {
  const encoded = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token: string): UserProfile | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  const bufSig = Buffer.from(sig);
  const bufExp = Buffer.from(expected);
  if (bufSig.length !== bufExp.length || !crypto.timingSafeEqual(bufSig, bufExp)) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!parsed.exp || Date.now() > parsed.exp) return null;
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      state: parsed.state,
      organization: parsed.organization,
    };
  } catch {
    return null;
  }
}

function buildInitialBlockchain(): BlockchainBlock[] {
  const blocks: BlockchainBlock[] = [];
  const entries: Array<Omit<BlockchainBlock, 'index' | 'prevHash' | 'hash'>> = [
    {
      timestamp: '2026-11-12T06:30:00Z',
      batchCode: 'PYZ-MH-2026-884',
      stage: 'HARVEST_LOT',
      actor: 'Rajesh Deshmukh (Farmer)',
      location: 'Lasalgaon, Nashik, Maharashtra',
      details: 'Bhima Shakti Red Onion harvested at 89% neck fall · 4,800 kg lot',
    },
    {
      timestamp: '2026-11-14T14:15:00Z',
      batchCode: 'PYZ-MH-2026-884',
      stage: 'CURING_SENSOR',
      actor: 'Nashik Smart Chawl #01',
      location: 'Niphad Cluster, Maharashtra',
      details: 'Solar-cured 48h · Moisture stabilized at 12.1% · RH 61% · Temp 24.4°C',
    },
    {
      timestamp: '2026-11-16T09:40:00Z',
      batchCode: 'PYZ-MH-2026-884',
      stage: 'OCHRATOXIN_ML_PASS',
      actor: 'PyazNet Optical Vision Lab',
      location: 'Lasalgaon QA Gate',
      details: 'High-res ML scan: 0% Aspergillus niger spores · Ochratoxin A < 0.8 ppb (Safe)',
    },
    {
      timestamp: '2026-11-18T11:20:00Z',
      batchCode: 'PYZ-OD-2026-319',
      stage: 'HARVEST_LOT',
      actor: 'Subashree Panda (Farmer)',
      location: 'Titlagarh, Balangir, Odisha',
      details: 'Agrifound Light Red cured lot · 2,400 kg · Dry matter 14.2%',
    },
    {
      timestamp: '2026-11-20T16:05:00Z',
      batchCode: 'PYZ-OD-2026-319',
      stage: 'OCHRATOXIN_ML_PASS',
      actor: 'PyazNet Optical Vision Lab',
      location: 'Balangir FPO Hub',
      details: 'Optical ML + ELISA verified · Zero mycotoxin · Listed for direct market',
    },
  ];

  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  entries.forEach((entry, idx) => {
    const hash = sha256(`${idx}|${prevHash}|${entry.batchCode}|${entry.stage}|${entry.timestamp}|${entry.details}`);
    blocks.push({
      index: idx + 1,
      ...entry,
      prevHash,
      hash,
    });
    prevHash = hash;
  });
  return blocks;
}

function buildInitialStore(): StoreData {
  const blockchain = buildInitialBlockchain();
  const initialState: AppStatePayload = {
    chambers: [
      {
        id: 'ch-1',
        name: 'Chawl Unit A1 — Nashik Red',
        location: 'Lasalgaon, Maharashtra',
        variety: 'Bhima Shakti Red',
        stockTonnes: 18.4,
        temperatureC: 24.6,
        humidityPct: 62,
        moisturePct: 12.2,
        weightLossPct: 1.4,
        shelfLifeDays: 138,
        fanActive: true,
        dehumidifierActive: false,
        alertLevel: 'NOMINAL',
        alertReason: 'Optimal curing & dry-air circulation; Ochratoxin A risk suppressed.',
        lastUpdated: new Date().toISOString(),
        history: [
          { time: '00:00', humidity: 64, temp: 25.1 },
          { time: '04:00', humidity: 66, temp: 24.2 },
          { time: '08:00', humidity: 63, temp: 24.4 },
          { time: '12:00', humidity: 60, temp: 25.6 },
          { time: '16:00', humidity: 61, temp: 25.2 },
          { time: '20:00', humidity: 62, temp: 24.6 },
        ],
      },
      {
        id: 'ch-2',
        name: 'Chawl Unit B4 — Balangir Stock',
        location: 'Balangir, Odisha',
        variety: 'Agrifound Light Red',
        stockTonnes: 11.2,
        temperatureC: 28.9,
        humidityPct: 79,
        moisturePct: 15.8,
        weightLossPct: 3.9,
        shelfLifeDays: 42,
        fanActive: true,
        dehumidifierActive: true,
        alertLevel: 'WARNING',
        alertReason: 'Coastal humidity spike (79% RH) detected — Aspergillus niger germination threshold approaching.',
        lastUpdated: new Date().toISOString(),
        history: [
          { time: '00:00', humidity: 71, temp: 27.1 },
          { time: '04:00', humidity: 74, temp: 27.5 },
          { time: '08:00', humidity: 76, temp: 28.0 },
          { time: '12:00', humidity: 78, temp: 28.6 },
          { time: '16:00', humidity: 80, temp: 29.1 },
          { time: '20:00', humidity: 79, temp: 28.9 },
        ],
      },
      {
        id: 'ch-3',
        name: 'Cold Chamber C2 — Export White',
        location: 'Mahuva, Gujarat',
        variety: 'Bhima Shubhra White',
        stockTonnes: 9.6,
        temperatureC: 22.8,
        humidityPct: 58,
        moisturePct: 11.5,
        weightLossPct: 0.9,
        shelfLifeDays: 164,
        fanActive: true,
        dehumidifierActive: false,
        alertLevel: 'NOMINAL',
        alertReason: 'Sub-60% RH locked. Zero neck-rot condensation.',
        lastUpdated: new Date().toISOString(),
        history: [
          { time: '00:00', humidity: 59, temp: 22.9 },
          { time: '04:00', humidity: 60, temp: 22.6 },
          { time: '08:00', humidity: 58, temp: 22.7 },
          { time: '12:00', humidity: 57, temp: 23.1 },
          { time: '16:00', humidity: 58, temp: 23.0 },
          { time: '20:00', humidity: 58, temp: 22.8 },
        ],
      },
    ],
    batches: [
      {
        id: 'batch-1',
        batchCode: 'PYZ-MH-2026-884',
        variety: 'Bhima Shakti Red (Nashik)',
        grade: 'Grade A',
        farmerId: 'seed-farmer-1',
        farmerName: 'Rajesh Deshmukh',
        originState: 'Maharashtra',
        originDistrict: 'Nashik · Lasalgaon',
        quantityKg: 4200,
        pricePerKg: 34,
        curingPct: 96,
        dryMatterPct: 14.8,
        bulbDiameterMm: 58,
        ochratoxinStatus: 'VERIFIED_FREE',
        harvestDate: '2026-11-12',
        shelfLifeDays: 138,
        imageUrl: '/src/assets/images/onion_grade_a_1795352574668.jpg',
        blockchainHash: blockchain[2].hash,
      },
      {
        id: 'batch-2',
        batchCode: 'PYZ-OD-2026-319',
        variety: 'Agrifound Light Red',
        grade: 'Grade A',
        farmerId: 'seed-farmer-2',
        farmerName: 'Subashree Panda',
        originState: 'Odisha',
        originDistrict: 'Balangir · Titlagarh',
        quantityKg: 2150,
        pricePerKg: 31,
        curingPct: 93,
        dryMatterPct: 14.2,
        bulbDiameterMm: 54,
        ochratoxinStatus: 'VERIFIED_FREE',
        harvestDate: '2026-11-18',
        shelfLifeDays: 112,
        imageUrl: '/src/assets/images/onion_harvest_hero_1795352576415.jpg',
        blockchainHash: blockchain[4].hash,
      },
      {
        id: 'batch-3',
        batchCode: 'PYZ-GJ-2026-502',
        variety: 'Bhima Shubhra White & Shallots',
        grade: 'Export',
        farmerId: 'seed-farmer-3',
        farmerName: 'Kiranbhai Patel',
        originState: 'Gujarat',
        originDistrict: 'Bhavnagar · Mahuva',
        quantityKg: 3600,
        pricePerKg: 42,
        curingPct: 98,
        dryMatterPct: 16.1,
        bulbDiameterMm: 62,
        ochratoxinStatus: 'VERIFIED_FREE',
        harvestDate: '2026-11-15',
        shelfLifeDays: 164,
        imageUrl: '/src/assets/images/onion_white_produce_1795352575084.jpg',
        blockchainHash: sha256('PYZ-GJ-2026-502-VERIFIED'),
      },
      {
        id: 'batch-4',
        batchCode: 'PYZ-MP-2026-711',
        variety: 'N-53 Kharif Red',
        grade: 'Grade B',
        farmerId: 'seed-farmer-4',
        farmerName: 'Mahendra Patidar',
        originState: 'Madhya Pradesh',
        originDistrict: 'Indore · Malwa Plateau',
        quantityKg: 2900,
        pricePerKg: 27,
        curingPct: 89,
        dryMatterPct: 13.1,
        bulbDiameterMm: 49,
        ochratoxinStatus: 'VERIFIED_FREE',
        harvestDate: '2026-11-19',
        shelfLifeDays: 84,
        imageUrl: '/src/assets/images/onion_grade_a_1795352574668.jpg',
        blockchainHash: sha256('PYZ-MP-2026-711-VERIFIED'),
      },
    ],
    blockchain,
    irrigationZones: [
      {
        id: 'zone-1',
        name: 'Plot North-01 (Bulb Initiation)',
        cropStage: 'Bulb Initiation · Day 54',
        soilMoisturePct: 48,
        targetMoisturePct: 55,
        ecDsM: 1.4,
        valveOpen: true,
        weatherPauseActive: false,
        nextSchedule: 'Active Drip · 22 min remaining',
        flowLpm: 38,
        dailyWaterLiters: 1420,
      },
      {
        id: 'zone-2',
        name: 'Plot East-02 (Maturation)',
        cropStage: 'Neck Fall & Maturity · Day 88',
        soilMoisturePct: 36,
        targetMoisturePct: 35,
        ecDsM: 1.1,
        valveOpen: false,
        weatherPauseActive: true,
        nextSchedule: 'Paused — Rain forecast 68% at 17:00',
        flowLpm: 0,
        dailyWaterLiters: 420,
      },
      {
        id: 'zone-3',
        name: 'Nursery Raised Bed 03',
        cropStage: 'Transplant Ready · Day 32',
        soilMoisturePct: 62,
        targetMoisturePct: 64,
        ecDsM: 1.3,
        valveOpen: false,
        weatherPauseActive: false,
        nextSchedule: 'Scheduled 06:00 AM · 15 min pulse',
        flowLpm: 0,
        dailyWaterLiters: 680,
      },
    ],
    weather: {
      location: 'Nashik · Lasalgaon Agri Station',
      tempC: 27.4,
      humidityPct: 58,
      windKmh: 14,
      rainProbPct: 68,
      uvIndex: 6,
      dewPointC: 18.2,
      advisory:
        'Evening light shower expected (68% prob). Automated irrigation paused on Plot East-02 to prevent basal rot and waterlogging.',
      forecast: [
        { day: 'Today', highC: 29, lowC: 18, rainPct: 68, condition: 'Evening Showers' },
        { day: 'Mon', highC: 28, lowC: 17, rainPct: 20, condition: 'Partly Cloudy' },
        { day: 'Tue', highC: 30, lowC: 17, rainPct: 5, condition: 'Clear Dry Sun' },
        { day: 'Wed', highC: 31, lowC: 18, rainPct: 0, condition: 'Optimal Curing' },
        { day: 'Thu', highC: 30, lowC: 18, rainPct: 10, condition: 'Mild Breeze' },
      ],
    },
    labReports: [
      {
        id: 'lab-1',
        sampleCode: 'SOIL-MH-904',
        labName: 'DOGR Rajgurunagar Crop Growth Lab',
        growthStage: 'Bulb Initiation',
        nitrogenKgHa: 112,
        phosphorusKgHa: 48,
        potassiumKgHa: 78,
        soilPh: 6.9,
        ochratoxinPpb: 0.4,
        pathogenCheck: 'Negative for Fusarium basal rot & Aspergillus niger',
        status: 'Completed',
        date: '2026-11-18',
      },
      {
        id: 'lab-2',
        sampleCode: 'TISS-OD-412',
        labName: 'OUAT Bhubaneswar Plant Pathology Lab',
        growthStage: 'Maturity & Curing',
        nitrogenKgHa: 96,
        phosphorusKgHa: 44,
        potassiumKgHa: 84,
        soilPh: 6.5,
        ochratoxinPpb: 0.7,
        pathogenCheck: 'Low Purple Blotch spore trace (<2%) — Copper oxychloride foliar pass',
        status: 'Completed',
        date: '2026-11-20',
      },
      {
        id: 'lab-3',
        sampleCode: 'NURS-GJ-118',
        labName: 'Junagadh Agri Growth Station',
        growthStage: 'Nursery',
        nitrogenKgHa: 124,
        phosphorusKgHa: 52,
        potassiumKgHa: 66,
        soilPh: 7.2,
        ochratoxinPpb: 0.2,
        pathogenCheck: 'Trichoderma viride soil drench verified healthy',
        status: 'Completed',
        date: '2026-11-21',
      },
    ],
    forumPosts: [
      {
        id: 'post-1',
        author: 'Rajesh Deshmukh',
        role: 'farmer',
        state: 'Maharashtra',
        title: 'Best curing airflow ratio to stop Aspergillus niger black mold after late rain?',
        body: 'Our Chawl Unit A1 saw 68% night humidity after unseasonal drizzle. Running exhaust louvers at 4 m/s plus silica-lime floor trays brought RH back to 61% in 3 hours.',
        category: 'Post-Harvest & Mycotoxin',
        upvotes: 28,
        createdAt: '2026-11-20',
        replies: [
          {
            id: 'rep-1',
            author: 'Dr. Kavita Kulkarni (DOGR Agronomist)',
            body: 'Keep neck curing intact for at least 12 days before topping leaves 2.5 cm above the bulb. Never store bulbs above 65% RH without forced draft.',
            createdAt: '2026-11-20',
          },
        ],
      },
      {
        id: 'post-2',
        author: 'Subashree Panda',
        role: 'farmer',
        state: 'Odisha',
        title: 'Thrips control in Kharif onion in Balangir without heavy chemical residue',
        body: 'Blue sticky traps (25/acre) paired with Neem oil 1500 ppm at dusk cut thrips count below economic threshold within 6 days.',
        category: 'Pest Management',
        upvotes: 19,
        createdAt: '2026-11-21',
        replies: [],
      },
    ],
    exchangeListings: [
      {
        id: 'ex-1',
        title: 'Solar Onion Tunnel Dryer (500 kg/batch)',
        category: 'Storage',
        ownerName: 'Sahyadri FPO Collective',
        state: 'Maharashtra',
        rateInr: 650,
        unit: 'day',
        available: true,
      },
      {
        id: 'ex-2',
        title: 'Digital Grain & Bulb Pin Moisture Meter',
        category: 'Equipment',
        ownerName: 'Prakash Mohanty',
        state: 'Odisha',
        rateInr: 180,
        unit: 'day',
        available: true,
      },
      {
        id: 'ex-3',
        title: 'Trichoderma viride + Pseudomonas Bio-Fungicide Kit (10 kg)',
        category: 'Bio-Inputs',
        ownerName: 'Malwa Krishi Kendra',
        state: 'Madhya Pradesh',
        rateInr: 920,
        unit: 'kit',
        available: true,
      },
      {
        id: 'ex-4',
        title: 'Certified Bhima Shakti Foundation Seed (5 kg pack)',
        category: 'Seeds',
        ownerName: 'NHRDF Nashik Depot',
        state: 'Maharashtra',
        rateInr: 2400,
        unit: 'pack',
        available: true,
      },
    ],
    messages: [
      {
        id: 'msg-1',
        senderName: 'FreshCart Wholesale',
        senderRole: 'buyer',
        recipientName: 'Rajesh Deshmukh',
        batchCode: 'PYZ-MH-2026-884',
        text: 'Hello Rajesh ji, we verified the Ochratoxin-free certificate for PYZ-MH-2026-884. Can you dispatch 500 kg in 25 kg mesh bags by Tuesday?',
        timestamp: '2026-11-21T10:15:00Z',
      },
      {
        id: 'msg-2',
        senderName: 'Rajesh Deshmukh',
        senderRole: 'farmer',
        recipientName: 'FreshCart Wholesale',
        batchCode: 'PYZ-MH-2026-884',
        text: 'Yes, curing is 96% complete and all bulbs are graded 55-62 mm. Dispatch slot confirmed.',
        timestamp: '2026-11-21T10:42:00Z',
      },
    ],
    orders: [
      {
        id: 'ord-1',
        orderCode: 'ORD-2026-4401',
        buyerName: 'FreshCart Wholesale',
        batchCode: 'PYZ-MH-2026-884',
        variety: 'Bhima Shakti Red (Nashik)',
        quantityKg: 250,
        totalAmountInr: 8500,
        status: 'In Transit',
        blockchainHash: sha256('ORD-2026-4401-PYZ-MH-2026-884'),
        createdAt: '2026-11-21',
      },
    ],
  };

  return {
    users: [],
    state: initialState,
  };
}

function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf8');
      return JSON.parse(raw) as StoreData;
    }
  } catch (err) {
    console.error('Failed to read store, initializing fresh:', err);
  }
  const fresh = buildInitialStore();
  saveStore(fresh);
  return fresh;
}

function saveStore(store: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function recomputeChamberAlert(chamber: StorageChamber): StorageChamber {
  let alertLevel: 'NOMINAL' | 'WARNING' | 'CRITICAL' = 'NOMINAL';
  let alertReason = 'Optimal curing & dry-air circulation; Ochratoxin A risk suppressed.';
  let shelfLifeDays = chamber.shelfLifeDays;

  if (chamber.humidityPct >= 82 || chamber.moisturePct >= 16.5) {
    alertLevel = 'CRITICAL';
    alertReason = `Critical moisture spike (${chamber.humidityPct}% RH / ${chamber.moisturePct}% moisture). Rapid Aspergillus niger & Ochratoxin A synthesis risk!`;
    shelfLifeDays = Math.max(12, Math.round(160 - (chamber.humidityPct - 55) * 4.2));
  } else if (chamber.humidityPct >= 72 || chamber.moisturePct >= 14.5) {
    alertLevel = 'WARNING';
    alertReason = `Elevated humidity (${chamber.humidityPct}% RH) — Activate dehumidifier and exhaust louvers to prevent neck rot.`;
    shelfLifeDays = Math.max(30, Math.round(160 - (chamber.humidityPct - 55) * 3.5));
  } else {
    shelfLifeDays = Math.min(180, Math.round(170 - Math.max(0, chamber.humidityPct - 58) * 2.5));
  }

  return {
    ...chamber,
    alertLevel,
    alertReason,
    shelfLifeDays,
    lastUpdated: new Date().toISOString(),
  };
}

interface AuthedRequest extends Request {
  user?: UserProfile;
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  const token = authHeader.slice(7).trim();
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }
  req.user = user;
  next();
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '14mb' }));

  const store = loadStore();

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, state, organization } = req.body ?? {};
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      (role !== 'farmer' && role !== 'buyer')
    ) {
      res.status(400).json({ error: 'Name, email, password, and role (farmer/buyer) are required.' });
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || password.length < 6) {
      res.status(400).json({ error: 'Provide a valid email and a password of at least 6 characters.' });
      return;
    }
    if (store.users.some((u) => u.email === cleanEmail)) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const { hash, salt } = hashPassword(password);
    const newUser: StoredUser = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      email: cleanEmail,
      role,
      state: typeof state === 'string' && state.trim() ? state.trim() : 'Maharashtra',
      organization:
        typeof organization === 'string' && organization.trim()
          ? organization.trim()
          : role === 'farmer'
            ? 'Independent Onion Grower'
            : 'Direct Produce Buyer',
      passwordHash: hash,
      passwordSalt: salt,
    };
    store.users.push(newUser);
    saveStore(store);

    const profile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      state: newUser.state,
      organization: newUser.organization,
    };
    const token = signToken(profile);
    res.status(201).json({ user: profile, token });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = store.users.find((u) => u.email === cleanEmail);
    if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const profile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      state: user.state,
      organization: user.organization,
    };
    const token = signToken(profile);
    res.json({ user: profile, token });
  });

  // Auth: Instant Preview Session (no hardcoded passwords; issues signed session for exploration)
  app.post('/api/auth/demo', (req, res) => {
    const role: UserRole = req.body?.role === 'buyer' ? 'buyer' : 'farmer';
    const profile: UserProfile =
      role === 'farmer'
        ? {
            id: 'preview-farmer-1',
            name: 'Rajesh Deshmukh',
            email: 'rajesh.nashik@pyaznet.preview',
            role: 'farmer',
            state: 'Maharashtra',
            organization: 'Lasalgaon Onion FPO',
          }
        : {
            id: 'preview-buyer-1',
            name: 'FreshCart Wholesale',
            email: 'procurement@freshcart.preview',
            role: 'buyer',
            state: 'Odisha',
            organization: 'FreshCart Direct Sourcing',
          };
    const token = signToken(profile);
    res.json({ user: profile, token });
  });

  // Shared live state
  app.get('/api/state', requireAuth, (_req, res) => {
    res.json(store.state);
  });

  // Storage chamber actuator & moisture spike simulation
  app.patch('/api/storage/:id', requireAuth, (req: AuthedRequest, res) => {
    if (req.user?.role !== 'farmer') {
      res.status(403).json({ error: 'Only farmer accounts can control storage actuators.' });
      return;
    }
    const idx = store.state.chambers.findIndex((c) => c.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Storage chamber not found.' });
      return;
    }
    const chamber = { ...store.state.chambers[idx] };
    const { toggleFan, toggleDehumidifier, simulateSpike, stabilize } = req.body ?? {};

    if (toggleFan) chamber.fanActive = !chamber.fanActive;
    if (toggleDehumidifier) chamber.dehumidifierActive = !chamber.dehumidifierActive;
    if (simulateSpike) {
      chamber.humidityPct = 84;
      chamber.moisturePct = 16.9;
      chamber.temperatureC = 30.2;
      chamber.weightLossPct = Number((chamber.weightLossPct + 1.1).toFixed(1));
      chamber.history = [
        ...chamber.history.slice(1),
        { time: 'Now', humidity: chamber.humidityPct, temp: chamber.temperatureC },
      ];
    }
    if (stabilize || (chamber.fanActive && chamber.dehumidifierActive && !simulateSpike)) {
      if (stabilize) {
        chamber.humidityPct = 60;
        chamber.moisturePct = 12.0;
        chamber.temperatureC = 24.2;
        chamber.fanActive = true;
        chamber.dehumidifierActive = false;
        chamber.history = [
          ...chamber.history.slice(1),
          { time: 'Now', humidity: chamber.humidityPct, temp: chamber.temperatureC },
        ];
      }
    }

    store.state.chambers[idx] = recomputeChamberAlert(chamber);
    saveStore(store);
    res.json(store.state.chambers[idx]);
  });

  // Farmer: Add new cured onion batch (updates inventory + appends blockchain block)
  app.post('/api/inventory', requireAuth, (req: AuthedRequest, res) => {
    if (req.user?.role !== 'farmer') {
      res.status(403).json({ error: 'Only farmer accounts can publish harvest lots.' });
      return;
    }
    const { variety, grade, quantityKg, pricePerKg, originDistrict, curingPct, dryMatterPct, bulbDiameterMm } =
      req.body ?? {};
    const qty = Number(quantityKg);
    const price = Number(pricePerKg);
    if (!variety || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price <= 0) {
      res.status(400).json({ error: 'Valid variety, quantityKg, and pricePerKg are required.' });
      return;
    }
    const codePrefix = req.user.state.slice(0, 2).toUpperCase() || 'IN';
    const batchCode = `PYZ-${codePrefix}-2026-${Math.floor(100 + Math.random() * 899)}`;
    const prevBlock = store.state.blockchain[store.state.blockchain.length - 1];
    const timestamp = new Date().toISOString();
    const details = `${variety} (${grade || 'Grade A'}) · ${qty} kg · Curing ${curingPct || 94}% · Ochratoxin ML QA Pending/Passed`;
    const hash = sha256(
      `${store.state.blockchain.length}|${prevBlock.hash}|${batchCode}|HARVEST_LOT|${timestamp}|${details}`
    );

    const newBlock: BlockchainBlock = {
      index: store.state.blockchain.length + 1,
      timestamp,
      batchCode,
      stage: 'HARVEST_LOT',
      actor: `${req.user.name} (Farmer)`,
      location: `${originDistrict || req.user.state}, ${req.user.state}`,
      details,
      prevHash: prevBlock.hash,
      hash,
    };

    const newBatch: OnionBatch = {
      id: `batch-${crypto.randomUUID().slice(0, 6)}`,
      batchCode,
      variety: String(variety).trim(),
      grade: grade === 'Grade B' || grade === 'Export' ? grade : 'Grade A',
      farmerId: req.user.id,
      farmerName: req.user.name,
      originState: req.user.state,
      originDistrict: String(originDistrict || req.user.state).trim(),
      quantityKg: qty,
      pricePerKg: price,
      curingPct: Number(curingPct) || 94,
      dryMatterPct: Number(dryMatterPct) || 14.5,
      bulbDiameterMm: Number(bulbDiameterMm) || 56,
      ochratoxinStatus: 'VERIFIED_FREE',
      harvestDate: timestamp.slice(0, 10),
      shelfLifeDays: 130,
      imageUrl: '/src/assets/images/onion_grade_a_1795352574668.jpg',
      blockchainHash: hash,
    };

    store.state.blockchain.push(newBlock);
    store.state.batches.unshift(newBatch);
    saveStore(store);
    res.status(201).json({ batch: newBatch, block: newBlock });
  });

  // Buyer: Place direct-to-consumer order (decrements real-time inventory + appends blockchain block)
  app.post('/api/orders', requireAuth, (req: AuthedRequest, res) => {
    const { batchId, quantityKg } = req.body ?? {};
    const qty = Number(quantityKg);
    if (!batchId || !Number.isFinite(qty) || qty <= 0) {
      res.status(400).json({ error: 'Valid batchId and positive quantityKg are required.' });
      return;
    }
    const batchIdx = store.state.batches.findIndex((b) => b.id === batchId);
    if (batchIdx === -1) {
      res.status(404).json({ error: 'Produce batch not found.' });
      return;
    }
    const batch = store.state.batches[batchIdx];
    if (qty > batch.quantityKg) {
      res.status(400).json({ error: `Only ${batch.quantityKg} kg remaining in batch ${batch.batchCode}.` });
      return;
    }

    batch.quantityKg = Number((batch.quantityKg - qty).toFixed(1));
    const totalAmountInr = Math.round(qty * batch.pricePerKg);
    const orderCode = `ORD-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const prevBlock = store.state.blockchain[store.state.blockchain.length - 1];
    const timestamp = new Date().toISOString();
    const details = `Direct order ${orderCode}: ${qty} kg purchased by ${req.user?.name || 'Buyer'} at ₹${batch.pricePerKg}/kg`;
    const hash = sha256(
      `${store.state.blockchain.length}|${prevBlock.hash}|${batch.batchCode}|BUYER_ORDER_DISPATCH|${timestamp}|${details}`
    );

    const newBlock: BlockchainBlock = {
      index: store.state.blockchain.length + 1,
      timestamp,
      batchCode: batch.batchCode,
      stage: 'BUYER_ORDER_DISPATCH',
      actor: req.user?.name || 'Direct Buyer',
      location: req.user?.state || 'India Direct',
      details,
      prevHash: prevBlock.hash,
      hash,
    };

    const order = {
      id: `ord-${crypto.randomUUID().slice(0, 6)}`,
      orderCode,
      buyerName: req.user?.name || 'Buyer',
      batchCode: batch.batchCode,
      variety: batch.variety,
      quantityKg: qty,
      totalAmountInr,
      status: 'Confirmed' as const,
      blockchainHash: hash,
      createdAt: timestamp.slice(0, 10),
    };

    store.state.blockchain.push(newBlock);
    store.state.orders.unshift(order);
    saveStore(store);
    res.status(201).json({ order, batch, block: newBlock });
  });

  // Farmer: Automated Irrigation Control
  app.patch('/api/irrigation/:id', requireAuth, (req: AuthedRequest, res) => {
    if (req.user?.role !== 'farmer') {
      res.status(403).json({ error: 'Only farmer accounts can modify irrigation valves.' });
      return;
    }
    const idx = store.state.irrigationZones.findIndex((z) => z.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Irrigation zone not found.' });
      return;
    }
    const zone = { ...store.state.irrigationZones[idx] };
    const { toggleValve, toggleWeatherPause, targetMoisturePct } = req.body ?? {};
    if (toggleWeatherPause) {
      zone.weatherPauseActive = !zone.weatherPauseActive;
      if (zone.weatherPauseActive) {
        zone.valveOpen = false;
        zone.flowLpm = 0;
        zone.nextSchedule = 'Paused — Rain forecast 68% protection';
      }
    }
    if (toggleValve && !zone.weatherPauseActive) {
      zone.valveOpen = !zone.valveOpen;
      zone.flowLpm = zone.valveOpen ? 36 : 0;
      zone.nextSchedule = zone.valveOpen ? 'Active Drip · Soil feedback loop engaged' : 'Standby · Moisture threshold met';
      if (zone.valveOpen) {
        zone.soilMoisturePct = Math.min(zone.targetMoisturePct, zone.soilMoisturePct + 3);
        zone.dailyWaterLiters += 180;
      }
    }
    if (typeof targetMoisturePct === 'number' && targetMoisturePct >= 25 && targetMoisturePct <= 80) {
      zone.targetMoisturePct = targetMoisturePct;
    }

    store.state.irrigationZones[idx] = zone;
    saveStore(store);
    res.json(zone);
  });

  // Farmer: Submit new Crop Growth Lab sample
  app.post('/api/labs', requireAuth, (req: AuthedRequest, res) => {
    const { labName, growthStage, nitrogenKgHa, phosphorusKgHa, potassiumKgHa, soilPh } = req.body ?? {};
    const report = {
      id: `lab-${crypto.randomUUID().slice(0, 6)}`,
      sampleCode: `LAB-${Math.floor(100 + Math.random() * 899)}`,
      labName: String(labName || 'PyazNet Regional Crop Growth Lab'),
      growthStage: growthStage || 'Bulb Initiation',
      nitrogenKgHa: Number(nitrogenKgHa) || 108,
      phosphorusKgHa: Number(phosphorusKgHa) || 46,
      potassiumKgHa: Number(potassiumKgHa) || 74,
      soilPh: Number(soilPh) || 6.8,
      ochratoxinPpb: 0.3,
      pathogenCheck: 'Sample logged · Spectrophotometric & ELISA assay cleared',
      status: 'Completed' as const,
      date: new Date().toISOString().slice(0, 10),
    };
    store.state.labReports.unshift(report);
    saveStore(store);
    res.status(201).json(report);
  });

  // Community Forum
  app.post('/api/forum', requireAuth, (req: AuthedRequest, res) => {
    const { title, body, category } = req.body ?? {};
    if (!title || !body) {
      res.status(400).json({ error: 'Title and body are required.' });
      return;
    }
    const post = {
      id: `post-${crypto.randomUUID().slice(0, 6)}`,
      author: req.user?.name || 'Farmer',
      role: req.user?.role || 'farmer',
      state: req.user?.state || 'India',
      title: String(title).trim(),
      body: String(body).trim(),
      category: String(category || 'Crop Advisory'),
      upvotes: 1,
      createdAt: new Date().toISOString().slice(0, 10),
      replies: [],
    };
    store.state.forumPosts.unshift(post);
    saveStore(store);
    res.status(201).json(post);
  });

  app.post('/api/forum/:id/upvote', requireAuth, (req, res) => {
    const post = store.state.forumPosts.find((p) => p.id === req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }
    post.upvotes += 1;
    saveStore(store);
    res.json(post);
  });

  app.post('/api/forum/:id/reply', requireAuth, (req: AuthedRequest, res) => {
    const post = store.state.forumPosts.find((p) => p.id === req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }
    const { body } = req.body ?? {};
    if (!body || !String(body).trim()) {
      res.status(400).json({ error: 'Reply text is required.' });
      return;
    }
    post.replies.push({
      id: `rep-${crypto.randomUUID().slice(0, 6)}`,
      author: req.user?.name || 'Member',
      body: String(body).trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    });
    saveStore(store);
    res.status(201).json(post);
  });

  // Peer-to-Peer Resource Exchange Marketplace
  app.post('/api/exchange', requireAuth, (req: AuthedRequest, res) => {
    const { title, category, rateInr, unit } = req.body ?? {};
    if (!title || !Number.isFinite(Number(rateInr))) {
      res.status(400).json({ error: 'Title and valid rateInr are required.' });
      return;
    }
    const item = {
      id: `ex-${crypto.randomUUID().slice(0, 6)}`,
      title: String(title).trim(),
      category: category || 'Equipment',
      ownerName: req.user?.name || 'Farmer',
      state: req.user?.state || 'Maharashtra',
      rateInr: Number(rateInr),
      unit: String(unit || 'day'),
      available: true,
    };
    store.state.exchangeListings.unshift(item);
    saveStore(store);
    res.status(201).json(item);
  });

  app.patch('/api/exchange/:id/book', requireAuth, (req: AuthedRequest, res) => {
    const item = store.state.exchangeListings.find((e) => e.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Listing not found.' });
      return;
    }
    item.available = !item.available;
    item.bookedBy = item.available ? undefined : req.user?.name;
    saveStore(store);
    res.json(item);
  });

  // Direct Marketplace Messaging (Buyer <-> Farmer)
  app.post('/api/messages', requireAuth, (req: AuthedRequest, res) => {
    const { recipientName, batchCode, text } = req.body ?? {};
    if (!text || !String(text).trim()) {
      res.status(400).json({ error: 'Message text is required.' });
      return;
    }
    const msg = {
      id: `msg-${crypto.randomUUID().slice(0, 6)}`,
      senderName: req.user?.name || 'User',
      senderRole: req.user?.role || 'buyer',
      recipientName: String(recipientName || 'Rajesh Deshmukh'),
      batchCode: batchCode ? String(batchCode) : undefined,
      text: String(text).trim(),
      timestamp: new Date().toISOString(),
    };
    store.state.messages.push(msg);
    saveStore(store);
    res.status(201).json(msg);
  });

  // Server-Side Gemini Vision ML Diagnostics (Ochratoxin A / Pest / Buyer Adulteration)
  app.post('/api/vision/analyze', requireAuth, async (req, res) => {
    try {
      const { imageBase64, mimeType, mode, language } = req.body ?? {};
      if (typeof imageBase64 !== 'string' || !imageBase64.length) {
        res.status(400).json({ error: 'Image payload (base64) is required.' });
        return;
      }

      const langLabel =
        language === 'hi' ? 'Hindi (Devanagari script)' : language === 'or' ? 'Odia (Odia script)' : 'English';

      let promptText = '';
      if (mode === 'ochratoxin') {
        promptText = `You are a plant pathology and food safety ML vision analyzer specializing in stored onions.
Inspect this high-resolution produce image carefully for signs of Aspergillus niger (sooty black mold colonies between scales or at the neck), Ochratoxin A contamination indicators, soft neck rot, moisture sheen, or sprouting decay.
Respond strictly in JSON matching the schema. Write 'classification', 'markersDetected', 'summary', and 'actionSteps' in ${langLabel}. Keep 'riskLevel' strictly one of LOW, MODERATE, CRITICAL.`;
      } else if (mode === 'pest') {
        promptText = `You are an Indian agronomy crop-disease & pest computer vision expert for Allium cepa (onion) crops.
Inspect this crop/leaf/bulb image for Purple Blotch (Alternaria porri), Stemphylium Blight, Onion Thrips (Thrips tabaci silvery streaks), Anthracnose, Basal Rot, or healthy foliage.
Respond strictly in JSON matching the schema. Write 'classification', 'markersDetected', 'summary', and 'actionSteps' in ${langLabel}. Keep 'riskLevel' strictly one of LOW, MODERATE, CRITICAL.`;
      } else {
        promptText = `You are a consumer food-safety ML vision scanner for retail/wholesale onion buyers.
Inspect this produce image for artificial red dye adulteration, chemical bleaching, mechanical bruising, hidden insect borers/pests, and black Aspergillus niger mold or Ochratoxin spoilage indicators.
Respond strictly in JSON matching the schema. Write 'classification', 'markersDetected', 'summary', and 'actionSteps' in ${langLabel}. Keep 'riskLevel' strictly one of LOW, MODERATE, CRITICAL.`;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: typeof mimeType === 'string' && mimeType.startsWith('image/') ? mimeType : 'image/jpeg',
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
            { text: promptText },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              classification: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              confidencePct: { type: Type.NUMBER },
              markersDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
              affectedAreaPct: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              safeForMarket: { type: Type.BOOLEAN },
            },
            required: [
              'classification',
              'riskLevel',
              'confidencePct',
              'markersDetected',
              'affectedAreaPct',
              'summary',
              'actionSteps',
              'safeForMarket',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Vision analysis failed.';
      console.error('Gemini vision error:', err);
      res.status(502).json({ error: message });
    }
  });

  // Server-Side Personalized Agronomist Expert Consultation
  app.post('/api/expert/consult', requireAuth, async (req: AuthedRequest, res) => {
    try {
      const { question, language, stateContext } = req.body ?? {};
      if (typeof question !== 'string' || !question.trim()) {
        res.status(400).json({ error: 'Consultation question is required.' });
        return;
      }
      const langLabel =
        language === 'hi' ? 'Hindi (Devanagari script)' : language === 'or' ? 'Odia (Odia script)' : 'English';

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Farmer location: ${stateContext || req.user?.state || 'India'}.
Active storage snapshot: Chawl A1 62% RH (Nominal), Chawl B4 79% RH (Humidity spike alert).
Question: ${question.trim()}`,
        config: {
          systemInstruction: `You are a senior Indian onion agronomist and post-harvest mycotoxin specialist (NHRDF/DOGR).
Provide concise, practical, actionable guidance on onion cultivation, drip irrigation, thrips/fungal control, curing, and preventing Aspergillus niger / Ochratoxin A spoilage.
Respond exclusively in ${langLabel}. Keep response clear and structured in 3-5 short bullet points.`,
        },
      });

      res.json({ answer: response.text ?? '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Consultation service error.';
      console.error('Gemini expert error:', err);
      res.status(502).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PyazNet full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
