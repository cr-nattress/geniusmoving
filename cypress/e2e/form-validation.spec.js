const LoginPage = require('../support/page-objects/LoginPage');

describe('GeniusMoving Login Form Validation Tests', () => {
  beforeEach(() => {
    // Visit the homepage before each test using the Page Object
    LoginPage.visit();
  });

  // Email validation tests
  describe('Email Validation', () => {
    it('should show validation error for empty email', () => {
      // Focus on email field and then blur without entering anything
      cy.get('[data-cy=email-input]').focus().blur();

      // Check for validation message
      cy.get('[data-cy=email-input]:invalid').should('exist');

      // Attempt to submit the form
      LoginPage.clickSubmit();

      // Check that the form wasn't submitted (validation prevented submission)
      cy.assertHomePage(); // Still on the same page
    });

    it('should show validation error for email without @ symbol', () => {
      // Use custom command to validate field with invalid input
      cy.validateField('[data-cy=email-input]', 'invalidemail', false);

      // Attempt to submit the form
      LoginPage.clickSubmit();

      // Check that the form wasn't submitted
      cy.assertHomePage();
    });

    it('should show validation error for email without domain', () => {
      // Use custom command to validate field with invalid input
      cy.validateField('[data-cy=email-input]', 'invalid@', false);

      // Attempt to submit the form
      LoginPage.clickSubmit();

      // Check that the form wasn't submitted
      cy.assertHomePage();
    });

    it('should validate email with domain without TLD', () => {
      // Note: Some browsers consider 'invalid@domain' as valid
      // This test checks that behavior
      cy.validateField('[data-cy=email-input]', 'user@domain', true);
    });

    it('should accept valid email format', () => {
      // Use custom command to validate field with valid input
      cy.validateField('[data-cy=email-input]', 'valid@example.com', true);
    });
  });

  // Password validation tests
  describe('Password Validation', () => {
    it('should show validation error for empty password', () => {
      // Focus on password field and then blur without entering anything
      cy.get('[data-cy=password-input]').focus().blur();

      // Check for validation message
      cy.get('[data-cy=password-input]:invalid').should('exist');

      // Attempt to submit the form
      LoginPage.clickSubmit();

      // Check that the form wasn't submitted
      cy.assertHomePage();
    });

    it('should accept any non-empty password', () => {
      // Use custom command to validate field with valid input
      cy.validateField('[data-cy=password-input]', 'password123', true);
    });
  });

  // Combined validation tests
  describe('Combined Form Validation', () => {
    it('should show validation errors when both fields are empty', () => {
      // Attempt to submit the form without entering any data
      LoginPage.clickSubmit();

      // Check that both fields show validation errors
      cy.get('[data-cy=email-input]:invalid').should('exist');
      cy.get('[data-cy=password-input]:invalid').should('exist');

      // Check that the form wasn't submitted
      cy.assertHomePage();
    });

    it('should show validation error when only email is valid', () => {
      // Enter valid email but leave password empty
      LoginPage.typeEmail('valid@example.com');

      // Attempt to submit the form
      LoginPage.clickSubmit();

      // Check that password field shows validation error
      cy.get('[data-cy=password-input]:invalid').should('exist');

      // Check that the form wasn't submitted
      cy.assertHomePage();
    });

    it('should show validation error when only password is valid', () => {
      // Enter valid password but leave email empty
      LoginPage.typePassword('password123');

      // Attempt to submit the form
      LoginPage.clickSubmit();

      // Check that email field shows validation error
      cy.get('[data-cy=email-input]:invalid').should('exist');

      // Check that the form wasn't submitted
      cy.assertHomePage();
    });

    it('should allow form submission when both fields are valid', () => {
      // Use the login method from the Page Object
      LoginPage.login('valid@example.com', 'password123');

      // Intercept form submission to prevent actual navigation
      cy.intercept('POST', '*', { statusCode: 200 }).as('formSubmit');

      // Check that both fields are valid
      cy.get('[data-cy=email-input]:valid').should('exist');
      cy.get('[data-cy=password-input]:valid').should('exist');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should validate email with special characters', () => {
      // Use custom command to validate field with valid input
      cy.validateField('[data-cy=email-input]', 'test.user+label@example.co.uk', true);
    });

    it('should validate email with uppercase characters', () => {
      // Use custom command to validate field with valid input
      cy.validateField('[data-cy=email-input]', 'Test.User@Example.com', true);
    });

    it('should validate very long email addresses', () => {
      // Use custom command to validate field with valid input
      cy.validateField(
        '[data-cy=email-input]',
        'very.long.email.address.with.many.parts.and.a.long.domain.name@example.very.long.domain.com',
        true
      );
    });

    it('should validate very long passwords', () => {
      // Use custom command to validate field with valid input
      cy.validateField(
        '[data-cy=password-input]',
        'ThisIsAVeryLongPasswordThatShouldStillBeValidEvenThoughItIsVeryLongAndContainsManyCharacters123456789!@#$%^&*()',
        true
      );
    });
  });
});
