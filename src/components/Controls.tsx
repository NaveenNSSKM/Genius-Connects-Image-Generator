"use client";

import React from "react";
import { PosterCanvasSettings } from "./PosterCanvas";
import {
  Upload,
  Wand2,
  Sliders,
  Type,
  Palette,
  Download,
  Copy,
  Sparkles,
  RefreshCw,
  MoveHorizontal,
  MoveVertical,
  ZoomIn,
  Sun,
  Layers,
  Eraser,
  Scissors
} from "lucide-react";

interface ControlsProps {
  settings: PosterCanvasSettings;
  setSettings: React.Dispatch<React.SetStateAction<PosterCanvasSettings>>;
  onUploadImage: (file: File) => void;
  onSelectSample?: (sampleUrl: string, isCutout: boolean) => void;
  onRemoveBackground: () => void;
  isRemovingBg: boolean;
  onDownloadPNG: () => void;
  onCopyImage: () => void;
  activeTab: "upload" | "text" | "cutout" | "background";
  setActiveTab: (tab: "upload" | "text" | "cutout" | "background") => void;
  isEraserMode: boolean;
  setIsEraserMode: (val: boolean) => void;
  eraserBrushSize: number;
  setEraserBrushSize: (val: number) => void;
  onAutoCleanHead?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  settings,
  setSettings,
  onUploadImage,
  onRemoveBackground,
  isRemovingBg,
  onDownloadPNG,
  onCopyImage,
  activeTab,
  setActiveTab,
  isEraserMode,
  setIsEraserMode,
  eraserBrushSize,
  setEraserBrushSize,
  onAutoCleanHead,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl text-sm font-medium">
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
            activeTab === "upload"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-purple-300 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
            activeTab === "text"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-purple-300 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Type className="w-4 h-4" />
          <span className="hidden sm:inline">Text</span>
        </button>

