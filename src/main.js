import Vue from 'vue'
import App from './App'

import router from './router'
// import change from './change'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import VueCookies from 'vue-cookies'
import * as echarts from 'echarts'
import * as Highcharts from 'highcharts'
import dataV from '@jiaminghi/data-view'
import 'bootstrap/dist/css/bootstrap.css'

Vue.use(router)
Vue.use(ElementUI)
// Vue.use(change)
Vue.use(VueCookies)
Vue.use(dataV)

Vue.prototype.$echarts = echarts
Vue.prototype.$hcharts = Highcharts

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
