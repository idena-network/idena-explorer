// pages/_app.js
import '../styles/index.scss';
import Head from 'next/head';
import { ReactQueryConfigProvider } from 'react-query';
import { SessionProvider } from '../shared/utils/session-context';

const queryConfig = {
  // Global
  refetchAllOnWindowFocus: false,
  cacheTime: 60 * 1000,
  // useQuery
  retry: 1,
  refetchOnMount: true,
};

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>Idena Blockchain Explorer</title>

        <meta httpEquiv="X-UA-Compatible" content="chrome=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="Idena Explorer allows you to explore and search the Idena blockchain for addresses, identities, transactions, flips, blocks, invitations, epochs, mining rewards and validation results taking place on Idena (DNA)"
        />

        <link rel="shortcut icon" href="/favicon.ico" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/android-chrome-256x256.png"
        />
        <meta name="msapplication-TileColor" content="#2456ec" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image" content="./og_image.jpg" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
      </Head>
      <ReactQueryConfigProvider config={queryConfig}>
        <SessionProvider>
          <Component {...pageProps} />
        </SessionProvider>
      </ReactQueryConfigProvider>
    </>
  );
}
