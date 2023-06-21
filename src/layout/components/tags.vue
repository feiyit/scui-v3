<template>
  <div class="adminui-tags">
    <ul ref="tags">
      <li
        v-for="tag in tagList"
        v-bind:key="tag"
        :class="[isActive(tag) ? 'active' : '', tag.meta.affix ? 'affix' : '']"
        @contextmenu.prevent="openContextMenu($event, tag)"
      >
        <router-link :to="tag">
          <span>{{ tag.meta.title }}</span>
          <el-icon v-if="!tag.meta.affix" @click.prevent.stop="closeSelectedTag(tag)"><el-icon-close /></el-icon>
        </router-link>
      </li>
    </ul>
  </div>

  <transition name="el-zoom-in-top">
    <ul v-if="contextMenuVisible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu" id="contextmenu">
      <li @click="refreshTab()">
        <el-icon><el-icon-refresh /></el-icon>刷新
      </li>
      <hr />
      <li @click="closeTabs()" :class="contextMenuItem.meta.affix ? 'disabled' : ''">
        <el-icon><el-icon-close /></el-icon>关闭标签
      </li>
      <li @click="closeOtherTabs()">
        <el-icon><el-icon-folder-delete /></el-icon>关闭其他标签
      </li>
      <hr />
      <li @click="maximize()">
        <el-icon><el-icon-full-screen /></el-icon>最大化
      </li>
      <li @click="openWindow()">
        <el-icon><el-icon-copy-document /></el-icon>在新的窗口中打开
      </li>
    </ul>
  </transition>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref, watch } from "vue"
import dynamicRouter from "@/router/dynamic"
import Sortable from "sortablejs"
import config from "@/config"

const contextMenuVisible = ref(false)
const tipDisplayed = ref(false)
const contextMenuItem = ref(null)
const left = ref(0)
const top = ref(0)

const treeFind = (tree, func) => {
  for (const data of tree) {
    if (func(data)) return data
    if (data.children) {
      const res = treeFind(data.children, func)
      if (res) return res
    }
  }
  return null
}

const addViewTags = (route) => {
  if (route.name && !route.meta.fullpage) {
    // this.$store.commit("pushViewTags", route)
    // this.$store.commit("pushKeepLive", route.name)
  }
}

onMounted(() => {
  var dashboardRoute = treeFind(dynamicRouter, (node) => node.path == config.DASHBOARD_URL)
  console.log("dashboardRoute", dashboardRoute)
  if (dashboardRoute) {
    dashboardRoute.fullPath = dashboardRoute.path
  }
})
</script>
