/**
 * Security utilities for protecting against common web vulnerabilities
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Replace potentially dangerous characters with HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes a URL to prevent XSS and open redirect vulnerabilities
 * @param {string} url - The URL to validate
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export function sanitizeUrl(url) {
  if (typeof url !== 'string') {
    return null;
  }
  
  // Remove whitespace
  url = url.trim();
  
  // Check for javascript: protocol which could be used for XSS
  if (/^javascript:/i.test(url)) {
    return null;
  }
  
  // Check for data: protocol which could be used for XSS
  if (/^data:/i.test(url)) {
    return null;
  }
  
  // Only allow http:, https:, and relative URLs
  if (!(/^(https?:)?\/\//i.test(url) || url.startsWith('/'))) {
    return null;
  }
  
  return url;
}

/**
 * Creates a nonce for use with Content Security Policy
 * @returns {string} - A random nonce
 */
export function generateNonce() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if a string contains HTML or script content
 * @param {string} input - The input to check
 * @returns {boolean} - Whether the input contains HTML
 */
export function containsHTML(input) {
  if (typeof input !== 'string') {
    return false;
  }
  
  // Check for HTML tags
  return /<[a-z\s\/](?:[^>"']|"[^"]*"|'[^']*')*>/i.test(input);
}

/**
 * Safely creates a DOM element with sanitized attributes
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|Node|Array} children - Child elements or text
 * @returns {HTMLElement} - The created element
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set sanitized attributes
  Object.entries(attributes).forEach(([key, value]) => {
    // Skip event handlers (they should be added separately)
    if (key.startsWith('on')) {
      return;
    }
    
    // Sanitize href and src attributes
    if ((key === 'href' || key === 'src') && typeof value === 'string') {
      const sanitized = sanitizeUrl(value);
      if (sanitized) {
        element.setAttribute(key, sanitized);
      }
      return;
    }
    
    // Set other attributes
    if (typeof value === 'string') {
      element.setAttribute(key, value);
    }
  });
  
  // Add children
  if (children) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    
    children.forEach(child => {
      if (typeof child === 'string') {
        // Text nodes should be text content, not HTML
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * Creates a safe HTML fragment from a string (use with caution)
 * @param {string} html - The HTML string
 * @param {boolean} sanitize - Whether to sanitize the HTML
 * @returns {DocumentFragment} - The created fragment
 */
export function createFragment(html, sanitize = true) {
  // Create a template element
  const template = document.createElement('template');
  
  // Set its HTML content (sanitized if requested)
  template.innerHTML = sanitize ? sanitizeHTML(html) : html;
  
  // Return the document fragment
  return template.content.cloneNode(true);
}

/**
 * Basic HTML sanitizer (for simple cases only)
 * For production use, consider using DOMPurify or a similar library
 * @param {string} html - The HTML to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html) {
  if (typeof html !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous tags and attributes
  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove on* event attributes
    .replace(/\s+on\w+\s*=\s*(["']).*?\1/gi, '')
    // Remove javascript: URLs
    .replace(/\s+href\s*=\s*(["'])\s*javascript:.*?\1/gi, '')
    // Remove data: URLs
    .replace(/\s+src\s*=\s*(["'])\s*data:.*?\1/gi, '')
    // Remove other potentially dangerous tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
}

/**
 * Validates a form input based on specified rules
 * @param {HTMLInputElement} input - The input element to validate
 * @param {Object} rules - Validation rules
 * @returns {boolean} - Whether the input is valid
 */
export function validateInput(input, rules = {}) {
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  // Required validation
  if (rules.required && !value) {
    isValid = false;
    errorMessage = rules.requiredMessage || 'This field is required';
  }
  
  // Email validation
  if (isValid && rules.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = rules.emailMessage || 'Please enter a valid email address';
    }
  }
  
  // Pattern validation
  if (isValid && rules.pattern && value) {
    if (!rules.pattern.test(value)) {
      isValid = false;
      errorMessage = rules.patternMessage || 'Please enter a valid value';
    }
  }
  
  // Min length validation
  if (isValid && rules.minLength && value.length < rules.minLength) {
    isValid = false;
    errorMessage = rules.minLengthMessage || `Please enter at least ${rules.minLength} characters`;
  }
  
  // Max length validation
  if (isValid && rules.maxLength && value.length > rules.maxLength) {
    isValid = false;
    errorMessage = rules.maxLengthMessage || `Please enter no more than ${rules.maxLength} characters`;
  }
  
  // Custom validation
  if (isValid && typeof rules.validate === 'function') {
    const customValidation = rules.validate(value);
    if (customValidation !== true) {
      isValid = false;
      errorMessage = customValidation || 'Invalid value';
    }
  }
  
  // Update input validity state
  if (!isValid) {
    input.setCustomValidity(errorMessage);
    
    // Find or create error message element
    let errorElement = document.getElementById(`${input.id}-error`);
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${input.id}-error`;
      errorElement.className = 'error-message';
      errorElement.setAttribute('aria-live', 'polite');
      input.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = errorMessage;
    input.classList.add('input-error');
  } else {
    input.setCustomValidity('');
    input.classList.remove('input-error');
    
    // Clear error message if it exists
    const errorElement = document.getElementById(`${input.id}-error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }
  
  return isValid;
}
