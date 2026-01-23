
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PageItem, PageType, MarketingPageConfig, AppState } from './types';
import { DEFAULT_ACCENT_COLOR, DEFAULT_MARKETING_CONFIG, ICONS } from './constants';
import { pdfService } from './services/pdfService';

// Components
import FileUploader from './components/FileUploader';
import PageCanvas from './components/PageCanvas';
import ExportPanel from './components/ExportPanel';
import MarketingPageSettings from './components/MarketingPageSettings';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [marketingPageEnabled, setMarketingPageEnabled] = useState(false);
  const [marketingConfig, setMarketingConfig] = useState<MarketingPageConfig>(DEFAULT_MARKETING_CONFIG);
  const [exportFileName, setExportFileName] = useState(`LeadMagnet_${new Date().toISOString().split('T')[0]}`);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
  const [isExporting, setIsExporting] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Persistence: Load session
  useEffect(() => {
    const saved = localStorage.getItem('calmpdf_session');
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        if (parsed.pages) setPages(parsed.pages);
        if (parsed.marketingPageEnabled !== undefined) setMarketingPageEnabled(parsed.marketingPageEnabled);
        if (parsed.marketingConfig) setMarketingConfig(parsed.marketingConfig);
        if (parsed.exportFileName) setExportFileName(parsed.exportFileName);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
      } catch (e) {
        console.error('Failed to restore session', e);
        localStorage.removeItem('calmpdf_session');
      }
    }
  }, []);

  // Persistence: Save session
  useEffect(() => {
    try {
      const state: AppState = { pages, marketingPageEnabled, marketingConfig, exportFileName, accentColor };
      localStorage.setItem('calmpdf_session', JSON.stringify(state));
    } catch (e) {
      console.warn('Storage quota exceeded.', e);
    }
  }, [pages, marketingPageEnabled, marketingConfig, exportFileName, accentColor]);

  const handleFilesAdded = async (files: File[]) => {
    setIsProcessingFiles(true);
    const errors: string[] = [];
    try {
      const newPages: PageItem[] = [];
      for (const file of files) {
        try {
          if (file.type.startsWith('image/')) {
            const page = await pdfService.processImage(file);
            newPages.push(page);
          } else if (file.type === 'application/pdf') {
            const pdfPages = await pdfService.processPdf(file);
            newPages.push(...pdfPages);
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          errors.push(`${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
        }
      }
      
      if (newPages.length > 0) {
        setPages(prev => [...prev, ...newPages]);
      }
      
      if (errors.length > 0) {
        alert(`Some files could not be processed:\n\n${errors.join('\n')}`);
      }
    } catch (globalError) {
      console.error('Fatal processing error:', globalError);
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const handleClearAll = () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      // Reset confirmation after 3 seconds if not clicked
      setTimeout(() => setIsConfirmingClear(false), 3000);
      return;
    }
    setPages([]);
    setIsConfirmingClear(false);
  };

  const handleRemovePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const handleRotatePage = (id: string) => {
    setPages(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, rotation: (p.rotation + 90) % 360 };
      }
      return p;
    }));
  };

  const handleReorder = (newPages: PageItem[]) => {
    setPages(newPages);
  };

  const handleExport = async () => {
    if (pages.length === 0) return;
    setIsExporting(true);
    try {
      await pdfService.exportPdf({
        pages,
        marketingPageEnabled,
        marketingConfig,
        fileName: exportFileName
      });
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: accentColor }}>
            <span className="font-bold text-sm">C</span>
          </div>
          <h1 className="text-xl font-medium tracking-tight text-gray-800">CalmPDF</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-normal">
            {pages.length} {pages.length === 1 ? 'page' : 'pages'}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-6 gap-8 max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar */}
        <section className="w-full md:w-80 flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Add Content</h2>
            <FileUploader onFilesAdded={handleFilesAdded} isProcessing={isProcessingFiles} />
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Brand Color</h2>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#1F2937'].map(color => (
                  <button 
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${accentColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={accentColor} 
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 p-0 border border-gray-200 bg-white cursor-pointer rounded-lg overflow-hidden"
                />
                <span className="text-xs text-gray-500 font-mono uppercase">{accentColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Marketing Page</h2>
              <button 
                onClick={() => setMarketingPageEnabled(!marketingPageEnabled)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${marketingPageEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                style={{ backgroundColor: marketingPageEnabled ? accentColor : undefined }}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${marketingPageEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            {marketingPageEnabled && (
              <MarketingPageSettings 
                config={marketingConfig} 
                onChange={setMarketingConfig} 
                accentColor={accentColor}
              />
            )}
          </div>
        </section>

        {/* Canvas Area */}
        <section className="flex-1 bg-gray-50/50 rounded-2xl p-6 min-h-[500px] flex flex-col relative border border-gray-100">
          <div className="mb-4 flex justify-between items-center">
             <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Arrangement</h2>
             <button 
                onClick={handleClearAll}
                className={`text-xs font-bold transition-all px-3 py-1 rounded-full ${
                  isConfirmingClear 
                  ? 'bg-red-500 text-white shadow-lg scale-105' 
                  : 'text-red-400 hover:text-red-600'
                } ${pages.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                disabled={pages.length === 0}
             >
               {isConfirmingClear ? 'Confirm Clear All?' : 'Clear All'}
             </button>
          </div>
          
          {pages.length === 0 && !isProcessingFiles ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 paper-shadow text-gray-200">
                <ICONS.Plus />
              </div>
              <p className="text-gray-400 font-light max-w-xs text-sm">
                Your canvas is empty. Drag and drop PDF pages or images here to begin.
              </p>
            </div>
          ) : (
            <PageCanvas 
              pages={pages} 
              onReorder={handleReorder} 
              onRemove={handleRemovePage}
              onRotate={handleRotatePage}
            />
          )}

          {isProcessingFiles && (
            <div className="mt-4 p-3 bg-white/90 backdrop-blur shadow-xl border border-indigo-100 text-indigo-600 rounded-xl text-xs text-center animate-pulse flex items-center justify-center gap-3 sticky bottom-0">
              <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
              Ingesting assets...
            </div>
          )}
        </section>

        {/* Right Sidebar */}
        <section className="w-full md:w-80 flex flex-col gap-6">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Export</h2>
          <ExportPanel 
            fileName={exportFileName}
            setFileName={setExportFileName}
            onExport={handleExport}
            isExporting={isExporting}
            canExport={pages.length > 0}
            accentColor={accentColor}
          />

          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-xs text-gray-400 leading-relaxed">
            <p className="mb-2 font-bold text-gray-500 uppercase tracking-tighter">Guide</p>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-indigo-400">01</span> Upload images or multi-page PDFs.</li>
              <li className="flex gap-2"><span className="text-indigo-400">02</span> Drag cards to reorder.</li>
              <li className="flex gap-2"><span className="text-indigo-400">03</span> Use the Marketing Page for CTAs.</li>
              <li className="flex gap-2"><span className="text-indigo-400">04</span> Files are processed 100% locally.</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
