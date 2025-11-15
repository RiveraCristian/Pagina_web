// Prefetch utility for preloading resources

/**
 * Prefetch a URL using link rel="prefetch"
 */
export function prefetchUrl(url: string) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = 'fetch';
  document.head.appendChild(link);
}

/**
 * Preload an image
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Prefetch multiple images
 */
export async function prefetchImages(urls: string[]): Promise<void> {
  const promises = urls.map(url => preloadImage(url).catch(() => {
    console.warn(`Failed to prefetch image: ${url}`);
  }));
  
  await Promise.all(promises);
}

/**
 * Prefetch popular projects data
 */
export function prefetchPopularProjects(projectIds: string[]) {
  // This would ideally call an API endpoint
  // For now, we just preload images from those projects
  projectIds.forEach(id => {
    prefetchUrl(`/api/projects/${id}`);
  });
}

/**
 * DNS prefetch for external domains
 */
export function dnsPrefetch(domain: string) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
}

/**
 * Preconnect to external domains (DNS + TCP + TLS)
 */
export function preconnect(domain: string) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

// Initialize prefetching on idle
export function initializePrefetch() {
  if (typeof window === 'undefined') return;

  // Wait for page to be idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Prefetch common domains
      dnsPrefetch('https://fonts.googleapis.com');
      dnsPrefetch('https://fonts.gstatic.com');
      
      // Preconnect to API (if using external API)
      // preconnect('https://api.example.com');
    });
  }
}
