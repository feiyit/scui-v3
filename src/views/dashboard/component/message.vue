<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span>最新工单进度</span>
        <el-button class="button" circle :icon="More"></el-button>
      </div>
    </template>
    <el-scrollbar height="260px">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :hollow="activity.hollow"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </el-scrollbar>
  </el-card>

</template>

<script lang="ts" setup>
import { MoreFilled,More } from '@element-plus/icons-vue'

const activities = [
  {
    content: 'Custom icon',
    timestamp: '2018-04-12 20:46',
    size: 'large',
    type: 'primary',
    icon: MoreFilled,
  },
  {
    content: 'Custom color',
    timestamp: '2018-04-03 20:46',
    color: '#0bbd87',
  },
  {
    content: 'Custom size',
    timestamp: '2018-04-03 20:46',
    size: 'large',
  },
  {
    content: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true,
  },
  {
    content: 'Default node',
    timestamp: '2018-04-03 20:46',
  },
]
</script>
<style scoped>
  .box-card{
    border:1px solid #ffffff
  }
  .box-card :deep(.el-card__header){
    padding:10px;
  }
  .box-card :deep(.el-card__body){
    padding:10px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>
