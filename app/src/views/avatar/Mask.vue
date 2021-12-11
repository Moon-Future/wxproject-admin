<template>
  <div>
    <base-table
      ref="baseTable"
      :fields="fields"
      :tableData="tableData"
      :url="url"
      :delUrl="delUrl"
      :loading="loading"
      :total="total"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :noAction="false"
      @changeSize="changeSize"
      @changeNo="changeNo"
      @refreshData="refreshData"
    ></base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'
import API from '@/utils/api'
import { tableMixin } from '@/utils/mixins'
export default {
  mixins: [tableMixin],
  name: 'AvatarTab',
  components: {
    BaseTable
  },
  props: {
    conditions: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      fields: [
        { field: 'name', label: '名称', required: true },
        { field: 'src', label: '图片', required: true, tableNodeType: 'img', nodeType: 'input' },
        { field: 'tab', label: '标签', required: true, nodeType: 'select', options: [], showField: 'tabName' },
        { field: 'leftValue', label: '左距', required: true, nodeType: 'number' },
        { field: 'topValue', label: '上距', required: true, nodeType: 'number' },
        { field: 'sort', label: '排序', required: true, nodeType: 'number', min: 1 },
        {
          field: 'hot',
          label: '是否热门',
          required: true,
          nodeType: 'select',
          default: 0,
          options: [
            { value: 0, label: '否' },
            { value: 1, label: '是' }
          ]
        }
      ],
      tableData: [],
      url: 'addAvatarMask',
      delUrl: 'delAvatarMask'
    }
  },
  async created() {
    await this.getTabs()
  },
  methods: {
    async getData(params = {}) {
      try {
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        this.loading = true
        let res = await API.getAvatarMask(params)
        this.tableData = res.data.data
        this.total = res.data.total
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
    async getTabs() {
      try {
        const res = await API.getAvatarAllTab({})
        const tabs = res.data.data.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
        this.fields.splice(2, 1, { field: 'tab', label: '标签', required: true, nodeType: 'select', options: tabs, showField: 'tabName' })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