        <button
          onClick={() => setActiveTab("cutout")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
            activeTab === "cutout"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-purple-300 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">Person</span>
        </button>

        <button
          onClick={() => setActiveTab("background")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
            activeTab === "background"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-purple-300 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Style</span>
        </button>
      </div>

      {/* Stable Tab Body Container (Prevents page shaking & layout shift) */}
      <div className="min-h-[460px] flex flex-col justify-start">
        {/* TAB 1: UPLOAD */}
        {activeTab === "upload" && (
          <div className="space-y-5 animate-fade-in flex-1">
            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-purple-500/40 hover:border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 hover:bg-purple-50/60 rounded-2xl p-8 cursor-pointer transition-all text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Upload Full Photo of Person
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, PNG, WEBP. AI will automatically extract the person cutout shape.
              </p>
            </label>

            <button
              onClick={onRemoveBackground}
              disabled={isRemovingBg}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/45 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Wand2 className="w-5 h-5" />
              <span>{isRemovingBg ? "AI Extracting Cutout..." : " Background Remover"}</span>
            </button>
          </div>
        )}

        {/* TAB 2: TEXT BANNER CUSTOMIZATION */}
        {activeTab === "text" && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Announcement Text:
            </label>
            <textarea
              rows={3}
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              placeholder="e.g. Enter your heading"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Font Style:
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm cursor-pointer"
            >
              <option value="Lexend Deca">Lexend Deca (Default - Modern Tech)</option>
              <option value="Helvetica Neue">Helvetica Neue (Classic Minimal)</option>
              <option value="Inter">Inter (Clean Corporate)</option>
              <option value="Outfit">Outfit (Geometric Modern)</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Sleek Tech)</option>
              <option value="Montserrat">Montserrat (Bold Modern)</option>
              <option value="Poppins">Poppins (Friendly Round)</option>
              <option value="Space Grotesk">Space Grotesk (Futuristic Tech)</option>
              <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
              <option value="Cinzel">Cinzel (Luxury Serif)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Text Size ({settings.titleFontSize}px)
              </label>
              <input
                type="range"
                min="18"
                max="48"
                value={settings.titleFontSize}
                onChange={(e) =>
                  setSettings({ ...settings, titleFontSize: Number(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Banner Height ({settings.bannerHeight}px)
              </label>
              <input
                type="range"
                min="70"
                max="180"
                value={settings.bannerHeight}
                onChange={(e) =>
                  setSettings({ ...settings, bannerHeight: Number(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {settings.textColor}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Banner Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.bannerBgColor}
                  onChange={(e) => setSettings({ ...settings, bannerBgColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {settings.bannerBgColor}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERSON CUTOUT CONTROLS */}
      {activeTab === "cutout" && (
        <div className="space-y-4 animate-fade-in">
          {/* Interactive Eraser Brush Toggle */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <Eraser className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Interactive Canvas Eraser Brush
              </span>
              <button
                onClick={() => setIsEraserMode(!isEraserMode)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  isEraserMode
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/25"
                    : "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-300"
                }`}
              >
                {isEraserMode ? "Eraser Active (Click Poster)" : "Enable Eraser Brush"}
              </button>
            </div>
            {isEraserMode && (
              <div>
                <label className="flex items-center justify-between text-[11px] text-purple-700 dark:text-purple-300 mb-1">
                  <span>Eraser Size ({eraserBrushSize}px)</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={eraserBrushSize}
                  onChange={(e) => setEraserBrushSize(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
                  Click and rub directly over head or hair edges on the canvas to erase white halo artifacts!
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-purple-500" /> Person Scale
                </span>
                <span>{settings.personScale.toFixed(2)}x</span>
              </label>
              <input
                type="range"
                min="0.4"
                max="2.2"
                step="0.05"
                value={settings.personScale}
                onChange={(e) =>
                  setSettings({ ...settings, personScale: parseFloat(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <MoveVertical className="w-3.5 h-3.5 text-purple-500" /> Vertical Position
                </span>
                <span>{settings.personOffsetY}px</span>
              </label>
              <input
                type="range"
                min="-250"
                max="250"
                step="5"
                value={settings.personOffsetY}
                onChange={(e) =>
                  setSettings({ ...settings, personOffsetY: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <MoveHorizontal className="w-3.5 h-3.5 text-purple-500" /> Horizontal Offset
                </span>
                <span>{settings.personOffsetX}px</span>
              </label>
              <input
                type="range"
                min="-300"
                max="300"
                step="5"
                value={settings.personOffsetX}
                onChange={(e) =>
                  setSettings({ ...settings, personOffsetX: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-500" /> Cutout Drop Shadow
                </span>
                <span>{settings.shadowBlur}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="40"
                step="2"
                value={settings.shadowBlur}
                onChange={(e) =>
                  setSettings({ ...settings, shadowBlur: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-purple-500" /> Brightness
                </span>
                <span>{settings.personBrightness}%</span>
              </label>
              <input
                type="range"
                min="70"
                max="140"
                step="2"
                value={settings.personBrightness}
                onChange={(e) =>
                  setSettings({ ...settings, personBrightness: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-purple-500" /> Contrast
                </span>
                <span>{settings.personContrast}%</span>
              </label>
              <input
                type="range"
                min="70"
                max="140"
                step="2"
                value={settings.personContrast}
                onChange={(e) =>
                  setSettings({ ...settings, personContrast: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                <Scissors className="w-3.5 h-3.5" /> Trim Top Head Artifacts (Arc Removal)
              </span>
              <span>{settings.topCrop}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={settings.topCrop}
              onChange={(e) =>
                setSettings({ ...settings, topCrop: parseInt(e.target.value) })
              }
              className="w-full accent-purple-600"
            />
          </div>

          {onAutoCleanHead && (
            <button
              onClick={onAutoCleanHead}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 text-white py-3 px-5 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-purple-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Auto-Remove Top Background Fixture / Lamp Protrusion</span>
            </button>
          )}

          <button
            onClick={() =>
              setSettings({
                ...settings,
                personScale: 1.0,
                personOffsetX: 0,
                personOffsetY: 0,
                personBrightness: 100,
                personContrast: 100,
                shadowBlur: 15,
                topCrop: 0,
              })
            }
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Position & Filters</span>
          </button>
        </div>
      )}

      {/* TAB 4: TEMPLATE & BACKGROUND STYLING */}
      {activeTab === "background" && (
        <div className="space-y-6 animate-fade-in">
          {/* Template Preset Options */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
              Template Preset Options
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Preset 1: Royal Violet CTA */}
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    bgType: "gradient",
                    bgColor1: "#4f46e5",
                    bgColor2: "#8b5cf6",
                    bgColor3: "#a855f7",
                    gradientAngle: 135,
                  })
                }
                className={`group flex flex-col p-2.5 rounded-xl border transition-all text-center ${
                  settings.bgType === "gradient" && settings.bgColor1 === "#4f46e5"
                    ? "border-purple-500 bg-purple-500/10 shadow-sm ring-2 ring-purple-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500 border border-slate-200/60 shadow-inner mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Royal Violet (CTA Theme)
                </span>
              </button>

              {/* Preset 2: Ocean Gradient */}
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    bgType: "gradient",
                    bgColor1: "#86efac",
                    bgColor2: "#34d399",
                    gradientAngle: 135,
                  })
                }
                className={`group flex flex-col p-2.5 rounded-xl border transition-all text-center ${
                  settings.bgType === "gradient" && settings.bgColor1 === "#86efac"
                    ? "border-teal-500 bg-teal-500/10 shadow-sm ring-2 ring-teal-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-gradient-to-r from-emerald-300 to-green-400 border border-slate-200/60 shadow-inner mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  Ocean Gradient
                </span>
              </button>

              {/* Preset 3: Pastel Glow */}
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    bgType: "gradient",
                    bgColor1: "#fbcfe8",
                    bgColor2: "#fef08a",
                    gradientAngle: 135,
                  })
                }
                className={`group flex flex-col p-2.5 rounded-xl border transition-all text-center ${
                  settings.bgType === "gradient" && settings.bgColor1 === "#fbcfe8"
                    ? "border-teal-500 bg-teal-500/10 shadow-sm ring-2 ring-teal-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-gradient-to-r from-pink-200 to-yellow-100 border border-slate-200/60 shadow-inner mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  Pastel Glow
                </span>
              </button>

              {/* Preset 4: Dark Cyber */}
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    bgType: "gradient",
                    bgColor1: "#0f172a",
                    bgColor2: "#1e293b",
                    gradientAngle: 135,
                  })
                }
                className={`group flex flex-col p-2.5 rounded-xl border transition-all text-center ${
                  settings.bgType === "gradient" && settings.bgColor1 === "#0f172a"
                    ? "border-teal-500 bg-teal-500/10 shadow-sm ring-2 ring-teal-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 shadow-inner mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  Dark Cyber
                </span>
              </button>

              {/* Preset 5: Corporate Gold */}
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    bgType: "gradient",
                    bgColor1: "#fde047",
                    bgColor2: "#fef08a",
                    gradientAngle: 135,
                  })
                }
                className={`group flex flex-col p-2.5 rounded-xl border transition-all text-center ${
                  settings.bgType === "gradient" && settings.bgColor1 === "#fde047"
                    ? "border-teal-500 bg-teal-500/10 shadow-sm ring-2 ring-teal-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-gradient-to-r from-yellow-200 to-amber-100 border border-slate-200/60 shadow-inner mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  Corporate Gold
                </span>
              </button>

              {/* Preset 6: Custom Color */}
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    bgType: "gradient",
                  })
                }
                className={`group flex flex-col p-2.5 rounded-xl border transition-all text-center ${
                  settings.bgType === "gradient" &&
                  settings.bgColor1 !== "#0f172a" &&
                  settings.bgColor1 !== "#86efac" &&
                  settings.bgColor1 !== "#fbcfe8" &&
                  settings.bgColor1 !== "#fde047"
                    ? "border-teal-500 bg-teal-500/10 shadow-sm ring-2 ring-teal-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div
                  className="w-full h-12 rounded-lg border border-slate-200/60 shadow-inner mb-2"
                  style={{
                    background: `linear-gradient(to right, ${settings.bgColor1}, ${settings.bgColor2})`,
                  }}
                />
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  Custom Color
                </span>
              </button>
            </div>
          </div>

          {/* CUSTOM BACKGROUND COLORS */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              CUSTOM BACKGROUND COLORS
            </label>

            <div className="flex items-center gap-8">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Primary Glow
                </span>
                <input
                  type="color"
                  value={settings.bgColor1}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bgType: "gradient",
                      bgColor1: e.target.value,
                    })
                  }
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer p-0.5 bg-white dark:bg-slate-700 shadow-sm"
                />
              </div>

              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Outer Ambient
                </span>
                <input
                  type="color"
                  value={settings.bgColor2}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bgType: "gradient",
                      bgColor2: e.target.value,
                    })
                  }
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer p-0.5 bg-white dark:bg-slate-700 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* EXPORT & ACTION BUTTONS */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onDownloadPNG}
          className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/45 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group text-sm"
        >
          <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download High-Res PNG</span>
        </button>

        <button
          onClick={onCopyImage}
          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3.5 px-6 rounded-full border border-slate-200 dark:border-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Image</span>
        </button>
      </div>
    </div>
  );
};
