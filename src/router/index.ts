import * as vueRouter from 'vue-router'

const router = vueRouter.createRouter({
  history: vueRouter.createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('@/views/Home/index.vue') },
    { path: '/chat', component: () => import('@/views/Chat/index.vue') },
    {
      path: '/403',
      component: () => import('@/views/Error/403.vue'),
    },
    {
      path: '/:routerMatch',
      component: () => import('@/views/Error/404.vue'),
    },
  ],
})

export default router
