import config from "@/config"
import http from "@/utils/request"
export default {
  page: {
    url: `${config.API_URL}/sysadmin/pages`,
    name: "列表",
    get: async function (params: {} | undefined) {
      return await http.get(this.url, params)
    }
  },
  add: {
    url: `${config.API_URL}/sysadmin`,
    name: "添加",
    post: async function (data: {} | undefined) {
      return await http.post(this.url, data)
    }
  },
  model: {
    url: `${config.API_URL}/sysadmin/`,
    name: "查询一条",
    get: async function (params: string) {
      return await http.get(this.url + params)
    }
  },
  update: {
    url: `${config.API_URL}/sysadmin`,
    name: "修改",
    put: async function (data: {} | undefined) {
      return await http.put(this.url, data)
    }
  },
  delete: {
    url: `${config.API_URL}/sysadmin`,
    name: "删除",
    delete: async function (params: string) {
      return await http.delete(this.url + "?ids=" + params)
    }
  }
}
