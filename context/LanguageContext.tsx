'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  analyzer: { en: 'Analyzer', pt: 'Analisador' },
  hueShifter: { en: 'Hue Shifter', pt: 'Ajuste de Matiz' },
  export: { en: 'Export', pt: 'Exportar' },
  proTool: { en: 'Pro Tool', pt: 'Ferramenta Pro' },
  advancedPixelArt: { en: 'Advanced Pixel Art Manipulation', pt: 'Manipulação Avançada de Pixel Art' },
  heroTitle: { en: 'Professional Color Orchestration for Sprites.', pt: 'Orquestração Profissional de Cores para Sprites.' },
  heroSubtitle: { en: 'The ultimate toolkit for game developers and pixel artists. Extract palettes, shift hues, and recolor assets with mathematical precision.', pt: 'O kit de ferramentas definitivo para desenvolvedores e artistas de pixel. Extraia paletas, altere matizes e recolore ativos com precisão matemática.' },
  spriteAnalyzerTitle: { en: 'Sprite Analyzer & Recolor', pt: 'Analisador de Sprite e Recolorir' },
  spriteAnalyzerSubtitle: { en: 'Extract and swap palettes from pixel art assets.', pt: 'Extraia e troque paletas de ativos de pixel art.' },
  standaloneHueShifterTitle: { en: 'Standalone Hue Shifter', pt: 'Ajuste de Matiz Independente' },
  standaloneHueShifterSubtitle: { en: 'Generate mathematical color palettes with precise HSV control.', pt: 'Gere paletas de cores matemáticas com controle HSV preciso.' },
  sourceSprite: { en: 'Source Sprite', pt: 'Sprite de Origem' },
  uploadSprite: { en: 'Click to upload or drag and drop', pt: 'Clique para carregar ou arraste e solte' },
  pngOnly: { en: 'PNG Sprites Only', pt: 'Apenas Sprites PNG' },
  applySwap: { en: 'Apply Palette Swap', pt: 'Aplicar Troca de Paleta' },
  paletteDashboard: { en: 'Palette Dashboard', pt: 'Painel de Paleta' },
  colors: { en: 'Colors', pt: 'Cores' },
  clickToCopy: { en: 'Click to copy HEX', pt: 'Clique para copiar HEX' },
  uploadToExtract: { en: 'Upload a sprite to extract its palette', pt: 'Carregue um sprite para extrair sua paleta' },
  originalColor: { en: 'Original Color', pt: 'Cor Original' },
  replacementColor: { en: 'Replacement Color', pt: 'Cor de Substituição' },
  downloadSprite: { en: 'Download Sprite', pt: 'Baixar Sprite' },
  hue: { en: 'Hue', pt: 'Matiz' },
  saturation: { en: 'Saturation', pt: 'Saturação' },
  value: { en: 'Value', pt: 'Valor' },
  brightness: { en: 'Brightness', pt: 'Brilho' },
  steps: { en: 'Steps', pt: 'Passos' },
  baseColor: { en: 'Base Color', pt: 'Cor Base' },
  hsvAdjustments: { en: 'HSV Adjustments', pt: 'Ajustes HSV' },
  paletteGeneratorControls: { en: 'Palette Generator Controls', pt: 'Controles do Gerador de Paleta' },
  generatedPalette: { en: 'Generated Palette', pt: 'Paleta Gerada' },
  documentation: { en: 'Documentation', pt: 'Documentação' },
  privacy: { en: 'Privacy', pt: 'Privacidade' },
  terms: { en: 'Terms', pt: 'Termos' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
