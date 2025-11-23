/**
 * FileManager - Sistema de gestión de archivos JSON
 * 
 * En desarrollo: Usa API del Vite plugin para leer/escribir archivos
 * En producción: Lee archivos compilados en el bundle
 */

import type {
  SiteConfig,
  ThemeConfig,
  CategoriesConfig,
  Category,
  Item,
  ItemsCollection,
} from '@/types/schema';

// Import de archivos JSON (en build time)
import configData from '@/data/config.json';
import themeData from '@/data/theme.json';
import categoriesData from '@/data/categories.json';

const isDev = import.meta.env.DEV;
const API_BASE = isDev ? '/api' : '';

/**
 * Clase para gestionar archivos de configuración y datos
 */
export class FileManager {
  // ==================== CONFIG ====================

  /**
   * Leer configuración general del sitio
   */
  static async readConfig(): Promise<SiteConfig> {
    if (isDev) {
      try {
        const response = await fetch(`${API_BASE}/config`);
        if (!response.ok) throw new Error('Failed to fetch config');
        return response.json();
      } catch (error) {
        console.warn('Failed to fetch config from API, using static import:', error);
        return configData as SiteConfig;
      }
    }
    return configData as SiteConfig;
  }

  /**
   * Guardar configuración general
   */
  static async saveConfig(config: SiteConfig): Promise<void> {
    if (!isDev) {
      throw new Error('Cannot save config in production mode');
    }

    const response = await fetch(`${API_BASE}/save-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config, null, 2),
    });

    if (!response.ok) {
      throw new Error('Failed to save config');
    }
  }

  // ==================== THEME ====================

  /**
   * Leer configuración del tema
   */
  static async readTheme(): Promise<ThemeConfig> {
    if (isDev) {
      try {
        const response = await fetch(`${API_BASE}/theme`);
        if (!response.ok) throw new Error('Failed to fetch theme');
        return response.json();
      } catch (error) {
        console.warn('Failed to fetch theme from API, using static import:', error);
        return themeData as ThemeConfig;
      }
    }
    return themeData as ThemeConfig;
  }

  /**
   * Guardar configuración del tema
   */
  static async saveTheme(theme: ThemeConfig): Promise<void> {
    if (!isDev) {
      throw new Error('Cannot save theme in production mode');
    }

    const response = await fetch(`${API_BASE}/save-theme`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(theme, null, 2),
    });

    if (!response.ok) {
      throw new Error('Failed to save theme');
    }
  }

  // ==================== CATEGORIES ====================

  /**
   * Leer todas las categorías
   */
  static async readCategories(): Promise<CategoriesConfig> {
    if (isDev) {
      try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) {
          console.warn(`Categories API returned ${response.status}, using static import`);
          return categoriesData as CategoriesConfig;
        }
        const data = await response.json();
        console.log('✅ Categories loaded from API:', data.categories?.length || 0, 'categories');
        return data;
      } catch (error) {
        console.warn('Failed to fetch categories from API, using static import:', error);
        return categoriesData as CategoriesConfig;
      }
    }
    return categoriesData as CategoriesConfig;
  }

  /**
   * Guardar todas las categorías
   */
  static async saveCategories(categories: CategoriesConfig): Promise<void> {
    if (!isDev) {
      throw new Error('Cannot save categories in production mode');
    }

    const response = await fetch(`${API_BASE}/save-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categories, null, 2),
    });

    if (!response.ok) {
      throw new Error('Failed to save categories');
    }
  }

  /**
   * Obtener una categoría específica por ID
   */
  static async getCategory(categoryId: string): Promise<Category | null> {
    try {
      const categories = await this.readCategories();
      if (!categories || !Array.isArray(categories.categories)) {
        console.error('Invalid categories structure:', categories);
        return null;
      }
      return categories.categories.find((c: Category) => c.id === categoryId) || null;
    } catch (error) {
      console.error('Error getting category:', error);
      return null;
    }
  }

  // ==================== ITEMS ====================

  /**
   * Leer items de una categoría
   */
  static async readItems(categoryId: string): Promise<Item[]> {
    if (isDev) {
      try {
        const response = await fetch(`${API_BASE}/items/${categoryId}`);
        if (!response.ok) throw new Error(`Failed to fetch items for ${categoryId}`);
        const data: ItemsCollection = await response.json();
        return data.items;
      } catch (error) {
        console.warn(`Failed to fetch items for ${categoryId}, using dynamic import:`, error);
        // Fallback a import dinámico
        try {
          const module = await import(`@/data/items/${categoryId}.json`);
          return module.default.items;
        } catch {
          return [];
        }
      }
    }

    // En producción, usar import dinámico
    try {
      const module = await import(`@/data/items/${categoryId}.json`);
      return module.default.items;
    } catch {
      console.warn(`No items found for category: ${categoryId}`);
      return [];
    }
  }

  /**
   * Guardar items de una categoría
   */
  static async saveItems(categoryId: string, items: Item[]): Promise<void> {
    if (!isDev) {
      throw new Error('Cannot save items in production mode');
    }

    console.log(`🔄 FileManager.saveItems called for category: ${categoryId}`);
    console.log(`📊 Number of items to save: ${items.length}`);
    console.log(`📋 Items preview:`, items.map(item => ({ id: item.id, title: item.data?.title || item.data?.titulo || 'No title' })));

    const data: ItemsCollection = { items };

    const response = await fetch(`${API_BASE}/save-items/${categoryId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data, null, 2),
    });

    console.log(`📡 API Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error:`, errorText);
      throw new Error(`Failed to save items for ${categoryId}: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ FileManager.saveItems completed:`, result);
  }

  /**
   * Obtener un item específico
   */
  static async getItem(categoryId: string, itemId: string): Promise<Item | null> {
    const items = await this.readItems(categoryId);
    return items.find((item) => item.id === itemId) || null;
  }

  /**
   * Crear un nuevo item
   */
  static async createItem(categoryId: string, itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    console.log(`🆕 Creating new item for category: ${categoryId}`);
    console.log(`📝 Item data:`, itemData);
    
    const items = await this.readItems(categoryId);
    console.log(`📊 Current items count: ${items.length}`);

    const newItem: Item = {
      ...itemData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log(`🔑 Generated item ID: ${newItem.id}`);
    items.push(newItem);
    console.log(`📈 New items count: ${items.length}`);
    
    await this.saveItems(categoryId, items);
    console.log(`✅ Item created successfully: ${newItem.id}`);

    return newItem;
  }

  /**
   * Actualizar un item existente
   */
  static async updateItem(categoryId: string, itemId: string, updates: Partial<Item>): Promise<Item> {
    console.log(`📝 Updating item ${itemId} in category: ${categoryId}`);
    console.log(`🔄 Updates:`, updates);
    
    const items = await this.readItems(categoryId);
    console.log(`📊 Current items count: ${items.length}`);
    
    const index = items.findIndex((item) => item.id === itemId);

    if (index === -1) {
      console.error(`❌ Item ${itemId} not found in category ${categoryId}`);
      throw new Error(`Item ${itemId} not found in category ${categoryId}`);
    }

    console.log(`📍 Found item at index: ${index}`);
    const updatedItem: Item = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    await this.saveItems(categoryId, items);
    console.log(`✅ Item updated successfully: ${itemId}`);

    return updatedItem;
  }

  /**
   * Eliminar un item
   */
  static async deleteItem(categoryId: string, itemId: string): Promise<void> {
    const items = await this.readItems(categoryId);
    const filtered = items.filter((item) => item.id !== itemId);

    if (filtered.length === items.length) {
      throw new Error(`Item ${itemId} not found in category ${categoryId}`);
    }

    await this.saveItems(categoryId, filtered);
  }

  // ==================== IMAGES ====================

  /**
   * Subir una imagen
   */
  static async uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
    if (!isDev) {
      throw new Error('Cannot upload images in production mode');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${API_BASE}/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  }

  /**
   * Eliminar una imagen
   */
  static async deleteImage(url: string): Promise<void> {
    if (!isDev) {
      throw new Error('Cannot delete images in production mode');
    }

    const response = await fetch(`${API_BASE}/delete-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  }

  // ==================== STATS ====================

  /**
   * Obtener estadísticas generales
   */
  static async getStats() {
    const categories = await this.readCategories();

    let totalItems = 0;
    let publishedItems = 0;
    let draftItems = 0;
    let archivedItems = 0;

    for (const category of categories.categories) {
      const items = await this.readItems(category.id);
      totalItems += items.length;
      publishedItems += items.filter((i) => i.status === 'published').length;
      draftItems += items.filter((i) => i.status === 'draft').length;
      archivedItems += items.filter((i) => i.status === 'archived').length;
    }

    return {
      totalCategories: categories.categories.length,
      totalItems,
      publishedItems,
      draftItems,
      archivedItems,
    };
  }

  /**
   * Obtener items recientes (últimos 10)
   */
  static async getRecentItems(limit: number = 10) {
    const categories = await this.readCategories();
    const allItems: Array<Item & { categoryName: string }> = [];

    for (const category of categories.categories) {
      const items = await this.readItems(category.id);
      allItems.push(
        ...items.map((item) => ({
          ...item,
          categoryName: category.name,
        }))
      );
    }

    // Ordenar por updatedAt descendente
    allItems.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return allItems.slice(0, limit);
  }

  // ==================== UTILITIES ====================

  /**
   * Generar ID único
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Validar que el modo desarrollo está activo
   */
  static assertDevMode(action: string): void {
    if (!isDev) {
      throw new Error(`${action} is only available in development mode`);
    }
  }

  /**
   * Verificar si hay cambios pendientes de guardar
   */
  static hasUnsavedChanges(): boolean {
    return localStorage.getItem('hasUnsavedChanges') === 'true';
  }

  /**
   * Marcar cambios como pendientes
   */
  static markAsChanged(): void {
    localStorage.setItem('hasUnsavedChanges', 'true');
  }

  /**
   * Limpiar marca de cambios pendientes
   */
  static clearChanges(): void {
    localStorage.removeItem('hasUnsavedChanges');
  }
}

// Export default
export default FileManager;
