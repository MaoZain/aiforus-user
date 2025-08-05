<template>
  <a-menu mode="inline" class="sidebar-menu">
    <a-menu-item v-if="role === 'user'" key="profile">
      <template #icon><user-outlined style="font-size: 16px;"/></template>
      <router-link to="/dashboard">Profile</router-link>
    </a-menu-item>
    <a-menu-item v-if="role === 'user'" key="license">
      <template #icon><safety-certificate-outlined style="font-size: 16px;"/></template>
      <router-link to="/dashboard/license">License</router-link>
    </a-menu-item>
    <!-- <a-menu-item v-if="role === 'user'" key="coupon">
      <template #icon><gift-outlined style="font-size: 16px;"/></template>
      <router-link to="/dashboard/coupon">Coupon</router-link>
    </a-menu-item> -->

    <a-menu-item v-if="role === 'admin'" key="management">
      <template #icon><setting-outlined style="font-size: 16px;"/></template>
      <router-link to="/dashboard/admin">Management</router-link>
    </a-menu-item>
    <a-menu-item v-if="role === 'user'" key="download">
      <template #icon><download-outlined style="font-size: 16px;"/></template>
      <router-link to="/dashboard/download">Download</router-link>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { 
  UserOutlined, 
  SafetyCertificateOutlined, 
  GiftOutlined, 
  SettingOutlined, 
  DownloadOutlined 
} from '@ant-design/icons-vue';

const store = useAuthStore();
const role = store.userRole;
</script>

<style scoped>
.sidebar-menu {
  border-right: none;
}

:deep(.ant-menu) {
  font-size: 16px;
  background-color: #f5f7fa;
}

:deep(.ant-menu-item) {
  font-size: 16px;
  height: 50px;
  line-height: 50px;
  margin-top: 8px;
  border-radius: 6px;
  transition: all 0.3s;
}

:deep(.ant-menu-item-selected) {
  background-color: #e6f7ff;
}

:deep(.ant-menu-item:hover) {
  background-color: #e6f7ff;
}

:deep(.ant-menu-item a) {
  display: block;
  width: 100%;
  color: inherit;
  text-decoration: none;
}

:deep(.anticon) {
  font-size: 18px;
  margin-right: 4px;
}
</style>
