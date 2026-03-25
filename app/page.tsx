'use client';

import React from 'react';
import { SpriteAnalyzer } from '@/components/SpriteAnalyzer';
import HueShifter from '@/components/HueShifter';
import { Header } from '@/components/Header';
import { Palette, Sparkles, Sliders } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-zinc-950 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium mb-4 transition-colors">
            <Sparkles size={14} className="text-zinc-900 dark:text-zinc-200" />
            <span>{t('advancedPixelArt')}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white max-w-3xl mx-auto leading-tight">
            {t('heroTitle').split(' ').map((word, i) => 
              word === 'Orchestration' || word === 'Orquestração' ? <span key={i} className="text-zinc-400 dark:text-zinc-500">{word} </span> : word + ' '
            )}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-500 max-w-xl mx-auto text-lg">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Main Tools Container */}
      <div className="max-w-7xl mx-auto px-6 space-y-24 pb-24">
        
        {/* Sprite Analyzer Section */}
        <section id="analyzer" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors">
              <Palette size={20} className="text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t('spriteAnalyzerTitle')}</h3>
              <p className="text-sm text-zinc-500">{t('spriteAnalyzerSubtitle')}</p>
            </div>
          </div>
          <SpriteAnalyzer />
        </section>

        {/* Hue Shifter Section */}
        <section id="shifter" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors">
              <Sliders size={20} className="text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t('standaloneHueShifterTitle')}</h3>
              <p className="text-sm text-zinc-500">{t('standaloneHueShifterSubtitle')}</p>
            </div>
          </div>
          <div className="max-w-4xl">
            <HueShifter />
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-12 px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600">
            <Palette size={16} />
            <span className="text-sm font-medium">ChromaSprint &copy; 2026</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">{t('documentation')}</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">{t('privacy')}</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">{t('terms')}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
