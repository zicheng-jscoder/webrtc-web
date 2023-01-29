import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router/index'
import store from '@/store'
import 'vant/lib/index.css'
import vant from 'vant'

// import './permission'
import vconsole from 'vconsole'
if (process.env.NODE_ENV === 'development') {
  new vconsole()
}

createApp(App).use(store).use(router).use(vant).mount('#app')
