import { type RouteRecordRaw } from "vue-router"
const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    meta: {
      title: "主页",
      icon: "el-icon-house",
      affix: false,
      type: "menu"
    },
    children: [
      {
        path: "/dashboard",
        component: "dashboard/index",
        name: "dashboard",
        meta: {
          title: "工作台",
          icon: "el-icon-menu",
          affix: true,
          type: "menu"
        },
        children: []
      }
      // {
      //   path: "http://localhost:5000/fytapiui/index.html",
      //   name: "api-doc",
      //   meta: {
      //     title: "接口文档",
      //     icon: "el-icon-document",
      //     affix: false,
      //     type: "link"
      //   },
      //   children: []
      // }
    ]
  },
  {
    path: "/unocss",
    name: "unocss",
    redirect: "/unocss/index",
    meta: {
      title: "UnoCSS",
      icon: "el-icon-basketball",
      affix: false,
      type: "menu"
    },
    children: [
      {
        path: "/unocss/temp",
        component: "unocss/index",
        name: "UnoCSS",
        meta: {
          title: "UnoCSS",
          icon: "el-icon-help",
          affix: false,
          type: "menu"
        },
        children: []
      }
    ]
  },
  {
    path: "/table",
    name: "table",
    meta: {
      title: "表格",
      icon: "el-icon-basketball",
      affix: false,
      type: "menu"
    },
    children: [
      {
        path: "/table/sc-table",
        component: "table/sctable/index",
        name: "sc-table",
        meta: {
          title: "Sc-table",
          icon: "el-icon-help",
          affix: false,
          type: "menu"
        },
        children: []
      }
    ]
  },
  {
    path: "/menu",
    name: "menu",
    meta: {
      title: "多级菜单",
      icon: "el-icon-basketball",
      affix: false,
      type: "menu"
    },
    children: [
      {
        path: "/menu1",
        component: "menu/menu1/index",
        name: "menu1",
        meta: {
          title: "menu1",
          icon: "el-icon-help",
          affix: false,
          type: "menu"
        },
        children: [
          {
            path: "/menu2",
            component: "menu/menu1/menu1-1/index",
            name: "menu2",
            meta: {
              title: "menu2",
              icon: "el-icon-help",
              affix: false,
              type: "menu"
            },
            children: []
          }
        ]
      }
    ]
  }
]
export default routes
