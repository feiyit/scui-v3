<script lang="ts" setup>
import { ref, inject } from "vue"
import { useUserStore } from "@/store/modules/user"
import AdminDashboard from "./admin/index.vue"
import EditorDashboard from "./editor/index.vue"

type CurrentRole = "admin" | "editor"

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
  <component :is="currentRole === 'admin' ? AdminDashboard : EditorDashboard" />
</template>
