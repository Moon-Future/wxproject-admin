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
      requireAuth: false
    },
    component: Home,
    children: [
      {
        path: '/proname/chinese',
        name: 'nameChinese',
        component: () => import('@/views/ProName/Chinese.vue')
      },
      {
        path: '/proname/word',
        name: 'nameWord',
        component: () => import('@/views/ProName/Word.vue')
      },
      {
        path: '/proname/poetry',
        name: 'namePoetry',
        component: () => import('@/views/ProName/Poetry.vue')
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
  mode: 'history',
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
