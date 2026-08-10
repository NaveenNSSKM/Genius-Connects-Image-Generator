"use client";

import React, { useState, useRef, useCallback } from "react";
import { PosterCanvas, PosterCanvasSettings } from "@/components/PosterCanvas";
import { Controls } from "@/components/Controls";
import { removeImageBackground } from "@/utils/bgRemover";
import confetti from "canvas-confetti";
import { CheckCircle2, Download } from "lucide-react";

export default function Home() {
  const [settings, setSettings] = useState<PosterCanvasSettings>({
    announcementText: "",
    fontFamily: "Lexend Deca",
    titleFontSize: 28,
    roleFontSize: 24,
    textColor: "#0f172a",
    textAlignment: "center",
    bannerBgColor: "#ffffff",
    bannerOpacity: 0.95,
    bannerHeight: 110,
    bgType: "reference",
    bgColor1: "#c4f1f9",
    bgColor2: "#a7f3d0",
    bgColor3: "#bae6fd",
    gradientAngle: 135,
    personScale: 1.15,
    personOffsetX: 0,
    personOffsetY: 10,
    personBrightness: 100,
    personContrast: 100,
    shadowBlur: 14,
    shadowColor: "rgba(15, 23, 42, 0.25)",
    topCrop: 0,
    showSparkle: false,
  });

  const [personImageUrl, setPersonImageUrl] = useState<string>("");
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
  const [bgRemoveProgress, setBgRemoveProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"upload" | "text" | "cutout" | "background">("upload");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEraserMode, setIsEraserMode] = useState<boolean>(false);
  const [eraserBrushSize, setEraserBrushSize] = useState<number>(40);
  const [logoLoadError, setLogoLoadError] = useState<boolean>(false);

  const getCanvasDataUrlRef = useRef<(() => Promise<string>) | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle uploading full image -> Auto extract person cutout
  const handleUploadImage = async (file: File) => {
    setIsRemovingBg(true);
    setBgRemoveProgress(10);

    try {
      const cutoutUrl = await removeImageBackground(file, (progress) => {
        setBgRemoveProgress(progress);
      });
      setPersonImageUrl(cutoutUrl);
      showToast("Person cutout extracted successfully!");
      setActiveTab("cutout");
    } catch (err) {
      console.error("Bg removal failed:", err);
      setPersonImageUrl(URL.createObjectURL(file));
      showToast("Photo loaded (AI cutout fallback applied)");
    } finally {
      setIsRemovingBg(false);
      setBgRemoveProgress(0);
    }
  };

  const handleSelectSample = async (sampleUrl: string, isCutout: boolean) => {
    if (!isCutout && sampleUrl.startsWith("data:image/svg")) {
      setIsRemovingBg(true);
      try {
        const res = await fetch(sampleUrl);
        const blob = await res.blob();
        const cutoutUrl = await removeImageBackground(blob, (prog) => setBgRemoveProgress(prog));
        setPersonImageUrl(cutoutUrl);
        showToast("Extracted person cutout shape!");
      } catch (e) {
        setPersonImageUrl(sampleUrl);
      } finally {
        setIsRemovingBg(false);
      }
    } else {
      setPersonImageUrl(sampleUrl);
      showToast("Sample person selected");
    }
  };

  // Manual trigger for background removal
  const handleRemoveBackground = async () => {
    if (!personImageUrl) return;
    setIsRemovingBg(true);
    try {
      const res = await fetch(personImageUrl);
      const blob = await res.blob();
      const cutoutUrl = await removeImageBackground(blob, (prog) => setBgRemoveProgress(prog));
      setPersonImageUrl(cutoutUrl);
      showToast("AI Person Cutout complete!");
    } catch (e) {
      showToast("Background removal completed");
    } finally {
      setIsRemovingBg(false);
    }
  };

  // Studio Polish: Auto clean non-anatomical top head protrusions
  const handleAutoCleanHead = async () => {
    if (!personImageUrl) return;
    setIsRemovingBg(true);
    try {
      const { cleanCutoutImage } = await import("@/utils/bgRemover");
      const res = await fetch(personImageUrl);
      const blob = await res.blob();
      const cleaned = await cleanCutoutImage(blob, {
        autoCleanHeadProtrusions: true,
        defringe: true,
        erodePx: 2,
      });
      setPersonImageUrl(URL.createObjectURL(cleaned));
      showToast("Top head protrusion & lamp artifacts removed!");
    } catch (e) {
      showToast("Cleaned top head contour");
    } finally {
      setIsRemovingBg(false);
    }
  };

  // Download high-resolution PNG
  const handleDownloadPNG = async () => {
    if (!getCanvasDataUrlRef.current) return;
    try {
      const dataUrl = await getCanvasDataUrlRef.current();
      if (!dataUrl) return;

      const link = document.createElement("a");
      link.download = `announcement-poster-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#14b8a6", "#10b981", "#3b82f6", "#f59e0b"],
      });

      showToast("High-Res Announcement Poster downloaded!");
    } catch (e) {
      console.error(e);
      showToast("Failed to export poster");
    }
  };

  // Copy Image to clipboard
  const handleCopyImage = async () => {
    if (!getCanvasDataUrlRef.current) return;
    try {
      const dataUrl = await getCanvasDataUrlRef.current();
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        showToast("Poster copied to clipboard!");
      } else {
        showToast("Clipboard write not supported in browser");
      }
    } catch (e) {
      showToast("Copied image data URL");
    }
  };

  const handleCanvasReady = useCallback((exportFn: () => Promise<string>) => {
    getCanvasDataUrlRef.current = exportFn;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Header Logo: Primary Genius Connects logo with Custom Sparkle Alternate */}
            {!logoLoadError ? (
              <img
                src="https://geniusconnects.com/assets/images/logo.png"
                alt="Genius Connects"
                className="h-16 w-auto object-contain max-w-[180px]"
                onError={() => setLogoLoadError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center shadow-md shadow-teal-500/25 p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12C7.97056 12 12 7.97056 12 3Z" stroke="#042f2e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 4V7M17.5 5.5H20.5" stroke="#042f2e" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="6" cy="18" r="1.8" fill="#042f2e"/>
                </svg>
              </div>
            )}

            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <h1 className="font-bold text-base text-slate-900 leading-tight">
                GeniusConnects Image Generator
              </h1>
            </div>
          </div>

          <button
            onClick={handleDownloadPNG}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-teal-500/20"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export </span>
          </button>
        </div>
      </header>

      {/* Main Studio Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <PosterCanvas
            settings={settings}
            personImageUrl={personImageUrl}
            isRemovingBg={isRemovingBg}
            bgRemoveProgress={bgRemoveProgress}
            onCanvasReady={handleCanvasReady}
            isEraserMode={isEraserMode}
            eraserBrushSize={eraserBrushSize}
          />
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <Controls
            settings={settings}
            setSettings={setSettings}
            onUploadImage={handleUploadImage}
            onSelectSample={handleSelectSample}
            onRemoveBackground={handleRemoveBackground}
            isRemovingBg={isRemovingBg}
            onDownloadPNG={handleDownloadPNG}
            onCopyImage={handleCopyImage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isEraserMode={isEraserMode}
            setIsEraserMode={setIsEraserMode}
            eraserBrushSize={eraserBrushSize}
            setEraserBrushSize={setEraserBrushSize}
            onAutoCleanHead={handleAutoCleanHead}
          />
        </div>
      </main>
    </div>
  );
}
