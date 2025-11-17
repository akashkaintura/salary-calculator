/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';
  
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove SQL injection patterns (basic)
    .replace(/['";\\]/g, '')
    // Limit length to prevent DoS
    .substring(0, 500);
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(input: any): number | null {
  if (input === null || input === undefined || input === '') return null;
  
  const num = typeof input === 'string' ? parseFloat(input) : Number(input);
  
  if (isNaN(num) || !isFinite(num)) return null;
  
  // Prevent extremely large numbers (potential DoS)
  if (Math.abs(num) > Number.MAX_SAFE_INTEGER) return null;
  
  return num;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: string | null | undefined): string {
  if (!input) return '';
  
  const email = input.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) return '';
  
  // Additional check for dangerous characters
  if (/[<>'"\\]/.test(email)) return '';
  
  return email.substring(0, 255);
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(input: string | null | undefined): string {
  if (!input) return '';
  
  const url = input.trim();
  
  // Only allow http, https protocols
  if (!/^https?:\/\//i.test(url)) return '';
  
  // Remove dangerous characters
  if (/[<>'"\\]/.test(url)) return '';
  
  return url.substring(0, 2048);
}

/**
 * Validate and sanitize city name
 */
export function sanitizeCity(input: string | null | undefined): string {
  if (!input) return '';
  
  // Only allow letters, spaces, hyphens, and common city name characters
  const sanitized = input.trim().replace(/[^a-zA-Z\s\-'.,()]/g, '');
  
  return sanitized.substring(0, 100);
}

/**
 * Validate and sanitize company name
 */
export function sanitizeCompany(input: string | null | undefined): string {
  if (!input) return '';
  
  // Allow letters, numbers, spaces, and common company name characters
  const sanitized = input.trim().replace(/[^a-zA-Z0-9\s\-'.,()&]/g, '');
  
  return sanitized.substring(0, 200);
}

