/* eslint-disable */
// GeniusMoving Login Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const forgotPasswordLink = document.getElementById('forgot-password');
  const requestDemoBtn = document.querySelector('.request-demo-btn');

  // Form submission handler
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Validate inputs
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Email is required');
      return;
    }

    if (!passwordInput.value.trim()) {
      showError(passwordInput, 'Password is required');
      return;
    }

    // Simulate authentication (in a real app, this would call an API)
    simulateLogin(emailInput.value, passwordInput.value);
  });

  // Forgot password handler
  // Removed the event listener that was preventing navigation

  // Request demo handler
  if (requestDemoBtn) {
    requestDemoBtn.addEventListener('click', (event) => {
      event.preventDefault();
      alert('Demo request functionality would be implemented here.');
    });
  }

  // Helper functions
  function showError(inputElement, message) {
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

  function clearError(inputElement) {
    // Remove error styling
    inputElement.classList.remove('input-error');

    // Remove any error message
    const errorMessage = inputElement.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  function simulateLogin(email, password) {
    // Show loading state
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';

    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, always show success
      alert('Login successful! In a real application, this would redirect to the dashboard.');

      // Reset form
      loginForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }, 1500);
  }

  // Add input event listeners to clear errors when typing
  emailInput.addEventListener('input', () => {
    clearError(emailInput);
  });

  passwordInput.addEventListener('input', () => {
    clearError(passwordInput);
  });
});

// Add CSS for error handling
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
        .input-error {
            border-color: #e94b35 !important;
        }
        
        .error-message {
            color: #e94b35;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
    `;
  document.head.appendChild(style);
});
