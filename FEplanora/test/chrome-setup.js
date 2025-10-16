// Add this at the top of your test files after the import
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

const service = new chrome.ServiceBuilder(path);
chrome.setDefaultService(service);