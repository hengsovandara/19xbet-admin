const { withFucss } = require('next-fucss')
const withCSS   = require('@zeit/next-css')
const withTranspileModules = require('next-transpile-modules')(['clik'])
const { HASURA_URL, EKYC_NODE_URL, npm_package_version, ENV } = process.env
const { version } = require('./package.json')


module.exports = withCSS(
  withTranspileModules({
    env: { HASURA_URL, EKYC_NODE_URL, version, env: ENV },
    publicRuntimeConfig: { version },
    webpack: (config, { dir, dev, isServer, defaultLoaders }) => {
      withFucss(config);
      config.resolve.alias = {...(config.resolve.alias || {}), 'react-native$': 'react-native-web' }
      config.resolve.extensions = [ '.web.js', ...config.resolve.extensions ]
      return config;
    }
  })
);
