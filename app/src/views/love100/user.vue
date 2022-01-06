<template>
  <div class="love100-user">
    <el-table :data="showData" style="width: 100%" v-loading="loading">
      <el-table-column label="头像">
        <template slot-scope="scope">
          <div class="column-item">
            <img class="avatar" :src="scope.row.avatarUrl" alt="" />
            <img class="avatar avatar-lover" :src="scope.row.loverData.avatarUrl" alt="" v-if="scope.row.loverData" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          <div class="column-item">
            <span>{{ scope.row.nickName }}</span>
            <span v-if="scope.row.loverData">{{ scope.row.loverData.nickName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="地区">
        <template slot-scope="scope">
          <div class="column-item">
            <span>{{ scope.row.country }}.{{ scope.row.province }}.{{ scope.row.city }}</span>
            <span v-if="scope.row.loverData">{{ scope.row.loverData.country }}.{{ scope.row.loverData.province }}.{{ scope.row.loverData.city }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <div class="column-item">
            <span>{{ scope.row.gender == 0 ? '男' : '女' }}</span>
            <span v-if="scope.row.loverData">{{ scope.row.loverData.gender == 0 ? '男' : '女' }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import API from '@/utils/api'
export default {
  name: 'colorBall',
  components: {
    
  },
  data() {
    return {
      showData: [],
      loading: false,
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      try {
        this.loading = true
        const res = await API.getUserList()
        const data = res.data.data
        const coupleData = []
        const obj = {}
        data.forEach(ele => {
          if (ele.common) {
            if (obj[ele.common]) {
              obj[ele.common].loverData = ele
            } else {
              obj[ele.common] = ele
            }
          } else {
            obj[ele.id] = ele
          }
        })
        for (const key in obj) {
          coupleData.push(obj[key])
        }
        console.log('coupleData', coupleData)
        this.tableData = coupleData
        this.total = this.tableData.length
        this.showData = this.tableData.slice(0, this.pageSize)
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    handleCurrentChange(val) {
      console.log(val)
      this.showData = this.tableData.slice((val - 1)*this.pageSize, this.pageSize * val)
    }
  }
}
</script>

<style lang="scss" scoped>
.love100-user {
  .avatar {
    width: 70px;
    &.avatar-lover {
      margin-top: 10px;
    }
  }
}
.column-item {
  display: flex;
  flex-direction: column;
}
</style>
