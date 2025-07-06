module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    indent: ['error', 2],
    'vue/multi-word-component-names': 'off',
    semi: ['error', 'never'],
    'space-before-function-paren': ['error', 'always']
  },
  globals: {
    vi: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    cy: 'readonly',
    Cypress: 'readonly'
  }
}
