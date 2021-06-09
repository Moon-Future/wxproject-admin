import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import API from '@/utils/api'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      requireAuth: true
    },
    component: Home,
    children: [
      {
        path: '/proname/chinese',
        name: 'nameChinese',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/proName/Chinese.vue')
      },
      {
        path: '/proname/word',
        name: 'nameWord',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/proName/Word.vue')
      },
      {
        path: '/proname/poetry',
        name: 'namePoetry',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/proName/Poetry.vue')
      },
      {
        path: '/proname/article',
        name: 'nameArticle',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/proName/Article.vue')
      },
      {
        path: '/lottery/colorball',
        name: 'colorBall',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/lottery/colorBall.vue')
      },
      {
        path: '/lottery/superlotto',
        name: 'superLotto',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/lottery/superLotto.vue')
      },
      {
        path: '/music/artist',
        name: 'Artist',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/music/Artist.vue')
      },
      {
        path: '/music/comment',
        name: 'Comment',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/music/Comment.vue')
      },
      {
        path: '/music/hotcomment',
        name: 'HotComment',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/music/HotComment.vue')
      },
      {
        path: '/music/song',
        name: 'Song',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/music/Song.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      requireAuth: false
    },
    component: Login
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition || (to.matched[0] && from.matched[0] && to.matched[0].path === from.matched[0].path)) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuth) {
    let token = localStorage.getItem('token')
    if (!token) {
      next({ path: '/login' })
    } else {
      try {
        await API.checkLogin()
        to.name === 'Login' ? next({ path: '/' }) : next()
      } catch (error) {
        next({ path: '/login' })
        console.log('not login')
      }
    }
  } else {
    next()
  }
})

export default router
