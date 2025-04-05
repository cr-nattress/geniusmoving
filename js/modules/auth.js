/**
 * Authentication module for handling login functionality
 */

/**
 * Sets a secure cookie with appropriate security attributes
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} maxAge - Cookie max age in seconds
 */
function setSecureCookie(name, value, maxAge = 3600) {
  // Use __Host- prefix for enhanced security (prevents subdomain cookie attacks)
  const cookieName = `__Host-${name}`;

  // Format expiration date
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();

  // Set cookie with secure attributes
  document.cookie = `${cookieName}=${value}; expires=${expires}; path=/; secure; samesite=strict`;
}

/**
 * Removes a secure cookie
 * @param {string} name - Cookie name
 */
function removeSecureCookie(name) {
  // Handle both prefixed and non-prefixed cookie names
  const cookieName = name.startsWith('__Host-') ? name : `__Host-${name}`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=strict`;
}

/**
 * Manages session timeout and activity tracking
 * @param {number} timeoutMinutes - Session timeout in minutes
 */
function setupSessionTimeout(timeoutMinutes = 30) {
  let sessionTimeout;

  function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(
      () => {
        // Session expired, log the user out
        logout();
        // Show notification to user
        const expiredEvent = new CustomEvent('session:expired', {
          detail: { message: 'Your session has expired due to inactivity' },
        });
        document.dispatchEvent(expiredEvent);
      },
      timeoutMinutes * 60 * 1000
    );
  }

  // Reset timeout on user activity
  ['click', 'keypress', 'scroll', 'mousemove'].forEach((event) => {
    document.addEventListener(event, resetSessionTimeout);
  });

  // Initialize timeout
  resetSessionTimeout();

  return {
    reset: resetSessionTimeout,
    clear: () => clearTimeout(sessionTimeout),
  };
}

/**
 * Securely logs out the user
 */
function logout() {
  // Clear any session cookies
  removeSecureCookie('sessionId');
  removeSecureCookie('authToken');

  // Clear any localStorage/sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Dispatch logout event
  const logoutEvent = new CustomEvent('auth:logout', {
    detail: { message: 'You have been logged out' },
  });
  document.dispatchEvent(logoutEvent);

  // Redirect to login page (in a real app)
  // window.location.href = '/login';
}

/**
 * Simulates a login process with the provided credentials
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {HTMLElement} submitButton - The submit button element
 * @returns {Promise} - A promise that resolves when login is complete
 */
export default function simulateLogin(email, password, submitButton) {
  // Store original button text
  const originalText = submitButton.textContent;

  // Show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Signing in...';

  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you would make an API call here
      // For demo purposes, we'll just simulate a successful login

      // Set secure session cookie (in a real app, this would come from the server)
      const sessionId = generateSessionId();
      setSecureCookie('sessionId', sessionId);

      // Setup session timeout
      setupSessionTimeout(30); // 30 minutes

      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalText;

      // Create and dispatch a custom event for successful login
      const successEvent = new CustomEvent('login:success', {
        detail: { message: 'Login successful! Redirecting to dashboard...' },
      });
      document.dispatchEvent(successEvent);

      resolve();
    }, 1500);
  });
}

/**
 * Generates a secure random session ID
 * @returns {string} - A random session ID
 */
function generateSessionId() {
  // In a real app, this would be generated server-side
  // This is a simplified client-side implementation for demo purposes
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Export additional functions for use in other modules
export { logout, setupSessionTimeout };
