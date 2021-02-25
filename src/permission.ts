import router from './router'
import { useStore } from './store'
import { ActionConstants } from './store/modules/constants'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

const store = useStore()


NProgress.configure({ showSpinner: false }) // NProgress Configuration



router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // generate accessible routes map based on roles
  const accessRoutes = await store.dispatch(ActionConstants.HandleGenerateRoutes, [])

  accessRoutes.forEach((route) => {
    // dynamically add accessible routes
    router.addRoute(route)
  })

  // TODO 登录页写好后用下面这个注释的
  // next({ ...to, replace: true })
  next()
})

router.afterEach(() => {
  // 每次请求结束后都需要关闭进度条
  NProgress.done()
})
