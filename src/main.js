import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import App from './App.vue'


Vue.use(VueRouter);

console.log('document.documentElement.clientWidth',document.documentElement.clientWidth);

const router = new VueRouter({
  mode:'history',
  routes,
})

new Vue({
  router,
  // store,
  el: '#app',
  render: h => h(App)
})
