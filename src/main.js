import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import qs from "qs";
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'


Vue.config.productionTip = false
Vue.use(ElementUI);

axios.interceptors.request.use(config => {
  config.data = qs.stringify(config.data);
  let token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config
})

Vue.prototype.$http= axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
