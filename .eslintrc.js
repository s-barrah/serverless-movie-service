module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  globals: {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    '@typescript/interface-name-prefix' : 'off',
    "import/no-extraneous-dependencies": ["off", {
      "devDependencies": false,
      "optionalDependencies": false,
      "peerDependencies": false
    }],
    'class-methods-use-this' : 'off',
    'no-shadow' : 'off',
    'camelcase' : 'off',
    'no-console' : 'off',
    'no-unused-vars' : 'off',
    "@typescript-eslint/interface-name-prefix" : "off",
    "@typescript-eslint/camelcase" : "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js", ".ts"
        ],
        "moduleDirectory": [
          "node_modules", "src/"
        ]
      }
    }
  }
};
