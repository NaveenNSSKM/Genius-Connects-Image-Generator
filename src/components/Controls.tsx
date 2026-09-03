"use client";

import React from "react";
import { PosterCanvasSettings } from "./PosterCanvas";
import { removeLogoWhiteBackground } from "@/utils/bgRemover";
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
  Scissors,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Building2,
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
  onUploadRightLogo?: (file: File) => void;
  isRemovingRightLogoBg?: boolean;
  onRemoveRightLogoBg?: () => void;
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
  onUploadRightLogo,
  isRemovingRightLogoBg = false,
  onRemoveRightLogoBg,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  const handleLeftLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await removeLogoWhiteBackground(file);
        setSettings((prev) => ({ ...prev, leftLogoUrl: url, showLeftLogo: true }));
      } catch (err) {
        const url = URL.createObjectURL(file);
        setSettings((prev) => ({ ...prev, leftLogoUrl: url, showLeftLogo: true }));
      }
    }
  };

  const handleResetLeftLogo = () => {
    setSettings((prev) => ({ ...prev, leftLogoUrl: "/templates/logo.png", showLeftLogo: true }));
  };

  const handleRightLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (onUploadRightLogo) {
        onUploadRightLogo(file);
      } else {
        const url = URL.createObjectURL(file);
        setSettings((prev) => ({ ...prev, rightLogoUrl: url, showRightLogo: true }));
      }
    }
  };

  const handleRemoveRightLogo = () => {
    setSettings((prev) => ({ ...prev, rightLogoUrl: "", showRightLogo: false }));
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

            {/* Quick Upload for Partner/Organization Logo */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Top-Right Partner Logo (Auto BG Removal)
                </span>
                {settings.rightLogoUrl && !isRemovingRightLogoBg && (
                  <button
                    onClick={handleRemoveRightLogo}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
              <label className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 rounded-xl cursor-pointer transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleRightLogoChange}
                  disabled={isRemovingRightLogoBg}
                />
                <div className="flex items-center gap-2.5">
                  {isRemovingRightLogoBg ? (
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 flex items-center justify-center animate-spin">
                      <Wand2 className="w-4 h-4" />
                    </div>
                  ) : settings.rightLogoUrl ? (
                    <img
                      src={settings.rightLogoUrl}
                      alt="Partner Logo"
                      className="w-8 h-8 object-contain rounded bg-white p-0.5 border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                      <Upload className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {isRemovingRightLogoBg
                        ? "Removing Background..."
                        : settings.rightLogoUrl
                        ? "Partner Logo Attached (Transparent)"
                        : "Upload Top-Right Partner Logo"}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isRemovingRightLogoBg
                        ? "AI is extracting transparent logo cutout..."
                        : settings.rightLogoUrl
                        ? "Click to change logo"
                        : "Background will be removed automatically"}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 group-hover:underline">
                  {isRemovingRightLogoBg ? "Processing..." : settings.rightLogoUrl ? "Change" : "Browse"}
                </span>
              </label>
            </div>
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
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm mb-3"
              placeholder="e.g. Enter your heading"
            />
            
            <div className="bg-indigo-50/50 dark:bg-slate-800/80 p-3 rounded-xl border border-indigo-100 dark:border-slate-700 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-tight">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Pro Tip:</span> Highlight words by adding <code className="bg-white dark:bg-slate-700 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-300">$</code> before a word for a gradient, or <code className="bg-white dark:bg-slate-700 px-1 py-0.5 rounded text-blue-600 dark:text-blue-300">_</code> for a solid color!
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 truncate" title="Gradient Start ($)">Grad Start ($)</label>
                  <input
                    type="color"
                    value={settings.highlightGradient1 || "#10b981"}
                    onChange={(e) => setSettings({ ...settings, highlightGradient1: e.target.value })}
                    className="w-full h-7 rounded cursor-pointer border border-slate-200 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 truncate" title="Gradient End ($)">Grad End ($)</label>
                  <input
                    type="color"
                    value={settings.highlightGradient2 || "#059669"}
                    onChange={(e) => setSettings({ ...settings, highlightGradient2: e.target.value })}
                    className="w-full h-7 rounded cursor-pointer border border-slate-200 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 truncate" title="Solid Color (_)">Solid Color (_)</label>
                  <input
                    type="color"
                    value={settings.highlightColor || "#3b82f6"}
                    onChange={(e) => setSettings({ ...settings, highlightColor: e.target.value })}
                    className="w-full h-7 rounded cursor-pointer border border-slate-200 dark:border-slate-600"
                  />
                </div>
              </div>
            </div>
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
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex justify-between">
                <span>Text Vertical Position</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{settings.textOffsetY > 0 ? `+${settings.textOffsetY}` : settings.textOffsetY}px</span>
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={settings.textOffsetY}
                onChange={(e) =>
                  setSettings({ ...settings, textOffsetY: Number(e.target.value) })
                }
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex justify-between">
                <span>Text Max Width</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{settings.textMaxWidth === 0 ? "Auto" : `${settings.textMaxWidth}px`}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={settings.textMaxWidth}
                onChange={(e) =>
                  setSettings({ ...settings, textMaxWidth: Number(e.target.value) })
                }
                className="w-full accent-purple-600"
                title="Set to 0 for automatic width"
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

          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
              <span>Banner Card Opacity</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{Math.round(settings.bannerOpacity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(settings.bannerOpacity * 100)}
              onChange={(e) =>
                setSettings({ ...settings, bannerOpacity: Number(e.target.value) / 100 })
              }
              className="w-full accent-purple-600 cursor-pointer"
            />
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
          {/* HEADER LOGOS & BRANDING (LEFT & RIGHT) - NOW AT TOP */}
          <div className="p-4 bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/50 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Header Logos & Movable Alignment
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Individually adjust size and X/Y positions for Left (default) & Right logos.
                </p>
              </div>
              {(settings.leftLogoOffsetX || settings.leftLogoOffsetY || settings.rightLogoOffsetX || settings.rightLogoOffsetY) ? (
                <button
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      leftLogoOffsetX: 0,
                      leftLogoOffsetY: 0,
                      rightLogoOffsetX: 0,
                      rightLogoOffsetY: 0,
                    }))
                  }
                  className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
                  title="Reset both logos to default positions"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Positions</span>
                </button>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Left Logo Card */}
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Left Logo (Public Default)
                  </span>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        showLeftLogo: prev.showLeftLogo !== false ? false : true,
                      }))
                    }
                    title={settings.showLeftLogo !== false ? "Hide Left Logo" : "Show Left Logo"}
                    className="text-slate-500 hover:text-purple-600 p-1 rounded-md transition-colors"
                  >
                    {settings.showLeftLogo !== false ? (
                      <Eye className="w-3.5 h-3.5 text-purple-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="h-14 bg-slate-50 dark:bg-slate-900/60 rounded-lg flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                  <img
                    src={settings.leftLogoUrl || "/templates/logo.png"}
                    alt="Left Logo"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <label className="flex-1 text-center bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 text-[11px] font-semibold py-1 px-2 rounded-lg cursor-pointer transition-colors truncate">
                    <span>Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLeftLogoChange}
                    />
                  </label>
                  {settings.leftLogoUrl && settings.leftLogoUrl !== "/templates/logo.png" && (
                    <button
                      onClick={handleResetLeftLogo}
                      title="Reset to Public Logo"
                      className="p-1 text-slate-500 hover:text-purple-600 bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Logo Card */}
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Right Logo (Dynamic Partner)
                  </span>
                  {settings.rightLogoUrl && !isRemovingRightLogoBg && (
                    <button
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          showRightLogo: prev.showRightLogo !== false ? false : true,
                        }))
                      }
                      title={settings.showRightLogo !== false ? "Hide Right Logo" : "Show Right Logo"}
                      className="text-slate-500 hover:text-purple-600 p-1 rounded-md transition-colors"
                    >
                      {settings.showRightLogo !== false ? (
                        <Eye className="w-3.5 h-3.5 text-purple-600" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>

                {isRemovingRightLogoBg ? (
                  <div className="h-14 bg-purple-50 dark:bg-purple-950/40 rounded-lg flex flex-col items-center justify-center p-2 border border-purple-200 dark:border-purple-800 text-purple-600 animate-pulse">
                    <Wand2 className="w-5 h-5 animate-spin mb-1" />
                    <span className="text-[10px] font-semibold">Removing Background...</span>
                  </div>
                ) : settings.rightLogoUrl ? (
                  <>
                    <div className="h-14 bg-slate-50 dark:bg-slate-900/60 rounded-lg flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                      <img
                        src={settings.rightLogoUrl}
                        alt="Right Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <label className="flex-1 text-center bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 text-[11px] font-semibold py-1 px-2 rounded-lg cursor-pointer transition-colors truncate">
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleRightLogoChange}
                        />
                      </label>
                      {onRemoveRightLogoBg && (
                        <button
                          onClick={onRemoveRightLogoBg}
                          title="Re-run AI Background Remover"
                          className="p-1.5 text-purple-600 hover:text-purple-800 bg-purple-100 dark:bg-purple-900/40 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-semibold"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Clean BG</span>
                        </button>
                      )}
                      <button
                        onClick={handleRemoveRightLogo}
                        title="Remove Right Logo"
                        className="p-1 text-rose-500 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="h-[92px] border-2 border-dashed border-purple-300 dark:border-purple-700/60 hover:border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 hover:bg-purple-50/60 rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer transition-all text-center group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleRightLogoChange}
                    />
                    <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-[11px] font-bold text-purple-900 dark:text-purple-300 leading-tight">
                      + Upload Partner Logo
                    </span>
                    <span className="text-[9px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                      Auto BG Removal Enabled
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Individual Logo Sizing Controls */}
            <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Logo Sizes
                </span>
                <button
                  onClick={() => {
                    const currentLeft = settings.leftLogoSize || settings.logoSize || 85;
                    setSettings((prev) => ({
                      ...prev,
                      leftLogoSize: currentLeft,
                      rightLogoSize: currentLeft,
                      logoSize: currentLeft,
                    }));
                  }}
                  className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100/70 dark:bg-purple-900/40 px-2 py-0.5 rounded-md hover:bg-purple-200 transition-colors"
                  title="Make Left and Right logos exact same size"
                >
                  Sync Both Sizes
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Left Logo Size</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{settings.leftLogoSize || settings.logoSize || 85}px</span>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="260"
                    step="2"
                    value={settings.leftLogoSize || settings.logoSize || 85}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSettings((prev) => ({ ...prev, leftLogoSize: val }));
                    }}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Right Logo Size</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{settings.rightLogoSize || settings.logoSize || 85}px</span>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="260"
                    step="2"
                    value={settings.rightLogoSize || settings.logoSize || 85}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSettings((prev) => ({ ...prev, rightLogoSize: val }));
                    }}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Individual Logo Movable Positioning Controls */}
            <div className="pt-3 border-t border-purple-100 dark:border-purple-900/40 space-y-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Individual Movable Logo Alignment (X/Y Offsets)
              </span>

              {/* Left Logo Movable Position Controls */}
              <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <MoveHorizontal className="w-3.5 h-3.5 text-indigo-500" />
                    Left Logo Position
                  </span>
                  {(settings.leftLogoOffsetX || settings.leftLogoOffsetY) ? (
                    <button
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          leftLogoOffsetX: 0,
                          leftLogoOffsetY: 0,
                        }))
                      }
                      className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Left
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      <span>Horizontal (X)</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {settings.leftLogoOffsetX || 0}px
                      </span>
                    </label>
                    <input
                      type="range"
                      min="-200"
                      max="600"
                      step="5"
                      value={settings.leftLogoOffsetX || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSettings((prev) => ({ ...prev, leftLogoOffsetX: val }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      <span>Vertical (Y)</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {settings.leftLogoOffsetY || 0}px
                      </span>
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="400"
                      step="5"
                      value={settings.leftLogoOffsetY || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSettings((prev) => ({ ...prev, leftLogoOffsetY: val }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Right Logo Movable Position Controls */}
              <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <MoveHorizontal className="w-3.5 h-3.5 text-purple-500" />
                    Right Logo Position
                  </span>
                  {(settings.rightLogoOffsetX || settings.rightLogoOffsetY) ? (
                    <button
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          rightLogoOffsetX: 0,
                          rightLogoOffsetY: 0,
                        }))
                      }
                      className="text-[10px] font-semibold text-slate-500 hover:text-purple-600 flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Right
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      <span>Horizontal (X)</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {settings.rightLogoOffsetX || 0}px
                      </span>
                    </label>
                    <input
                      type="range"
                      min="-600"
                      max="200"
                      step="5"
                      value={settings.rightLogoOffsetX || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSettings((prev) => ({ ...prev, rightLogoOffsetX: val }));
                      }}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      <span>Vertical (Y)</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {settings.rightLogoOffsetY || 0}px
                      </span>
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="400"
                      step="5"
                      value={settings.rightLogoOffsetY || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSettings((prev) => ({ ...prev, rightLogoOffsetY: val }));
                      }}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-2">
              💡 Tip: Use Horizontal (X) and Vertical (Y) sliders to freely position both Left (default) and Right logos anywhere on top of your poster!
            </p>
          </div>

          {/* POSTER LAYOUT OPTIONS - 3 per row (3 + 3 = 6 items total) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
              Poster Layout
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Option 0: Dual Logo Template (Reference Layout Pattern with Dynamic Logos) */}
              <button
                onClick={() => {
                  setSettings({
                    ...settings,
                    layoutMode: "dual-logo",
                    bgType: "gradient",
                    bgColor1: "#a7f3d0",
                    bgColor2: "#c4f1f9",
                    gradientAngle: 135,
                    showLeftLogo: true,
                    leftLogoUrl: settings.leftLogoUrl || "/templates/logo.png",
                    showRightLogo: true,
                    bannerBgColor: "#ffffff",
                    bannerOpacity: 1,
                    bannerHeight: 110,
                  });
                }}
                className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all text-center ${
                  settings.layoutMode === "dual-logo"
                    ? "border-purple-600 bg-purple-500/10 shadow-sm ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full aspect-[16/10] bg-gradient-to-tr from-emerald-100 to-cyan-100 rounded-lg flex flex-col justify-between p-1 border border-slate-300 dark:border-slate-600 mb-2 relative overflow-hidden">
                  <div className="flex justify-between items-center w-full px-0.5 pt-0.5">
                    <div className="w-2.5 h-1.5 bg-indigo-600 rounded-[2px]" />
                    <div className="w-2.5 h-1.5 bg-purple-600 rounded-[2px]" />
                  </div>
                  <div className="w-3 h-3 bg-slate-400/80 rounded-full mx-auto" />
                  <div className="w-full h-1.5 bg-white rounded-xs border border-slate-200" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Dual Logo
                </span>
              </button>

              {/* Option 1: Classic (Bottom Banner) */}
              <button
                onClick={() => {
                  const nextSettings = { ...settings, layoutMode: "classic" as const };
                  if (nextSettings.bgType === "reference") nextSettings.bgType = "gradient";
                  setSettings(nextSettings);
                }}
                className={`flex flex-col items-center justify-between p-3 rounded-xl border transition-all text-center ${
                  settings.layoutMode === "classic"
                    ? "border-purple-600 bg-purple-500/10 shadow-sm ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-700 rounded-lg flex flex-col justify-end p-1 border border-slate-300 dark:border-slate-600 mb-2">
                  <div className="w-1/3 h-1/2 bg-slate-400 dark:bg-slate-500 rounded mx-auto mb-1" />
                  <div className="w-full h-2 bg-slate-600 dark:bg-slate-400 rounded-xs" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Bottom Banner
                </span>
              </button>

              {/* Option 2: Left Image, Right Text */}
              <button
                onClick={() => {
                  const nextSettings = { ...settings, layoutMode: "left-image" as const };
                  if (nextSettings.bgType === "reference") nextSettings.bgType = "gradient";
                  setSettings(nextSettings);
                }}
                className={`flex flex-col items-center justify-between p-3 rounded-xl border transition-all text-center ${
                  settings.layoutMode === "left-image"
                    ? "border-purple-600 bg-purple-500/10 shadow-sm ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-700 rounded-lg flex p-1 border border-slate-300 dark:border-slate-600 gap-1 mb-2">
                  <div className="w-1/2 h-full bg-slate-400 dark:bg-slate-500 rounded flex items-end justify-center">
                    <div className="w-2/3 h-4/5 bg-slate-500 dark:bg-slate-600 rounded-t" />
                  </div>
                  <div className="w-1/2 h-full flex flex-col justify-center gap-1.5 p-0.5">
                    <div className="w-full h-1 bg-slate-600 dark:bg-slate-400 rounded-xs" />
                    <div className="w-5/6 h-1 bg-slate-600 dark:bg-slate-400 rounded-xs" />
                    <div className="w-2/3 h-1 bg-slate-600 dark:bg-slate-400 rounded-xs" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Left Image
                </span>
              </button>

              {/* Option 3: Right Image, Left Text */}
              <button
                onClick={() => {
                  const nextSettings = { ...settings, layoutMode: "right-image" as const };
                  if (nextSettings.bgType === "reference") nextSettings.bgType = "gradient";
                  setSettings(nextSettings);
                }}
                className={`flex flex-col items-center justify-between p-3 rounded-xl border transition-all text-center ${
                  settings.layoutMode === "right-image"
                    ? "border-purple-600 bg-purple-500/10 shadow-sm ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-700 rounded-lg flex p-1 border border-slate-300 dark:border-slate-600 gap-1 mb-2">
                  <div className="w-1/2 h-full flex flex-col justify-center gap-1.5 p-0.5">
                    <div className="w-full h-1 bg-slate-600 dark:bg-slate-400 rounded-xs" />
                    <div className="w-5/6 h-1 bg-slate-600 dark:bg-slate-400 rounded-xs" />
                    <div className="w-2/3 h-1 bg-slate-600 dark:bg-slate-400 rounded-xs" />
                  </div>
                  <div className="w-1/2 h-full bg-slate-400 dark:bg-slate-500 rounded flex items-end justify-center">
                    <div className="w-2/3 h-4/5 bg-slate-500 dark:bg-slate-600 rounded-t" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Right Image
                </span>
              </button>

              {/* Option 3.5: Clean Split Left Text */}
              <button
                onClick={() => {
                  setSettings({
                    ...settings,
                    layoutMode: "split-clean-left",
                    textAlignment: "left",
                    bgType: "split-clean-template"
                  });
                }}
                className={`flex flex-col items-center justify-between p-3 rounded-xl border transition-all text-center ${
                  settings.layoutMode === "split-clean-left"
                    ? "border-purple-600 bg-purple-500/10 shadow-sm ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-700 rounded-lg flex p-1 border border-slate-300 dark:border-slate-600 gap-1 mb-2">
                  <div className="w-1/2 h-full flex flex-col justify-center gap-1.5 p-1">
                    <div className="w-full h-1.5 bg-slate-700 dark:bg-slate-300 rounded-xs" />
                    <div className="w-2/3 h-1.5 bg-slate-700 dark:bg-slate-300 rounded-xs" />
                    <div className="w-full h-1 bg-slate-500 dark:bg-slate-400 rounded-xs mt-1" />
                    <div className="w-4/5 h-1 bg-slate-500 dark:bg-slate-400 rounded-xs" />
                  </div>
                  <div className="w-1/2 h-full bg-slate-400 dark:bg-slate-500 rounded flex items-end justify-center">
                    <div className="w-2/3 h-4/5 bg-slate-500 dark:bg-slate-600 rounded-t" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Clean Split
                </span>
              </button>

              {/* Option 4: Reference Template Layout */}
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    layoutMode: "circle-banner",
                    bgType: "reference",
                  })
                }
                className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all text-center ${
                  settings.layoutMode === "circle-banner" || settings.bgType === "reference"
                    ? "border-purple-600 bg-purple-500/10 shadow-sm ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full aspect-[5/4] rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 mb-2 shadow-xs bg-slate-100">
                  <img
                    src="/templates/poster-layout-1.png"
                    alt="Reference Poster Layout"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Reference Layout
                </span>
              </button>
            </div>
          </div>

          {/* Template Preset Options */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
              Template Preset Options
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Preset 1: Reference Cyan Glow */}
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    bgType: "reference",
                    bgColor1: "#c4f1f9",
                    bgColor2: "#a7f3d0",
                  })
                }
                className={`group flex flex-col p-2.5 rounded-xl border transition-all text-center ${
                  settings.bgType === "reference"
                    ? "border-purple-500 bg-purple-500/10 shadow-sm ring-2 ring-purple-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400"
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-gradient-to-tr from-cyan-200 via-teal-200 to-yellow-100 border border-slate-200/60 shadow-inner mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Reference Cyan Glow
                </span>
              </button>

              {/* Preset 2: Royal Violet CTA */}
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
                  Royal Violet
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
