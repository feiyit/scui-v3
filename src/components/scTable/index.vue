<template>
  <div class="scTable" :style="{ height: _height }" v-loading="loading">
    <div class="scTable-table" :style="{ height: _table_height }">
      <el-table
        v-bind="$attrs"
        :data="tableData"
        :row-key="rowKey"
        :key="toggleIndex"
        default-expand-all
        ref="scTable"
        :height="height == 'auto' ? null : '100%'"
        :size="fatherElement.size"
        :border="fatherElement.border"
        :stripe="fatherElement.stripe"
        :summary-method="remoteSummary ? remoteSummaryMethod : summaryMethod"
        @row-contextmenu="rowContextmenu"
        @sort-change="sortChange"
        @filter-change="filterChange"
      >
        <slot></slot>
        <template v-for="(item, index) in userColumn" :key="index">
          <el-table-column
            v-if="!item.hide"
            highlight-current-row
            :align="item.align == null ? 'center' : item.align"
            :column-key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :min-width="item.width"
            :sortable="item.sortable"
            :fixed="item.fixed"
            :filters="item.filters"
            :filter-method="remoteFilter || !item.filters ? null : filterHandler"
            :show-overflow-tooltip="item.showOverflowTooltip"
          >
            <template #default="scope">
              <slot :name="item.prop" v-bind="scope" :data="scope.row">
                {{ scope.row[item.prop] }}
              </slot>
            </template>
          </el-table-column>
        </template>
        <template #empty>
          <el-empty :description="emptyText" :image-size="100"></el-empty>
        </template>
      </el-table>
    </div>
    <div class="scTable-page">
      <div class="scTable-pagination">
        <el-pagination
          v-if="!hidePagination"
          :currentPage="currentPage"
          :page-size="pageSize"
          :page-sizes="scPageSize"
          :layout="paginationLayout"
          :total="total"
          background
          :small="true"
          @size-change="paginationSizeChange"
          @current-change="paginationChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, defineProps, watch } from "vue"
import { usePagination } from "@/hooks/usePagination"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
console.log("paginationData", paginationData)
console.log("handleCurrentChange", handleCurrentChange)
console.log("handleSizeChange", handleSizeChange)
const fatherElement = defineProps({
  height: {
    type: [Number, String],
    default: "100%"
  },
  apiObj: { type: Object, default: () => {} },
  params: { type: Object, default: () => ({}) },
  data: { type: Object, default: () => {} },
  size: { type: String, default: "default" },
  pageSizes: { type: Array, default: 10 },
  border: { type: Boolean, default: false },
  stripe: { type: Boolean, default: false },
  isTree: { type: Boolean, default: false },
  limit: { type: Number, default: 20 },
  rowKey: { type: String, default: "" },
  summaryMethod: { type: Function, default: null },
  column: { type: Object, default: () => {} },
  remoteSort: { type: Boolean, default: false },
  remoteFilter: { type: Boolean, default: false },
  remoteSummary: { type: Boolean, default: false },
  hidePagination: { type: Boolean, default: false },
  hideDo: { type: Boolean, default: false },
  hideRefresh: { type: Boolean, default: false },
  hidePrint: { type: Boolean, default: false },
  hideExcel: { type: Boolean, default: false },
  hideSetting: { type: Boolean, default: false },
  menuColumn: { type: Object, default: () => {} },
  menuDefault: { type: Array, default: () => ["add", "edit", "delete"] }
})
// 定义变量
const tableData = ref([])
const tableParams = ref({})
const userColumn = ref([])
const currentPage = ref(1)
const total = ref(0)
const emptyText = ref("暂无数据")
const loading = ref(false)
const pageSize = ref(fatherElement.limit)
const scPageSize = ref(pageSize.value)

// 计算
const _height = computed(() => {
  return Number(fatherElement.height) ? Number(fatherElement.height) + "px" : fatherElement.height
})
const _table_height = computed(() => {
  return fatherElement.hidePagination && fatherElement.hideDo ? "100%" : "calc(100% - 50px)"
})
// 监听
// watch(() => [fatherElement.data, fatherElement.apiObj,fatherElement.column], (newVal, oldVal) => {
//   console.log(newVal, oldVal); // [11, 22], [1, 2]
//   console.log(newVal[0], oldVal[0], newVal[1], oldVal[1]); // 11, 1, 22, 2
// })
watch(fatherElement.data, (currentValue, oldValue) => {
  tableData.value = fatherElement.data
})
watch(fatherElement.apiObj, () => {
  tableParams.value = fatherElement.params
})
watch(fatherElement.column, () => {
  userColumn.value = fatherElement.column
})
</script>

<style scoped>
.scTable-table {
  height: calc(100% - 50px);
}
.scTable-page {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
.scTable-do {
  white-space: nowrap;
}
.scTable:deep(.el-table__footer) .cell {
  font-weight: bold;
}
</style>
