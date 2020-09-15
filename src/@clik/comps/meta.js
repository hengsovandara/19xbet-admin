import Head from 'next/head'
import { Fragment } from 'react'

export default props => {
  return (
    <Fragment>
      <Head>
        <title>Clik - Customer Service System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="description" content="We're working hard to fight fraudsters and improve ID security but we need your help. We're currently looking for people who can upload a photo of their Photo ID so we can accurately identify fakes." />
        <meta name="author" content="Clik - Customer Service System" />
        <meta name="copyright" content="Clik - Customer Service System. All Rights Reserved." />
        <meta name="application-name" content="Clik - Customer Service System" />
        <link rel="stylesheet" href="./static/style.css" />
        <link rel="shortcut icon" type="image/x-icon" href="./static/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="./static/favicon.ico" />
        <link font-src="https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700" href="https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700" rel="stylesheet" />
        {props.isFun && (
          <Fragment>
            <script type="text/javascript" src="https://jeeliz.com/demos/faceFilter/dist/jeelizFaceFilter.js"></script>
            <script type="text/javascript" src="https://jeeliz.com/demos/faceFilter/libs/gify/jdataview.js"></script>
            <script type="text/javascript" src="https://jeeliz.com/demos/faceFilter/libs/gify/gify.min.js"></script>
            <script type="text/javascript" src="https://jeeliz.com/demos/faceFilter/libs/gif-frames/gif-frames.min.js"></script>
          </Fragment>
        )}
      </Head>
      <style jsx global>{`
        body {
          background: white;
        }
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }

        #faceFilterGifContainer {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 3;
        }
        #originalGif {
          z-index: 10;
          // width: 100%;
          top: 0;
          left: 0;
          background-repeat: no-repeat;
          background-size: cover;
          position: absolute;
          background: white;

          height: 100%;
          width: 100%;
        }
        #faceFilterVideo {
          position: absolute;
          height: 450px;
          max-width: 100%;
          min-width: 200px;
          z-index: -10;
          visibility: hidden;
          top: 0;
          left: 0;
        }
        .gif {
          z-index: 8;
          top: 4px;
          left: 0px;
          position: relative;
          max-width: 100vw;
          min-width: 200px;
          max-height: 450px;
        }
        .canvasDetected {
          position: absolute;
          z-index: -1;
          background: linear-gradient(to bottom, black, transparent, transparent);
        }
        .canvasNotDetected {
          z-index: 11;
          position: absolute;
          top: auto !important;
          bottom: 0px !important;
          left: 0px !important;
          max-width: 100% !important;
          max-height: 100% !important;
        }
      `}</style>
    </Fragment>
  )
}
