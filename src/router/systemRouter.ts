const routes = [
  {
    name: "layout",
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/dashboard",
    meta: {
      hidden: true
    },
    children: []
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/redirect",
    component: () => import("@/layout/index.vue"),
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  }
]

export default routes
