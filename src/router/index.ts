import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('@/views/Quiz.vue'),
  },
  {
    path: '/result',
    name: 'result',
    component: () => import('@/views/Result.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router