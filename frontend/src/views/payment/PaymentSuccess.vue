<template>
  <div class="payment-result">
    <a-result
      v-if="!loading"
      :status="paymentStatus.status"
      :title="paymentStatus.title"
      :sub-title="paymentStatus.subTitle"
    >
      <template #extra>
        <a-button type="primary" @click="goToDashboard">Go to Dashboard</a-button>
      </template>
    </a-result>
    <div v-else class="loading-container">
      <a-spin tip="Verifying payment status..."></a-spin>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { useLicenseStore } from '@/store/license';
import { postAction } from '@/services/api';
import { message } from 'ant-design-vue';

const router = useRouter();
const authStore = useAuthStore();
const licenseStore = useLicenseStore();
const loading = ref(true);
const paymentStatus = reactive({
  status: 'success',
  title: 'Payment Successful',
  subTitle: 'Thank you for your purchase. Your license has been upgraded successfully.'
});

function goToDashboard() {
  router.push('/dashboard');
}

function restoreAuth() {
  const prePaymentAuthToken = localStorage.getItem('prePaymentAuthToken');
  if (prePaymentAuthToken) {
    authStore.setToken(prePaymentAuthToken);
    localStorage.removeItem('prePaymentAuthToken');
  }
}

async function verifyPayment() {
  try {
    loading.value = true;
    
    // 从 URL 获取会话 ID
    const urlParams = new URLSearchParams(window.location.search);
    let sessionId = urlParams.get('session_id');
    
    // 如果 URL 中没有 session_id，尝试从 localStorage 获取
    if (!sessionId) {
      sessionId = localStorage.getItem('stripeSessionId');
    }
    
    if (!sessionId) {
      throw new Error('No session ID found');
    }
    
    // 调用后端 API 验证支付状态
    const response = await postAction('/payment/verify-session', { 
      sessionId: sessionId 
    });
    
    if (response.success && response.data) {
      // 支付成功，更新许可证信息
      licenseStore.getLicense(authStore.useremail);
      router.push('/dashboard/license');
      
      // 更新支付状态显示
      paymentStatus.status = 'success';
      paymentStatus.title = 'Payment Successful';
      paymentStatus.subTitle = 'Thank you for your purchase. Your license has been upgraded successfully.'
      
      // 清除会话 ID
      localStorage.removeItem('stripeSessionId');
    } else {
      // 支付验证失败
      throw new Error(response.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    
    // 更新失败状态显示
    paymentStatus.status = 'warning';
    paymentStatus.title = 'Payment Verification Issue';
    paymentStatus.subTitle = 'Payment verification failed. Your license has not been upgraded successfully.'
    
    // 显示错误消息
    message.error('Payment verification failed: ' + (error.message || 'Unknown error'));
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // 首先恢复认证状态
  restoreAuth();
  
  // 然后验证支付状态
  await verifyPayment();
});
</script>

<style scoped>
.payment-result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.loading-container {
  padding: 50px;
  text-align: center;
}
</style>
