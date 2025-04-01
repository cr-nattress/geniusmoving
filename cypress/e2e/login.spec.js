const LoginPage = require('../support/page-objects/LoginPage');

describe('GeniusMoving Login Form Test', () => {
  beforeEach(() => {
    // Visit the homepage before each test using the Page Object
    LoginPage.visit();
  });

  it('should display the login form', () => {
    // Use the Page Object to validate form elements
    LoginPage
      .validateFormExists()
      .validateEmailField()
      .validatePasswordField()
      .validateSubmitButton();
      
    // Take a screenshot for visual verification
    cy.takeScreenshot('login-form-display');
  });

  it('should show validation message when submitting empty form', () => {
    // Submit the form without entering any data
    LoginPage.clickSubmit();
    
    // Check for validation messages using :invalid pseudo-class
    cy.get('[data-cy=email-input]:invalid').should('exist');
    cy.get('[data-cy=password-input]:invalid').should('exist');
      
    // Verify we're still on the login page
    cy.assertHomePage();
  });

  it('should allow entering credentials', () => {
    // Use the Page Object to enter credentials
    LoginPage
      .typeEmail('test@example.com')
      .typePassword('password123');
    
    // Verify the values were entered correctly
    cy.get('[data-cy=email-input]').should('have.value', 'test@example.com');
    cy.get('[data-cy=password-input]').should('have.value', 'password123');
  });
  
  it('should allow login with valid credentials', () => {
    // Use the custom command to login
    cy.login('test@example.com', 'password123');
    
    // Intercept form submission to prevent actual navigation
    cy.intercept('POST', '*', { statusCode: 200 }).as('formSubmit');
    
    // Take a screenshot after login attempt
    cy.takeScreenshot('after-login-attempt');
  });
});
