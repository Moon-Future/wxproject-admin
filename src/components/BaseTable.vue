<template>
  <div>
    <div class="table-wrapper" v-if="!edit">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <template v-for="(item, index) in fields">
          <el-table-column v-if="!item.hideField" :prop="item.field" :label="item.label" :width="item.width || 'initial'" :key="index">
            <template slot-scope="scope">
              <img class="article-img" :src="scope.row[item.showField || item.field]" alt="" v-if="item.tableNodeType === 'img'" />
              <div v-html="scope.row[item.showField || item.field]" v-else></div>
            </template>
          </el-table-column>
        </template>
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

    <div class="form-wrapper" v-else :style="{ width: width }">
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
          <template v-if="item.nodeType === 'richtext'">
            <div class="rich-editor">
              <quill-editor
                ref="myQuillEditor"
                class="ql-editor"
                v-model="formData[item.field]"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)"
              />
            </div>
          </template>
          <template v-if="item.nodeType === 'date'">
            <el-date-picker v-model="formData[item.field]" type="date" placeholder="选择日期"></el-date-picker>
          </template>
        </el-form-item>
      </el-form>
      <div class="form-btngrp" :style="{ width: btngrpWidth }">
        <el-button type="primary" class="form-btn" @click="submit" :loading="submitng">提交</el-button>
        <el-button type="danger" class="form-btn" @click="cancel">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import API from '@/utils/api'
import { deepClone } from '@/utils/util'

export default {
  name: 'BaseTable',
  components: {
    quillEditor
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    delUrl: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '500px'
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
    },
    editEmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      edit: false,
      formData: {},
      submitng: false,
      row: null,
      editorOption: {
        // Some Quill options...
        placeholder: '',
        readOnly: true,
        formats: {},
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block', 'link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            ['clean'],
            ['image']
          ]
        }
      }
    }
  },
  computed: {
    btngrpWidth() {
      return this.width.indexOf('px') === -1 ? '100%' : this.width.replace('px', '') - 80 + 'px'
    }
  },
  created() {
    this.iniFormData()
  },
  methods: {
    // 富文本
    onEditorBlur(quill) {},
    onEditorFocus(quill) {},
    onEditorReady(quill) {},
    onEditorChange({ quill, html, text }) {},
    iniFormData() {
      let obj = {}
      this.fields.forEach(ele => {
        obj[ele.field] = ele.default || ''
      })
      this.formData = obj
    },
    handleEdit(index, row, scope) {
      let self = this
      if (this.editEmit) {
        this.$emit('handleEdit', {
          index: index,
          callback: res => {
            this.row = row
            for (let key in res) {
              this.row[key] = res[key]
            }
            for (let key in this.formData) {
              if (typeof row[key] === 'string' && row[key].indexOf('</br>') !== -1) {
                this.$set(this.formData, key, row[key].replace(new RegExp('</br>', 'g'), '\n'))
              } else {
                this.$set(this.formData, key, row[key])
              }
            }
            this.edit = true
          }
        })
      } else {
        for (let key in this.formData) {
          if (typeof row[key] === 'string' && row[key].indexOf('</br>') !== -1) {
            this.$set(this.formData, key, row[key].replace(new RegExp('</br>', 'g'), '\n'))
          } else {
            this.$set(this.formData, key, row[key])
          }
        }
        this.row = row
        this.edit = true
      }
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
.article-img {
  width: 65px;
}
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
.rich-editor {
  background: #fff;
}
/deep/ .ql-editor {
  min-height: 500px;
}
/deep/ .ql-toolbar {
  text-align: left;
}
/deep/ .ql-snow .ql-picker {
  line-height: 24px;
}
</style>
