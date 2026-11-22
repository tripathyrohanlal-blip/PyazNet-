import React, { useRef, useState } from 'react';
import {
  Camera,
  Upload,
  ScanLine,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, VisionAnalysisResult } from '../types';

interface VisionScannerProps {
  mode: 'ochratoxin' | 'pest' | 'buyer_adulteration';
  language: Language;
  token: string;
}

const SAMPLE_ASSETS: Record<VisionScannerProps['mode'], { label: string; src: string }> = {
  ochratoxin: {
    label: 'Lab Onion Cross-Section & Scale Sample',
    src: '/src/assets/images/agri_lab_sample_1795352576270.jpg',
  },
  pest: {
    label: 'Cured Red Onion Bulb & Neck Lot',
    src: '/src/assets/images/onion_grade_a_1795352574668.jpg',
  },
  buyer_adulteration: {
    label: 'Retail White & Red Onion Basket',
    src: '/src/assets/images/onion_white_produce_1795352575084.jpg',
  },
};

export const VisionScanner: React.FC<VisionScannerProps> = ({ mode, language, token }) => {
  const t = TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<VisionAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title =
    mode === 'ochratoxin'
      ? t.vision.ochratoxinTitle
      : mode === 'pest'
        ? t.vision.pestTitle
        : t.vision.buyerTitle;

  const subtitle =
    mode === 'ochratoxin'
      ? t.vision.ochratoxinSubtitle
      : mode === 'pest'
        ? t.vision.pestSubtitle
        : t.vision.buyerSubtitle;

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setError('Camera permission unavailable in browser. Upload a high-res photo or load the reference specimen below.');
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }

  function captureFrame() {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 960;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewUrl(dataUrl);
    setMimeType('image/jpeg');
    setResult(null);
    stopCamera();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResult(null);
    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function loadSampleSpecimen() {
    setError(null);
    setResult(null);
    const sample = SAMPLE_ASSETS[mode];
    try {
      const res = await fetch(sample.src);
      const blob = await res.blob();
      setMimeType(blob.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      setError('Could not load specimen image.');
    }
  }

  async function runAnalysis() {
    if (!previewUrl) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/vision/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageBase64: previewUrl,
          mimeType,
          mode,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Vision ML service failed.');
        return;
      }
      setResult(data as VisionAnalysisResult);
    } catch {
      setError('Network error while running ML analysis.');
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#111815]">{title}</h2>
        <p className="text-sm text-[#526056] mt-1 max-w-3xl">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Optical Viewfinder & Controls */}
        <div className="lg:col-span-7 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            {!cameraOpen ? (
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{t.vision.startCamera}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={captureFrame}
                  className="px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>{t.vision.captureFrame}</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3 py-2 rounded-lg border border-[#D4DBD1] text-[#111815] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{t.vision.stopCamera}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-[#D4DBD1] hover:border-emerald-700 bg-white text-[#111815] text-xs font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>{t.vision.uploadPhoto}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={loadSampleSpecimen}
              className="px-4 py-2 rounded-lg border border-[#D4DBD1] hover:border-emerald-700 bg-[#F6F8F5] text-[#2F3A32] text-xs font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <span>{t.vision.useSample}</span>
            </button>
          </div>

          {/* Optical Viewport */}
          <div className="relative w-full aspect-[16/10] bg-[#141C17] rounded-lg overflow-hidden border border-[#29372E] flex items-center justify-center">
            {cameraOpen ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Produce specimen ready for ML inspection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain bg-[#111815]"
              />
            ) : (
              <div className="text-center px-6 py-8 text-neutral-300 space-y-2">
                <ScanLine className="w-10 h-10 mx-auto text-emerald-400" />
                <p className="text-sm font-medium text-white">Optical ML Inspection Frame Ready</p>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  {SAMPLE_ASSETS[mode].label} · Capture from camera, upload a crisp photo, or load the reference specimen.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="text-xs text-[#526056]">
              <span>Gemini Multimodal Vision</span>
              <span aria-hidden="true"> · </span>
              <span>{mode === 'ochratoxin' ? 'Aspergillus niger / Ochratoxin A' : mode === 'pest' ? 'Pathology & Thrips' : 'Dye, Bleaching & Borers'}</span>
            </div>

            <button
              type="button"
              disabled={!previewUrl || analyzing}
              onClick={runAnalysis}
              className="px-5 py-2.5 rounded-lg bg-[#111815] hover:bg-[#24332B] disabled:opacity-45 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>{analyzing ? t.vision.analyzing : t.vision.analyzeBtn}</span>
            </button>
          </div>
        </div>

        {/* Right Diagnostic Report */}
        <div className="lg:col-span-5 bg-white border border-[#DFE4DC] rounded-xl p-6 space-y-5">
          {!result && !analyzing && (
            <div className="py-12 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-[#8B988F] mx-auto" />
              <div className="text-sm font-semibold text-[#111815]">Awaiting Optical Sample</div>
              <p className="text-xs text-[#526056] max-w-xs mx-auto leading-relaxed">
                Capture or load an image on the left and run ML analysis to inspect mycotoxin risk, pest markers, and market clearance.
              </p>
            </div>
          )}

          {analyzing && (
            <div className="py-12 space-y-4">
              <div className="h-4 bg-[#EAEFEA] rounded w-2/3 animate-pulse" />
              <div className="h-20 bg-[#F2F5F1] rounded animate-pulse" />
              <div className="h-4 bg-[#EAEFEA] rounded w-1/2 animate-pulse" />
              <div className="h-24 bg-[#F2F5F1] rounded animate-pulse" />
            </div>
          )}

          {result && !analyzing && (
            <div className="space-y-5">
              <div className="pb-4 border-b border-[#EAEFEA] flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-[#526056]">{t.vision.riskLevel}</div>
                  <h3 className="font-display text-xl font-bold text-[#111815] mt-0.5">
                    {result.classification}
                  </h3>
                </div>
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold shrink-0 ${
                    result.riskLevel === 'CRITICAL'
                      ? 'text-red-700'
                      : result.riskLevel === 'MODERATE'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                  }`}
                >
                  {result.riskLevel === 'LOW' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>{result.riskLevel}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-[#F6F8F5] border border-[#E2E7DF]">
                  <div className="text-xs text-[#526056]">{t.vision.confidence}</div>
                  <div className="text-xl font-bold text-[#111815] font-mono-nums mt-0.5">
                    {Math.round(result.confidencePct)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#F6F8F5] border border-[#E2E7DF]">
                  <div className="text-xs text-[#526056]">{t.vision.affectedArea}</div>
                  <div className="text-xl font-bold text-[#111815] font-mono-nums mt-0.5">
                    {Number(result.affectedAreaPct).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  result.safeForMarket
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {result.safeForMarket ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                )}
                <span>{result.safeForMarket ? t.vision.safeMarket : t.vision.quarantineRequired}</span>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#526056] mb-1">Summary</div>
                <p className="text-sm text-[#1E2923] leading-relaxed">{result.summary}</p>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#526056] mb-1.5">{t.vision.markers}</div>
                <ul className="space-y-1 text-xs text-[#2F3A32]">
                  {result.markersDetected.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-[#526056]">0{idx + 1}.</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#EAEFEA]">
                <div className="text-xs font-semibold text-[#526056] mb-1.5">{t.vision.actions}</div>
                <ul className="space-y-1.5 text-xs text-[#111815]">
                  {result.actionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">→</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
