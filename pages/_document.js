import { Html, Head, Main, NextScript } from "next/document";
import { montserrat } from "../fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body className={`${montserrat.className} antialiased`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
