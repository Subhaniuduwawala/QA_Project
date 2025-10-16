import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';

const TIMEOUT = 60000; // Timeout in milliseconds

const service = new chrome.ServiceBuilder(chromedriver.path);

describe('Admin Signup Page', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('should show error when fields are missing', async () => {
    await driver.get('http://localhost:5173/admin/signup');

    // Only fill in some fields, leaving email empty to trigger validation error
    await driver.findElement(By.name('firstName')).sendKeys('Jane');
    await driver.findElement(By.name('lastName')).sendKeys('Doe');
    await driver.findElement(By.name('password')).sendKeys('Password123');
    await driver.findElement(By.name('confirmPassword')).sendKeys('Password123');

    await driver.findElement(By.css('button[type="submit"]')).click();

    const errorElement = await driver.wait(
      until.elementLocated(By.css('.text-red-500')),
      5000
    );
    const errorText = await errorElement.getText();

    expect(errorText).toBe('All fields are required.');
  });
});
