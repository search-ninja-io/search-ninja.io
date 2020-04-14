module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        },
    },
    ignorePatterns: ['node_modules', 'dist', 'backup', 'cdk.out'],
    rules: {},
    settings: {
        react: {
            version: "detect"
        }
    },
};