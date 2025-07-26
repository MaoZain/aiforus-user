import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import Login from '@/views/login/App.vue'
import Register from '@/views/register/App.vue'
import DefaultLayout from '@/layout/Default.vue'
import PaymentSuccess from '@/views/payment/PaymentSuccess.vue';
import PaymentCancel from '@/views/payment/PaymentCancel.vue';

const routes = [
  {
    path:'/404',
    component: () => import('@/views/404.vue'),
    meta: { guest: true }
  },
  {
    path:'/home',
    component: () => import('@/views/home/App.vue'),
    meta: { guest: true }
  },
  {
    path:'/orders',
    component: () => import('@/views/orders/App.vue'),
    meta: { guest: true }
  },
  {
    path:'/tutorials',
    component: () => import('@/views/tutorials/App.vue'),
    meta: { guest: true }
  },
  {
    path: '/login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    component: Register,
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    component: DefaultLayout,
    meta: { role: 'user' },
    children: [
      { path: '', component: () => import('@/views/profile/App.vue') },
      { path: 'license', component: () => import('@/views/license/App.vue') },
      { path: 'coupon', component: () => import('@/views/coupon/App.vue') },
      { path: 'download', component: () => import('@/views/download/App.vue') },
    ]
  },
  // admin
  {
    path: '/dashboard/admin',
    component: DefaultLayout,
    meta: { role: 'admin' },
    children: [
      { path: '', component: () => import('@/views/userManagement/App.vue') },
      { path: 'download', component: () => import('@/views/download/App.vue') },
    ]
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: PaymentSuccess,
  },
  {
    path: '/payment-cancel',
    name: 'PaymentCancel',
    component: PaymentCancel,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：控制访问权限
router.beforeEach((to, from, next) => {
  const store = useAuthStore()
  console.log(store);

  // if ( !store.authToken ) {
  //   debugger
  //   return next('/home')
  // }

  if (to.meta.role && store.userRole !== to.meta.role) {
    return next('/404') // 或跳转 403 页面
  }

  // if (to.meta.guest && store.authToken) {
  //   return next('/') // 登录用户不能访问登录/注册页
  // }

  next()
})

export default router
