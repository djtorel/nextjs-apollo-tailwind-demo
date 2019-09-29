# NextJS + Apollo/GraphQL + TailwindCSS Front end Demo

## About

This is a demo of a stack using NextJS, Apollo & GraphQL, and TailwindCSS on the front end. The purpose is to set up and document the use of these technologies for potential use in a LambdaSchool labs application.

## To use this demo

First run `yarn install`.

Then run `yarn dev` to get the dev server up.

---

## Notes

## Initial Setup

### Dependencies

```bash
yarn add next react react-dom next-apollo graphql apollo-boost @apollo/react-hooks @apollo/react-ssr @zeit/next-css
```

### Dev Dependencies

```bash
yarn add --dev tailwindcss postcss-preset-env eslint-plugin-react@latest eslint@latest prettier
```

## Initialize some dev stuff (or copy files given)

### ESLint

Create an `.eslint.json` file with these contents:

```json
{
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "React": "writable"
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["react"],
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "no-console": "off"
  }
}
```

### Prettier

Create a `.prettierrc` file with this contents:

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true
}
```

### NextJS config file for using Tailwind CSS

Create a `next.config.js` file with these contents:

```javascript
const withCSS = require('@zeit/next-css');
module.exports = withCSS({});
```

### Tailwind config file

Create a tailwind.config.js file with this command: `npx tailwind init`

### PostCSS config file

Create a file named `postcss.config.js` with the following contents:

```javascript
module.exports = {
  plugins: [require('tailwindcss'), require('postcss-preset-env')],
};
```

### Index CSS File

Create a folder named `styles` and then create an `index.css` file with these contents:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
