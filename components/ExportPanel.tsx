
import React from 'react';
import { ICONS } from '../constants';

interface ExportPanelProps {
  fileName: string;
  setFileName: (val: string) => void;
  onExport: () => void;
  isExporting: boolean;
  canExport: boolean;
  accentColor: string;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ 
  fileName, setFileName, onExport, isExporting, canExport, accentColor 
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <label className="text-[10px] text-gray-400 block mb-2 uppercase tracking-wide">Document Name</label>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 focus-within:border-indigo-200 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
          <input 
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent text-sm w-full focus:outline-none font-medium text-gray-700"
            placeholder="LeadMagnet_Name"
          />
          <span className="text-xs text-gray-400">.pdf</span>
        </div>
      </div>

      <button 
        onClick={onExport}
        disabled={!canExport || isExporting}
        className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-medium ${
          canExport && !isExporting 
          ? 'text-white paper-shadow hover:scale-[1.02] active:scale-[0.98]' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        style={{ backgroundColor: canExport && !isExporting ? accentColor : undefined }}
      >
        {isExporting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <ICONS.Download />
        )}
        <span>{isExporting ? 'Generating PDF...' : 'Export Lead Magnet'}</span>
      </button>

      {!canExport && (
        <p className="text-center text-xs text-gray-400 px-4">
          Upload at least one page to export.
        </p>
      )}
    </div>
  );
};

export default ExportPanel;
