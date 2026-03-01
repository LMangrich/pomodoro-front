/**
 * Security utilities for input validation and sanitization
 */

export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') 
    .replace(/javascript:/gi, '') 
    .replace(/on\w+=/gi, '')
    .replace(/data:text\/html/gi, '') 
    .replace(/vbscript:/gi, '');
}

export function sanitizeName(name: string): string {
  if (!name) return '';
  
  return name
    .replace(/[^a-zA-ZÀ-ÿ '-]/g, '')
    .substring(0, 100);
}

export function sanitizeNumericInput(input: string): string {
  if (!input) return '';
  return input.replace(/\D/g, '');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateContent(content: string, maxLength: number = 1000): boolean {
  if (content.length > maxLength) return false;
  
  const suspiciousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
  ];

  return !suspiciousPatterns.some(pattern => pattern.test(content));
}
