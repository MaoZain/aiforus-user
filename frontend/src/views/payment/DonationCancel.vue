<template>
  <div class="payment-result">
    <a-result
      status="warning"
      title="Donation Cancelled"
      sub-title="Your donation was not completed. No charges were made."
    >
      <template #extra>
        <a-button type="primary" @click="goToDashboard">Go to Dashboard</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

function goToDashboard() {
  router.push('/dashboard');
}

function restoreAuth() {
  const prePaymentAuthToken = localStorage.getItem('prePaymentAuthToken');
  if (prePaymentAuthToken) {
    authStore.setToken(prePaymentAuthToken); // 假设有 setToken 方法
    localStorage.removeItem('prePaymentAuthToken');
  }
}

restoreAuth();
</script>

<style scoped>
.payment-result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
</style>
