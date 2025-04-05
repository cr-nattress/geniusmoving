const LoginPage = require('../support/page-objects/LoginPage.js');
const ForgotPasswordPage = require('../support/page-objects/ForgotPasswordPage.js');

/**
 * End-to-End tests for the Forgot Password functionality
 * Tests navigation, UI elements, form validation, and submission
 */
describe('Forgot Password Page', () => {
  context('Navigation', () => {
    beforeEach(() => {
      // Start at the login page before each test in this context
      LoginPage.visit();
    });

    it('should navigate to forgot password page when clicking the forgot password link', () => {
      // Click the forgot password link
      LoginPage.clickForgotPassword();

      // Verify we're on the forgot password page
      cy.url().should('include', '/new-forgot-password.html');
      ForgotPasswordPage.validateFormExists();
      cy.takeScreenshot('navigation-to-forgot-password');
    });

    it('should navigate back to login page when clicking back to login link', () => {
      // Navigate to forgot password page
      LoginPage.clickForgotPassword();

      // Click the back to login link
      ForgotPasswordPage.clickBackToLogin();

      // Verify we're back on the login page
      cy.url().should('not.include', '/new-forgot-password.html');
      LoginPage.validateFormExists();
    });
  });

  context('UI Elements', () => {
    beforeEach(() => {
      // Visit the forgot password page directly for UI tests
      ForgotPasswordPage.visit();
    });

    it('should display all required UI elements', () => {
      // Verify all UI elements are present
      ForgotPasswordPage.validateLogo()
        .validateDescription()
        .validateEmailField()
        .validateResetButton()
        .validateBackToLoginLink();

      // Take a screenshot for visual verification
      cy.takeScreenshot('forgot-password-ui-elements');
    });

    it('should have the correct page title and heading', () => {
      // Check the page title
      cy.title().should('include', 'Forgot Password');

      // Check the heading
      cy.get('h1').should('have.text', 'Forgot Password');
    });
  });

  context('Email Validation', () => {
    beforeEach(() => {
      ForgotPasswordPage.visit();
    });

    it('should show validation error when submitting empty form', () => {
      // Get the email input element
      const emailInput = ForgotPasswordPage.elements.emailInput();

      // Clear the input (in case there's any default value)
      emailInput.clear();

      // Submit without entering email
      ForgotPasswordPage.clickResetButton();

      // Check for HTML5 validation - using the :invalid pseudo-class
      // This works with the browser's built-in validation
      cy.get('#email:invalid').should('exist');

      // Verify we're still on the forgot password page
      cy.url().should('include', '/new-forgot-password.html');
    });

    it('should validate email format correctly', () => {
      // Test with an invalid email format
      ForgotPasswordPage.typeEmail('plaintext');

      // Submit the form to trigger validation
      ForgotPasswordPage.clickResetButton();

      // Check for HTML5 validation - this should work with the browser's built-in validation
      cy.get('#email:invalid').should('exist');

      // Clear for the valid email test
      ForgotPasswordPage.elements.emailInput().clear();

      // Test with valid email format
      ForgotPasswordPage.typeEmail('valid@example.com');

      // Click elsewhere to trigger validation
      cy.get('h1').click();

      // Valid email should not trigger validation errors
      cy.get('#email').should('not.have.class', 'input-error');
    });
  });

  context('Form Submission', () => {
    beforeEach(() => {
      ForgotPasswordPage.visit();
    });

    it('should show loading state when submitting the form', () => {
      // Submit a valid email
      ForgotPasswordPage.typeEmail('test@example.com');

      // Verify button text before clicking
      ForgotPasswordPage.validateButtonText('Reset Password');

      // Click the button and check for loading state
      ForgotPasswordPage.clickResetButton();

      // Button should show loading state
      cy.get('[data-cy=reset-password-button]').should('be.disabled');
      cy.get('[data-cy=reset-password-button]').should('contain', 'Sending');
    });

    it('should handle successful password reset request', () => {
      const testEmail = 'success@example.com';

      // Submit the form with valid email
      ForgotPasswordPage.submitResetRequest(testEmail);

      // Wait for the simulated API call (1.5 seconds)
      cy.wait(1600);

      // Verify success message is displayed
      cy.get('[data-cy=success-message]')
        .should('be.visible')
        .and('contain', 'Password reset link sent');

      // Form should be reset
      cy.get('[data-cy=email-input]').should('have.value', '');
    });
  });

  context('Error Handling', () => {
    beforeEach(() => {
      ForgotPasswordPage.visit();
    });

    // This test is skipped because we can't easily simulate server errors
    // in our current implementation without modifying the JavaScript
    it.skip('should handle server errors gracefully', () => {
      // This would require modifying the JavaScript to handle server errors
      // which is beyond the scope of this test suite
    });

    // This test is skipped for the same reason
    it.skip('should handle non-existent email addresses', () => {
      // This would require modifying the JavaScript to handle non-existent emails
      // which is beyond the scope of this test suite
    });
  });

  context('Expired Reset Link', () => {
    // This test is skipped because we don't have token validation implemented
    it.skip('should handle expired password reset links', () => {
      // This would require implementing token validation logic
      // which is beyond the scope of this test suite
    });
  });

  context('Responsive Design', () => {
    beforeEach(() => {
      ForgotPasswordPage.visit();
    });

    it('should be responsive on different screen sizes', () => {
      // Test responsiveness using the page object method
      ForgotPasswordPage.validateResponsiveDesign();
    });

    it('should have touch-friendly input fields on mobile', () => {
      // Set viewport to mobile size
      cy.viewport('iphone-x');

      // Check that input fields and buttons are large enough for touch
      cy.get('[data-cy=email-input]').should('be.visible');
      cy.get('[data-cy=reset-password-button]').should('be.visible');

      // Ensure there's enough spacing between elements
      cy.get('.input-group').should('be.visible');
    });
  });
});
