import "components/styles/app.scss";
import Header from "components/UI/Header/Header";
import { AuthUserProvider } from "lib/AuthUserContext";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="pageContainer">
        <Header />
        <Component {...pageProps} />
      </div>
    </AuthUserProvider>
  );
}

export default MyApp;
