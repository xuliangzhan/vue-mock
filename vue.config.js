module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-mock-template/' : '/',
  outputDir: 'docs',
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
