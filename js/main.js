/**
 * Main JavaScript entry point for GeniusMoving
 */
import initLoginForm from './components/loginForm.js';
import initDemoRequest from './components/demoRequest.js';
import { addErrorStyles } from './utils/ui.js';

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize login form functionality
  initLoginForm();

  // Initialize demo request button
  initDemoRequest();

  // Add CSS for error handling
  addErrorStyles();
});
