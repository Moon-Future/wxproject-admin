<template>
  <div>
    <Search @search="search">
      <div class="search-item">
        <el-input placeholder="请输入汉字" v-model="searchConds.chinese" clearable></el-input>
      </div>
      <div class="search-item">
        <el-input placeholder="请输入五行" v-model="searchConds.attr" clearable></el-input>
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
  name: 'Chinese',
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
      url: 'addChinese',
      delUrl: 'delChinese',
      fields: [
        { field: 'chinese', label: '汉字', required: true, disabled: true },
        { field: 'pronounce', label: '拼音' },
        { field: 'stroke', label: '笔划', nodeType: 'number' },
        { field: 'attr', label: '五行' }
      ],
      tableData: [],
      searchConds: {
        chinese: '',
        attr: ''
      }
    }
  },
  methods: {
    async getData(params = {}) {
      try {
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        this.loading = true
        let res = await API.getChinese(params)
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
