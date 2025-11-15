// Cache utility for search results and recent queries

const CACHE_VERSION = 'v1';
const CACHE_KEYS = {
  RECENT_SEARCHES: `recent_searches_${CACHE_VERSION}`,
  SEARCH_RESULTS: `search_results_${CACHE_VERSION}`,
  PREFERENCES: `user_preferences_${CACHE_VERSION}`,
};

const MAX_RECENT_SEARCHES = 10;
const MAX_CACHED_RESULTS = 20;
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedResult {
  query: string;
  result: any;
  timestamp: number;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

// Get from localStorage with error handling
function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

// Set to localStorage with error handling
function setToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    // If quota exceeded, clear old cache
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

// Clear expired cache entries
function clearOldCache() {
  const results = getFromStorage<CachedResult[]>(CACHE_KEYS.SEARCH_RESULTS) || [];
  const now = Date.now();
  const validResults = results.filter(r => now - r.timestamp < CACHE_EXPIRY_MS);
  setToStorage(CACHE_KEYS.SEARCH_RESULTS, validResults);
}

// Cache management functions
export const cacheManager = {
  // Recent searches
  getRecentSearches(): RecentSearch[] {
    return getFromStorage<RecentSearch[]>(CACHE_KEYS.RECENT_SEARCHES) || [];
  },

  addRecentSearch(query: string) {
    const searches = this.getRecentSearches();
    const newSearch: RecentSearch = {
      query: query.toLowerCase(),
      timestamp: Date.now(),
    };

    // Remove duplicates
    const filtered = searches.filter(s => s.query !== newSearch.query);
    
    // Add new search at the beginning
    const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    
    setToStorage(CACHE_KEYS.RECENT_SEARCHES, updated);
  },

  clearRecentSearches() {
    localStorage.removeItem(CACHE_KEYS.RECENT_SEARCHES);
  },

  // Search results
  getCachedResult(query: string): any | null {
    const results = getFromStorage<CachedResult[]>(CACHE_KEYS.SEARCH_RESULTS) || [];
    const normalizedQuery = query.toLowerCase().trim();
    const now = Date.now();

    const cached = results.find(
      r => r.query === normalizedQuery && now - r.timestamp < CACHE_EXPIRY_MS
    );

    return cached ? cached.result : null;
  },

  cacheResult(query: string, result: any) {
    const results = getFromStorage<CachedResult[]>(CACHE_KEYS.SEARCH_RESULTS) || [];
    const normalizedQuery = query.toLowerCase().trim();
    
    // Remove old entry for same query
    const filtered = results.filter(r => r.query !== normalizedQuery);
    
    // Add new result
    const newResult: CachedResult = {
      query: normalizedQuery,
      result,
      timestamp: Date.now(),
    };

    const updated = [newResult, ...filtered].slice(0, MAX_CACHED_RESULTS);
    setToStorage(CACHE_KEYS.SEARCH_RESULTS, updated);
  },

  clearCachedResults() {
    localStorage.removeItem(CACHE_KEYS.SEARCH_RESULTS);
  },

  // User preferences
  getPreferences(): Record<string, any> {
    return getFromStorage(CACHE_KEYS.PREFERENCES) || {};
  },

  setPreference(key: string, value: any) {
    const prefs = this.getPreferences();
    prefs[key] = value;
    setToStorage(CACHE_KEYS.PREFERENCES, prefs);
  },

  // Clear all cache
  clearAll() {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Get cache size info
  getCacheSize(): { used: number; available: number } {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        used += (localStorage.getItem(key) || '').length;
      }
    }
    
    // Estimate available space (5MB typical limit)
    const available = 5 * 1024 * 1024 - used;
    
    return { used, available };
  },
};
