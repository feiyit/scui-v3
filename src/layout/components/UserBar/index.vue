<template>
  <div class="user-bar">
    <div class="panel-item" v-if="showScreenfull">
			<Screenfull />
		</div>
    <div class="panel-item" v-if="showThemeSwitch">
      <el-dropdown trigger="click" @command="setTheme">
        <div>
          <el-tooltip effect="dark" content="主题模式" placement="bottom">
            <el-icon :size="20">
              <MagicStick />
            </el-icon>
          </el-tooltip>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(theme, index) in themeList"
              :key="index"
              :disabled="activeThemeName === theme.name"
              :command="theme.name"
            >
              <span>{{ theme.title }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="panel-item"> <Notify v-if="showNotify" /></div>
    <div class="panel-item">
      <el-dropdown>
        <div class="right-menu-avatar">
          <el-avatar :icon="UserFilled" :size="30" />
          <span>{{ userStore.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <span class="user-drop-item"
                ><el-icon><User /></el-icon> 个人中心</span
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="user-drop-item"
                ><el-icon><EditPen /></el-icon> 修改密码</span
              >
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <span class="user-drop-item"
                ><el-icon><SwitchButton /></el-icon> 退出登录</span
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>


</template>
<script lang="ts" setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useAppStore } from "@/store/modules/app"
import { useSettingsStore } from "@/store/modules/settings"
import { useUserStore } from "@/store/modules/user"
import { useTheme } from "@/hooks/useTheme"
import Notify from "../Notify/index.vue"
import { User, EditPen, SwitchButton,UserFilled,MagicStick } from "@element-plus/icons-vue"
import Screenfull from "../Screenfull/index.vue"

const router = useRouter()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const { themeList, activeThemeName, setTheme } = useTheme()

const sidebar = computed(() => {
  return appStore.sidebar
})
const showNotify = computed(() => {
  return settingsStore.showNotify
})
const showThemeSwitch = computed(() => {
  return settingsStore.showThemeSwitch
})
const showScreenfull = computed(() => {
  return settingsStore.showScreenfull
})

const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}
const logout = () => {
  userStore.logout()
  router.push("/login")
}
</script>
<style lang="scss" scoped>
  .user-bar {display: flex;align-items: center;height: 100%;}
	.user-bar .panel-item {padding: 0 10px;cursor: pointer;height: 100%;display: flex;align-items: center;}
	.user-bar .panel-item i {font-size: 16px;}
	.user-bar .panel-item:hover {background: rgba(0, 0, 0, 0.1);}
.right-menu-item {
  padding: 0 10px;
  cursor: pointer;
  .right-menu-avatar {
    display: flex;
    align-items: center;
    .el-avatar {
      margin-right: 10px;
    }
    span {
      font-size: 16px;
    }
  }
}
.user-drop-item {
  width: 160px;
  padding: 5px 0;
}
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>
