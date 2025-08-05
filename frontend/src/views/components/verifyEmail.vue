<template>
  <div class="verify-email-page">
    <div class="verify-container">
      <div class="verify-content">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-section">
          <a-spin size="large" />
          <h2>Verifying your email...</h2>
          <p>Please wait while we process your verification request.</p>
        </div>

        <!-- 成功状态 -->
        <div v-else-if="verificationStatus === 'success'" class="success-section">
          <div class="success-icon">
            <a-icon type="check-circle" />
          </div>
          <h2>Email verified successfully!</h2>
          <p>Congratulations, your email has been successfully verified. Your account is now active.</p>
          <div class="user-info" v-if="userInfo">
            <p><strong>Email:</strong> {{ userInfo.email }}</p>
          </div>
          <a-button type="primary" size="large" @click="goToLogin">
            Go to Login
          </a-button>
        </div>

        <!-- 失败状态 -->
        <div v-else-if="verificationStatus === 'error'" class="error-section">
          <div class="error-icon">
            <a-icon type="close-circle" />
          </div>
          <h2>Verification failed</h2>
          <p class="error-message">{{ errorMessage }}</p>
          <div class="action-buttons">
            <a-button type="primary" @click="resendEmail" :loading="resendLoading">
              Resend Verification Email
            </a-button>
            <a-button @click="goToRegister">
              Go to Registration Page
            </a-button>
          </div>
        </div>

        <!-- 过期状态 -->
        <div v-else-if="verificationStatus === 'expired'" class="expired-section">
          <div class="warning-icon">
            <a-icon type="exclamation-circle" />
          </div>
          <h2>Verification link has expired</h2>
          <p>Your verification link has expired. Please request a new verification email.</p>
          <div class="email-input-section">
            <a-input
              v-model:value="email"
              placeholder="Please enter your email address"
              size="large"
              style="margin-bottom: 16px;"
            />
            <a-button 
              type="primary" 
              block 
              size="large" 
              @click="resendEmail"
              :loading="resendLoading"
            >
              Resend Verification Email
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { postAction } from '@/services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const verificationStatus = ref('')
const errorMessage = ref('')
const userInfo = ref(null)
const email = ref('')
const resendLoading = ref(false)

// 验证邮箱
const verifyEmail = async (token) => {
  try {
    const response = await postAction('/users/verifyEmailToken', { token })
    
    if (response.success) {
      verificationStatus.value = 'success'
      userInfo.value = response.data.user      
      message.success('Email verified successfully!')
    } else {
      throw new Error(response.message || 'Verification failed')
    }
  } catch (error) {
    console.error('Verification error:', error)
    if (error.message?.includes('expired') || error.message?.includes('过期')) {
      verificationStatus.value = 'expired'
      errorMessage.value = 'Verification link has expired. Please request a new verification email.'
    } else {
      verificationStatus.value = 'error'
      errorMessage.value = error.message || 'An error occurred during verification. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}

// 重新发送验证邮件
const resendEmail = async () => {
  if (!email.value) {
    message.error('Please enter your email address')
    return
  }
  resendLoading.value = true
  try {
    const response = await postAction('/users/resendVerificationEmailToken', { email: email.value })
    
    if (response.success) {
      message.success('Verification email resent successfully. Please check your inbox.')
    } else {
      throw new Error(response.message || 'Failed to resend verification email')
    }
  } catch (error) {
    console.log('Error resending verification email:', error);
  } finally {
    resendLoading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}

// 页面加载时执行验证
onMounted(() => {
  const token = route.query.token
  
  if (!token) {
    verificationStatus.value = 'error'
    errorMessage.value = 'No verification token provided.'
    loading.value = false
    return
  }
  
  verifyEmail(token)
})
</script>

<style scoped>
.verify-email-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.verify-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 48px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.verify-content h2 {
  margin: 24px 0 16px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.verify-content p {
  color: #666;
  font-size: 16px;
  margin-bottom: 24px;
  line-height: 1.5;
}

/* 加载状态 */
.loading-section {
  padding: 40px 0;
}

.loading-section .ant-spin {
  margin-bottom: 24px;
}

/* 成功状态 */
.success-section .success-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 16px;
}

.user-info {
  background: #f6f8fa;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  text-align: left;
}

.user-info p {
  margin: 8px 0;
  color: #333;
}

/* 错误状态 */
.error-section .error-icon {
  font-size: 64px;
  color: #ff4d4f;
  margin-bottom: 16px;
}

.error-message {
  color: #ff4d4f !important;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 过期状态 */
.expired-section .warning-icon {
  font-size: 64px;
  color: #faad14;
  margin-bottom: 16px;
}

.email-input-section {
  max-width: 300px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .verify-container {
    padding: 32px 24px;
    margin: 0 16px;
  }
  
  .verify-content h2 {
    font-size: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .ant-btn {
    width: 100%;
  }
}
</style>