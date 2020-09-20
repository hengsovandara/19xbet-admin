import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyCustomDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render () {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <meta name="description" content="We're working hard to fight fraudsters and improve ID security but we need your help. We're currently looking for people who can upload a photo of their Photo ID so we can accurately identify fakes." />
          <meta name="author" content="Clik - Traffic light System" />
          <meta name="copyright" content="Clik - Traffic light System. All Rights Reserved." />
          <meta name="application-name" content="Clik - Traffic light System" />
          <link rel="stylesheet" href="./static/style.css" />
          <meta name="theme-color" content="#333" />
          <link rel="manifest" href="./static/manifest.json" />
          <link rel="shortcut icon" type="image/x-icon" href="./static/favicon.ico" />
          <link rel="icon" type="image/x-icon" href="./static/favicon.ico" />
          <link font-src="https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700" href="https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700" rel="stylesheet" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
