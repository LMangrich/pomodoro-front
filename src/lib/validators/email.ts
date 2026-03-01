/**
 * Validates email format and length
 */
export const validateEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) {
    return false;
  }
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim().toLowerCase()) && email.length <= 254;
};
