import 'components/app.scss';
import Header from 'components/UI/Header/Header';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300&display=swap" rel="stylesheet" />
      </Head>
      <Header/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
