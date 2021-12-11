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
        { field: 'sort', label: '排序', required: true, nodeType: 'number', min: 1 }
      ],
      tableData: [],
      url: 'addAvatarTab',
      delUrl: 'delAvatarTab'
    }
  },
  methods: {
    async getData(params = {}) {
      try {
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        this.loading = true
        let res = await API.getAvatarTab(params)
        this.tableData = res.data.data
        this.total = res.data.total
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
