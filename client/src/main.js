import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    getSuitableId: function(arr) {
      if (arr.length === 0) return 1;
      return Math.max(...arr.map(row => row.id))+1;
    }
  }
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
