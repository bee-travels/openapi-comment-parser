module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:openapi-jsdoc/recommended',
  ],
  rules: {
    'func-names': 'off',
    'no-console': 'off',
    'object-shorthand': 'off',
  },
};
