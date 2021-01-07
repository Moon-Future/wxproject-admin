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
      <div class="search-item">
        <el-select v-model="searchConds.used" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="女孩" value="0"></el-option>
          <el-option label="男孩" value="1"></el-option>
          <el-option label="网游" value="2"></el-option>
          <el-option label="社交" value="3"></el-option>
        </el-select>
      </div>
      <div class="search-item">
        <el-select v-model="searchConds.enor" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="英文名" value="1"></el-option>
          <el-option label="非英文名" value="0"></el-option>
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
        { field: 'word', label: '词语', width: 80, required: true, disabled: true },
        { field: 'mean', label: '含义', nodeType: 'textarea', rows: 5, hideField: true },
        { field: 'feature', label: '特征' },
        { field: 'source', label: '出处', nodeType: 'textarea', rows: 5 },
        { field: 'author', label: '作者', width: 100, hideField: true },
        { field: 'dynasty', label: '朝代', width: 50, hideField: true },
        { field: 'poetry', label: '诗名' },
        { field: 'likes', label: '点赞量', nodeType: 'number', hideField: true },
        {
          field: 'used',
          label: '适用',
          default: '-1',
          showField: 'usedm',
          nodeType: 'select',
          options: [
            { value: '-1', label: '全部' },
            { value: '0', label: '女孩' },
            { value: '1', label: '男孩' },
            { value: '01', label: '男女' },
            { value: '2', label: '网游' },
            { value: '3', label: '社交' }
          ],
          width: 50
        },
        {
          field: 'enor',
          label: '是否英文名',
          default: '0',
          showField: 'enorm',
          nodeType: 'select',
          options: [
            { value: '0', label: '否' },
            { value: '1', label: '是' }
          ],
          width: 100
        }
      ],
      tableData: [],
      searchConds: {
        word: '',
        author: '',
        poetry: '',
        used: '',
        enor: ''
      },
      usedMap: {
        '-1': '',
        '0': '女孩',
        '1': '男孩',
        '01': '男女',
        '2': '网游',
        '3': '社交'
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
        res.data.data.forEach((ele, index) => {
          res.data.data[index].used = ele.used === null ? '-1' : ele.used
          res.data.data[index].usedm = this.usedMap[ele.used]
          res.data.data[index].enorm = ele.enor == '1' ? '是' : '否'
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
