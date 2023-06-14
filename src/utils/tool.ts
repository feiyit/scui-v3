import Cookies from "js-cookie"
import * as CryptoJS from "crypto-js"
import { format } from "date-fns"

type Storage = {
  key: string
  value: any
}
export class util {
  storage = {
    set(item: Storage) {
      localStorage.setItem(item.key, JSON.stringify(item.value))
    },
    get(key: string) {
      let result = localStorage.getItem(key)
      result = (result && JSON.parse(result)) || null
      return result
    },
    remove(key: string) {
      localStorage.removeItem(key)
    },
    clear() {
      localStorage.clear()
    }
  }
  cookie = {
    set(item: Storage) {
      Cookies.set(item.key, JSON.stringify(item.value))
    },
    get(key: string) {
      return Cookies.get(key)
    },
    remove(key: string) {
      Cookies.remove(key)
    },
    clear() {
      const cookies = document.cookie.split(";")
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
    }
  }
  session = {
    set(item: Storage) {
      sessionStorage.setItem(item.key, JSON.stringify(item.value))
    },
    get(key: string) {
      let result = sessionStorage.getItem(key)
      result = (result && JSON.parse(result)) || null
      return result
    },
    remove(key: string) {
      sessionStorage.removeItem(key)
    },
    clear() {
      sessionStorage.clear()
    }
  }
  crypto = {
    // md5加密
    md5(value: string): string {
      return CryptoJS.MD5(value).toString()
    },
    // aes加密
    aesEncrypt(value: string, key: string): string {
      const encrypted = CryptoJS.AES.encrypt(value, key)
      return encrypted.toString()
    },
    // aes解密
    aesDecrypt(value: string, key: string): string {
      const decrypted = CryptoJS.AES.decrypt(value, key)
      return decrypted.toString(CryptoJS.enc.Utf8)
    },
    // des加密
    desEncrypt(value: string, key: string): string {
      const encrypted = CryptoJS.DES.encrypt(value, key)
      return encrypted.toString()
    },
    // des解密
    desDecrypt(value: string, key: string): string {
      const decrypted = CryptoJS.DES.decrypt(value, key)
      return decrypted.toString(CryptoJS.enc.Utf8)
    },
    // base64编码
    base64Encode(value: string): string {
      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value))
    },
    // base64解码
    base64Decode(value: string): string {
      return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8)
    }
  }
  objIsNull = (obj: object): boolean => {
    let result: boolean
    if (obj && Object.keys(obj).length > 0) {
      result = true
    } else {
      result = false
    }
    return result
  }
  arrIsNull = (arr: any[]): boolean => {
    let result: boolean
    if (arr && arr.length > 0) {
      result = true
    } else {
      result = false
    }
    return result
  }
  objKeySort(obj: Record<string, any>): Record<string, any> {
    const sortedObj = Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = obj[key]
        return acc
      }, {})
    return sortedObj
  }
  /* 复制对象 */
  objCopy = (obj: any) => {
    return JSON.parse(JSON.stringify(obj))
  }
  /* 日期格式化 */
  dateFormat = (date: string | number | Date, fmt = "yyyy-MM-dd hh:mm:ss") => {
    date = new Date(date)
    return format(date, fmt)
  }
  /* 千分符 */
  groupSeparator = (num: number) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }
  // 列表树结构数据转成树形结构数据
  changeTree = (data: any[]) => {
    if (data.length > 0) {
      data.forEach((item) => {
        const parentId = item.parentId
        if (parentId) {
          data.forEach((ele) => {
            if (ele.id === parentId) {
              let childArray = ele.children
              if (!childArray) {
                childArray = []
              }

              childArray.push(item)
              ele.children = childArray
            }
          })
        }
      })
    }
    return data.filter((item) => item.parentId == "0")
  }
  uuid = (length = 32) => {
    const num = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let str = ""
    for (let i = 0; i < length; i++) {
      str += num.charAt(Math.floor(Math.random() * num.length))
    }
    return str
  }
  fileSize = (limit: number) => {
    let size = ""
    if (limit < 0.1 * 1024) {
      //小于0.1KB，则转化成B
      size = limit.toFixed(2) + "B"
    } else if (limit < 0.1 * 1024 * 1024) {
      //小于0.1MB，则转化成KB
      size = (limit / 1024).toFixed(2) + "KB"
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
      //小于0.1GB，则转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB"
    } else {
      //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
    }
    const sizeStr = size + "" //转成字符串
    const index = sizeStr.indexOf(".") //获取小数点处的索引
    const dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
    if (dou == "00") {
      //判断后两位是否为00，如果是则删除00
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size
  }
  uriGetParam = (name: string): string => {
    const reg = new RegExp("[?&]" + name + "=([^&#]*)", "i")
    const res = window.location.href.match(reg)
    if (res && res.length > 1) {
      return decodeURIComponent(res[1])
    }
    return ""
  }
}

export default new util()
function arrIsNull(keys: RegExpMatchArray) {
  throw new Error("Function not implemented.")
}
