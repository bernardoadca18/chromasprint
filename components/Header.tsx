'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import { Palette, Zap, Sun, Moon, Languages } from 'lucide-react';

export const Header = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center transition-colors">
              <Palette size={18} className="text-white dark:text-zinc-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">ChromaSprint</h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center transition-colors">
            <Palette size={18} className="text-white dark:text-zinc-950" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">ChromaSprint</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#analyzer" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{t('analyzer')}</a>
          <a href="#shifter" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{t('hueShifter')}</a>
          <a href="#" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{t('export')}</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full transition-colors">
            <Zap size={12} className="text-yellow-600 dark:text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('proTool')}</span>
          </div>

          <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 ml-2 pl-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-all flex items-center gap-2"
              title="Switch Language"
            >
              <Languages size={18} />
              <span className="text-xs font-bold font-mono">{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-all"
              title="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
