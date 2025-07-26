<template>
  <div class="header-container">
    <div class="logo">AIforUs</div>
    <nav class="nav-menu">
      <router-link to="/home" class="nav-item" exact>Home</router-link>
      <router-link  v-if="isAuthenticated" :to=" userRole==='admin'? '/dashboard/admin':'/dashboard'" class="nav-item">Dashboard</router-link>
      <!-- <router-link v-if="userRole!=='admin'" to="/orders" class="nav-item">My Orders</router-link> -->
      <router-link to="/tutorials" class="nav-item">Tutorials</router-link>
    </nav>
    <div class="header-actions">
      <span class="username">{{ username }}</span>
      <router-link v-if="!isAuthenticated" to="/login" class="logout-btn">Login</router-link>
      <button v-else @click="logout" class="logout-btn">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const username = computed(() => authStore.username || 'Guest')
const userRole = computed(() => authStore.userRole || 'guest') // 获取用户角色
const isAuthenticated = computed(() => authStore.isAuthenticated) // 使用 computed 绑定响应式状态

const logout = () => {
  authStore.logout() // 调用退出登录逻辑
  router.push('/home') // 跳转到首页
}
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 32px;
  background: #2d323a;
  border-bottom: 1px solid #23262c;
  font-size: 18px;
}

.logo {
  font-weight: bold;
  color: #fff;
  font-size: 22px;
  margin-right: 32px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
}

.nav-item {
  color: #fff;
  opacity: 0.85;
  font-size: 16px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.nav-item.router-link-exact-active,
.nav-item.router-link-active {
  opacity: 1;
  font-weight: bold;
}

.nav-item:hover {
  opacity: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  color: #fff;
  font-size: 16px;
}

.logout-btn {
  color: #4f6ef7;
  cursor: pointer;
  font-size: 15px;
  text-decoration: underline;
  background: none;
  border: none;
}
</style>