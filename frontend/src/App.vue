<template>
  <Header class="header" />
  <router-view />
</template>
<script setup>
import Header from '@/components/Header.vue'
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useAuthStore } from "@/store/auth";
import { postAction } from "@/services/api";
import {useLicenseStore} from "@/store/license";

const licenseStore = useLicenseStore();

// 绑定路由与状态
const router = useRouter();
const authStore = useAuthStore();
// 自动登录逻辑 SSO
const autoLogin = async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      // 验证 token 的有效性
      const response = await postAction("/auth/validate-token", { token });

      if (response.success) {
        // message.success("SSO Login successful! Redirecting to dashboard...");
        const {token, role, username, email} = response.data;
        authStore.login(response.data);
        licenseStore.getLicense(response.data.email);
        if (role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error("Invalid token");
      }
    } catch (err) {
      console.log("SSO Login failed", err);
      localStorage.removeItem("authToken"); // 清除无效的 token
    }
  }
};

// 页面加载时检查 SSO
autoLogin();
</script>
<style scoped>
.header { 
  height: 64px;
  box-shadow: 0 2px 8px #f0f1f2;
  z-index: 10;
}
</style>
