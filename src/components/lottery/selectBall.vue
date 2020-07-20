<template>
  <div>
    <div v-if="edit">
      <div class="selectball-container">
        <div class="red-wrapper">
          <div
            class="ball redball"
            :class="{ redon: redSelect.indexOf(item) !== -1 }"
            v-for="(item, index) in redBall"
            :key="index"
            @click="selectRed(item)"
          >
            {{ item }}
          </div>
        </div>
        <div class="line"></div>
        <div class="blue-wrapper">
          <div
            class="ball blueball"
            :class="{ blueon: blueSelect.indexOf(item) !== -1 }"
            v-for="(item, index) in blueBall"
            :key="index"
            @click="selectBlue(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <el-button type="danger" size="mini" @click="randRed">机选红球</el-button>
      <el-button type="success" size="mini" @click="confirm">选好了</el-button>
      <el-button type="primary" size="mini" @click="randBlue">机选篮球</el-button>
    </div>

    <div class="table-wrapper">
      <div class="table-top">
        <el-date-picker
          class="date-picker"
          v-model="date"
          type="date"
          placeholder="选择日期"
          :editable="false"
          :clearable="false"
          @change="changeDate"
        ></el-date-picker>
        <el-button type="primary" size="mini" @click="changeEdit">{{ edit ? '返回' : '新增' }}</el-button>
      </div>
      <div class="recent">
        <div class="descr">
          <p>{{ now }}</p>
          <p>[{{ descr }}]</p>
          <p>最新开奖期号：{{ recentData.code }}</p>
          <p>最新开奖日期：{{ recentData.date }}</p>
        </div>
        <div class="flex-wrapper">
          <div class="ball redball redon" v-for="red in recentData.red" :key="red">{{ red }}</div>
          <div class="ball blueball blueon" v-for="blue in recentData.blue" :key="blue">{{ blue }}</div>
        </div>
      </div>

      <el-table v-if="!edit && type === 1" :data="moneyData" style="width: 100%;margin-bottom: 20px" size="mini" v-loading="refreshLoading">
        <el-table-column prop="code" label="期号" width="100"></el-table-column>
        <el-table-column prop="date" label="开奖日期" width="200"></el-table-column>
        <el-table-column prop="balls" label="中将号码">
          <template slot-scope="scope">
            <div class="flex-wrapper">
              <div class="ball redball redon" v-for="red in scope.row.red" :key="red">{{ red }}</div>
              <div class="ball blueball blueon" v-for="blue in scope.row.blue" :key="blue">{{ blue }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-button size="mini" @click="getMoneyData">刷新</el-button>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" style="width: 100%" size="mini" v-loading="getLoading">
        <el-table-column prop="balls" label="球儿">
          <template slot-scope="scope">
            <div class="flex-wrapper">
              <div
                class="ball redball redon"
                :class="{ ballwin: scope.row.winRed && scope.row.winRed.indexOf(index) !== -1 }"
                v-for="(red, index) in scope.row.red"
                :key="red"
              >
                {{ red }}
              </div>
              <div
                class="ball blueball blueon"
                :class="{ ballwin: scope.row.winBlue && scope.row.winBlue.indexOf(index) !== -1 }"
                v-for="(blue, index) in scope.row.blue"
                :key="blue"
              >
                {{ blue }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="win" label="中奖金额" width="200"></el-table-column>
        <el-table-column prop="price" label="价格" width="100"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" v-if="edit" @click="handleEdit(scope.$index, scope.row)">{{ scope.row.updFlag ? '返回' : '编辑' }}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button class="submit-btn" type="primary" size="mini" @click="submit" v-if="tableData.length !== 0 && edit" :loading="loading">提交</el-button>

    <el-image style="width: 300px;display:flex;margin-top:20px" :src="img" :fit="fit"></el-image>
  </div>
</template>

<script>
import API from '@/utils/api'
import { formatTime } from '@/utils/util'
const dateMap = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六'
}
export default {
  name: 'selectBall',
  props: {
    redNum: {
      type: Number,
      default: 33
    },
    blueNum: {
      type: Number,
      default: 16
    },
    redLen: {
      type: Number,
      default: 6
    },
    blueLen: {
      type: Number,
      default: 2
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      redSelect: [],
      blueSelect: [],
      loading: false,
      date: new Date(),
      tableData: [],
      updIndex: -1,
      edit: false,
      getLoading: false,
      refreshLoading: false,
      moneyData: [{}],
      recentData: {},
      colorBallWin: {
        '6+1': '😀 一等奖 浮动 500万',
        '6+0': '😀 二等奖 浮动 20万',
        '5+1': '😀 三等奖 3000',
        '5+0': '😀 四等奖 200',
        '4+1': '😀 四等奖 200',
        '4+0': '😀 五等奖 10',
        '3+1': '😀 五等奖 10',
        '2+1': '😀 六等奖 5',
        '1+1': '😀 六等奖 5',
        '0+1': '😀 六等奖 5'
      },
      superLottoWin: {
        '5+2': '😀 一等奖 浮动 1000万',
        '5+1': '😀 二等奖 浮动 500万',
        '5+0': '😀 三等奖 10000',
        '4+2': '😀 四等奖 3000',
        '4+1': '😀 五等奖 300',
        '3+2': '😀 六等奖 200',
        '4+0': '😀 七等奖 100',
        '3+1': '😀 八等奖 15',
        '2+2': '😀 八等奖 15',
        '3+0': '😀 九等奖 5',
        '1+2': '😀 九等奖 5',
        '2+1': '😀 九等奖 5',
        '0+2': '😀 九等奖 5'
      },
      now: `${formatTime(new Date(), 'yyyy-MM-dd')} 星期${dateMap[new Date().getDay()]}`
    }
  },
  computed: {
    img() {
      return this.type === 1 ? require('@/assets/colorball.jpg') : require('@/assets/superlotto.jpg')
    },
    descr() {
      return this.type === 1 ? '每周二、四、日 21:15开奖' : '每周一、三、六 20:25开奖'
    },
    redBall() {
      let arr = []
      for (let i = 1; i <= this.redNum; i++) {
        arr.push(i < 10 ? '0' + i : i + '')
      }
      return arr
    },
    blueBall() {
      let arr = []
      for (let i = 1; i <= this.blueNum; i++) {
        arr.push(i < 10 ? '0' + i : i + '')
      }
      return arr
    }
  },
  async created() {
    await this.getRecentData()
    await this.getBalls()
  },
  methods: {
    changeDate(e) {
      this.date = e
      if (!this.edit) {
        this.getBalls()
      }
    },
    changeEdit() {
      if (this.edit) {
        this.edit = false
        this.tableData = []
        this.getBalls()
      } else {
        this.edit = true
        this.redSelect = []
        this.blueSelect = []
        this.tableData = []
        this.date = new Date()
      }
    },
    selectRed(item) {
      if (this.redSelect.indexOf(item) !== -1) {
        this.redSelect.splice(this.redSelect.indexOf(item), 1)
      } else {
        this.redSelect.push(item)
      }
    },
    selectBlue(item) {
      if (this.blueSelect.indexOf(item) !== -1) {
        this.blueSelect.splice(this.blueSelect.indexOf(item), 1)
      } else {
        this.blueSelect.push(item)
      }
    },
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    randRed() {
      let arr = [].concat(this.redBall)
      this.redSelect = []
      for (let i = 0; i < this.redLen; i++) {
        let index = this.random(0, arr.length - 1)
        this.redSelect.push(arr[index])
        arr.splice(index, 1)
      }
    },
    randBlue() {
      let arr = [].concat(this.blueBall)
      this.blueSelect = []
      for (let i = 0; i < this.blueLen; i++) {
        let index = this.random(0, arr.length - 1)
        this.blueSelect.push(arr[index])
        arr.splice(index, 1)
      }
    },
    confirm() {
      if (this.redSelect.length < this.redLen || this.blueSelect.length < this.blueLen) {
        this.$message({
          message: `红【${this.redLen}】，蓝【${this.blueLen}】`,
          duration: 1000
        })
        return
      }
      this.redSelect.sort((a, b) => {
        return Number(a) - Number(b)
      })
      this.blueSelect.sort((a, b) => {
        return Number(a) - Number(b)
      })
      if (this.updIndex !== -1) {
        this.tableData.splice(this.updIndex, 1, {
          red: [].concat(this.redSelect),
          blue: [].concat(this.blueSelect)
        })
        this.updIndex = -1
      } else {
        this.tableData.push({
          red: [].concat(this.redSelect),
          blue: [].concat(this.blueSelect)
        })
      }
      this.redSelect = []
      this.blueSelect = []
    },
    handleEdit(index, row) {
      if (this.updIndex !== -1 && this.updIndex !== index) {
        this.$message({
          message: `正在编辑其他`,
          duration: 1000
        })
        return
      }
      if (this.updIndex !== -1) {
        row.updFlag = false
        this.updIndex = -1
        this.redSelect = []
        this.blueSelect = []
        this.tableData.splice(index, 1, row)
      } else {
        row.updFlag = true
        this.updIndex = index
        this.redSelect = [].concat(row.red)
        this.blueSelect = [].concat(row.blue)
        this.tableData.splice(index, 1, row)
      }
    },
    handleDelete(index, row) {
      if (this.edit) {
        this.tableData.splice(index, 1)
      } else {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await API.delLottery({ id: row.id })
            this.tableData.splice(index, 1)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    async submit() {
      if (this.tableData.length === 0) {
        return
      }
      try {
        this.loading = true
        await API.addLottery({ data: this.tableData, date: new Date(this.date).getTime(), type: this.type })
        this.loading = false
        this.changeEdit()
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
    async getBalls() {
      try {
        this.getLoading = true
        await this.getMoneyData()
        let resultData = this.type === 1 ? this.moneyData[0] : this.recentData
        if (this.type === 2 && formatTime(new Date(resultData.date.split(' ')[0]), 'yyyy-MM-dd') !== formatTime(this.date, 'yyyy-MM-dd')) {
          resultData = {}
        }
        let res = await API.getLottery({ date: new Date(this.date).getTime(), type: this.type })
        res.data.data.forEach((ele, index) => {
          let red = ele.red.split(',')
          let blue = ele.blue.split(',')
          let resRed = resultData.red || []
          let resBlue = resultData.blue || []
          let winRed = [],
            winBlue = []
          for (let i = 0; i < resRed.length; i++) {
            if (red.indexOf(resRed[i]) !== -1) {
              winRed.push(red.indexOf(resRed[i]))
            }
          }
          for (let i = 0; i < resBlue.length; i++) {
            if (blue.indexOf(resBlue[i]) !== -1) {
              winBlue.push(blue.indexOf(resBlue[i]))
            }
          }
          res.data.data[index].red = red
          res.data.data[index].blue = blue
          res.data.data[index].winRed = winRed
          res.data.data[index].winBlue = winBlue
          let key = `${winRed.length}+${winBlue.length}`
          let noWin = resRed.length === 0 ? '尚未开奖' : '🙂 再接再励'
          res.data.data[index].win = this.type === 1 ? this.colorBallWin[key] || noWin : this.superLottoWin[key] || noWin
        })
        this.tableData = res.data.data
        this.getLoading = false
      } catch (error) {
        this.getLoading = false
        console.log(error)
      }
    },
    async getMoneyData() {
      if (this.edit) {
        return
      }
      try {
        this.refreshLoading = true
        if (this.type === 1) {
          let res = await API.getLotteryData({
            date: this.date,
            type: this.type
          })
          let data = res.data.data.result || []
          if (data.length === 0) {
            this.moneyData = [{ date: '尚未开奖' }]
            this.refreshLoading = false
            return
          }
          this.moneyData = data.map(ele => {
            return {
              red: ele.red.split(','),
              blue: ele.blue.split(','),
              code: ele.code,
              date: ele.date
            }
          })
        }
        this.refreshLoading = false
      } catch (error) {
        this.refreshLoading = false
        console.log(error)
      }
    },
    async getRecentData() {
      try {
        let res = await API.getLotteryRecent({
          date: this.date,
          type: this.type
        })
        let data = res.data.data
        data.red = data.red.split(',')
        data.blue = data.blue.split(',')
        this.recentData = data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selectball-container {
  display: flex;
}
.red-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.blue-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.ball {
  width: 40px;
  height: 40px;
  border: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  background: #ffffff;
  font-size: 16px;
}
.line {
  width: 5px;
  background: #eaeaea;
}
.redon {
  color: #ffffff;
  background: #ed1c24;
}
.blueon {
  color: #ffffff;
  background: #0588ce;
}
.redon.ballwin {
  background: linear-gradient(#ed1c24, #67c23a);
}
.blueon.ballwin {
  background: linear-gradient(#0588ce, #67c23a);
}
.flex-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.selected-wrapper {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
.del-icon {
  margin-left: 20px;
  cursor: pointer;
}

.table-wrapper {
  text-align: left;
}
.date-picker {
  margin-bottom: 20px;
}
.submit-btn {
  margin: 20px auto;
}
.table-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recent {
  margin-bottom: 20px;
  font-size: 14px;
  color: #ab9399;
}
.descr {
  display: flex;
  flex-wrap: wrap;
  p {
    margin-right: 10px;
    padding: 5px 0;
  }
}
</style>
