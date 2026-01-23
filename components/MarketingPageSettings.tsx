
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

  const inputStyles = {
    backgroundColor: 'white',
    color: '#111827', // text-gray-900
    border: '1px solid #e5e7eb', // border-gray-200
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div>
        <label className="text-[10px] text-gray-400 block mb-1 uppercase font-bold tracking-wide">Headline</label>
        <input 
          type="text"
          value={config.headingText}
          onChange={(e) => handleChange('headingText', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-300"
          style={inputStyles}
          placeholder="e.g. Join Our Community"
        />
      </div>

      <div>
        <label className="text-[10px] text-gray-400 block mb-1 uppercase font-bold tracking-wide">Subheading</label>
        <textarea 
          rows={3}
          value={config.subheadingText}
          onChange={(e) => handleChange('subheadingText', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none transition-all placeholder:text-gray-300"
          style={inputStyles}
          placeholder="e.g. Get the latest tips..."
        />
      </div>

      <div>
        <label className="text-[10px] text-gray-400 block mb-1 uppercase font-bold tracking-wide">CTA Button Text</label>
        <input 
          type="text"
          value={config.ctaText}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-300"
          style={inputStyles}
          placeholder="e.g. Download Now"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-gray-400 block mb-1 uppercase font-bold tracking-wide">Page Background</label>
          <div className="flex items-center gap-2">
            <input 
              type="color"
              value={config.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-10 h-10 p-1 bg-white border border-gray-200 cursor-pointer rounded-lg overflow-hidden shrink-0"
            />
            <span className="text-[10px] text-gray-400 font-mono uppercase">{config.backgroundColor}</span>
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-400 block mb-1 uppercase font-bold tracking-wide">Text Color</label>
          <div className="flex items-center gap-2">
            <input 
              type="color"
              value={config.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-10 h-10 p-1 bg-white border border-gray-200 cursor-pointer rounded-lg overflow-hidden shrink-0"
            />
            <span className="text-[10px] text-gray-400 font-mono uppercase">{config.textColor}</span>
          </div>
        </div>
      </div>
      
      <div>
        <label className="text-[10px] text-gray-400 block mb-1 uppercase font-bold tracking-wide">Button Color</label>
        <div className="flex gap-2">
          <input 
            type="color"
            value={config.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
            className="w-full h-10 p-1 bg-white border border-gray-200 cursor-pointer rounded-lg overflow-hidden"
          />
          <button 
            onClick={() => handleChange('accentColor', accentColor)}
            className="px-3 py-2 text-[10px] font-bold text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            style={{ backgroundColor: accentColor }}
          >
            Use Brand
          </button>
        </div>
      </div>

      {/* Mini Preview Section */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <label className="text-[10px] text-gray-400 block mb-2 uppercase font-bold tracking-wide">Live Preview (Closing Page)</label>
        <div 
          className="aspect-square rounded-xl p-4 flex flex-col justify-center items-center text-center gap-2 overflow-hidden border border-gray-100"
          style={{ backgroundColor: config.backgroundColor }}
        >
          <div className="text-xs font-bold leading-tight" style={{ color: config.textColor }}>
            {config.headingText || 'Heading'}
          </div>
          <div className="text-[7px] leading-snug opacity-75" style={{ color: config.textColor }}>
            {config.subheadingText || 'Subheading details...'}
          </div>
          <div 
            className="mt-2 w-fit px-3 py-1.5 text-[6px] font-bold text-white rounded shadow-sm"
            style={{ backgroundColor: config.accentColor }}
          >
            {config.ctaText || 'CTA Button'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPageSettings;
