import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import './mock'
import './plugins/echarts'
import './plugins/element.js'
import './plugins/element-extends.js'
import './plugins/xtable'

// Whether to enable mock data.
// if (process.env.NODE_ENV === 'development') {
//   require('./mock')
// }

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
