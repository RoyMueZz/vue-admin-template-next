import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'xe-utils'
import VXETable from 'vxe-table'
import './styles/reset.scss'
import 'element-plus/lib/theme-chalk/index.css'
import 'vxe-table/lib/style.css'
import 'element-plus/lib/theme-chalk/index.css'



createApp(App).use(store).use(router).use(ElementPlus).use(VXETable).mount('#app')
