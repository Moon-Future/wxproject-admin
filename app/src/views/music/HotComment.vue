<template>
  <div>
    <Search @search="search">
      <div class="search-item">
        <el-input placeholder="请输入姓名" v-model="searchConds.name" clearable></el-input>
      </div>
    </Search>
    <div class="update-text">
      上次更新时间：{{ updateInfo.time }}
      上次更新开始：{{ updateInfo.startIndex }}
      上次更新结束：{{ updateInfo.endIndex }}
    </div>
    <div class="update-all">
      <div class="wrap">全部：{{ total }}</div>
      <div class="wrap">开始：<el-input-number v-model="startIndex" :min="1"></el-input-number></div>
      <div class="wrap">结束：<el-input-number v-model="endIndex" :min="1"></el-input-number></div>
      <el-button type="primary" :loading="updating" @click="updateAll">{{ updating ? '正在更新' : '批量更新点赞数' }}</el-button>
      <el-button type="primary" v-if="updating"  @click="updateAll">停止更新</el-button>
    </div>
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
        <el-button size="mini" type="primary" @click="update(data, index)">更新点赞数</el-button>
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
      },
      startIndex: 1,
      endIndex: 2,
      updating: false,
      updateInfo: {}
    }
  },
  created() {
    this.getUpdateHistory()
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
    async update(data, index) {
      let newData = Object.assign({}, data)
      newData.loading = true
      this.tableData.splice(index, 1, newData)
      let res = await API.updateCommentLikedCount({ commentId: data.id, songId: data.songId })
      newData.likedCount = res.data.data
      newData.loading = false
      this.tableData.splice(index, 1, newData)
    },
    async getUpdateHistory() {
      let result = await API.getUpdateHistory({ type: 2 })
      result.data.data.time = formatTime(result.data.data.time, 'yyyy-MM-dd hh:mm:ss')
      this.updateInfo = result.data.data
      this.updating = !!this.updateInfo.doing
    },
    async updateAll() {
      this.updating = true
      let res = await API.updateCommentLikedCount({ startIndex: this.startIndex, endIndex: this.endIndex })
      this.updating = false
    }
  }
}
</script>

<style lang="scss" scoped>
.update-text {
  text-align: left;
  color: #999;
}
.update-all {
  display: flex;
  align-items: center;
  margin: 10px 0;
  .wrap {
    margin-right: 10px;
  }
}
</style>
