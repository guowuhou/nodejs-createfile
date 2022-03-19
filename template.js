// 视图层文件模板
const vueFile = (module) => `<template>
  <page-header-wrapper>
    <template v-slot:rightContent>
      <div class="c6"><span class="icon g_icon ic_box vam mr5"></span>共{{ table.pagination.total || 0 }}条数据</div>
    </template>
    <div class="table-page-search-wrapper">
      <div class="table-page-search">
        <search-form @search="search" @resetSearch="resetSearch" labelFontLen="4">
          <search-item
            type="input"
            :value.sync="params.templateName"
            :params="{ placeholder: '请输入' }"
            label="模板名称"
          />
        </search-form>
      </div>
      <div class="columns-chosen-wrapper">
        <table-column-selector class="bar" :columnsProp.sync="columns" table-id="${module}Prop" key="${module}Prop" />
      </div>
      <a-table
        ref="table"
        tableLayout="fixed"
        :loading="table.loading"
        :columns="columns"
        :data-source="table.data"
        :scroll="{ x: 2200 }"
        :pagination="table.pagination"
        @change="onChangeTable"
        :rowKey="(record, index) => 'table' + index"
      >
        <span slot="serial" slot-scope="text, record, index">{{ table.serial(index) }}</span>
      </a-table>
    </div>
  </page-header-wrapper>
</template>

<script>
// import { coloumn } from './_data/columns'
import SearchForm from '@/components/SearchForm/SearchForm'
import SearchItem from '@/components/SearchItem/SearchItem'
import tableMixin from '@/mixins/tableMixin'
// import debounce from 'lodash/debounce'

export default {
name: '${module}List',
components: { SearchForm, SearchItem },
data () {
  return {
    columns: [
      {
        title: '#',
        dataIndex: 'serial',
        scopedSlots: { customRender: 'serial' },
        width: 60,
        fixed: 'left'
      },
      {
        title: '模板号',
        dataIndex: 'templateNo',
        // scopedSlots: { customRender: 'orderNo' },
        ellipsis: true,
        width: 130
        // fixed: 'left'
      }
    ],
    params: {}
  }
},
mixins: [tableMixin],
mounted () {},
methods: {
  async init () {}
}
}
</script>

<style lang="less" scoped></style>
`

// 路由文件模板
const routerFile = (module) => `
// import { BasicLayout } from '@/layouts'

// export default {
//   path: '/tms/${module}',
//   name: '${module}',
//   component: BasicLayout,
//   redirect: '/${module}/template/list',
//   meta: { title: '模板', icon: 'data', permission: ['table'] },
//   children: [
//     // 模板路由
//     {
//       name: 'TemplatePage',
//       path: '/template/list',
//       component: () => import('@/views/algorithm/algorithm/FunctionIndex.vue'),
//       meta: { title: 模板算法', hiddenHeaderContent: true, keepAlive: true, permission: ['table'] }
//     }
//   ]
// }
`

// api文件模板
const apiFile = (module) => `
// import { post, get } from '@/utils/request'
// import { TMS_PRE } from '@/constData/constants'

// // 以下为模板接口
// export const api = {
//   templateList: TMS_PRE + '/template/getList',
//   templateUpdate: TMS_PRE + '/template/update'
// }

// export function templateList (data) {
//   return get(api.templateList, data)
// }

// export function templateUpdate (data) {
//   return get(api.templateUpdate, data)
// }
`
module.exports = {
  vueFile,
  routerFile,
  apiFile
}