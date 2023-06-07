<script lang="ts" setup>
import { ref, inject } from "vue"
import { useUserStore } from "@/store/modules/user"
import statistic from "./component/statistic.vue"
import project from "./component/project.vue"
import message from "./component/message.vue"

const userStore = useUserStore()
const currentRole = ref<CurrentRole>("admin")
if (!userStore.roles.includes("admin")) {
  currentRole.value = "editor"
}
// const globalApi = inject("API")
// console.log("$API", globalApi)
// const res = await globalApi.admin.page.get({ id: 1 })
// console.log(res)
</script>

<template>
  <div class="app-container">
  <statistic />
  <el-row :gutter="20" class="m-t2">
    <el-col :span="16"> <project /></el-col>
    <el-col :span="8"><message /></el-col>
    </el-row>
</div>
</template>
