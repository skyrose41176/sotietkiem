# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

* Setup environment test:

- Install libraries
<!-- @babel/core, @babel/preset-env , @babel/preset-react, @babel/preset-typescript, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @types/jest, babel-jest, eslint-plugin-jest, eslint-plugin-testing-library, jest, jest-environment-jsdom, jest-localstorage-mock, ts-jest -->
- Commanline
<!-- npm install --save-dev ....libraries  -->
- Created file setup

* .babelrc
<!-- {
   "presets": [
      "@babel/typescript",
      ["@babel/env", {"loose": true}],
      "@babel/react",
   ],
   "plugins": [
      ["@babel/proposal-class-properties", {"loose": true}]
   ]
} -->
* jest.config.js
<!-- export default {
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
}; -->
* jest.setup.js
<!-- Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); -->

- Setup properties on package.json
<!-- "test": "jest --coverage",
"test:watch": "jest test --coverage --watchAll" -->
- Created forder **test** on src
<!-- [Name].test.ts (function)
[Name].test.tsx/jsx (component) -->
- Run test
<!-- npm run test -->
