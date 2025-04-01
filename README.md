# GeniusMoving Website

This is the GeniusMoving website project with Cypress end-to-end testing.

## Project Structure

- `index.html` - The main HTML file for the GeniusMoving website
- `styles.css` - CSS styles for the website
- `script.js` - JavaScript functionality for the website
- `assets/` - Directory containing images and other assets
  - `images/` - Directory containing image assets
    - `logo.svg` - SVG logo for the GeniusMoving website
    - `favicon.svg` - SVG favicon for the GeniusMoving website
- `cypress/` - Directory containing Cypress tests
  - `e2e/` - Directory containing end-to-end tests
    - `logo.spec.js` - Tests for the logo display
    - `login.spec.js` - Tests for the login form functionality

## Running the Website

To run the website locally, use the following command:

```bash
npm run start
```

This will start an HTTP server on port 8080. You can then access the website at http://localhost:8080.

## Running the Tests

To run the Cypress tests, use the following command:

```bash
npm run test
```

This will run all the Cypress tests in headless mode.

To open the Cypress Test Runner and run the tests interactively, use the following command:

```bash
npm run cypress:open
```

## Test Coverage

The Cypress tests cover the following functionality:

### Logo Tests
- Verifies that the SVG logo is displayed correctly
- Checks that the logo has the correct styling applied

### Login Form Tests
- Verifies that the login form is displayed correctly
- Checks that validation messages are shown when submitting an empty form
- Verifies that credentials can be entered into the form fields
