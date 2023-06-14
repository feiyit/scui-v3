import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { whiteList } from "@/config/white-list"
import asyncRouteSettings from "@/config/async-route"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import config from "@/config"
import tool from "@/utils/tool"

NProgress.configure({ showSpinner: false })
//判断是否已加载过动态/静态路由
let isGetRouter = false
router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = tool.storage.get(config.TOKEN_NAME)

  //动态标题
  document.title = to.meta.title ? `${to.meta.title} - ${config.APP_NAME}` : `${config.APP_NAME}`

  // 判断该用户是否登录
  if (token) {
    if (to.path === "/login") {
      // 如果已经登录，并准备进入 Login 页面，则重定向到主页
      next({ path: "/" })
      NProgress.done()
    } else {
      //整页路由处理
      if (to.meta.fullpage) {
        to.matched = [to.matched[to.matched.length - 1]]
      }

      if (isGetRouter) {
        next()
      } else {
        // 读取用户信息
        const userInfo = tool.storage.get(config.USER_INFO)
        try {
          if (asyncRouteSettings.open) {
            permissionStore.setRoutes(userInfo.roles)
          } else {
            // 没有开启动态路由功能，则启用默认角色
            userStore.setRoles(asyncRouteSettings.defaultRoles)
            permissionStore.setRoutes(asyncRouteSettings.defaultRoles)
          }
          // 将'有访问权限的动态路由' 添加到 Router 中
          permissionStore.dynamicRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // 设置 replace: true, 因此导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (err: any) {
          // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
          userStore.resetToken()
          ElMessage.error(err.message || "路由守卫过程发生错误")
          next("/login")
          NProgress.done()
        }
        isGetRouter = true
      }
    }
  } else {
    // 如果没有 Token
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在免登录的白名单中，则直接进入
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      next("/login")
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
