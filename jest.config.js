

module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react|react-dom|@testing-library|@radix-ui)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
