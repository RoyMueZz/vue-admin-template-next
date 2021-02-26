import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'


export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '仪表盘', icon: 'el-icon-s-data', affix: true }
      }
    ]
  },
  {
    path: '/basicData',
    component: Layout,
    meta: { title: '基础资料', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'dictionary',
        component: () => import('@/views/basicData/dictionary/index.vue'),
        name: 'Dictionary',
        meta: { title: '数据字典', icon: 'el-icon-collection' }
      }
    ]
  }
]

export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true }}
]


const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
