<template>
  <div class="payment-result">
    <div class="success-card">
      <a-result
        v-if="!loading"
        :status="paymentStatus.status"
        :title="paymentStatus.title"
        :sub-title="paymentStatus.subTitle"
      >
        <template #icon>
          <HeartFilled class="heart-icon" />
        </template>
        <template #extra>
          <a-button type="primary" size="large" shape="round" class="action-btn" @click="goToDashboard">Go to Dashboard</a-button>
        </template>
      </a-result>
      <div v-else class="loading-container">
        <a-spin tip="Verifying payment status..." size="large"></a-spin>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { HeartFilled } from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/auth';
import { useLicenseStore } from '@/store/license';
import { postAction } from '@/services/api';
import { message } from 'ant-design-vue';

const router = useRouter();
const authStore = useAuthStore();
const licenseStore = useLicenseStore();
const loading = ref(false);
const paymentStatus = reactive({
  status: 'success',
  title: 'Thank You for Your Support!',
  subTitle: 'Your generosity warms our hearts and fuels our mission. We truly appreciate your contribution to AiforUs.'
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
      // 支付成功
      // 捐款成功不需要更新license或强制跳转，显示感谢页面即可
      
      // 更新支付状态显示
      paymentStatus.status = 'success';
      paymentStatus.title = 'Thank You for Your Support!';
      paymentStatus.subTitle = 'Your generosity warms our hearts and fuels our mission. We truly appreciate your contribution to AiforUs.'
      
      // 清除会话 ID
      localStorage.removeItem('stripeSessionId');
    } else {
      // 支付验证失败
      throw new Error(response.message || 'Donation verification failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    
    // 更新失败状态显示
    paymentStatus.status = 'warning';
    paymentStatus.title = 'Verification Issue';
    paymentStatus.subTitle = 'We could not verify your donation status automatically. Please contact support if you have been charged.'
    
    // 显示错误消息
    message.error('Verification failed: ' + (error.message || 'Unknown error'));
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // 首先恢复认证状态
  // restoreAuth();
  
  // 然后验证支付状态
  // await verifyPayment();
});
</script>

<style scoped>
.payment-result {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0e6 100%); /* 调整为暖色调背景 */
  padding: 20px;
}

.success-card {
  background: rgba(255, 255, 255, 0.95); /* 稍微增加不透明度 */
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(255, 100, 100, 0.1); /* 阴影也带一点暖色 */
  max-width: 600px;
  width: 100%;
  text-align: center;
  animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  backdrop-filter: blur(10px);
}

.heart-icon {
  font-size: 72px;
  color: #f5222d !important; /* 添加 !important 强制覆盖 Ant Design 的默认绿色 */
  animation: heartbeat 1.5s ease-in-out infinite;
  margin-bottom: 10px;
  display: inline-block;
  filter: drop-shadow(0 4px 8px rgba(245, 34, 45, 0.4)); /* 增加红色光晕 */
}

.action-btn {
  min-width: 180px;
  height: 48px;
  font-size: 16px;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3);
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

.loading-container {
  padding: 60px 20px;
  text-align: center;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.15); }
  28% { transform: scale(1); }
  42% { transform: scale(1.15); }
  70% { transform: scale(1); }
}

/* Override Ant Design result styles for better typography */
:deep(.ant-result-title) {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
}

:deep(.ant-result-subtitle) {
  font-size: 18px;
  line-height: 1.6;
  color: #595959;
  max-width: 480px;
  margin: 0 auto;
}
</style>
