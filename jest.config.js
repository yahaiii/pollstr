// Load .env.test for Jest using ESM-compatible dynamic import
if (process.env.NODE_ENV === 'test') {
  (async () => {
    await import('dotenv').then(dotenv => dotenv.config({ path: '.env.test' }));
  })();
}
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react|react-dom|@testing-library|@radix-ui)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
