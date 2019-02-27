module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-mock-template/' : '/',
  outputDir: 'docs',
  productionSourceMap: false,
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
