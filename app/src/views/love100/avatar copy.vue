<template>
  <div>
    <div class="btn-box">
      <el-button @click="addNew" size="mini">新增</el-button>
    </div>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false">
      <div class="avatar-box">
        <el-avatar class="avatar-item" shape="square" :size="100" :fit="fit" :src="avatar1" @click.native="openUpload('avatar1')">+</el-avatar>
        <el-avatar class="avatar-item" shape="square" :size="100" :fit="fit" :src="avatar2" @click.native="openUpload('avatar2')">+</el-avatar>
      </div>
      <div class="input-box">
        <el-input v-model="hotValue"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="danger" v-loading="loading" @click="del" v-if="modifyItem">删 除</el-button>
        <el-button type="primary" v-loading="loading" @click="submit">提 交</el-button>
      </div>
    </el-dialog>
    <my-upload
      field="avatar"
      :modelValue="uploadShow"
      :width="200"
      :height="200"
      :url="uploadUrl"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      @update:modelValue="cropClose"
      img-format="jpg"
    ></my-upload>

    <div class="avatar-list">
      <div class="avatar-row" v-for="(item, i) in avatarList" :key="i" @click="edit(item)">
        <el-avatar class="avatar-item" shape="square" :size="100" :fit="fit" :src="item.avatar1"></el-avatar>
        <el-avatar class="avatar-item" shape="square" :size="100" :fit="fit" :src="item.avatar2"></el-avatar>
      </div>
    </div>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import { URL } from '@/utils/api'
import API from '@/utils/api'
export default {
  name: 'Avatar',
  components: {
    myUpload
  },
  data() {
    return {
      visible: false,
      uploadShow: false,
      uploadUrl: URL.uploadAvatar,
      avatar1: '',
      avatar2: '',
      loading: false,
      pageNo: 1,
      pageSize: 10,
      avatarList: [],
      total: 0,
      modifyItem: null,
      hotValue: 1
    }
  },
  created() {
    this.getAvatarList()
  },
  methods: {
    async getAvatarList() {
      try {
        const res = await API.getAvatarList({ pageNo: this.pageNo, pageSize: this.pageSize })
        this.avatarList = res.data.data
      } catch (e) {
        console.log(e)
      }
    },
    addNew() {
      this.visible = true
      this.modifyItem = null
      this.avatar1 = ''
      this.avatar2 = ''
      this.hotValue = 1
    },
    openUpload(field) {
      this.field = field
      this.uploadShow = true
    },
    cropUploadSuccess(e) {
      if (this.field === 'avatar1') {
        this.avatar1 = 'https://' + e.filePath
      } else {
        this.avatar2 = 'https://' + e.filePath
      }
    },
    cropClose(e) {
      this.uploadShow = false
    },
    async submit() {
      if (this.loading || this.avatar1 === '' || this.avatar2 === '') return
      try {
        this.loading = true
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
    async del() {
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
      this.avatar1 = item.avatar1
      this.avatar2 = item.avatar2
      this.hotValue = item.hot
      this.modifyItem = item
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
    .avatar-item {
      margin-right: 10px;
    }
  }
}
</style>
