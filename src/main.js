import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // <---
import { createPinia } from 'pinia'

import VueSweetAlert from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import { formatDate, numberWithCommas } from './utils/utils'
import "vue-select/dist/vue-select.css";

const app = createApp(App)
app.config.globalProperties.$formatDate = formatDate
app.config.globalProperties.$numberWithCommas = numberWithCommas
const pinia = createPinia()

app
  .use(pinia)
  .use(VueSweetAlert)
  .use(router)
  .mount('#app')