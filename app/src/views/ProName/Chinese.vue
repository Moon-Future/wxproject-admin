<template>
  <div>
    <Search @search="search">
      <div class="search-item">
        <el-input placeholder="请输入汉字" v-model="searchConds.chinese" clearable></el-input>
      </div>
      <div class="search-item">
        <!-- <el-input placeholder="请输入五行" v-model="searchConds.attr" clearable></el-input> -->
        <el-select v-model="searchConds.attr" placeholder="请选择五行属性">
          <!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option> -->
          <el-option label="金木水火土" value=""></el-option>
          <el-option label="金" value="金"></el-option>
          <el-option label="木" value="木"></el-option>
          <el-option label="水" value="水"></el-option>
          <el-option label="火" value="火"></el-option>
          <el-option label="土" value="土"></el-option>
        </el-select>
      </div>
      <div class="search-item">
        <el-select v-model="searchConds.surname" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="姓氏" value="1"></el-option>
          <el-option label="非姓氏" value="0"></el-option>
        </el-select>
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
        {
          field: 'surname',
          label: '是否姓氏',
          default: '0',
          showField: 'surnamem',
          nodeType: 'select',
          options: [
            { value: '1', label: '是' },
            { value: '0', label: '否' }
          ]
        },
        { field: 'attr', label: '五行' }
      ],
      tableData: [],
      searchConds: {
        chinese: '',
        attr: '',
        surname: ''
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
        res.data.data.forEach((ele, index) => {
          res.data.data[index].surname = ele.surname + ''
          res.data.data[index].surnamem = ele.surname == 1 ? '是' : ''
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
