<template>
  <div>
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
    <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
    <div class="selected-wrapper">
      <div class="flex-wrapper" v-for="(item, index) in selected" :key="index">
        <div class="flex-wrapper">
          <div class="ball redball redon" v-for="red in item.red" :key="red">{{ red }}</div>
          <div class="ball blueball blueon" v-for="blue in item.blue" :key="blue">{{ blue }}</div>
        </div>
        <div class="del-icon" @click="del(index)"><i class="el-icon-delete"></i></div>
      </div>
    </div>
    <el-button type="primary" size="mini" @click="submit" v-show="selected.length !== 0" :loading="loading">提交</el-button>
  </div>
</template>

<script>
import API from '@/utils/api'
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
      selected: [],
      loading: false,
      date: new Date()
    }
  },
  computed: {
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
  methods: {
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
      this.selected.push({
        red: [].concat(this.redSelect),
        blue: [].concat(this.blueSelect)
      })
    },
    del(index) {
      this.selected.splice(index, 1)
    },
    async submit() {
      if (this.selected.length === 0) {
        return
      }
      try {
        this.loading = true
        await API.addLottery({ data: this.selected, date: new Date(this.date).getTime(), type: this.type })
        this.loading = false
      } catch (error) {
        this.loading = false
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
.flex-wrapper {
  display: flex;
  align-items: center;
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
</style>
