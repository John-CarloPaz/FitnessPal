import { createRouter, createWebHistory } from 'vue-router'
import FoodLog from '@/views/FoodLog.vue'
import Register from '@/views/Registration.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        requiresAuth: true, 
      },
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: () => import('../views/Calculator.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/log',
      name: 'food',
      component: FoodLog,
      meta: {
        requiresAuth: true, 
      },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next()
      } else {
        next('/login')
      }
    })
  } else {
    next()
  }
})
export default router
