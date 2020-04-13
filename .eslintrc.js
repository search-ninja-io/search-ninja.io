module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended', 
        'prettier/@typescript-eslint', 
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',

    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    ignorePatterns: ["node_modules","dist","build"],
    rules: {},
    settings: {},
};