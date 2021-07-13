/* eslint-disable react/jsx-props-no-spreading */
// pages/_app.js
import '../styles/index.scss'
import Head from 'next/head'
import {Helmet} from 'react-helmet'
import {ReactQueryConfigProvider} from 'react-query'
import {SessionProvider} from '../shared/utils/session-context'

const queryConfig = {
  // Global
  refetchAllOnWindowFocus: false,
  cacheTime: 60 * 1000,
  // useQuery
  retry: 1,
  refetchOnMount: true,
}

export default function MyApp({Component, pageProps}) {
  return (
    <>
      <Helmet
        defaultTitle="Idena Blockchain Explorer"
        titleTemplate="%s - Idena Blockchain Explorer"
      />

      <Head>
        <meta charSet="UTF-8" />

        <meta httpEquiv="X-UA-Compatible" content="chrome=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="Idena Explorer allows you to explore and search the Idena blockchain for addresses, identities, transactions, flips, blocks, invitations, epochs, mining rewards and validation results taking place on Idena (iDNA)"
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

      <footer className="footer">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-7 col-lg-6">
              <div className="social_list">
                <a
                  href="https://medium.com/idena"
                  rel="nofollow"
                  target="blank"
                  className="social_list__item"
                >
                  <i className="icon icon--medium" />
                </a>
                <a
                  href="https://twitter.com/IdenaNetwork"
                  rel="nofollow"
                  target="blank"
                  className="social_list__item"
                >
                  <i className="icon icon--twitter" />
                </a>
                <a
                  href="https://t.me/IdenaNetworkPublic"
                  rel="nofollow"
                  target="blank"
                  className="social_list__item"
                >
                  <i className="icon icon--telegram" />
                </a>
                <a
                  href="https://github.com/idena-network"
                  rel="nofollow"
                  target="blank"
                  className="social_list__item"
                >
                  <i className="icon icon--github" />
                </a>
                <a
                  href="https://www.reddit.com/r/Idena/"
                  target="blank"
                  className="social_list__item"
                >
                  <i className="icon icon--reddit" />
                </a>

                <a
                  href="https://discord.gg/8BusRj7"
                  target="blank"
                  className="social_list__item"
                >
                  <i className="icon icon--discord" />
                </a>
                <a
                  href="mailto:info@idena.io"
                  target="blank"
                  className="social_list__item"
                >
                  <i className="icon icon--mail" />
                </a>
              </div>
              <div className="donate">
                <a target="blank" href="https://idena.io/donate">
                  Support Idena by making a donation
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
