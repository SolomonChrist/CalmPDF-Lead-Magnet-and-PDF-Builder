
import React from 'react';
import { MarketingPageConfig } from '../types';

interface MarketingPageSettingsProps {
  config: MarketingPageConfig;
  onChange: (config: MarketingPageConfig) => void;
  accentColor: string;
}

const MarketingPageSettings: React.FC<MarketingPageSettingsProps> = ({ config, onChange, accentColor }) => {
  const handleChange = (key: keyof MarketingPageConfig, value: string | number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div>
        <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold tracking-wide">Headline</label>
        <input 
          type="text"
          value={config.headingText}
          onChange={(e) => handleChange('headingText', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
          placeholder="Heading text..."
        />
      </div>

      <div>
        <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold tracking-wide">Subheading</label>
        <textarea 
          rows={3}
          value={config.subheadingText}
          onChange={(e) => handleChange('subheadingText', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none transition-all"
          placeholder="Subheading text..."
        />
      </div>

      <div>
        <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold tracking-wide">CTA Button Text</label>
        <input 
          type="text"
          value={config.ctaText}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
          placeholder="CTA text..."
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold tracking-wide">Bg</label>
          <div className="relative group">
            <input 
              type="color"
              value={config.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-full h-10 p-0.5 border border-gray-200 bg-white cursor-pointer rounded-lg overflow-hidden"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold tracking-wide">Text</label>
          <input 
            type="color"
            value={config.textColor}
            onChange={(e) => handleChange('textColor', e.target.value)}
            className="w-full h-10 p-0.5 border border-gray-200 bg-white cursor-pointer rounded-lg overflow-hidden"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold tracking-wide">Brand</label>
          <button 
            onClick={() => {
              handleChange('accentColor', accentColor);
            }}
            className="w-full h-10 text-[10px] font-bold text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
            title="Apply Brand Color to Button"
          >
            Use Brand
          </button>
        </div>
      </div>
      
      <div>
        <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold tracking-wide">Button Color</label>
        <input 
          type="color"
          value={config.accentColor}
          onChange={(e) => handleChange('accentColor', e.target.value)}
          className="w-full h-8 p-0.5 border border-gray-200 bg-white cursor-pointer rounded-lg overflow-hidden"
        />
      </div>

      {/* Mini Preview */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <label className="text-[10px] text-gray-500 block mb-2 uppercase font-bold tracking-wide">Live Preview</label>
        <div 
          className="aspect-[4/3] rounded-xl p-4 flex flex-col justify-center items-center text-center gap-2 overflow-hidden border border-gray-100 shadow-inner"
          style={{ backgroundColor: config.backgroundColor }}
        >
          <div className="text-sm font-bold leading-tight" style={{ color: config.textColor }}>
            {config.headingText || 'Join Our Community'}
          </div>
          <div className="text-[8px] leading-snug opacity-80" style={{ color: config.textColor }}>
            {config.subheadingText || 'Get the latest updates delivered straight to your inbox.'}
          </div>
          <div 
            className="mt-2 w-fit px-3 py-1.5 text-[7px] font-bold text-white rounded shadow-sm"
            style={{ backgroundColor: config.accentColor }}
          >
            {config.ctaText || 'Visit website'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPageSettings;
