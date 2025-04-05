/**
 * Login Form Component
 */
import { isValidEmail } from '../utils/validation.js';
import simulateLogin, { logout } from '../modules/auth.js';
import {
  showInputError,
  clearInputError,
  setButtonLoading,
  enhanceFormAccessibility,
  showNotification,
} from '../utils/ui.js';
import { sanitizeInput } from '../utils/security.js';
import { protectForm, getCSRFToken } from '../utils/csrfProtection.js';

/**
 * Initializes the login form functionality
 * @param {string} formId - The ID of the login form element
 */
export default function initLoginForm(formId = 'login-form') {
  const loginForm = document.getElementById(formId);
  if (!loginForm) return;

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitButton = loginForm.querySelector('button[type="submit"]');

  // Add accessibility enhancements
  enhanceFormAccessibility(loginForm);

  // Apply CSRF protection to the form
  protectForm(loginForm);

  // Setup real-time validation
  setupRealTimeValidation(emailInput, passwordInput);

  // Setup session expiration handler
  setupSessionExpirationHandler();

  // Form submission handler
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validate form before submission
    if (!validateForm(emailInput, passwordInput)) {
      return;
    }

    // Sanitize inputs before processing
    const sanitizedEmail = sanitizeInput(emailInput.value.trim());
    // Note: We don't sanitize passwords as they may contain special characters
    const password = passwordInput.value;

    // Show loading state
    setButtonLoading(submitButton, true);

    try {
      // Refresh CSRF token before login attempt
      getCSRFToken();

      // Simulate authentication (in a real app, this would call an API)
      await simulateLogin(sanitizedEmail, password, submitButton);
    } catch (error) {
      showNotification(error.message || 'An error occurred during login', 'error');
    } finally {
      // Remove loading state
      setButtonLoading(submitButton, false);
    }
  });

  // Listen for successful login events
  document.addEventListener('login:success', (event) => {
    showNotification(event.detail.message, 'success');
    // In a real app, you would redirect to dashboard here
    setTimeout(() => {
      // Simulate redirect
      showNotification('Redirecting to dashboard...', 'info');
    }, 1500);
  });

  // Listen for session expiration events
  document.addEventListener('session:expired', (event) => {
    showNotification(event.detail.message, 'warning');
    // Reset form
    loginForm.reset();
    // Focus on email input for better UX
    emailInput.focus();
  });

  // Listen for logout events
  document.addEventListener('auth:logout', (event) => {
    showNotification(event.detail.message, 'info');
    // Reset form
    loginForm.reset();
  });
}

/**
 * Setup handler for session expiration
 */
function setupSessionExpirationHandler() {
  // Add a logout button to the page if it exists
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      logout();
    });
  }
}

/**
 * Setup real-time validation for form inputs
 * @param {HTMLInputElement} emailInput - The email input element
 * @param {HTMLInputElement} passwordInput - The password input element
 */
function setupRealTimeValidation(emailInput, passwordInput) {
  // Email validation
  emailInput.addEventListener('blur', () => {
    validateEmail(emailInput);
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('input-error')) {
      validateEmail(emailInput);
    }
  });

  // Password validation
  passwordInput.addEventListener('blur', () => {
    validatePassword(passwordInput);
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('input-error')) {
      validatePassword(passwordInput);
    }
  });
}

/**
 * Validate the email input
 * @param {HTMLInputElement} emailInput - The email input element
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(emailInput) {
  const email = emailInput.value.trim();
  if (!email) {
    showInputError(emailInput, 'Email is required');
    return false;
  }
  if (!isValidEmail(email)) {
    showInputError(emailInput, 'Please enter a valid email address');
    return false;
  }
  clearInputError(emailInput);
  return true;
}

/**
 * Validate the password input
 * @param {HTMLInputElement} passwordInput - The password input element
 * @returns {boolean} - Whether the password is valid
 */
function validatePassword(passwordInput) {
  const password = passwordInput.value.trim();
  if (!password) {
    showInputError(passwordInput, 'Password is required');
    return false;
  }
  if (password.length < 8) { // Increased minimum length to 8 for better security
    showInputError(passwordInput, 'Password must be at least 8 characters');
    return false;
  }
  // Add more complex password validation
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    showInputError(
      passwordInput,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    );
    return false;
  }
  clearInputError(passwordInput);
  return true;
}

/**
 * Validate the entire form
 * @param {HTMLInputElement} emailInput - The email input element
 * @param {HTMLInputElement} passwordInput - The password input element
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(emailInput, passwordInput) {
  const isEmailValid = validateEmail(emailInput);
  const isPasswordValid = validatePassword(passwordInput);
  return isEmailValid && isPasswordValid;
}
