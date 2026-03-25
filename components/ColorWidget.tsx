'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ArrowRight, Settings2, X } from 'lucide-react';
import { hexToRgb, rgbToHsv } from '@/lib/colorUtils';
import { MiniHueShifter } from './MiniHueShifter';

interface ColorWidgetProps {
  id: string;
  originalColor: string;
  replacementColor: string;
  onReplacementChange: (hex: string) => void;
}

export const ColorWidget: React.FC<ColorWidgetProps> = ({
  id,
  originalColor,
  replacementColor,
  onReplacementChange,
}) => {
  const [showShifter, setShowShifter] = React.useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const rgb = hexToRgb(originalColor);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2"
    >
      <div
        className={`group flex items-center gap-4 p-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all ${
          isDragging ? 'opacity-50 scale-95 shadow-2xl border-zinc-400 dark:border-zinc-600' : 'hover:border-zinc-300 dark:hover:border-zinc-700'
        }`}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          <GripVertical size={18} />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-inner transition-colors"
            style={{ backgroundColor: originalColor }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-200 uppercase">
              {originalColor}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              H:{Math.round(hsv.h)} S:{Math.round(hsv.s)} V:{Math.round(hsv.v)}
            </span>
          </div>
        </div>

        <div className="text-zinc-300 dark:text-zinc-700">
          <ArrowRight size={16} />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShifter(!showShifter)}
            className={`p-2 rounded-lg border transition-all ${
              showShifter ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-950' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {showShifter ? <X size={16} /> : <Settings2 size={16} />}
          </button>
          <input
            type="color"
            value={replacementColor}
            onChange={(e) => onReplacementChange(e.target.value)}
            className="w-10 h-10 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden"
          />
          <span className="text-sm font-mono font-medium text-zinc-500 dark:text-zinc-400 uppercase w-20">
            {replacementColor}
          </span>
        </div>
      </div>

      {showShifter && (
        <div className="px-3 pb-2 animate-in slide-in-from-top-2 duration-200">
          <MiniHueShifter 
            initialColor={replacementColor} 
            onChange={onReplacementChange} 
          />
        </div>
      )}
    </div>
  );
};
