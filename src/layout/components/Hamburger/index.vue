<script lang="ts" setup>
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue"

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

/** Vue 3.3+ defineEmits 语法 */
const emit = defineEmits<{
  toggleClick: []
}>()

const toggleClick = () => {
  emit("toggleClick")
}
</script>

<template>
  <div @click="toggleClick">
    <span class="quan">
      <el-icon :size="14" class="icon">
        <ArrowLeftBold v-if="props.isActive" />
        <ArrowRightBold v-else />
      </el-icon>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.quan {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 27px;
  border-radius: 50px;
  background: #f0f3fa;
  text-align: center;
}
.icon {
  vertical-align: middle;
}
.dark .quan{
  background: #404d6a;
}
</style>
