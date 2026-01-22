
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';
import * as pdfjsLib from 'https://esm.sh/pdfjs-dist@3.11.174';
import { PageItem, PageType, MarketingPageConfig } from '../types';

// Robustly resolve the PDF.js library object
const pdfjs: any = (pdfjsLib as any).getDocument ? pdfjsLib : (pdfjsLib as any).default;

// Configure the worker
if (pdfjs && pdfjs.GlobalWorkerOptions) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
}

// Standard PDF point width (US Letter width = 8.5" * 72 points/inch)
const TARGET_WIDTH_POINTS = 612;

export const pdfService = {
  /**
   * Normalizes any image file into a standard JPEG data URL and scales dimensions to points.
   */
  async processImage(file: File): Promise<PageItem> {
    try {
      const originalDataUrl = await this.fileToDataUrl(file);
      
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error(`Failed to load image file: ${file.name}`));
        img.src = originalDataUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context.');
      
      ctx.drawImage(img, 0, 0);
      const normalizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

      const aspectRatio = img.height / img.width;
      const widthPoints = TARGET_WIDTH_POINTS;
      const heightPoints = widthPoints * aspectRatio;
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: PageType.IMAGE,
        sourceFileName: file.name,
        pageIndex: 0,
        rotation: 0,
        width: widthPoints,
        height: heightPoints,
        dataUrl: normalizedDataUrl,
      };
    } catch (e) {
      console.error(`Image processing failed for ${file.name}:`, e);
      throw new Error(`Failed to process image ${file.name}: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  },

  async processPdf(file: File): Promise<PageItem[]> {
    try {
      if (!pdfjs || !pdfjs.getDocument) {
        throw new Error('PDF.js library is not properly loaded. Please refresh the page.');
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ 
        data: arrayBuffer,
        disableWorker: false,
        stopAtErrors: false 
      });
      
      const pdf = await loadingTask.promise;
      const pages: PageItem[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        
        const viewport = page.getViewport({ scale: 1.5 });
        const originalViewport = page.getViewport({ scale: 1.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context generation failed.');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        const aspectRatio = originalViewport.height / originalViewport.width;
        const widthPoints = TARGET_WIDTH_POINTS;
        const heightPoints = widthPoints * aspectRatio;
        
        pages.push({
          id: Math.random().toString(36).substr(2, 9),
          type: PageType.PDF_PAGE,
          sourceFileName: file.name,
          pageIndex: i - 1,
          rotation: 0,
          width: widthPoints,
          height: heightPoints,
          dataUrl,
        });
        
        canvas.width = 0;
        canvas.height = 0;
      }
      return pages;
    } catch (e) {
      console.error(`PDF extraction failed for ${file.name}:`, e);
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      throw new Error(`Failed to read PDF "${file.name}". ${errorMsg}`);
    }
  },

  base64ToUint8Array(base64: string): Uint8Array {
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  },

  async exportPdf({ pages, marketingPageEnabled, marketingConfig, fileName }: {
    pages: PageItem[];
    marketingPageEnabled: boolean;
    marketingConfig: MarketingPageConfig;
    fileName: string;
  }) {
    const pdfDoc = await PDFDocument.create();

    for (const page of pages) {
      try {
        const isPng = page.dataUrl.includes('image/png');
        const isJpg = page.dataUrl.includes('image/jpeg') || page.dataUrl.includes('image/jpg');
        
        const base64Parts = page.dataUrl.split(',');
        if (base64Parts.length < 2) continue;
        
        const base64Data = base64Parts[1];
        const imageBytes = this.base64ToUint8Array(base64Data);
        
        let image;
        if (isPng) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (isJpg) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          continue;
        }
        
        const isRotated = page.rotation === 90 || page.rotation === 270;
        const pageWidth = isRotated ? page.height : page.width;
        const pageHeight = isRotated ? page.width : page.height;

        const outputPage = pdfDoc.addPage([pageWidth, pageHeight]);
        
        outputPage.drawImage(image, {
          x: page.rotation === 90 ? pageWidth : page.rotation === 180 ? pageWidth : 0,
          y: page.rotation === 180 ? pageHeight : page.rotation === 270 ? pageHeight : 0,
          width: isRotated ? page.height : page.width,
          height: isRotated ? page.width : page.height,
          rotate: { type: 'degrees', angle: -page.rotation } as any,
        });
      } catch (e) {
        console.error(`Error during PDF export for page ${page.id}:`, e);
      }
    }

    if (marketingPageEnabled) {
      const marketingPage = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const bg = this.hexToRgb(marketingConfig.backgroundColor);
      marketingPage.drawRectangle({
        x: 0,
        y: 0,
        width: 612,
        height: 792,
        color: rgb(bg.r / 255, bg.g / 255, bg.b / 255),
      });

      const textCol = this.hexToRgb(marketingConfig.textColor);
      const textColor = rgb(textCol.r / 255, textCol.g / 255, textCol.b / 255);

      const accentCol = this.hexToRgb(marketingConfig.accentColor);
      const accentColor = rgb(accentCol.r / 255, accentCol.g / 255, accentCol.b / 255);

      // Centered layout for marketing page
      const title = marketingConfig.headingText || 'Join Our Community';
      const titleSize = 28 * (marketingConfig.fontScale || 1);
      const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);

      marketingPage.drawText(title, {
        x: (612 - titleWidth) / 2,
        y: 500,
        size: titleSize,
        font: fontBold,
        color: textColor,
      });

      const sub = marketingConfig.subheadingText || '';
      const subSize = 14 * (marketingConfig.fontScale || 1);
      marketingPage.drawText(sub, {
        x: 80,
        y: 440,
        size: subSize,
        font: font,
        color: textColor,
        maxWidth: 452,
        lineHeight: 20,
      });

      // CTA Button
      const ctaText = marketingConfig.ctaText || 'Visit website';
      const ctaWidth = fontBold.widthOfTextAtSize(ctaText, 14);
      const btnWidth = Math.max(200, ctaWidth + 60);
      const btnX = (612 - btnWidth) / 2;

      marketingPage.drawRectangle({
        x: btnX,
        y: 340,
        width: btnWidth,
        height: 50,
        color: accentColor,
      });

      marketingPage.drawText(ctaText, {
        x: btnX + (btnWidth - ctaWidth) / 2,
        y: 360,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },

  fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('File reading failed.'));
      reader.readAsDataURL(file);
    });
  },

  hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
};
