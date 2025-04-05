// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using CommonJS syntax for consistency
require('./commands');

// Import page objects
require('./page-objects/LoginPage');

// Configure global behavior
beforeEach(() => {
  // Modern way to handle sessions in Cypress 12+
  // This will be used if we need to preserve login state between tests
  cy.session('default', () => {
    // Setup code that runs once per session
    // For example, login operations if needed
  });
});

// Add custom error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  console.error('Uncaught exception:', err.message);
  return false;
});

// Add custom logging for test starts
Cypress.on('test:before:run', (attributes) => {
  console.log(`Running: ${attributes.title}`);
});
