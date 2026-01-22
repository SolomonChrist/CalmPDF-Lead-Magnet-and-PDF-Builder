
export enum PageType {
  IMAGE = 'IMAGE',
  PDF_PAGE = 'PDF_PAGE',
  MARKETING_PAGE = 'MARKETING_PAGE'
}

export interface PageItem {
  id: string;
  type: PageType;
  sourceFileName: string;
  pageIndex: number; // For PDF files
  rotation: number; // Degrees (0, 90, 180, 270)
  width: number;
  height: number;
  dataUrl: string; // Preview/Storage
  originalFile?: File; // Keep reference if possible
}

export interface MarketingPageConfig {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  headingText: string;
  subheadingText: string;
  ctaText: string;
  fontScale: number;
}

export interface AppState {
  pages: PageItem[];
  marketingPageEnabled: boolean;
  marketingConfig: MarketingPageConfig;
  exportFileName: string;
  accentColor: string;
}
