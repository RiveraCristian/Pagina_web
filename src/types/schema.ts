/**
 * Schema Types - VoiceSearch Framework
 * Definiciones de tipos para configuración y datos del sistema
 */

// ==================== CONFIG TYPES ====================

export interface SiteConfig {
  site: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    url: string;
    language: string;
    timezone: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    twitterHandle?: string;
  };
  features: {
    voiceSearch: boolean;
    textSearch: boolean;
    darkMode: boolean;
    particles: boolean;
    animations: boolean;
    pwa: boolean;
    analytics: boolean;
  };
  search: {
    placeholder: string;
    voiceButtonText: string;
    maxResults: number;
    fuzzySearch: boolean;
    searchInFields: string[];
  };
}

// ==================== THEME TYPES ====================

export interface ThemeConfig {
  mode: 'dark' | 'light' | 'auto';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    headingFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  effects: {
    particles: {
      enabled: boolean;
      count: number;
      color: string;
      speed: number;
      size: number;
    };
    animations: {
      level: 'none' | 'low' | 'medium' | 'high';
      duration: string;
      easing: string;
    };
    blur: {
      enabled: boolean;
      amount: string;
    };
  };
  logo: {
    path: string;
    width: number;
    height: number;
    compactWidth: number;
    compactHeight: number;
  };
}

// ==================== FIELD TYPES ====================

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'url'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'boolean'
  | 'image'
  | 'file'
  | 'tags'
  | 'color'
  | 'markdown'
  | 'richtext'
  | 'json'
  | 'relation'
  | 'slug';

export interface FieldDefinition {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  searchable: boolean;
  placeholder?: string;
  helpText?: string;
  default?: any;

  // Text/Textarea
  maxLength?: number;
  minLength?: number;
  rows?: number;

  // Number
  min?: number;
  max?: number;
  step?: number;

  // Select/Radio
  options?: string[];

  // Image/File
  accept?: string;
  maxSize?: number; // bytes

  // Tags
  maxTags?: number;

  // Validation
  pattern?: string;
  validation?: {
    regex?: string;
    message?: string;
    maxLength?: number;
    minLength?: number;
    min?: number;
    max?: number;
    options?: string;
  };
}

// ==================== CATEGORY TYPES ====================

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  itemsFile: string;
  searchWeight: number;
  displayOrder: number;
  fields: FieldDefinition[];
}

export interface CategoriesConfig {
  categories: Category[];
}

// ==================== ITEM TYPES ====================

export interface Item {
  id: string;
  categoryId: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  publishedAt?: string;
  data: Record<string, any>; // Dynamic data based on category fields
}

export interface ItemsCollection {
  items: Item[];
}

// ==================== HELPER TYPES ====================

export interface SearchResult {
  item: Item;
  category: Category;
  relevance: number;
  matchedFields: string[];
}

// ==================== ERROR TYPES ====================

export class ConfigError extends Error {
  field?: string;
  
  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ConfigError';
    this.field = field;
  }
}

export class ValidationError extends Error {
  field: string;
  value: any;
  
  constructor(message: string, field: string, value: any) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}
