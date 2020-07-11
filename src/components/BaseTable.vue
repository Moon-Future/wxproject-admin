<template>
  <div>
    <div class="table-wrapper" v-if="!edit">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column v-for="(item, index) in fields" :prop="item.field" :label="item.label" :width="item.width || 'initial'" :key="index">
          <template slot-scope="scope">
            <div v-html="scope.row[item.showField || item.field]"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="page-wrapper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <div class="table-btngrp">
        <el-button type="primary" size="mini" @click="edit = !edit">新增</el-button>
      </div>
    </div>

    <div class="form-wrapper" v-else>
      <el-form ref="form" :model="formData" label-width="80px" label-position="left">
        <el-form-item v-for="(item, index) in fields" :class="{ required: item.required }" :prop="item.field" :label="item.label" :key="index">
          <template v-if="!item.nodeType || item.nodeType === 'input'">
            <el-input v-model="formData[item.field]" :disabled="item.disabled && row"></el-input>
          </template>
          <template v-if="item.nodeType === 'textarea'">
            <el-input v-model="formData[item.field]" type="textarea" :rows="item.rows || 8"></el-input>
          </template>
          <template v-if="item.nodeType === 'number'">
            <el-input-number v-model="formData[item.field]" :min="0"></el-input-number>
          </template>
          <template v-if="item.nodeType === 'select'">
            <el-select v-model="formData[item.field]" placeholder="请选择">
              <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div class="form-btngrp">
        <el-button type="primary" class="form-btn" @click="submit" :loading="submitng">提交</el-button>
        <el-button type="danger" class="form-btn" @click="cancel">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/utils/api'
import { deepClone } from '@/utils/util'

export default {
  name: 'BaseTable',
  props: {
    url: {
      type: String,
      default: ''
    },
    delUrl: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    fields: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    pageNo: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      edit: false,
      formData: {},
      submitng: false,
      row: null
    }
  },
  created() {
    this.iniFormData()
  },
  methods: {
    iniFormData() {
      let obj = {}
      this.fields.forEach(ele => {
        obj[ele.field] = ele.default || ''
      })
      this.formData = obj
    },
    handleEdit(index, row) {
      this.row = row
      for (let key in this.formData) {
        if (typeof row[key] === 'string' && row[key].indexOf('</br>') !== -1) {
          this.$set(this.formData, key, row[key].replace(new RegExp('</br>', 'g'), '\n'))
        } else {
          this.$set(this.formData, key, row[key])
        }
      }
      this.edit = true
    },
    handleDelete(index, row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await API[this.delUrl]({ id: row.id })
          this.$emit('refreshData')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSizeChange(val) {
      this.$emit('changeSize', val)
    },
    handleCurrentChange(val) {
      this.$emit('changeNo', val)
    },
    async submit() {
      if (this.submitng) return
      for (let i = 0, len = this.fields.length; i < len; i++) {
        if (this.fields[i].required && this.formData[this.fields[i].field] === '') {
          this.$message({
            message: '请完善数据',
            duration: 1000,
            type: 'warning'
          })
          return
        }
      }
      try {
        let formData = deepClone(this.formData)
        let updFlag = false
        for (let key in formData) {
          if (typeof formData[key] === 'string') {
            formData[key] = formData[key].trim()
          }
        }
        if (this.row) {
          for (let key in formData) {
            if (this.row[key] !== undefined && this.row[key] != formData[key]) {
              updFlag = true
            }
          }
          if (!updFlag) {
            this.cancel()
            return
          }
          formData.id = this.row.id
        }
        this.submitng = true
        await API[this.url](formData)
        this.submitng = false
        this.$refs.form.resetFields()
        this.iniFormData()
        this.$emit('refreshData')
        if (this.row) {
          this.row = null
          this.edit = false
        }
      } catch (error) {
        this.submitng = false
        console.log(error)
      }
    },
    cancel() {
      this.edit = false
      this.row = null
      this.iniFormData()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-btngrp {
  text-align: right;
  margin-top: 10px;
}
.form-wrapper {
  width: 500px;
  margin: auto;
  position: relative;
  text-align: left;
}
.form-btngrp {
  width: 420px;
  position: absolute;
  right: 0;
}
.form-btn {
  width: 100%;
  margin: 10px 0;
}
/deep/ .required .el-form-item__label:after {
  content: ' *';
  color: red;
}
.page-wrapper {
  margin-top: 10px;
}
</style>
