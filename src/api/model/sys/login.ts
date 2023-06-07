import config from "@/config"
import http from "@/utils/request"
export default {
  authority: {
    url: `${config.API_URL}/user/authoritymenu`,
    name: "获得权限",
    get: async function (params: {} | undefined) {
      return await http.get(this.url, params)
    }
  },
  code: {
    url: `${config.API_URL}/login/code`,
    name: "获得验证码",
    get: async function (params: {} | undefined) {
      return await http.get(this.url, params)
    }
  },
  submit: {
    url: `${config.API_URL}/user/login`,
    name: "登录",
    post: async function (data: {} | undefined) {
      return await http.post(this.url, data)
    }
  }
}
