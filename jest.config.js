// Use ESM-compatible dynamic import for .env.test loading in Jest
if (process.env.NODE_ENV === 'test') {
  import('fs').then(fs => {
    import('path').then(path => {
      const envPath = path.resolve('.env.test');
      if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            process.env[key.trim()] = value.trim();
          }
        });
      }
    });
  });
}

module.exports = {
  testEnvironment: 'jsdom',
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
