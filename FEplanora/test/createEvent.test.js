import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';

const TIMEOUT = 60000; // Timeout in milliseconds

describe('Create Event Modal', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('should create event when all fields are filled', async () => {
    await driver.get('http://localhost:5173/admin/events');

    // Step 1: Wait for the page to load
    await driver.wait(until.elementLocated(By.css('button[data-testid="create-event-button"]')), 5000);
    
    // Step 2: Click the button that opens the modal
    await driver.findElement(By.css('button[data-testid="create-event-button"]')).click();

    // Step 3: Wait for modal to appear
    await driver.wait(until.elementLocated(By.css('h2.text-indigo-700')), 5000);

    // Step 4: Fill in the form
    await driver.findElement(By.css('input[name="name"]')).sendKeys('Tech Conference');
    await driver.findElement(By.css('input[name="date"]')).sendKeys('2025-09-15');
    await driver.findElement(By.css('input[name="location"]')).sendKeys('Colombo');

    // Step 4: Submit the form
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Step 5: Wait for modal to close or success action
    await driver.sleep(2000);

    // Step 6: Confirm no error message
    const errors = await driver.findElements(By.css('.text-red-500'));
    expect(errors.length).toBe(0);
  });
});
