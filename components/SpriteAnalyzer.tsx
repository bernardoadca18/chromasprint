'use client';

import React, { useState, useRef } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Trash2, 
  Palette, 
  Layers,
  SortAsc,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { hexToRgb, rgbToHex, rgbToHsv, getLuminance } from '@/lib/colorUtils';
import { ColorWidget } from './ColorWidget';
import { useLanguage } from '@/context/LanguageContext';

interface PaletteItem {
  id: string;
  original: string;
  replacement: string;
}

export const SpriteAnalyzer: React.FC = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<PaletteItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      setImage(imgUrl);
      analyzeImage(imgUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = (imgUrl: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = originalCanvasRef.current;
      if (!canvas) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const colors = new Set<string>();

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a > 0) {
          colors.add(rgbToHex(r, g, b));
        }
      }

      const extractedPalette = Array.from(colors).map(hex => ({
        id: hex,
        original: hex,
        replacement: hex
      }));

      setPalette(extractedPalette);
      setPreviewImage(null);
      setIsProcessing(false);
    };
    img.src = imgUrl;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPalette((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateReplacement = (id: string, hex: string) => {
    setPalette(prev => prev.map(item => 
      item.id === id ? { ...item, replacement: hex } : item
    ));
  };

  const sortPalette = (type: 'hue' | 'brightness' | 'saturation') => {
    const sorted = [...palette].sort((a, b) => {
      const rgbA = hexToRgb(a.original);
      const rgbB = hexToRgb(b.original);
      const hsvA = rgbToHsv(rgbA.r, rgbA.g, rgbA.b);
      const hsvB = rgbToHsv(rgbB.r, rgbB.g, rgbB.b);

      if (type === 'hue') return hsvA.h - hsvB.h;
      if (type === 'saturation') return hsvA.s - hsvB.s;
      if (type === 'brightness') return getLuminance(rgbA.r, rgbA.g, rgbA.b) - getLuminance(rgbB.r, rgbB.g, rgbB.b);
      return 0;
    });
    setPalette(sorted);
  };

  const applySwap = () => {
    if (!image || !originalCanvasRef.current) return;
    
    const canvas = canvasRef.current;
    const originalCanvas = originalCanvasRef.current;
    if (!canvas || !originalCanvas) return;

    canvas.width = originalCanvas.width;
    canvas.height = originalCanvas.height;
    const ctx = canvas.getContext('2d');
    const originalCtx = originalCanvas.getContext('2d');
    if (!ctx || !originalCtx) return;

    const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    const data = imageData.data;

    // Create a map for faster lookup
    const colorMap = new Map<string, { r: number, g: number, b: number }>();
    palette.forEach(item => {
      colorMap.set(item.original.toLowerCase(), hexToRgb(item.replacement));
    });

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a > 0) {
        const hex = rgbToHex(r, g, b).toLowerCase();
        const replacement = colorMap.get(hex);
        if (replacement) {
          data[i] = replacement.r;
          data[i + 1] = replacement.g;
          data[i + 2] = replacement.b;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setPreviewImage(canvas.toDataURL());
  };

  const downloadSprite = () => {
    if (!previewImage) return;
    const link = document.createElement('a');
    link.download = 'recolored-sprite.png';
    link.href = previewImage;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto p-6 transition-colors duration-300">
      {/* Left Column: Image Preview & Controls */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-900 dark:text-white">
              <ImageIcon size={20} className="text-zinc-400" />
              {t('sourceSprite')}
            </h2>
            {image && (
              <button 
                onClick={() => { setImage(null); setPalette([]); setPreviewImage(null); }}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {!image ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold">{t('uploadSprite')}</span>
                </p>
                <p className="text-xs text-zinc-400 uppercase tracking-widest">{t('pngOnly')}</p>
              </div>
              <input type="file" className="hidden" accept="image/png" onChange={handleFileUpload} />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-square bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center p-8 transition-colors">
                <img 
                  src={previewImage || image} 
                  alt="Preview" 
                  className="max-w-full max-h-full pixelated shadow-2xl"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center transition-colors">
                    <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={applySwap}
                  disabled={palette.length === 0}
                  className="flex-1 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={18} />
                  {t('applySwap')}
                </button>
                {previewImage && (
                  <button
                    onClick={downloadSprite}
                    className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white p-3 rounded-xl transition-all"
                    title={t('downloadSprite')}
                  >
                    <Download size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvases for processing */}
        <canvas ref={originalCanvasRef} className="hidden" />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Right Column: Palette Management */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-900 dark:text-white">
              <Palette size={20} className="text-zinc-400" />
              {t('paletteDashboard')}
              <span className="ml-2 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] rounded-full uppercase tracking-tighter transition-colors">
                {palette.length} {t('colors')}
              </span>
            </h2>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors">
                <button 
                  onClick={() => sortPalette('hue')}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all"
                  title="Sort by Hue"
                >
                  <SortAsc size={16} />
                </button>
                <button 
                  onClick={() => sortPalette('brightness')}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all"
                  title="Sort by Brightness"
                >
                  <Layers size={16} />
                </button>
                <button 
                  onClick={() => sortPalette('saturation')}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all"
                  title="Sort by Saturation"
                >
                  <Sparkles size={16} />
                </button>
              </div>
            </div>
          </div>

          {palette.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={palette.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {palette.map((item) => (
                    <ColorWidget
                      key={item.id}
                      id={item.id}
                      originalColor={item.original}
                      replacementColor={item.replacement}
                      onReplacementChange={(hex) => updateReplacement(item.id, hex)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors">
              <Palette size={48} className="mb-4 opacity-20" />
              <p className="text-sm">{t('uploadToExtract')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
