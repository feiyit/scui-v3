import { type App } from "vue"
import config from "./config"
import api from "./api"
import http from "./utils/request"

import { handleGlobalError } from "./utils/errorHandler"
export default {
  install: (app: App) => {
    //挂载全局对象
    app.provide("CONFIG", config)
    app.config.globalProperties.$CONFIG = config
    app.provide("HTTP", http)
    app.config.globalProperties.$HTTP = http
    app.provide("API", api)
    app.config.globalProperties.$API = api

    //全局代码错误捕捉
    app.config.errorHandler = handleGlobalError
  }
}
