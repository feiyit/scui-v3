<script lang="ts" setup>
import { computed } from "vue"
import { useAppStore } from "@/store/modules/app"
import Breadcrumb from "../Breadcrumb/index.vue"
import Hamburger from "../Hamburger/index.vue"
import UserBar from "../UserBar/index.vue"

const appStore = useAppStore()
const sidebar = computed(() => {
  return appStore.sidebar
})
const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}

</script>

<template>
  <div class="navigation-bar">
    <Hamburger :is-active="sidebar.opened" class="hamburger" @toggle-click="toggleSidebar" />
    <Breadcrumb class="breadcrumb" />
    <div class="right-menu">
      <UserBar />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .navigation-bar {
    height: var(--v3-navigationbar-height);
    overflow: hidden;
    background: #fff;
    .hamburger {
      display: flex;
      align-items: center;
      height: 100%;
      float: left;
      padding: 0 15px;
      cursor: pointer;
    }
    .breadcrumb {
      float: left;
      @media screen and (max-width: 576px) {
        display: none;
      }
    }
    .right-menu {
      float: right;
      margin-right: 10px;
      height: 100%;
      display: flex;
      align-items: center;
      color: #606266;

    }
  }

  </style>
