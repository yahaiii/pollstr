

module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react|react-dom|@testing-library|@radix-ui)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
