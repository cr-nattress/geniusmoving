/**
 * CSRF Protection Utility
 * 
 * Provides functionality to protect against Cross-Site Request Forgery attacks
 */

/**
 * Generates a secure random token for CSRF protection
 * @returns {string} - A random token
 */
function generateCSRFToken() {
  const array = new Uint8Array(32); // 256 bits
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Stores a CSRF token in localStorage with expiration
 * @param {number} expirationMinutes - Token expiration time in minutes
 * @returns {string} - The generated token
 */
export function createCSRFToken(expirationMinutes = 30) {
  const token = generateCSRFToken();
  const expiration = Date.now() + (expirationMinutes * 60 * 1000);
  
  // Store token with expiration
  const tokenData = {
    value: token,
    expires: expiration
  };
  
  localStorage.setItem('csrfToken', JSON.stringify(tokenData));
  return token;
}

/**
 * Gets the current valid CSRF token or creates a new one if needed
 * @returns {string} - The current valid CSRF token
 */
export function getCSRFToken() {
  const tokenData = localStorage.getItem('csrfToken');
  
  if (!tokenData) {
    return createCSRFToken();
  }
  
  try {
    const parsed = JSON.parse(tokenData);
    
    // Check if token has expired
    if (parsed.expires < Date.now()) {
      return createCSRFToken();
    }
    
    return parsed.value;
  } catch (error) {
    console.error('Error parsing CSRF token:', error);
    return createCSRFToken();
  }
}

/**
 * Validates a CSRF token against the stored token
 * @param {string} token - The token to validate
 * @returns {boolean} - Whether the token is valid
 */
export function validateCSRFToken(token) {
  if (!token) {
    return false;
  }
  
  const storedTokenData = localStorage.getItem('csrfToken');
  
  if (!storedTokenData) {
    return false;
  }
  
  try {
    const parsed = JSON.parse(storedTokenData);
    
    // Check if token has expired
    if (parsed.expires < Date.now()) {
      return false;
    }
    
    // Compare tokens using constant-time comparison
    return constantTimeCompare(token, parsed.value);
  } catch (error) {
    console.error('Error validating CSRF token:', error);
    return false;
  }
}

/**
 * Adds a CSRF token to a form
 * @param {HTMLFormElement} form - The form to protect
 */
export function protectForm(form) {
  if (!form || !(form instanceof HTMLFormElement)) {
    console.error('Invalid form element provided to protectForm');
    return;
  }
  
  // Check if form already has a CSRF token
  if (form.querySelector('input[name="csrf_token"]')) {
    return;
  }
  
  // Create token input
  const tokenInput = document.createElement('input');
  tokenInput.type = 'hidden';
  tokenInput.name = 'csrf_token';
  tokenInput.value = getCSRFToken();
  
  // Add token to form
  form.appendChild(tokenInput);
  
  // Update token on form submission
  form.addEventListener('submit', (event) => {
    // Update token value before submission
    tokenInput.value = getCSRFToken();
  });
}

/**
 * Adds a CSRF token to fetch or XMLHttpRequest options
 * @param {Object} options - The request options
 * @returns {Object} - The updated options with CSRF token
 */
export function addCSRFToRequest(options = {}) {
  const token = getCSRFToken();
  
  // Create a new options object to avoid modifying the original
  const newOptions = { ...options };
  
  // Initialize headers if they don't exist
  newOptions.headers = newOptions.headers || {};
  
  // Add CSRF token to headers
  if (typeof newOptions.headers === 'object') {
    newOptions.headers = {
      ...newOptions.headers,
      'X-CSRF-Token': token
    };
  }
  
  return newOptions;
}

/**
 * Performs a constant-time comparison of two strings
 * This helps prevent timing attacks when comparing tokens
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - Whether the strings are equal
 */
function constantTimeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Creates a fetch wrapper with CSRF protection
 * @returns {Function} - Protected fetch function
 */
export function createProtectedFetch() {
  return function protectedFetch(url, options = {}) {
    const protectedOptions = addCSRFToRequest(options);
    return fetch(url, protectedOptions);
  };
}

// Export a pre-configured fetch function with CSRF protection
export const secureFetch = createProtectedFetch();
