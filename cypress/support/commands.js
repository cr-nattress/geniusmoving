// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to login with email and password
 * @param {string} email - The email to use for login
 * @param {string} password - The password to use for login
 */
Cypress.Commands.add('login', (email, password) => {
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
});

/**
 * Custom command to validate form fields
 * @param {string} selector - The selector for the form field
 * @param {string} value - The value to type into the field
 * @param {boolean} shouldBeValid - Whether the field should be valid after typing
 */
Cypress.Commands.add('validateField', (selector, value, shouldBeValid = true) => {
  cy.get(selector).clear().type(value).blur();
  
  // Use :valid and :invalid pseudo-classes for HTML5 validation
  if (shouldBeValid) {
    cy.get(`${selector}:valid`).should('exist');
  } else {
    cy.get(`${selector}:invalid`).should('exist');
  }
});

/**
 * Custom command to check if we're on the homepage
 */
Cypress.Commands.add('assertHomePage', () => {
  cy.url().should('include', '/');
  cy.get('[data-cy=login-form]').should('be.visible');
});

/**
 * Custom command to take a screenshot with a meaningful name
 * @param {string} name - The name for the screenshot
 */
Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(`${Cypress.currentTest.title} - ${name}`);
});