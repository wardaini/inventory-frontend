// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 6 characters
  if (password.length < 6) return false;
  return true;
};

// Validate phone number (Indonesian format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(08|628|\+628)[0-9]{8,11}$/;
  return phoneRegex.test(phone);
};

// Validate required field
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Validate number range
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Validate SKU format (alphanumeric with hyphens)
export const isValidSKU = (sku) => {
  const skuRegex = /^[A-Z0-9-]+$/;
  return skuRegex.test(sku);
};

// Get validation error message
export const getValidationMessage = (field, rule, value) => {
  const messages = {
    required: `${field} is required`,
    email: 'Please enter a valid email address',
    password: 'Password must be at least 6 characters',
    phone: 'Please enter a valid phone number',
    minLength: `${field} must be at least ${value} characters`,
    maxLength: `${field} cannot exceed ${value} characters`,
    min: `${field} must be at least ${value}`,
    max: `${field} cannot exceed ${value}`,
    sku: 'SKU must contain only uppercase letters, numbers, and hyphens',
  };
  return messages[rule] || 'Invalid input';
};