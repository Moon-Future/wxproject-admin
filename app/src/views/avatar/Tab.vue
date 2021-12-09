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
      :noAction="true"
      @changeSize="changeSize"
      @changeNo="changeNo"
      @refreshData="refreshData"
    >
      <template slot="table-action" slot-scope="{ data, index }">
        <el-button size="mini" type="primary" :loading="data.loading" @click="update(data, index)">更新歌曲数量</el-button>
      </template>
    </base-table>
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
        { field: 'id', label: 'ID', editHide: true },
        { field: 'name', label: '名称' },
        { field: 'sort', label: '排序' }
      ],
      tableData: []
    }
  },
  methods: {
    async getData(params = {}) {
      try {
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        this.loading = true
        let res = await API.getAvatarTabs(params)
        this.tableData = res.data.data
        this.total = res.data.count
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
    async update(data, index) {
      let newData = Object.assign({}, data)
      newData.loading = true
      this.tableData.splice(index, 1, newData)
      let res = await API.updateMusicSize({ artist: data.id })
      newData.musicSize = res.data.data
      newData.loading = false
      this.tableData.splice(index, 1, newData)
    }
  }
}
</script>

<style lang="scss" scoped></style>
