import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import echarts from 'echarts'
import axios from 'axios'
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.$BaseUrl = "http://127.0.0.1:8000/"
Vue.use(Antd)

//axios.defaults.baseURL = 'http://127.0.0.1:8000/'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
