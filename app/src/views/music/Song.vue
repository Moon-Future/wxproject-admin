<template>
  <div>
    <Search @search="search">
      <div class="search-item">
        <el-input placeholder="请输入姓名" v-model="searchConds.name" clearable></el-input>
      </div>
    </Search>
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
        <el-button size="mini" type="primary" :loading="data.loading" @click="update(data, index)">更新评论数</el-button>
      </template>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'
import Search from '@/components/Search'
import API from '@/utils/api'
import { tableMixin } from '@/utils/mixins'
export default {
  mixins: [tableMixin],
  name: 'Artist',
  components: {
    BaseTable,
    Search
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
        { field: 'name', label: '歌名' },
        { field: 'artistName', label: '歌手' },
        { field: 'commentCount', label: '评论数' }
      ],
      tableData: [],
      searchConds: {
        name: '',
      }
    }
  },
  methods: {
    async getData(params = {}) {
      try {
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        this.loading = true
        let res = await API.getSong(params)
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
      let res = await API.updateCommentCount({ id: data.id })
      newData.commentCount = res.data.data
      newData.loading = false
      this.tableData.splice(index, 1, newData)
    }
  }
}
</script>

<style lang="scss" scoped></style>
