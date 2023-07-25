<script lang="ts" setup>
import { computed, watch, ref, onMounted } from "vue"
import { RouteLocationMatched, useRoute, useRouter } from "vue-router"
import { useAppStore } from "@/store/modules/app"
import { useSettingsStore } from "@/store/modules/settings"
import { AppMain, NavigationBar, Settings, Sidebar, TagsView, RightPanel, Breadcrumb, UserBar } from "./components"
import useResize from "./hooks/useResize"
import { DeviceEnum } from "@/constants/app-key"
import { usePermissionStore } from "@/store/modules/permission"
import dynamicRouter from "@/router/dynamic"
import { Fold, Expand } from "@element-plus/icons-vue"
import NavMenu from "./components/NavMenu.vue"
import tags from "./components/tags.vue"
import config from "@/config"
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

/** Layout 布局响应式 */
useResize()

const classObj = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    withoutAnimation: appStore.sidebar.withoutAnimation,
    mobile: appStore.device === DeviceEnum.Mobile,
    showGreyMode: showGreyMode.value,
    showColorWeakness: showColorWeakness.value
  }
})

const showSettings = computed(() => {
  return settingsStore.showSettings
})
const showTagsView = computed(() => {
  return settingsStore.showTagsView
})
const fixedHeader = computed(() => {
  return settingsStore.fixedHeader
})
const showGreyMode = computed(() => {
  return settingsStore.showGreyMode
})
const showColorWeakness = computed(() => {
  return settingsStore.showColorWeakness
})
const layout = computed(() => {
  return settingsStore.layout
})
watch(layout, () => {
  document.body.setAttribute("data-layout", layout.value)
})
document.body.setAttribute("data-layout", layout.value)
const handleClickOutside = () => {
  appStore.closeSidebar(false)
}
const pmenu = ref({})
const active = ref("")
const nextMenu = ref([])
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})
//根据导航获得
pmenu.value = dynamicRouter[0]

const filterUrl = (map) => {
  let newMap = []
  map &&
    map.forEach((item) => {
      item.meta = item.meta ? item.meta : {}
      //处理隐藏
      if (item.meta.hidden || item.meta.type == "button") {
        return false
      }
      //处理http
      if (item.meta.type == "iframe") {
        item.path = `/i/${item.name}`
      }
      //递归循环
      if (item.children && item.children.length > 0) {
        item.children = filterUrl(item.children)
      }
      newMap.push(item)
    })
  return newMap
}
nextMenu.value = filterUrl(pmenu.value.children)
const showMenu = (route) => {
  console.log('param',route)
  pmenu.value = route
  nextMenu.value = filterUrl(route.children)
  console.log('nextMenu',nextMenu.value)
  if ((!route.children || route.children.length == 0) && route.component) {
    router.push({ path: route.path })
  }
}

//路由监听高亮
const showThis = () => {
  active.value = activeMenu.value
  if (route.matched.length > 1) {
    pmenu.value = route.matched[route.matched.length - 2]
    console.log("pmenu.value", pmenu.value)
  }
}
const getBreadcrumb = () => {
  const temp = route.matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

watch(
  () => route.path,
  (path) => {
    console.log('path',path)
    getBreadcrumb()
  }
)
onMounted(() => {
  //showThis()
})
showThis()
</script>

<template>
  <!-- 默认布局 -->
  <template v-if="layout == 'default'">
    <section class="aminui-wrapper">
      <div v-if="!classObj.mobile" :class="!classObj.openSidebar ? 'aminui-side isCollapse' : 'aminui-side'">
        <div class="adminui-side-logo">
          <img src="@/assets/layout/logo.png" class="sidebar-logo" />
          <span>{{ config.APP_NAME }}</span>
        </div>
        <div class="adminui-side-scroll">
          <Sidebar class="sidebar-container" />
          <!-- <el-scrollbar>
            <el-menu :default-active="active" router :collapse="!classObj.openSidebar">
              <NavMenu :navMenus="dynamicRouter"></NavMenu>
            </el-menu>
          </el-scrollbar> -->
        </div>
        <div class="adminui-side-bottom">
          <el-icon :size="20" v-if="classObj.openSidebar"><Fold /></el-icon>
          <el-icon :size="20" v-if="!classObj.openSidebar"><Expand /></el-icon>
        </div>
      </div>
      <div class="aminui-body el-container">
        <NavigationBar />
        <TagsView v-show="showTagsView" />
        <!-- <tags /> -->
        <AppMain />
      </div>
    </section>
  </template>
  <RightPanel v-if="showSettings">
    <Settings />
  </RightPanel>
  <!-- 通栏布局 -->
  <template v-if="layout == 'header'">
    <header class="adminui-header">
      <div class="adminui-header-left">
        <div class="logo-bar">
          <img class="logo" src="/src/assets/layout/logo.png" /><span>{{ config.APP_NAME }}</span>
        </div>
        <ul v-if="!classObj.mobile" class="nav">
          <li
            v-for="item in dynamicRouter"
            :key="item"
            :class="pmenu.path == item.path ? 'active' : ''"
            @click="showMenu(item)"
          >
            <!-- <el-icon><component :is="item.meta.icon || 'el-icon-menu'" /></el-icon> -->
            <svg-icon name="lock" />
            <span>{{ item.meta.title }}</span>
          </li>
        </ul>
      </div>
      <div class="adminui-header-right"><UserBar /></div>
    </header>
    <section class="aminui-wrapper">
      <div class="aminui-side">
        <div v-if="!classObj.openSidebar" class="adminui-side-top">
          <h2>{{ pmenu.meta.title }}</h2>
        </div>
        <div class="adminui-side-scroll">
          <el-scrollbar>
            <el-menu :default-active="active" router :collapse="!classObj.openSidebar">
              <NavMenu :navMenus="nextMenu"></NavMenu>
            </el-menu>
          </el-scrollbar>
        </div>
        <div class="adminui-side-bottom">
          <el-icon :size="20" v-if="classObj.openSidebar"><Fold /></el-icon>
          <el-icon :size="20" v-if="!classObj.openSidebar"><Expand /></el-icon>
        </div>
      </div>
      <div class="aminui-body el-container">
        <!-- <Breadcrumb class="breadcrumb" /> -->
        <TagsView v-show="showTagsView" />
        <AppMain />
      </div>
    </section>
  </template>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  display: flex;
  flex-flow: column;
}

.showGreyMode {
  filter: grayscale(1);
}

.showColorWeakness {
  filter: invert(0.8);
}

.drawer-bg {
  background-color: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: var(--v3-sidebar-width);
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: var(--v3-sidebar-width) !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - var(--v3-sidebar-width));
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: var(--v3-sidebar-hide-width);
  }
  .sidebar-container {
    width: var(--v3-sidebar-hide-width) !important;
  }
  .fixed-header {
    width: calc(100% - var(--v3-sidebar-hide-width));
  }
}

// for mobile response 适配移动端
.mobile {
  .main-container {
    margin-left: 0px;
  }
  .sidebar-container {
    transition: transform 0.28s;
    width: var(--v3-sidebar-width) !important;
  }
  &.openSidebar {
    position: fixed;
    top: 0;
  }
  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(calc(0px - var(--v3-sidebar-width)), 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}

[data-layout="header"] {
  .breadcrumb {
    margin-left: 0px;
    display: block;
    background: #ffffff;
    padding-left: 10px;
  }
}
</style>
