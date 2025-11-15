// Input sanitization utility to prevent XSS attacks

/**
 * Sanitize user input to prevent XSS attacks
 * This is a basic implementation. In production, use DOMPurify library
 */

// HTML entities to escape
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

// Dangerous patterns to detect
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick, onerror, etc.
  /<iframe/gi,
  /<embed/gi,
  /<object/gi,
];

/**
 * Escape HTML entities in a string
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, char => HTML_ENTITIES[char] || char);
}

/**
 * Remove dangerous HTML/JS from string
 */
export function stripDangerousContent(input: string): string {
  let sanitized = input;
  
  // Remove dangerous patterns
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
}

/**
 * Sanitize search query input
 * - Remove dangerous HTML/JS
 * - Trim whitespace
 * - Limit length
 */
export function sanitizeSearchQuery(query: string, maxLength: number = 500): string {
  if (!query || typeof query !== 'string') {
    return '';
  }

  let sanitized = query.trim();
  
  // Remove dangerous content
  sanitized = stripDangerousContent(sanitized);
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  return sanitized;
}

/**
 * Sanitize text for display (escape HTML)
 */
export function sanitizeForDisplay(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return escapeHtml(text.trim());
}

/**
 * Validate URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();
  const lowerUrl = trimmed.toLowerCase();

  // Block dangerous protocols
  if (
    lowerUrl.startsWith('javascript:') ||
    lowerUrl.startsWith('data:') ||
    lowerUrl.startsWith('vbscript:')
  ) {
    return '';
  }

  // Only allow http, https, mailto
  if (
    !lowerUrl.startsWith('http://') &&
    !lowerUrl.startsWith('https://') &&
    !lowerUrl.startsWith('mailto:') &&
    !lowerUrl.startsWith('/')
  ) {
    return '';
  }

  return trimmed;
}

/**
 * Validate and sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') {
    return '';
  }

  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '');
  
  // Remove special characters except dots, hyphens, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    const name = sanitized.substring(0, 255 - ext.length);
    sanitized = name + ext;
  }
  
  return sanitized;
}

/**
 * Detect and warn about potential XSS attempts
 */
export function detectXSSAttempt(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Check for dangerous patterns
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Rate limiting tracker (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const requests = rateLimitMap.get(identifier) || [];
  
  // Filter out old requests
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  
  return { 
    allowed: true, 
    remaining: maxRequests - recentRequests.length 
  };
}

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  const windowMs = 60000;
  
  for (const [key, requests] of rateLimitMap.entries()) {
    const recentRequests = requests.filter(time => now - time < windowMs);
    if (recentRequests.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recentRequests);
    }
  }
}, 60000); // Clean every minute
