<template>
  <div>
    <Search @search="search">
      <div class="search-item">
        <el-input placeholder="请输入词组" v-model="searchConds.word" clearable></el-input>
      </div>
      <div class="search-item">
        <el-input placeholder="请输入作者" v-model="searchConds.author" clearable></el-input>
      </div>
      <div class="search-item">
        <el-input placeholder="请输入诗名" v-model="searchConds.poetry" clearable></el-input>
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
      @changeSize="changeSize"
      @changeNo="changeNo"
      @refreshData="refreshData"
    ></base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'
import Search from '@/components/Search'
import API from '@/utils/api'
import { tableMixin } from '@/utils/mixins'

export default {
  mixins: [tableMixin],
  name: 'nameWord',
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
      url: 'addWord',
      delUrl: 'delWord',
      fields: [
        { field: 'word', label: '词语', width: 100, required: true, disabled: true },
        { field: 'mean', label: '含义', width: 250, nodeType: 'textarea', rows: 3 },
        { field: 'feature', label: '特征', width: 180 },
        { field: 'source', label: '出处', nodeType: 'textarea', rows: 3 },
        { field: 'author', label: '作者', width: 100 },
        { field: 'poetry', label: '诗名', width: 100 },
        { field: 'likes', label: '点赞量', width: 100, nodeType: 'number' }
      ],
      tableData: [],
      searchConds: {
        word: '',
        author: '',
        poetry: ''
      }
    }
  },
  methods: {
    async getData(params = {}) {
      try {
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        this.loading = true
        let res = await API.getWord(params)
        this.tableData = res.data.data
        this.total = res.data.count
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
