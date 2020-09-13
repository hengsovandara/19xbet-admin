import React, { useEffect } from 'react'
import App, { Container } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { 
  faHome,
  faNewspaper, 
  faFutbol, 
  faBullhorn, 
  faTv, 
  faDice, 
  faMobileAlt, 
  faFish, 
  faAt,
  faIdBadge,
  faThumbsUp,
  faUserPlus,
  faHandHoldingUsd,
  faFileInvoiceDollar,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';

import 'antd/dist/antd.css';
import '../src/styles/vars.css';
import '../src/styles/global.css';
import { theme } from '../src/styles/theme';

library.add(
  fab, 
  faHome, 
  faNewspaper, 
  faFutbol, 
  faBullhorn, 
  faTv, 
  faDice, 
  faMobileAlt, 
  faFish, 
  faAt, 
  faIdBadge, 
  faThumbsUp, 
  faUserPlus,
  faHandHoldingUsd,
  faFileInvoiceDollar,
  faMoneyBill,
);

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
