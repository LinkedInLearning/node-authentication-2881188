import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import VueCookies from 'vue-cookies';

import App from './App.vue';

Vue.config.productionTip = false;
// Install BootstrapVue
Vue.use(BootstrapVue);
// Add cookie support
Vue.use(VueCookies);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
new Vue({
  render: h => h(App)
}).$mount('#app');
