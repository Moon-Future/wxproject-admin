<template>
  <div>
    <Search @search="search">
      <div class="search-item">
        <el-input placeholder="请输入诗名" v-model="searchConds.poetry" clearable></el-input>
      </div>
      <div class="search-item">
        <el-input placeholder="请输入作者" v-model="searchConds.author" clearable></el-input>
      </div>
      <div class="search-item">
        <el-input placeholder="请输入诗句" v-model="searchConds.verse" clearable></el-input>
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
  name: 'namePoetry',
  components: {
    BaseTable,
    Search
  },
  data() {
    return {
      url: 'addPoetry',
      delUrl: 'delPoetry',
      fields: [
        { field: 'poetry', label: '诗名', width: 200, required: true },
        { field: 'author', label: '作者', width: 100 },
        { field: 'dynasty', label: '朝代', width: 100 },
        { field: 'verse', label: '诗句', nodeType: 'textarea', required: true }
      ],
      tableData: [],
      searchConds: {
        poetry: '',
        author: '',
        verse: ''
      }
    }
  },
  methods: {
    async getData(params = {}) {
      try {
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        this.loading = true
        let res = await API.getPoetry(params)
        res.data.data.forEach((ele, index) => {
          res.data.data[index].verse = ele.verse.replace(/\n/g, '</br>')
        })
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
