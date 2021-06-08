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
      <template slot="table-action" slot-scope="{ data }">
        <el-button size="mini" type="primary" @click="update(data)">更新</el-button>
      </template>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'
import Search from '@/components/Search'
import API from '@/utils/api'
import { formatTime } from '@/utils/util'
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
        { field: 'nickname', label: '用户' },
        { field: 'content', label: '评论' },
        { field: 'songName', label: '歌曲' },
        { field: 'likedCount', label: '点赞' },
        { field: 'time', label: '时间' },
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
        let res = await API.getHotComment(params)
        res.data.data.forEach((ele, index) => {
          res.data.data[index].time = formatTime(ele.time, 'yyyy-MM-dd hh:mm')
        })
        this.tableData = res.data.data
        this.total = res.data.count
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
    update() {

    }
  }
}
</script>

<style lang="scss" scoped></style>
