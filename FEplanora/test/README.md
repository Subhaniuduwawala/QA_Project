# Selenium UI Testing Guide for Planora

This guide provides step-by-step instructions for setting up and running Selenium UI tests for the Planora application.

## Test Scenarios

1. Admin Signup Test (`signup.test.js`)
   - Tests form validation in the admin signup process
   - Verifies error handling for missing fields

2. Create Event Test (`createEvent.test.js`)
   - Tests the event creation functionality
   - Verifies form submission and validation

## Prerequisites

1. Node.js and npm installed
2. Google Chrome browser installed
3. ChromeDriver installed and in system PATH
4. Planora frontend and backend servers running locally

## Setup Instructions

1. Install required dependencies:
   ```bash
   npm install selenium-webdriver jest @testing-library/jest-dom --save-dev
   ```

2. Install ChromeDriver:
   - Windows (using npm):
     ```bash
     npm install chromedriver
     ```
   - Add ChromeDriver to system PATH

3. Ensure your frontend application is running on `http://localhost:5173`

## Test File Structure

The tests are located in the `test` directory:
- `signup.test.js` - Admin signup tests
- `createEvent.test.js` - Event creation tests

## Running the Tests

1. Start the Planora backend server
2. Start the Planora frontend server
3. Run the tests:
   ```bash
   npm test
   ```

To run specific test files:
```bash
npm test signup.test.js
npm test createEvent.test.js
```

## Test Details

### Admin Signup Test
- Located in `signup.test.js`
- Tests form validation
- Verifies error messages for missing fields
- Test duration: ~60 seconds

### Create Event Test
- Located in `createEvent.test.js`
- Tests event creation modal
- Verifies form submission
- Test duration: ~60 seconds

## Common Issues and Solutions

1. Timeout Errors
   - Increase the timeout in the test files:
     ```javascript
     jest.setTimeout(60000);
     ```

2. ChromeDriver Issues
   - Ensure ChromeDriver version matches your Chrome browser version
   - Verify ChromeDriver is in system PATH
   - Try reinstalling ChromeDriver

3. Element Not Found Errors
   - Check if selectors are correct
   - Increase wait times using `until.elementLocated()`
   - Verify the application state before running tests

## Recommended Improvements

1. Add more test scenarios:
   - Success case for admin signup
   - Error cases for event creation
   - Form validation tests

2. Enhance error handling:
   - Add more specific error message checks
   - Implement retry logic for flaky tests

3. Implement test cleanup:
   - Clear test data after each run
   - Reset application state between tests

## Best Practices

1. Keep tests independent
2. Use meaningful test descriptions
3. Implement proper wait conditions instead of fixed timeouts
4. Clean up resources after tests complete
5. Use page object pattern for better maintainability

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Add proper documentation
3. Ensure tests are independent
4. Include both positive and negative test cases


## Steps

run backend
run frontend
in powershell, run;
cd "C:\Users\Asus\Documents\Project\QA - Copy\FEplanora" ; npm test test/signup.test.js
cd "C:\Users\Asus\Documents\Project\QA - Copy\FEplanora" ; npm test test/createEvent.test.js