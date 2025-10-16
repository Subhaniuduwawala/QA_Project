// jest.config.js
export default {
  testEnvironment: 'node',
  testTimeout: 60000,
  transform: {},
  moduleFileExtensions: ['js', 'jsx'],
  testMatch: ['**/test/**/*.test.js'],
  verbose: true,
  transformIgnorePatterns: [
    'node_modules/(?!(selenium-webdriver|chromedriver)/)'
  ]
};