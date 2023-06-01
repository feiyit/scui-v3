<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref, watch } from "vue"
import { type RouteRecordRaw, RouterLink, useRoute, useRouter } from "vue-router"
import { type TagView, useTagsViewStore } from "@/store/modules/tags-view"
import { usePermissionStore } from "@/store/modules/permission"
import ScrollPane from "./ScrollPane.vue"
import path from "path-browserify"
import { Close, CircleCloseFilled } from "@element-plus/icons-vue"

const instance = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

const tagRefs = ref<InstanceType<typeof RouterLink>[]>([])

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>({})
let affixTags: TagView[] = []

const isActive = (tag: TagView) => {
  return tag.path === route.path
}

const isAffix = (tag: TagView) => {
  return tag.meta?.affix
}

const filterAffixTags = (routes: RouteRecordRaw[], basePath = "/") => {
  let tags: TagView[] = []
  routes.forEach((route) => {
    if (route.meta?.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path)
      if (childTags.length >= 1) {
        tags = tags.concat(childTags)
      }
    }
  })
  return tags
}

const initTags = () => {
  affixTags = filterAffixTags(permissionStore.routes)
  for (const tag of affixTags) {
    // 必须含有 name 属性
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

const addTags = () => {
  if (route.name) {
    tagsViewStore.addVisitedView(route)
    tagsViewStore.addCachedView(route)
  }
}

const refreshSelectedTag = (view: TagView) => {
  tagsViewStore.delCachedView(view)
  router.replace({ path: "/redirect" + view.path, query: view.query })
}

const closeSelectedTag = (view: TagView) => {
  tagsViewStore.delVisitedView(view)
  tagsViewStore.delCachedView(view)
  if (isActive(view)) {
    toLastView(tagsViewStore.visitedViews, view)
  }
}

const closeOthersTags = () => {
  if (selectedTag.value.fullPath !== route.path && selectedTag.value.fullPath !== undefined) {
    router.push(selectedTag.value.fullPath)
  }
  tagsViewStore.delOthersVisitedViews(selectedTag.value)
  tagsViewStore.delOthersCachedViews(selectedTag.value)
}

const closeAllTags = (view: TagView) => {
  tagsViewStore.delAllVisitedViews()
  tagsViewStore.delAllCachedViews()
  if (affixTags.some((tag) => tag.path === route.path)) {
    return
  }
  toLastView(tagsViewStore.visitedViews, view)
}

const toLastView = (visitedViews: TagView[], view: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView !== undefined && latestView.fullPath !== undefined) {
    router.push(latestView.fullPath)
  } else {
    // 如果 TagsView 全部被关闭了，则默认重定向到主页
    if (view.name === "Dashboard") {
      // 重新加载主页
      router.push({ path: "/redirect" + view.path, query: view.query })
    } else {
      router.push("/")
    }
  }
}

const openMenu = (tag: TagView, e: MouseEvent) => {
  const menuMinWidth = 105
  // container margin left
  const offsetLeft = instance!.proxy!.$el.getBoundingClientRect().left
  // container width
  const offsetWidth = instance!.proxy!.$el.offsetWidth
  // left boundary
  const maxLeft = offsetWidth - menuMinWidth
  // 15: margin right
  const left15 = e.clientX - offsetLeft + 15
  if (left15 > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = left15
  }
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

const closeMenu = () => {
  visible.value = false
}

watch(
  route,
  () => {
    addTags()
  },
  {
    deep: true
  }
)

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener("click", closeMenu)
  } else {
    document.body.removeEventListener("click", closeMenu)
  }
})

onMounted(() => {
  initTags()
  addTags()
})
</script>

<template>
  <div class="tags-view-container">
    <ScrollPane class="tags-view-wrapper" :tag-refs="tagRefs">
      <router-link
        ref="tagRefs"
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.meta?.title }}
        <el-icon v-if="!isAffix(tag)" :size="14" @click.prevent.stop="closeSelectedTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </ScrollPane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <el-icon :size="16"><Refresh /></el-icon> 刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <el-icon :size="16"><Close /></el-icon> 关闭
      </li>
      <li @click="closeOthersTags">
        <el-icon :size="16"><Remove /></el-icon>关闭其它
      </li>
      <li @click="closeAllTags(selectedTag)">
        <el-icon :size="16"><CircleClose /></el-icon> 关闭所有
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: var(--v3-tagsview-height);
  width: 100%;
  padding-top: 5px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 35px;
      line-height: 35px;
      border-radius: var(--v3-tagsview-tag-border-radius);
      color: var(--v3-tagsview-tag-text-color);
      background-color: var(--v3-tagsview-tag-bg-color);
      padding: 0 20px;
      font-size: 13px;
      margin-left: 5px;
      &:first-of-type {
        margin-left: 5px;
      }
      &:last-of-type {
        margin-right: 5px;
      }
      &.active {
        background-color: var(--v3-tagsview-tag-active-bg-color);
        color: var(--v3-tagsview-tag-active-text-color);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        &::before,
        &::after {
          content: "";
          position: absolute;
          bottom: 0px;
          width: 10px;
          height: 6px;
          background-size: 100% 100%;
          background-image: url(@/assets/layout/tab-j.png);
        }
        &::before {
          left: -3px;
        }
        &::after {
          right: -3px;
        }
      }
      .el-icon {
        margin-left: 5px;
        vertical-align: middle;
        border-radius: 50%;
        &:hover {
          background-color: var(--v3-tagsview-tag-icon-hover-bg-color);
          color: var(--v3-tagsview-tag-icon-hover-color);
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background-color: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 8px 0;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 #00000030;
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      display: flex;
      &:hover {
        background-color: #e9f4ff;
      }
      .el-icon {
        margin-right: 5px;
      }
    }
  }
}
</style>
