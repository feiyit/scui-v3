import { ref, inject } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import config from "@/config"
import tool from "@/utils/tool"
import router, { resetRouter } from "@/router"
import { getUserInfoApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"
import asyncRouteSettings from "@/config/async-route"

export const useUserStore = defineStore("user", () => {
  const globalApi = inject("API")
  const token = ref<string>(tool.storage.get(config.TOKEN_NAME) || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = async (loginData: LoginRequestData) => {
    const res = await globalApi.login.submit.post(loginData)
    if (res.code === 200) {
      token.value = res.data.accessToken
      username.value = res.data.userInfo.username
      roles.value = res.data.userInfo.roles
      tool.storage.set({ key: config.TOKEN_NAME, value: res.data.accessToken })
      tool.storage.set({ key: config.USER_INFO, value: res.data.userInfo })
      // if (asyncRouteSettings.open) {
      //   permissionStore.setRoutes(roles.value)
      // } else {
      //   // 没有开启动态路由功能，则启用默认角色
      //   setRoles(asyncRouteSettings.defaultRoles)
      //   permissionStore.setRoutes(asyncRouteSettings.defaultRoles)
      // }
      // // 将'有访问权限的动态路由' 添加到 Router 中
      // console.log("permissionStore.dynamicRoutes", permissionStore.dynamicRoutes)
      // permissionStore.dynamicRoutes.forEach((route) => {
      //   router.addRoute(route)
      // })
    } else {
      roles.value = asyncRouteSettings.defaultRoles
    }
    return res
  }
  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((res) => {
          const data = res.data
          username.value = data.username
          // 验证返回的 roles 是否是一个非空数组
          if (data.roles && data.roles.length > 0) {
            roles.value = data.roles
          } else {
            // 塞入一个没有任何作用的默认角色，不然路由守卫逻辑会无限循环
            roles.value = asyncRouteSettings.defaultRoles
          }
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    console.log("changeRoles", role)
    const newToken = "token-" + role
    token.value = newToken
    //setToken(newToken)
    await getInfo()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
    _resetTagsView()
  }
  /** 登出 */
  const logout = () => {
    tool.storage.clear()
    token.value = ""
    roles.value = []
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    tool.storage.clear()
    token.value = ""
    roles.value = []
  }
  /** 重置 visited views 和 cached views */
  const _resetTagsView = () => {
    tagsViewStore.delAllVisitedViews()
    tagsViewStore.delAllCachedViews()
  }

  return { token, roles, username, setRoles, login, getInfo, changeRoles, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
