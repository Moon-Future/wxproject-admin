<template>
  <div>
    <Search @search="search">
      <div class="search-item">
        <el-input placeholder="请输入标题" v-model="searchConds.title" clearable></el-input>
      </div>
      <div class="search-item">
        <el-select v-model="searchConds.tag" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in tags" :label="item.name" :value="item.id" :key="index"></el-option>
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
      editEmit
      width="80%"
      @changeSize="changeSize"
      @changeNo="changeNo"
      @refreshData="refreshData"
      @handleEdit="handleEdit"
    >
      <template slot="table-action" slot-scope="{ data }">
        <el-button size="mini" type="primary" @click="preview(data)">预览</el-button>
      </template>
    </base-table>

    <el-dialog :title="previewData.title" :visible.sync="previewData.visible" fullscreen>
      <div class="preview-content" v-html="previewData.content"></div>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'
import Search from '@/components/Search'
import API from '@/utils/api'
import { tableMixin } from '@/utils/mixins'
import { formatTime } from '@/utils/util'

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
      url: 'addArticle',
      delUrl: 'delArticle',
      fields: [
        { field: 'title', label: '标题', required: true, disabled: true },
        { field: 'author', label: '作者' },
        { field: 'summary', label: '概要' },
        { field: 'tag', label: '标签', showField: 'tagm', nodeType: 'select', options: [] },
        { field: 'img', label: '封面', tableNodeType: 'img' },
        { field: 'date', label: '日期', showField: 'dateFormat', nodeType: 'date' },
        { field: 'content', label: '文章', required: true, nodeType: 'richtext', hideField: true, handleEdit: true }
      ],
      tableData: [],
      searchConds: {
        title: '',
        tag: ''
      },
      tags: [],
      tagMap: {},
      tagInit: false,
      previewData: {
        visible: false,
        title: '',
        content: ''
      }
    }
  },
  methods: {
    async preview(row) {
      try {
        this.loading = true
        let res = await API.getArticleFile({ title: row.title })
        this.previewData = {
          visible: true,
          title: row.title,
          content: res.data.article
        }
        console.log(res)
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async getTag() {
      try {
        let res = await API.getTag()
        this.tags = res.data.data || []
        let options = this.tags.map(ele => {
          this.tagMap[ele.id] = ele.id === '-1' ? '' : ele.name
          return {
            value: ele.id,
            label: ele.name
          }
        })
        this.$set(this.fields, 3, { field: 'tag', label: '标签', showField: 'tagm', nodeType: 'select', options: options })
      } catch (error) {
        console.log(error)
      }
    },
    async getData(params = {}) {
      try {
        if (!this.tagInit) {
          await this.getTag()
          this.tagInit = true
        }
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        this.loading = true
        let res = await API.getArticle(params)
        res.data.data.forEach((ele, index) => {
          res.data.data[index].dateFormat = formatTime(ele.date, 'yyyy-MM-dd')
          res.data.data[index].tagm = this.tagMap[ele.tag]
        })
        this.tableData = res.data.data
        this.total = res.data.count
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
    async handleEdit({ index, callback }) {
      try {
        this.loading = true
        let row = this.tableData[index]
        let res = await API.getArticleFile({ title: row.title })
        this.loading = false
        callback({ content: res.data.article })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-content {
  text-align: left;
  ::v-deep p {
    padding: 10px 0;
  }
}
</style>
