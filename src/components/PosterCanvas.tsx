"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface PosterCanvasSettings {
  // Layout mode
  layoutMode?: "classic" | "left-image" | "right-image" | "circle-banner" | "split-clean-left" | "dual-logo";
  // Logos
  showLeftLogo?: boolean;
  leftLogoUrl?: string;
  leftLogoSize?: number;
  leftLogoOffsetX?: number;
  leftLogoOffsetY?: number;
  showRightLogo?: boolean;
  rightLogoUrl?: string;
  rightLogoSize?: number;
  rightLogoOffsetX?: number;
  rightLogoOffsetY?: number;
  logoSize?: number;
  logoPaddingX?: number;
  logoPaddingY?: number;
  // Text content
  announcementText: string;
  // Typography
  fontFamily: string;
  titleFontSize: number;
  roleFontSize: number;
  textColor: string;
  highlightGradient1?: string;
  highlightGradient2?: string;
  highlightColor?: string;
  textAlignment: "center" | "left" | "right";
  textOffsetY: number;
  textMaxWidth: number; // 0 = Auto
  // Banner background
  bannerBgColor: string;
  bannerOpacity: number;
  bannerHeight: number;
  // Poster overall background
  bgType: "reference" | "gradient" | "solid" | "mesh" | "split-clean-template";
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

  const referenceImgRef = useRef<HTMLImageElement | null>(null);
  const [refImageLoaded, setRefImageLoaded] = useState(false);

  // Left and Right Header Logos
  const leftLogoImgRef = useRef<HTMLImageElement | null>(null);
  const [leftLogoLoaded, setLeftLogoLoaded] = useState(false);
  const rightLogoImgRef = useRef<HTMLImageElement | null>(null);
  const [rightLogoLoaded, setRightLogoLoaded] = useState(false);

  const [isDrawingEraser, setIsDrawingEraser] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Load reference layout image
  useEffect(() => {
    const img = new Image();
    img.src = "/templates/poster-layout-1.png";
    img.onload = () => {
      referenceImgRef.current = img;
      setRefImageLoaded(true);
    };
  }, []);

  // Load Left Logo (default: /templates/logo.png)
  const leftUrl = settings.leftLogoUrl !== undefined ? settings.leftLogoUrl : "/templates/logo.png";
  useEffect(() => {
    if (!leftUrl) {
      leftLogoImgRef.current = null;
      setLeftLogoLoaded(false);
      return;
    }
    setLeftLogoLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      leftLogoImgRef.current = img;
      setLeftLogoLoaded(true);
    };
    img.onerror = () => {
      setLeftLogoLoaded(false);
    };
    img.src = leftUrl;
  }, [leftUrl]);

  // Load Right Logo (dynamic upload)
  const rightUrl = settings.rightLogoUrl;
  useEffect(() => {
    if (!rightUrl) {
      rightLogoImgRef.current = null;
      setRightLogoLoaded(false);
      return;
    }
    setRightLogoLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      rightLogoImgRef.current = img;
      setRightLogoLoaded(true);
    };
    img.onerror = () => {
      setRightLogoLoaded(false);
    };
    img.src = rightUrl;
  }, [rightUrl]);

  // Initialize offscreen eraser mask canvas
  useEffect(() => {
    if (!eraserMaskCanvasRef.current) {
      const eCanvas = document.createElement("canvas");
      eCanvas.width = 1400;
      eCanvas.height = 1120;
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
      if (eCtx) eCtx.clearRect(0, 0, 1400, 1120);
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

    const width = 1400;
    const height = 1120;
    canvas.width = width;
    canvas.height = height;

    // 1. DRAW BACKGROUND
    if (settings.bgType === "reference") {
      if (referenceImgRef.current && refImageLoaded) {
        ctx.drawImage(referenceImgRef.current, 0, 0, width, height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#c4f1f9");
        grad.addColorStop(1, "#a7f3d0");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
    } else if (settings.bgType === "split-clean-template") {
      // Draw the requested custom template (White/Purple/DarkBlue with dots)
      // 1. Base light gray/white background
      ctx.fillStyle = "#f8f9fd";
      ctx.fillRect(0, 0, width, height);
      
      ctx.save();
      
      // 2. Main Purple rounded shape
      ctx.fillStyle = "#6d48ba"; // Vibrant purple
      ctx.beginPath();
      // Translate to the right side and rotate to draw the angled pill shape
      ctx.translate(width * 0.7, height * 0.4);
      ctx.rotate(18 * Math.PI / 180);
      
      // Use standard arc/rect path since roundRect isn't supported in all older canvas implementations, but roundRect is standard now
      if (ctx.roundRect) {
        ctx.roundRect(-250, -800, 500, 1600, 250);
      } else {
        ctx.rect(-250, -800, 500, 1600); // Fallback
      }
      ctx.fill();
      
      ctx.restore();
      
      // 3. Dark blue angled polygon on the far right
      ctx.fillStyle = "#2d2366"; // Dark blue
      ctx.beginPath();
      ctx.moveTo(width * 0.75, height);
      ctx.lineTo(width * 0.95, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      
      // 4. Dot Grid Pattern
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      const dotSpacing = 24;
      const startX = width * 0.88;
      const startY = height * 0.25;
      
      for(let row = 0; row < 8; row++) {
        for(let col = 0; col < 5; col++) {
          ctx.beginPath();
          ctx.arc(startX + col * dotSpacing, startY + row * dotSpacing, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
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

      const isSplitLayout = settings.layoutMode === "left-image" || settings.layoutMode === "right-image";
      const isSplitClean = settings.layoutMode === "split-clean-left";
      const isRightSideImage = settings.layoutMode === "right-image" || isSplitClean;
      
      const maxWidth = (isSplitLayout || isSplitClean) ? width / 2 : width;
      const maxHeight = (isSplitLayout || isSplitClean) ? height * 0.9 : height * 0.8;
      const baseScale = Math.min(maxWidth / personImg.width, maxHeight / personImg.height);
      const scaledW = personImg.width * baseScale * settings.personScale;
      const scaledH = personImg.height * baseScale * settings.personScale;

      let x = (width - scaledW) / 2 + settings.personOffsetX;
      let y = (height - scaledH) / 2 + settings.personOffsetY + 20;

      if (settings.layoutMode === "left-image") {
        x = (width * 0.25 - scaledW / 2) + settings.personOffsetX;
        y = height - scaledH + settings.personOffsetY;
      } else if (settings.layoutMode === "right-image" || settings.layoutMode === "split-clean-left") {
        x = (width * 0.75 - scaledW / 2) + settings.personOffsetX;
        y = height - scaledH + settings.personOffsetY;
      }

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
    } else {
      // 2B. DRAW PLACEHOLDER WHEN NO IMAGE
      ctx.save();
      const isSplitLayout = settings.layoutMode === "left-image" || settings.layoutMode === "right-image";
      const isSplitClean = settings.layoutMode === "split-clean-left";
      const isRightSideImage = settings.layoutMode === "right-image" || isSplitClean;
      
      const maxWidth = (isSplitLayout || isSplitClean) ? width / 2 : width;
      const maxHeight = (isSplitLayout || isSplitClean) ? height * 0.9 : height * 0.8;
      
      const scaledW = Math.min(300, maxWidth) * settings.personScale;
      const scaledH = Math.min(450, maxHeight) * settings.personScale;
      
      let x = (width - scaledW) / 2 + settings.personOffsetX;
      let y = (height - scaledH) / 2 + settings.personOffsetY + 20;

      if (settings.layoutMode === "left-image") {
        x = (width * 0.25 - scaledW / 2) + settings.personOffsetX;
        y = height - scaledH + settings.personOffsetY;
      } else if (settings.layoutMode === "right-image" || settings.layoutMode === "split-clean-left") {
        x = (width * 0.75 - scaledW / 2) + settings.personOffsetX;
        y = height - scaledH + settings.personOffsetY;
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.beginPath();
      // Draw a simple person silhouette
      ctx.arc(x + scaledW/2, y + scaledH*0.2, scaledW*0.2, 0, Math.PI * 2); // head
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(x + scaledW/2, y + scaledH*0.75, scaledW*0.4, scaledH*0.45, 0, Math.PI, 0); // body
      ctx.fill();
      
      // Text "Your Image"
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.font = "600 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Your Image", x + scaledW/2, y + scaledH/2);

      ctx.restore();
    }

    // 3. CALCULATE TEXT WRAPPING & CARD DIMENSIONS
    const fullText = settings.announcementText.trim();
    ctx.save();

    const isSplitLayout = settings.layoutMode === "left-image" || settings.layoutMode === "right-image";
    const isSplitClean = settings.layoutMode === "split-clean-left";
    
    // Width of the banner/card
    const cardWidth = (isSplitLayout || isSplitClean) ? 550 : width;
    const cardPaddingX = (isSplitLayout || isSplitClean) ? 45 : 60;
    const maxTextWidth = settings.textMaxWidth > 0 ? settings.textMaxWidth : (cardWidth - cardPaddingX * 2);

    const rawLines = fullText.split("\n");
    type Token = { text: string; style: "normal" | "gradient" | "color" };
    type ParsedLine = { tokens: Token[]; isHeading: boolean; height: number; width: number };
    const parsedLines: ParsedLine[] = [];
    let totalTextHeight = 0;
    
    // Tokenizer that respects spaces and uses prefix syntax
    const getTokens = (text: string): Token[] => {
      const words = text.split(" ");
      const tokens: Token[] = [];
      
      words.forEach((w, i) => {
        let style: "normal" | "gradient" | "color" = "normal";
        let content = w;
        if (content.startsWith("$")) {
           style = "gradient";
           content = content.slice(1);
        } else if (content.startsWith("_")) {
           style = "color";
           content = content.slice(1);
        }
        
        const hasSpace = i < words.length - 1;
        tokens.push({ text: content + (hasSpace ? " " : ""), style });
      });
      return tokens;
    };

    rawLines.forEach((rawLine, index) => {
      // In clean layout, we make the first line larger as a "Heading"
      const isHeading = isSplitClean && index === 0 && rawLine.trim() !== "";
      const fontSize = isHeading ? settings.titleFontSize * 1.6 : settings.titleFontSize;
      ctx.font = `${isHeading ? "800" : "600"} ${fontSize}px "${settings.fontFamily}", sans-serif`;
      
      const lineHeight = fontSize * 1.3;

      if (rawLine.trim() === "") {
        parsedLines.push({ tokens: [], isHeading, height: lineHeight, width: 0 });
        totalTextHeight += lineHeight;
        return;
      }
      
      const tokens = getTokens(rawLine);
      let currentLineTokens: Token[] = [];
      let currentLineWidth = 0;
      
      for (let t of tokens) {
        const tokenWidth = ctx.measureText(t.text).width;
        if (currentLineWidth + tokenWidth > maxTextWidth && currentLineTokens.length > 0) {
           parsedLines.push({ tokens: currentLineTokens, isHeading, height: lineHeight, width: currentLineWidth });
           totalTextHeight += lineHeight;
           
           if (t.text.trim() === "") {
               currentLineTokens = [];
               currentLineWidth = 0;
           } else {
               currentLineTokens = [t];
               currentLineWidth = tokenWidth;
           }
        } else {
           currentLineTokens.push(t);
           currentLineWidth += tokenWidth;
        }
      }
      if (currentLineTokens.length > 0) {
         parsedLines.push({ tokens: currentLineTokens, isHeading, height: lineHeight, width: currentLineWidth });
         totalTextHeight += lineHeight;
      }
    });

    ctx.restore();

    // 4. DRAW TEXT BANNER / PANEL / CARD
    ctx.save();
    ctx.fillStyle = settings.bannerBgColor;
    ctx.globalAlpha = settings.bannerOpacity;
    
    if (isSplitLayout) {
      // Draw a beautiful floating banner card for split layouts
      const cardHeight = Math.max(160, totalTextHeight + 90);
      const centerX = settings.layoutMode === "left-image" ? width * 0.75 : width * 0.25;
      const cardX = centerX - cardWidth / 2;
      const cardY = (height - cardHeight) / 2;
      const radius = 24;

      // Add a nice soft shadow to the banner card
      ctx.shadowColor = "rgba(15, 23, 42, 0.18)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.shadowOffsetX = 0;

      // Draw rounded card path
      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardWidth - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + radius);
      ctx.lineTo(cardX + cardWidth, cardY + cardHeight - radius);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - radius, cardY + cardHeight);
      ctx.lineTo(cardX + radius, cardY + cardHeight);
      ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.fill();

      // Draw subtle light border to make the banner stand out
      ctx.shadowColor = "transparent"; // disable shadow for border
      ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (isSplitClean) {
      // No background card for clean layout, text goes directly on the background
    } else if (settings.layoutMode !== "circle-banner") {
      // Bottom banner
      const bHeight = settings.bannerHeight;
      const bY = height - bHeight;
      ctx.fillRect(0, bY, width, bHeight);

      // Bottom banner border line
      ctx.strokeStyle = "rgba(226, 232, 240, 0.8)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, bY);
      ctx.lineTo(width, bY);
      ctx.stroke();
    }
    ctx.restore();

    // 5. DRAW SPARKLE (Disabled by default)
    if (settings.showSparkle) {
      ctx.save();
      let sparkX = width - 80;
      let sparkY = height - settings.bannerHeight - 20;
      
      if (settings.layoutMode === "left-image") {
        sparkX = width * 0.75 + 180;
        sparkY = 60;
      } else if (settings.layoutMode === "right-image") {
        sparkX = width * 0.25 + 180;
        sparkY = 60;
      }
      
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

    // 6. DRAW BANNER TEXT
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.textAlign = "left"; // We will calculate anchor positions manually for multi-styled text

    let anchorX = width / 2;
    if (isSplitLayout || isSplitClean) {
      const centerX = settings.layoutMode === "left-image" ? width * 0.75 : width * 0.25;
      const cardX = centerX - cardWidth / 2;
      anchorX =
        settings.textAlignment === "center"
          ? centerX
          : settings.textAlignment === "left"
          ? cardX + cardPaddingX
          : cardX + cardWidth - cardPaddingX;
    } else {
      anchorX =
        settings.textAlignment === "center"
          ? width / 2
          : settings.textAlignment === "left"
          ? 60
          : width - 60;
    }

    let startY = 0;
    if (isSplitLayout) {
      const cardHeight = Math.max(160, totalTextHeight + 90);
      const cardY = (height - cardHeight) / 2;
      startY = cardY + (cardHeight - totalTextHeight) / 2 + parsedLines[0]?.height / 2;
    } else if (isSplitClean) {
      startY = (height - totalTextHeight) / 2 + parsedLines[0]?.height / 2;
    } else {
      const bHeight = settings.bannerHeight;
      const bY = height - bHeight;
      startY = bY + (bHeight - totalTextHeight) / 2 + parsedLines[0]?.height / 2;
    }

    // Apply the user's manual vertical offset
    startY += settings.textOffsetY;

    parsedLines.forEach((l) => {
      if (l.tokens.length > 0) {
        // Use bolder font for heading
        const fontSize = l.isHeading ? settings.titleFontSize * 1.6 : settings.titleFontSize;
        ctx.font = `${l.isHeading ? "800" : "600"} ${fontSize}px "${settings.fontFamily}", sans-serif`;
        
        let currentX = anchorX;
        if (settings.textAlignment === "center") {
          currentX = anchorX - l.width / 2;
        } else if (settings.textAlignment === "right") {
          currentX = anchorX - l.width;
        }
        
        l.tokens.forEach(token => {
           const tokenWidth = ctx.measureText(token.text).width;
           
           if (token.style === "gradient") {
               const grad = ctx.createLinearGradient(currentX, startY - fontSize / 2, currentX + tokenWidth, startY + fontSize / 2);
               grad.addColorStop(0, settings.highlightGradient1 || "#10b981");
               grad.addColorStop(1, settings.highlightGradient2 || "#059669");
               ctx.fillStyle = grad;
           } else if (token.style === "color") {
               ctx.fillStyle = settings.highlightColor || "#3b82f6";
           } else {
               ctx.fillStyle = settings.textColor;
           }
           
           // Add subtle text shadow in clean mode for legibility against backgrounds
           if (isSplitClean) {
             ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
             ctx.shadowBlur = 4;
             ctx.shadowOffsetY = 2;
           }
           
           ctx.fillText(token.text, currentX, startY);
           ctx.shadowColor = "transparent"; // Reset shadow
           
           currentX += tokenWidth;
        });
      }
      startY += l.height;
    });

    ctx.restore();

    // 7. DRAW TOP LOGOS (LEFT & RIGHT) - Exclusively on Dual-Logo template
    if (settings.layoutMode === "dual-logo") {
      const showLeft = settings.showLeftLogo !== false;
      const showRight = settings.showRightLogo !== false && !!settings.rightLogoUrl;

      const targetLeftLogoHeight = settings.leftLogoSize || settings.logoSize || 85;
      const targetRightLogoHeight = settings.rightLogoSize || settings.logoSize || 85;
      const maxLeftLogoWidth = targetLeftLogoHeight * 3.5;
      const maxRightLogoWidth = targetRightLogoHeight * 3.5;
      const paddingX = settings.logoPaddingX || 60;
      const paddingY = settings.logoPaddingY || 45;

      ctx.save();

      // Draw Left Logo (Default Public Logo or Custom)
      if (showLeft && leftLogoImgRef.current && leftLogoLoaded) {
        const lImg = leftLogoImgRef.current;
        const lAspect = (lImg.naturalWidth || lImg.width) / (lImg.naturalHeight || lImg.height);
        let lH = targetLeftLogoHeight;
        let lW = lH * lAspect;
        if (lW > maxLeftLogoWidth) {
          lW = maxLeftLogoWidth;
          lH = lW / lAspect;
        }
        const lX = paddingX + (settings.leftLogoOffsetX || 0);
        const lY = paddingY + (targetLeftLogoHeight - lH) / 2 + (settings.leftLogoOffsetY || 0);

        ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.drawImage(lImg, lX, lY, lW, lH);
        ctx.shadowColor = "transparent";
      }

      // Draw Right Logo (Dynamic Uploaded Partner Logo)
      if (showRight && rightLogoImgRef.current && rightLogoLoaded) {
        const rImg = rightLogoImgRef.current;
        const rAspect = (rImg.naturalWidth || rImg.width) / (rImg.naturalHeight || rImg.height);
        let rH = targetRightLogoHeight;
        let rW = rH * rAspect;
        if (rW > maxRightLogoWidth) {
          rW = maxRightLogoWidth;
          rH = rW / rAspect;
        }
        const rX = width - paddingX - rW + (settings.rightLogoOffsetX || 0);
        const rY = paddingY + (targetRightLogoHeight - rH) / 2 + (settings.rightLogoOffsetY || 0);

        ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.drawImage(rImg, rX, rY, rW, rH);
        ctx.shadowColor = "transparent";
      }

      ctx.restore();
    }
  }, [settings, imageLoaded, refImageLoaded, leftLogoLoaded, rightLogoLoaded]);

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
    const scaleX = 1400 / rect.width;
    const scaleY = 1120 / rect.height;
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
