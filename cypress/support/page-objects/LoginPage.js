/**
 * Page Object Model for the Login Page
 * Contains selectors and methods for interacting with the login page
 */
class LoginPage {
  // Selectors
  elements = {
    loginForm: () => cy.get('[data-cy=login-form]'),
    emailInput: () => cy.get('[data-cy=email-input]'),
    passwordInput: () => cy.get('[data-cy=password-input]'),
    submitButton: () => cy.get('[data-cy=login-button]'),
    forgotPasswordLink: () => cy.get('[data-cy=forgot-password]'),
    rememberMeCheckbox: () => cy.get('[data-cy=remember-me]'),
    logo: () => cy.get('[data-cy=logo]')
  };

  // Actions
  visit() {
    cy.visit('/');
    return this;
  }

  typeEmail(email) {
    this.elements.emailInput().type(email);
    return this;
  }

  typePassword(password) {
    this.elements.passwordInput().type(password);
    return this;
  }

  clickSubmit() {
    this.elements.submitButton().click();
    return this;
  }

  checkRememberMe() {
    this.elements.rememberMeCheckbox().check();
    return this;
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink().click();
    return this;
  }

  // Combined actions
  login(email, password) {
    this.typeEmail(email);
    this.typePassword(password);
    this.clickSubmit();
    return this;
  }

  // Assertions
  validateFormExists() {
    this.elements.loginForm().should('be.visible');
    return this;
  }

  validateEmailField() {
    this.elements.emailInput().should('be.visible');
    return this;
  }

  validatePasswordField() {
    this.elements.passwordInput().should('be.visible');
    return this;
  }

  validateSubmitButton() {
    this.elements.submitButton().should('be.visible');
    return this;
  }

  validateLogo() {
    this.elements.logo()
      .should('be.visible')
      .and('have.attr', 'src', 'assets/images/logo.svg')
      .and('have.attr', 'alt', 'GeniusMoving Logo');
    return this;
  }

  validateEmailValidationError() {
    this.elements.emailInput().then($el => {
      cy.get('[data-cy=email-input]:invalid').should('exist');
    });
    return this;
  }

  validatePasswordValidationError() {
    this.elements.passwordInput().then($el => {
      cy.get('[data-cy=password-input]:invalid').should('exist');
    });
    return this;
  }
}

module.exports = new LoginPage();
