/**
 * Validates name (at least 2 words)
 */
export const validateFullName = (name: string): boolean => {
  const trimmedName = name.trim();
  if (trimmedName.length < 3) return false;
  
  const words = trimmedName.split(/\s+/);
  return words.length >= 2 && words.every(word => word.length > 0);
};
