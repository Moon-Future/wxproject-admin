<template>
  <div class="aside-container">
    <el-menu :default-active="onRoutes" background-color="#324157" text-color="#fff" unique-opened router>
      <template v-for="item in navList">
        <template v-if="item.subs">
          <el-submenu :key="item.index" :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              {{ item.title }}
            </template>
            <el-menu-item v-for="(subItem, i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}</el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :key="item.index" :index="item.index">
            <i :class="item.icon"></i>
            {{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Aside',
  data() {
    return {
      navList: [
        {
          // icon: 'el-icon-menu',
          index: '1',
          title: '取名通',
          subs: [
            {
              index: '/proname/chinese',
              title: '汉字'
            },
            {
              index: '/proname/word',
              title: '词组'
            },
            {
              index: '/proname/poetry',
              title: '古诗'
            },
            {
              index: '/proname/article',
              title: '文章'
            }
          ]
        },
        {
          // icon: 'el-icon-menu',
          index: '2',
          title: '彩票',
          subs: [
            {
              index: '/lottery/colorball',
              title: '双色球'
            },
            {
              index: '/lottery/superlotto',
              title: '超级大乐透'
            }
          ]
        },
        {
          // icon: 'el-icon-menu',
          index: '3',
          title: '网易云',
          subs: [
            {
              index: '/music/artist',
              title: '歌手'
            },
            {
              index: '/music/song',
              title: '歌曲'
            },
            {
              index: '/music/comment',
              title: '评论'
            },
            {
              index: '/music/hotcomment',
              title: '热门评论'
            }
          ]
        },
        {
          index: '4',
          title: '美头秀秀',
          subs: [
            {
              index: '/avatar/tab',
              title: '标签'
            },
            {
              index: '/avatar/mask',
              title: '元素'
            }
          ]
        },
        {
          index: '/login',
          title: '退出'
        }
      ]
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.aside-container {
  height: 100%;
}
.el-menu {
  border-right: solid 1px #324157;
  height: 100%;
}
</style>
