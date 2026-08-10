"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface PosterCanvasSettings {
  // Text content
  announcementText: string;
  // Typography
  fontFamily: string;
  titleFontSize: number;
  roleFontSize: number;
  textColor: string;
  textAlignment: "center" | "left" | "right";
  // Banner background
  bannerBgColor: string;
  bannerOpacity: number;
  bannerHeight: number;
  // Poster overall background
  bgType: "reference" | "gradient" | "solid" | "mesh";
  bgColor1: string;
  bgColor2: string;
  bgColor3: string;
  gradientAngle: number;
  // Person Cutout positioning & adjustments
  personScale: number;
  personOffsetX: number;
  personOffsetY: number;
  personBrightness: number;
  personContrast: number;
  shadowBlur: number;
  shadowColor: string;
  topCrop: number; // Crop top head artifacts (0 to 80px)
  showSparkle: boolean;
}

interface PosterCanvasProps {
  settings: PosterCanvasSettings;
  personImageUrl: string;
  isRemovingBg?: boolean;
  bgRemoveProgress?: number;
  onCanvasReady?: (exportFn: () => Promise<string>) => void;
  isEraserMode?: boolean;
  eraserBrushSize?: number;
  onResetEraser?: () => void;
}

export const PosterCanvas: React.FC<PosterCanvasProps> = ({
  settings,
  personImageUrl,
  isRemovingBg = false,
  bgRemoveProgress = 0,
  onCanvasReady,
  isEraserMode = false,
  eraserBrushSize = 40,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const eraserMaskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const personImgRef = useRef<HTMLImageElement | null>(null);

  const [isDrawingEraser, setIsDrawingEraser] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Initialize offscreen eraser mask canvas
  useEffect(() => {
    if (!eraserMaskCanvasRef.current) {
      const eCanvas = document.createElement("canvas");
      eCanvas.width = 1200;
      eCanvas.height = 750;
      eraserMaskCanvasRef.current = eCanvas;
    }
  }, []);

  // Load person cutout image
  useEffect(() => {
    if (!personImageUrl) return;
    setImageLoaded(false);

    // Clear eraser mask on new image
    if (eraserMaskCanvasRef.current) {
      const eCtx = eraserMaskCanvasRef.current.getContext("2d");
      if (eCtx) eCtx.clearRect(0, 0, 1200, 750);
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      personImgRef.current = img;
      setImageLoaded(true);
    };
    img.src = personImageUrl;
  }, [personImageUrl]);

  const drawPoster = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 750;
    canvas.width = width;
    canvas.height = height;

    // 1. DRAW BACKGROUND
    if (settings.bgType === "reference") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#c4f1f9");
      grad.addColorStop(0.4, "#a7f3d0");
      grad.addColorStop(0.7, "#bae6fd");
      grad.addColorStop(1, "#e0f2fe");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const radial = ctx.createRadialGradient(width / 2, 100, 10, width / 2, 200, 450);
      radial.addColorStop(0, "rgba(254, 240, 138, 0.45)");
      radial.addColorStop(0.6, "rgba(186, 230, 253, 0.2)");
      radial.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
    } else if (settings.bgType === "gradient") {
      const angleRad = (settings.gradientAngle * Math.PI) / 180;
      const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
      const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;
      const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
      const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, settings.bgColor1);
      grad.addColorStop(1, settings.bgColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = settings.bgColor1;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. DRAW CENTER PERSON CUTOUT IMAGE
    const personImg = personImgRef.current;
    if (personImg && imageLoaded) {
      ctx.save();

      ctx.filter = `brightness(${settings.personBrightness}%) contrast(${settings.personContrast}%)`;

      const baseScale = Math.min(width / personImg.width, (height * 0.8) / personImg.height);
      const scaledW = personImg.width * baseScale * settings.personScale;
      const scaledH = personImg.height * baseScale * settings.personScale;

      const x = (width - scaledW) / 2 + settings.personOffsetX;
      const y = (height - scaledH) / 2 + settings.personOffsetY + 20;

      if (settings.shadowBlur > 0) {
        ctx.shadowColor = settings.shadowColor;
        ctx.shadowBlur = settings.shadowBlur;
        ctx.shadowOffsetY = 12;
      }

      if (settings.topCrop > 0) {
        const cropAmount = (settings.topCrop / 100) * scaledH;
        ctx.beginPath();
        ctx.rect(x, y + cropAmount, scaledW, scaledH - cropAmount + 200);
        ctx.clip();
      }

      // Create a temporary canvas to draw person + apply eraser mask
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tCtx = tempCanvas.getContext("2d");
      if (tCtx) {
        tCtx.drawImage(personImg, x, y, scaledW, scaledH);

        // Subtract user erased areas
        if (eraserMaskCanvasRef.current) {
          tCtx.globalCompositeOperation = "destination-out";
          tCtx.drawImage(eraserMaskCanvasRef.current, 0, 0);
        }
      }

      ctx.drawImage(tempCanvas, 0, 0);
      ctx.restore();
    }

    // 3. DRAW BOTTOM WHITE ANNOUNCEMENT BANNER
    const bHeight = settings.bannerHeight;
    const bY = height - bHeight;

    ctx.save();
    ctx.fillStyle = settings.bannerBgColor;
    ctx.globalAlpha = settings.bannerOpacity;
    ctx.fillRect(0, bY, width, bHeight);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(226, 232, 240, 0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bY);
    ctx.lineTo(width, bY);
    ctx.stroke();
    ctx.restore();

    // 4. DRAW SPARKLE (Disabled by default)
    if (settings.showSparkle) {
      ctx.save();
      const sparkX = width - 80;
      const sparkY = bY - 20;
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(sparkX, sparkY - 18);
      ctx.quadraticCurveTo(sparkX, sparkY, sparkX + 18, sparkY);
      ctx.quadraticCurveTo(sparkX, sparkY, sparkX, sparkY + 18);
      ctx.quadraticCurveTo(sparkX, sparkY, sparkX - 18, sparkY);
      ctx.quadraticCurveTo(sparkX, sparkY, sparkX, sparkY - 18);
      ctx.fill();
      ctx.restore();
    }

    // 5. DRAW BANNER TEXT
    ctx.save();
    ctx.fillStyle = settings.textColor;
    ctx.textAlign = settings.textAlignment;
    ctx.textBaseline = "middle";

    const textX =
      settings.textAlignment === "center"
        ? width / 2
        : settings.textAlignment === "left"
        ? 60
        : width - 60;

    const fullText = settings.announcementText.trim();
    ctx.font = `600 ${settings.titleFontSize}px ${settings.fontFamily}, sans-serif`;

    const maxTextWidth = width - 120;
    const words = fullText.split(" ");
    let line = "";
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const lineHeight = settings.titleFontSize * 1.25;
    const totalTextHeight = lines.length * lineHeight;
    let startY = bY + (bHeight - totalTextHeight) / 2 + lineHeight / 2;

    lines.forEach((l) => {
      ctx.fillText(l, textX, startY);
      startY += lineHeight;
    });

    ctx.restore();
  }, [settings, imageLoaded]);

  useEffect(() => {
    drawPoster();
  }, [drawPoster]);

  const getCanvasDataUrl = useCallback(async () => {
    drawPoster();
    return canvasRef.current?.toDataURL("image/png", 1.0) || "";
  }, [drawPoster]);

  useEffect(() => {
    if (onCanvasReady) {
      onCanvasReady(getCanvasDataUrl);
    }
  }, [onCanvasReady, getCanvasDataUrl]);

  // Handle Interactive Eraser Brush Drawing
  const getCanvasPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const scaleX = 1200 / rect.width;
    const scaleY = 750 / rect.height;
    return {
      x: clientX * scaleX,
      y: clientY * scaleY,
      screenX: clientX,
      screenY: clientY,
    };
  };

  const drawEraserPoint = (pt: { x: number; y: number }) => {
    if (!eraserMaskCanvasRef.current) return;
    const eCtx = eraserMaskCanvasRef.current.getContext("2d");
    if (!eCtx) return;

    eCtx.save();
    eCtx.fillStyle = "#ffffff";
    eCtx.beginPath();
    eCtx.arc(pt.x, pt.y, eraserBrushSize, 0, Math.PI * 2);
    eCtx.fill();
    eCtx.restore();

    drawPoster();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEraserMode) return;
    setIsDrawingEraser(true);
    const pt = getCanvasPoint(e);
    if (pt) drawEraserPoint(pt);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const pt = getCanvasPoint(e);
    if (pt) {
      setMousePos({ x: pt.screenX, y: pt.screenY });
      if (isEraserMode && isDrawingEraser) {
        drawEraserPoint(pt);
      }
    }
  };

  const handleMouseUp = () => setIsDrawingEraser(false);
  const handleMouseLeave = () => {
    setIsDrawingEraser(false);
    setMousePos(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-4xl mx-auto flex flex-col items-center ${
        isEraserMode ? "cursor-crosshair select-none" : ""
      }`}
    >
      <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
        <canvas ref={canvasRef} className="w-full h-full object-contain block" />

        {/* Live Eraser Brush Cursor Indicator */}
        {isEraserMode && mousePos && containerRef.current && (
          <div
            className="absolute rounded-full border-2 border-emerald-400 bg-emerald-400/20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 shadow-lg"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: `${(eraserBrushSize / 1200) * containerRef.current.clientWidth * 2}px`,
              height: `${(eraserBrushSize / 1200) * containerRef.current.clientWidth * 2}px`,
            }}
          />
        )}

        {/* AI Background Removal Processing Overlay */}
        {isRemovingBg && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-20 text-white animate-fade-in">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg text-emerald-400">Removing Background using AI...</p>
              <p className="text-xs text-slate-300 mt-1">Applying automatic hair matting & edge defringing</p>
              {bgRemoveProgress > 0 && (
                <div className="w-48 bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${bgRemoveProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
