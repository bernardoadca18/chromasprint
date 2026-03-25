'use client';

import React, { useState, memo } from 'react';
import { Check, Palette, Copy } from 'lucide-react';
import { generatePalette, hexToHsv, hsvToHex, hexToRgb, hexToHsl } from '@/lib/colorUtils';
import { useLanguage } from '@/context/LanguageContext';

function HueShifter() {
  const { t } = useLanguage();
  const [baseColor, setBaseColor] = useState('#a882ff');
  const [hStep, setHStep] = useState(15);
  const [sStep, setSStep] = useState(10);
  const [vStep, setVStep] = useState(15);
  const [steps, setSteps] = useState(3);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const palette = React.useMemo(() => {
    try {
      if (/^#[0-9A-F]{6}$/i.test(baseColor) || /^#[0-9A-F]{3}$/i.test(baseColor)) {
        return generatePalette(baseColor, steps, hStep, sStep, vStep);
      }
    } catch (e) {
      // Ignore invalid colors
    }
    return [];
  }, [baseColor, hStep, sStep, vStep, steps]);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleHsvChange = (component: 'h' | 's' | 'v', value: number) => {
    try {
      const currentHsv = hexToHsv(baseColor);
      const newHsv = { ...currentHsv, [component]: value };
      setBaseColor(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
    } catch (e) {}
  };

  const currentHsv = React.useMemo(() => {
    try { return hexToHsv(baseColor); } catch (e) { return { h: 0, s: 0, v: 0 }; }
  }, [baseColor]);

  const currentRgb = React.useMemo(() => {
    try { return hexToRgb(baseColor); } catch (e) { return { r: 0, g: 0, b: 0 }; }
  }, [baseColor]);

  const currentHsl = React.useMemo(() => {
    try { return hexToHsl(baseColor); } catch (e) { return { h: 0, s: 0, l: 0 }; }
  }, [baseColor]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col text-zinc-900 dark:text-zinc-100 shadow-sm dark:shadow-xl transition-colors duration-300">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <h3 className="font-semibold flex items-center gap-2">
          <Palette size={18} className="text-zinc-600 dark:text-zinc-200" />
          {t('hueShifter')}
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">{t('baseColor')}</label>
              <div className="flex gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner transition-colors">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 transition-all"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-zinc-600">RGB</label>
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 text-center transition-colors">
                  {Math.round(currentRgb.r)},{Math.round(currentRgb.g)},{Math.round(currentRgb.b)}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-zinc-600">HSL</label>
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 text-center transition-colors">
                  {Math.round(currentHsl.h)}°,{Math.round(currentHsl.s)}%,{Math.round(currentHsl.l)}%
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-zinc-600">HSV</label>
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 text-center transition-colors">
                  {Math.round(currentHsv.h)}°,{Math.round(currentHsv.s)}%,{Math.round(currentHsv.v)}%
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">{t('hsvAdjustments')}</label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 w-4">H</span>
                <input
                  type="range" min="0" max="360"
                  value={currentHsv.h}
                  onChange={(e) => handleHsvChange('h', Number(e.target.value))}
                  className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 dark:accent-zinc-200 transition-colors"
                />
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 w-10 text-right">{Math.round(currentHsv.h)}°</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 w-4">S</span>
                <input
                  type="range" min="0" max="100"
                  value={currentHsv.s}
                  onChange={(e) => handleHsvChange('s', Number(e.target.value))}
                  className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 dark:accent-zinc-200 transition-colors"
                />
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 w-10 text-right">{Math.round(currentHsv.s)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 w-4">V</span>
                <input
                  type="range" min="0" max="100"
                  value={currentHsv.v}
                  onChange={(e) => handleHsvChange('v', Number(e.target.value))}
                  className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 dark:accent-zinc-200 transition-colors"
                />
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 w-10 text-right">{Math.round(currentHsv.v)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">{t('paletteGeneratorControls')}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-600 mb-2">
                <label>{t('hue')} Shift</label>
                <span className="text-zinc-900 dark:text-zinc-100">{hStep}°</span>
              </div>
              <input
                type="range" min="-60" max="60"
                value={hStep}
                onChange={(e) => setHStep(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-600 mb-2">
                <label>{t('saturation')} Shift</label>
                <span className="text-zinc-900 dark:text-zinc-100">{sStep}%</span>
              </div>
              <input
                type="range" min="0" max="50"
                value={sStep}
                onChange={(e) => setSStep(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-600 mb-2">
                <label>{t('value')} Shift</label>
                <span className="text-zinc-900 dark:text-zinc-100">{vStep}%</span>
              </div>
              <input
                type="range" min="0" max="50"
                value={vStep}
                onChange={(e) => setVStep(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 transition-colors"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-600 mb-2">
                <label>{t('steps')}</label>
                <span className="text-zinc-900 dark:text-zinc-100">{steps}</span>
              </div>
              <input
                type="range" min="1" max="5"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t('generatedPalette')}</label>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase font-bold">{t('clickToCopy')}</span>
          </div>
          <div className="flex h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-2xl transition-colors">
            {palette.map((color, index) => (
              <button
                key={index}
                onClick={() => handleCopy(color)}
                className="flex-1 relative group transition-all hover:flex-[1.5] hover:z-10"
                style={{ backgroundColor: color }}
                title={`Copy ${color}`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
                  {copiedColor === color ? (
                    <Check size={16} className="text-white drop-shadow-md" />
                  ) : (
                    <Copy size={16} className="text-white drop-shadow-md" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(HueShifter);
