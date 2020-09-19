const { withFucss } = require('next-fucss');
const withCSS   = require('@zeit/next-css');
const withTranspileModules = require('next-transpile-modules'); 

module.exports = withCSS(
  withTranspileModules({
    transpileModules: ['clik'],
    webpack: (config, { dir, dev, isServer, defaultLoaders }) => {
      withFucss(config);
      return config;
    },
    publicRuntimeConfig: {
      version: process.env.npm_package_version,
      env: process.env.ENV,
      HASURA_URL: process.env.HASURA_URL,
      CRM_NODE_URL: process.env.CRM_NODE_URL,
      EKYC_NODE_URL: process.env.EKYC_NODE_URL
    }
  })
);