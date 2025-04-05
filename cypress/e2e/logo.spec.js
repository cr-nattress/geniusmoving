const LoginPage = require('../support/page-objects/LoginPage');

describe('SmartMoving Logo Test', () => {
  beforeEach(() => {
    // Visit the homepage before each test using the Page Object
    LoginPage.visit();
  });

  it('should display the SVG logo correctly', () => {
    // Use the Page Object to validate the logo
    LoginPage.validateLogo();

    // Take a screenshot for visual verification
    cy.takeScreenshot('logo-display');
  });

  it('should have the correct styling applied to the logo', () => {
    // Check if the logo has the expected CSS properties using data-cy selector
    cy.get('[data-cy=logo]').should('have.css', 'max-height');
  });
});
