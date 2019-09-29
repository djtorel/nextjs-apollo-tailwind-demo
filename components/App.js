import Head from 'next/head';

const App = ({ children }) => (
  <>
    <Head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <title>NextJS, Apollo, Tailwind Demo</title>
    </Head>
    <main>{children}</main>
  </>
);

export default App;
