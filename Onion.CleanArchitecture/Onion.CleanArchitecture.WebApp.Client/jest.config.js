export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  roots: ["<rootDir>/"],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageReporters: ["json", "lcov", "text", "clover"],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  moduleNameMapper: {
    '^antd-style$': '<rootDir>/node_modules/antd-style',
    "^@react-pdf/renderer$": "<rootDir>/node_modules/@react-pdf/renderer",
    "^@utilities/(.*)$": "<rootDir>/src/utilities/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@providers/(.*)$": "<rootDir>/src/providers/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
    "\\.(css|less|scss|sss|styl)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(antd-style|@react-pdf/renderer|@assets)/)"
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  maxWorkers: 2,
  testTimeout: 30000,
}; 