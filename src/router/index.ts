import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { ElMessage } from "element-plus"
import config from "@/config"
import tool from "@/utils/tool"
import systemRouter from "./systemRouter"
import dynamicRouter from "./dynamic"

//系统路由
const routes = systemRouter
//系统特殊路由
const routes_404 = {
  path: "/:pathMatch(.*)*",
  hidden: true,
  component: () => import("@/views/error-page/404.vue")
}
let routes_404_r = () => {}

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: systemRouter
})

//设置标题
document.title = config.APP_NAME

NProgress.configure({ showSpinner: false })

//判断是否已加载过动态/静态路由
let isGetRouter = false

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  //动态标题
  document.title = to.meta.title ? `${to.meta.title} - ${config.APP_NAME}` : `${config.APP_NAME}`
  // debugger
  if (to.path === "/login") {
    //删除路由(替换当前layout路由)
    router.addRoute(routes[0])
    //删除路由(404)
    routes_404_r()
    isGetRouter = false
    next()
    return false
  }

  if (routes.findIndex((r) => r.path === to.path) >= 0) {
    next()
    return false
  }

  const token = tool.storage.get(config.TOKEN_NAME)

  if (!token) {
    next({
      path: "/login"
    })
    return false
  }

  //整页路由处理
  if (to.meta.fullpage) {
    to.matched = [to.matched[to.matched.length - 1]]
  }
  if (!isGetRouter) {
    let menuRouter = filterAsyncRouter(dynamicRouter)
    menuRouter = flatAsyncRoutes(menuRouter)
    menuRouter.forEach((item) => {
      router.addRoute("layout", item)
    })
    routes_404_r = router.addRoute(routes_404)
    if (to.matched.length == 0) {
      router.push(to.fullPath)
    }
    isGetRouter = true
    next({ ...to, replace: true })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

router.onError((error) => {
  NProgress.done()
  ElMessage.error(error.message || "路由守卫过程发生错误")
})

//入侵追加自定义方法、对象
export const getMenu = () => {
  return dynamicRouter
}

const filterAsyncRouter = (routerMap: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = []
  routerMap.forEach((item) => {
    item.meta = item.meta ? item.meta : {}
    //处理外部链接特殊路由
    if (item.meta.type == "iframe") {
      item.meta.url = item.path
      item.path = `/i/${String(item.name)}`
    }
    //MAP转路由对象
    const tempRoute = {
      path: item.path,
      name: item.name,
      meta: item.meta,
      redirect: item.redirect,
      children: item.children ? filterAsyncRouter(item.children) : null,
      component: resolveComponent(item.component)
    }
    res.push(tempRoute)
  })
  return res
}
// 加载动态路由
const pages = import.meta.glob("../views/**/*.vue")

const resolveComponent = (name: any) => {
  if (!name) {
    return import("@/layout/index.vue")
  }
  const importPage = pages[`../views/${name}.vue`]
  if (!importPage) {
    throw new Error(`Unknown page ${name}. Is it located under Pages with a .vue extension?`)
  }
  return importPage().then((module: any) => module.default)
}
//路由扁平化
function flatAsyncRoutes(tree: RouteRecordRaw[]): RouteRecordRaw[] {
  return tree.reduce<RouteRecordRaw[]>((acc, node) => {
    const temp = node
    acc.push(temp)
    if (node.children) {
      acc.push(...flatAsyncRoutes(node.children))
    }
    return acc
  }, [])
}

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
