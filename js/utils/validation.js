/**
 * Form validation utility functions
 */

/**
 * Validates if an email is in the correct format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a password meets minimum requirements
 * @param {string} password - The password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length required (default: 6)
 * @param {boolean} options.requireSpecialChar - Whether to require a special character
 * @param {boolean} options.requireNumber - Whether to require a number
 * @param {boolean} options.requireUppercase - Whether to require an uppercase letter
 * @returns {boolean} - Whether the password is valid
 */
export function isValidPassword(password, options = {}) {
  const {
    minLength = 6,
    requireSpecialChar = false,
    requireNumber = false,
    requireUppercase = false,
  } = options;

  // Check minimum length
  if (password.length < minLength) {
    return false;
  }

  // Check for special character if required
  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  // Check for number if required
  if (requireNumber && !/\d/.test(password)) {
    return false;
  }

  // Check for uppercase if required
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }

  return true;
}

/**
 * Validates if a string is not empty
 * @param {string} value - The string to validate
 * @returns {boolean} - Whether the string is not empty
 */
export function isNotEmpty(value) {
  return value.trim().length > 0;
}

/**
 * Validates if a value is a number
 * @param {string} value - The value to validate
 * @returns {boolean} - Whether the value is a number
 */
export function isNumber(value) {
  return !Number.isNaN(parseFloat(value)) && Number.isFinite(value);
}

/**
 * Validates if a value is within a range
 * @param {number} value - The value to validate
 * @param {number} min - The minimum allowed value
 * @param {number} max - The maximum allowed value
 * @returns {boolean} - Whether the value is within the range
 */
export function isInRange(value, min, max) {
  const num = parseFloat(value);
  return num >= min && num <= max;
}

/**
 * Validates if a string matches a specific pattern
 * @param {string} value - The string to validate
 * @param {RegExp} pattern - The pattern to match against
 * @returns {boolean} - Whether the string matches the pattern
 */
export function matchesPattern(value, pattern) {
  return pattern.test(value);
}

/**
 * Validates if a date is valid and optionally within a range
 * @param {string} dateStr - The date string to validate
 * @param {Object} options - Validation options
 * @param {Date} options.minDate - Minimum allowed date
 * @param {Date} options.maxDate - Maximum allowed date
 * @returns {boolean} - Whether the date is valid
 */
export function isValidDate(dateStr, options = {}) {
  const { minDate, maxDate } = options;

  // Check if it's a valid date
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  // Check minimum date if provided
  if (minDate && date < minDate) {
    return false;
  }

  // Check maximum date if provided
  if (maxDate && date > maxDate) {
    return false;
  }

  return true;
}

/**
 * Validates if a phone number is in a valid format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export function isValidPhone(phone) {
  // Remove any non-digit characters for validation
  const digits = phone.replace(/\D/g, '');

  // Most US phone numbers have 10 digits
  // Adjust this validation based on your country/format requirements
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Shows an error message for an input element
 * @param {HTMLElement} inputElement - The input element with the error
 * @param {string} message - The error message to display
 */
export function showError(inputElement, message) {
  // Remove any existing error
  clearError(inputElement);

  // Create error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;

  // Add error styling to input
  inputElement.classList.add('input-error');

  // Insert error after input
  inputElement.parentNode.appendChild(errorDiv);
}

/**
 * Clears error styling and messages for an input element
 * @param {HTMLElement} inputElement - The input element to clear errors from
 */
export function clearError(inputElement) {
  // Remove error styling
  inputElement.classList.remove('input-error');

  // Remove any error message
  const errorMessage = inputElement.parentNode.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}
