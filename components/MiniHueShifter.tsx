'use client';

import React, { useState, useEffect } from 'react';
import { rgbToHex, hsvToRgb, rgbToHsv, hexToRgb } from '@/lib/colorUtils';
import { useLanguage } from '@/context/LanguageContext';

interface MiniHueShifterProps {
  initialColor: string;
  onChange: (hex: string) => void;
}

export const MiniHueShifter: React.FC<MiniHueShifterProps> = ({ initialColor, onChange }) => {
  const { t } = useLanguage();
  const [hsv, setHsv] = useState(() => {
    const rgb = hexToRgb(initialColor);
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
  });
  const [prevColor, setPrevColor] = useState(initialColor);

  if (initialColor !== prevColor) {
    const rgb = hexToRgb(initialColor);
    setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
    setPrevColor(initialColor);
  }

  const handleHsvChange = (key: keyof typeof hsv, value: number) => {
    const newHsv = { ...hsv, [key]: value };
    setHsv(newHsv);
    const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
    onChange(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-inner transition-colors"
          style={{ backgroundColor: rgbToHex(...Object.values(hsvToRgb(hsv.h, hsv.s, hsv.v)) as [number, number, number]) }}
        />
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1">{t('hue')}</div>
          <input
            type="range"
            min="0"
            max="360"
            value={hsv.h}
            onChange={(e) => handleHsvChange('h', parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 dark:accent-zinc-200 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1">{t('saturation')}</div>
          <input
            type="range"
            min="0"
            max="100"
            value={hsv.s}
            onChange={(e) => handleHsvChange('s', parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 dark:accent-zinc-200 transition-colors"
          />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1">{t('value')}</div>
          <input
            type="range"
            min="0"
            max="100"
            value={hsv.v}
            onChange={(e) => handleHsvChange('v', parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 dark:accent-zinc-200 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
