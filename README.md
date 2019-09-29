# NextJS + Apollo/GraphQL + TailwindCSS Front end Demo

## About

This is a demo of a stack using NextJS, Apollo & GraphQL, and TailwindCSS on the front end. The purpose is to set up and document the use of these technologies for potential use in a LambdaSchool labs application.

## To use this demo

First run `yarn install`.

Then run `yarn dev` to get the dev server up.

Also this uses the basic backend from this repo: [https://github.com/djtorel/express-apollo-mongodb](https://github.com/djtorel/express-apollo-mongodb)

---

## Links

[NextJS Docs](https://nextjs.org/docs)

[Tailwind CSS Docs](https://tailwindcss.com/docs/installation)

[NextJS With Apollo example](https://github.com/zeit/next.js/tree/master/examples/with-apollo)

[Apollo Docs](https://www.apollographql.com/docs/)

---

## Notes

## Initial Setup

### Dependencies

`yarn add next react react-dom graphql apollo-boost @apollo/react-hooks @apollo/react-ssr @zeit/next-css isomorphic-unfetch`

### Dev Dependencies

`yarn add --dev tailwindcss postcss-preset-env eslint-plugin-react@latest eslint@latest prettier`

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

---

## Apollo Config

### Utility files

Create a `./lib` folder

Create an `init-apollo.js` file in `./lib` with the following contents

```javascript
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;

function create(initialState) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const isBrowser = typeof window !== 'undefined';
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: 'http://localhost:4000/graphql', // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      // Use fetch() polyfill on the server
      fetch: !isBrowser && fetch,
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
```

Create a `with-apollo-client.js` file in `./lib` with the following contents

```javascript
import React from 'react';
import initApollo from './init-apollo';
import Head from 'next/head';
import { getDataFromTree } from '@apollo/react-ssr';

export default App => {
  return class Apollo extends React.Component {
    static displayName = 'withApollo(App)';
    static async getInitialProps(ctx) {
      const { AppTree } = ctx;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo();
      if (typeof window === 'undefined') {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <AppTree {...appProps} apolloClient={apollo} />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    constructor(props) {
      super(props);
      this.apolloClient = initApollo(props.apolloState);
    }

    render() {
      return <App apolloClient={this.apolloClient} {...this.props} />;
    }
  };
};
```

### Wrap the base App with AppolloProvider

Create a `_app.js` file in the `./pages` folder with the following contents

```javascript
import App from 'next/app';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import withApolloClient from '../lib/with-apollo-client';

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default withApolloClient(MyApp);
```
