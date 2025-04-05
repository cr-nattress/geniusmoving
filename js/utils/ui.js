/**
 * UI utility functions
 */

/**
 * Adds CSS styles to the document for error handling
 * This function is now deprecated as we've moved styles to CSS files
 * Kept for backward compatibility
 */
export function addErrorStyles() {
  // This function is kept for backward compatibility
  // Styles are now imported via CSS files
  console.warn('addErrorStyles is deprecated. Styles are now in separate CSS files.');
}

/**
 * Shows a notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds to show the notification
 * @returns {HTMLElement} - The notification element
 */
export function showNotification(message, type = 'info', duration = 3000) {
  // Get or create notification container
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  notification.textContent = message;

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close notification');
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });
  notification.appendChild(closeBtn);

  // Add to DOM
  container.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Remove after delay
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(notification);
    }, duration);
  }

  // Also dispatch an event for programmatic handling
  const notificationEvent = new CustomEvent('ui:notification', {
    detail: { message, type },
  });
  document.dispatchEvent(notificationEvent);
  return notification;
}

/**
 * Removes a notification from the DOM with animation
 * @param {HTMLElement} notification - The notification element to remove
 */
export function removeNotification(notification) {
  notification.classList.remove('show');
  notification.classList.add('hide');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

/**
 * Shows a form validation error
 * @param {HTMLElement} inputElement - The input element with the error
 * @param {string} message - The error message
 */
export function showInputError(inputElement, message) {
  // Add error class to input
  inputElement.classList.add('input-error');
  // Find or create error message element
  const inputId = inputElement.id;
  const errorElement = document.getElementById(`${inputId}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Clears a form validation error
 * @param {HTMLElement} inputElement - The input element to clear error for
 */
export function clearInputError(inputElement) {
  // Remove error class
  inputElement.classList.remove('input-error');
  // Clear error message
  const inputId = inputElement.id;
  const errorElement = document.getElementById(`${inputId}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Sets the loading state of a button
 * @param {HTMLElement} button - The button element
 * @param {boolean} isLoading - Whether the button is in loading state
 */
export function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.setAttribute('disabled', 'disabled');
    // Store original aria-label if it exists
    if (button.getAttribute('aria-label')) {
      button.setAttribute('data-original-label', button.getAttribute('aria-label'));
      button.setAttribute('aria-label', 'Loading, please wait...');
    }
  } else {
    button.classList.remove('loading');
    button.removeAttribute('disabled');
    // Restore original aria-label if it existed
    if (button.getAttribute('data-original-label')) {
      button.setAttribute('aria-label', button.getAttribute('data-original-label'));
      button.removeAttribute('data-original-label');
    }
  }
}

/**
 * Adds accessibility features to a form
 * @param {HTMLFormElement} form - The form element to enhance
 */
export function enhanceFormAccessibility(form) {
  // Add required field indicators
  const requiredInputs = form.querySelectorAll('[required]');
  requiredInputs.forEach((input) => {
    const label = form.querySelector(`label[for="${input.id}"]`);
    if (label && !label.querySelector('.required-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'required-indicator';
      indicator.textContent = ' *';
      indicator.setAttribute('aria-hidden', 'true');
      label.appendChild(indicator);
      // Add aria-required attribute
      input.setAttribute('aria-required', 'true');
    }
  });
  // Add better focus management
  const formInputs = form.querySelectorAll('input, select, textarea, button');
  formInputs.forEach((input) => {
    input.addEventListener('focus', () => {
      input.classList.add('has-focus');
    });
    input.addEventListener('blur', () => {
      input.classList.remove('has-focus');
    });
  });
}
