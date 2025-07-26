<template>
  <div class="payment-result">
    <a-result
      status="error"
      title="Payment Cancelled"
      sub-title="Your payment was not completed. Please try again or contact support if you need assistance."
    >
      <template #extra>
        <a-button type="primary" @click="retryPayment">Retry Payment</a-button>
        <a-button @click="goToDashboard">Go to Dashboard</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

function retryPayment() {
  router.push('/license');
}

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
