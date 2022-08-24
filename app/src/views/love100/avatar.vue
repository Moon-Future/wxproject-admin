<template>
  <div>
    <div class="btn-box">
      <el-button @click="addNew" size="mini">新增</el-button>
    </div>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" @close="dialogClose">
      <div class="avatar-box">
        <el-upload
          ref="upload"
          :action="uploadUrl"
          :auto-upload="false"
          :file-list="fileList"
          limit="2"
          multiple
          :http-request="handleUploadForm"
          :on-success="successUpload"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div class="input-box">
        <el-input v-model="hotValue"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="danger" v-loading="loading" @click="handleDelete" v-if="modifyItem">删 除</el-button>
        <el-button type="primary" v-loading="loading" @click="uploadImage">提 交</el-button>
      </div>
    </el-dialog>
    <div class="avatar-list">
      <div class="avatar-row" v-for="(item, i) in avatarList" :key="i" @click="edit(item)">
        <div>
          <el-avatar class="avatar-item" shape="square" :size="100" :fit="fit" :src="item.avatar1"></el-avatar>
          <div class="avatar-name">{{item.fileName1}}</div>
        </div>
        <div>
          <el-avatar class="avatar-item" shape="square" :size="100" :fit="fit" :src="item.avatar2"></el-avatar>
          <div class="avatar-name">{{item.fileName2}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { URL } from '@/utils/api'
import API from '@/utils/api'
export default {
  name: 'Avatar',
  data() {
    return {
      visible: false,
      uploadUrl: URL.uploadAvatar,
      fileList: [],
      loading: false,
      pageNo: 1,
      pageSize: 10,
      avatarList: [],
      total: 0,
      modifyItem: null,
      hotValue: 1,
      index: 1
    }
  },
  created() {
    this.getAvatarList()
  },
  methods: {
    async getAvatarList() {
      try {
        const res = await API.getAvatarList({ pageNo: this.pageNo, pageSize: this.pageSize })
        res.data.data.forEach(item => {
          item.fileName1 = item.avatar1.split('/').pop()
          item.fileName2 = item.avatar2.split('/').pop()
        })
        this.avatarList = res.data.data
      } catch (e) {
        console.log(e)
      }
    },
    addNew() {
      this.visible = true
      this.modifyItem = null
      this.hotValue = 1
      this.avatar1 = ''
      this.avatar2 = ''
      this.index = 1
    },
    dialogClose() {
      this.fileList = []
      this.$refs.upload.clearFiles()
    },
    handleUploadForm(param) {
      console.log('handleUploadForm', param)
      let formData = new FormData()
      // 在formData中加入我们需要的参数
      formData.append('file', param.file)
    	formData.append('avatarField', this.index === 1 ? 'avatar1' : 'avatar2')
      this.index += 1
      // 向后端发送数据
      this.$http.post(this.uploadUrl, formData).then(async (res) => {
        const { filePath, avatarField } = res.data
        if (avatarField === 'avatar1') {
          this.avatar1 = 'https://' + filePath
        } else {
          this.avatar2 = 'https://' + filePath
        }
        if (this.avatar1 !== '' && this.avatar2 !== '') {
          await this.submit()
        }
      })
    },
    async uploadImage() {
      if (this.$refs.upload.uploadFiles.length < 2) {
        this.$message({
          message: '请上传两张图片',
          duration: 1000,
          type: 'info'
        })
        return
      }
      let needUpload = false
      this.$refs.upload.uploadFiles.forEach((item, index) => {
        if (item.status === 'ready') {
          needUpload = true
        } else {
          if (index === 0) {
            this.avatar1 = item.url
            this.index = 2
          } else if (index === 1) {
            this.avatar2 = item.url
            this.index = 1
          }
        }
      })
      this.loading = true
      if (needUpload) {
        this.$refs.upload.submit()
      } else {
        await this.submit()
      }
    },
    async submit() {
      try {
        if (this.modifyItem) {
          await API.modifyAvatar({ id: this.modifyItem.id, avatar1: this.avatar1, avatar2: this.avatar2, hot: this.hotValue, operate: 1 })
        } else {
          await API.saveAvatar({ avatar1: this.avatar1, avatar2: this.avatar2, hot: this.hotValue })
        }
        this.loading = false
        this.visible = false
        this.getAvatarList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async handleDelete() {
      try {
        if (this.loading) return
        this.loading = true
        await API.modifyAvatar({ id: this.modifyItem.id, operate: 3 })
        this.loading = false
        this.visible = false
        this.getAvatarList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    edit(item) {
      this.visible = true
      this.hotValue = item.hot
      this.modifyItem = item
      this.fileList = [{ name: '', url: item.avatar1 }, { name: '', url: item.avatar2 }]
      this.avatar1 = ''
      this.avatar2 = ''
      this.index = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
  display: flex;
}
.avatar-box {
  display: flex;
  justify-content: space-around;
  .avatar-item {
    cursor: pointer;
    font-size: 30px;
  }
}
.input-box {
  margin-top: 10px;
  width: 100%;
}
.avatar-list {
  display: flex;
  flex-wrap: wrap;
  .avatar-row {
    display: flex;
    margin: 10px 20px 10px 0;
    cursor: pointer;
    .avatar-item {
      margin-right: 10px;
    }
    .avatar-name {
      font-size: 12px;
    }
  }
}
</style>
