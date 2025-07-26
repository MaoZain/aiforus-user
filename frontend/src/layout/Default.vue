<template>
  <div class="layout-root">
    <div class="layout-main">
      <SidebarMenu class="sidebar" />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarMenu from '@/components/SidebarMenu.vue'
</script>

<style scoped>
.layout-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 64px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  z-index: 10;
}

.layout-main {
  flex: 1;
  display: flex;
  min-height: 0;
}

.sidebar {
  width: 220px;
  background: #f7f9fa;
  border-right: 1px solid #eee;
  min-height: 0;
  overflow-y: auto;
}

.content {
  flex: 1;
  padding: 24px;
  background: #f5f6fa;
  min-height: 0;
  overflow-y: auto;
}
</style>