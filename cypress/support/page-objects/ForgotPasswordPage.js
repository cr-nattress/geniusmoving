/**
 * Page Object Model for the Forgot Password Page
 * Contains selectors and methods for interacting with the forgot password page
 */
class ForgotPasswordPage {
  // Selectors
  elements = {
    forgotPasswordForm: () => cy.get('[data-cy=forgot-password-form]'),
    emailInput: () => cy.get('[data-cy=email-input]'),
    resetButton: () => cy.get('[data-cy=reset-password-button]'),
    backToLoginLink: () => cy.get('[data-cy=back-to-login]'),
    logo: () => cy.get('[data-cy=logo]'),
    forgotPasswordDescription: () => cy.get('[data-cy=forgot-password-description]'),
    errorMessage: () => cy.get('[data-cy=error-message]'),
    successMessage: () => cy.get('[data-cy=success-message]'),
  };

  // Actions
  visit() {
    cy.visit('/new-forgot-password.html');
    return this;
  }

  typeEmail(email) {
    this.elements.emailInput().clear().type(email);
    return this;
  }

  clickResetButton() {
    this.elements.resetButton().click();
    return this;
  }

  clickBackToLogin() {
    this.elements.backToLoginLink().click();
    return this;
  }

  // Combined actions
  submitResetRequest(email) {
    this.typeEmail(email);
    this.clickResetButton();
    return this;
  }

  // Assertions
  validateFormExists() {
    this.elements.forgotPasswordForm().should('be.visible');
    return this;
  }

  validateEmailField() {
    this.elements.emailInput().should('be.visible');
    return this;
  }

  validateResetButton() {
    this.elements.resetButton().should('be.visible');
    return this;
  }

  validateBackToLoginLink() {
    this.elements.backToLoginLink().should('be.visible');
    return this;
  }

  validateLogo() {
    this.elements.logo().should('be.visible');
    return this;
  }

  validateDescription() {
    this.elements
      .forgotPasswordDescription()
      .should('be.visible')
      .and('contain', 'Enter your email address');
    return this;
  }

  validateEmailValidationError() {
    this.elements.emailInput().then(($el) => {
      cy.get('[data-cy=email-input]:invalid').should('exist');
    });
    return this;
  }

  validateErrorMessage(message) {
    this.elements.errorMessage().should('be.visible').and('contain', message);
    return this;
  }

  validateSuccessMessage(message) {
    this.elements.successMessage().should('be.visible').and('contain', message);
    return this;
  }

  validateButtonText(text) {
    this.elements.resetButton().should('have.text', text);
    return this;
  }

  // Responsive design validation
  validateResponsiveDesign() {
    // Check desktop view
    cy.viewport(1200, 800);
    this.elements.forgotPasswordForm().should('be.visible');
    cy.wait(500); // Wait for any animations
    cy.takeScreenshot('forgot-password-desktop');

    // Check tablet view
    cy.viewport(768, 1024);
    this.elements.forgotPasswordForm().should('be.visible');
    cy.wait(500);
    cy.takeScreenshot('forgot-password-tablet');

    // Check mobile view
    cy.viewport(375, 667);
    this.elements.forgotPasswordForm().should('be.visible');
    cy.wait(500);
    cy.takeScreenshot('forgot-password-mobile');

    return this;
  }
}

module.exports = new ForgotPasswordPage();
