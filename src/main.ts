import { createApp } from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus, { ElMessage } from 'element-plus'
import 'xe-utils'
import VXETable from 'vxe-table'
import './styles/element-variables.scss'
import 'vxe-table/lib/style.css'
import './styles/index.scss'
import './permission' // permission control


const app = createApp(App)

app.config.globalProperties.$message = ElMessage

app.use(store).use(router).use(ElementPlus).use(VXETable).mount('#app')
