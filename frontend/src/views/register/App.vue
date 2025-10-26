<template>
  <div class="register-page">
    <div class="register-box">
      <!-- 左侧注册表单 -->
      <div class="register-form-section">
        <div class="center-header">
          <h2>Create your account</h2>
        </div>

        <a-form ref="formRef" layout="vertical" :model="form" @submit.prevent="handleRegister">
          <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please enter username' }]">
            <a-input 
              v-model:value="form.username" 
              placeholder="Type your username" 
              size="large"
            />
          </a-form-item>

          <a-form-item
            label="Email"
            name="email"
            :rules="[{ required: true, type: 'email', message: 'Enter a valid email' }]"
          >
            <a-input 
              v-model:value="form.email" 
              placeholder="Type your email" 
              size="large"
              type="email"
            />
          </a-form-item>

          <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]"
          >
            <a-input-password 
              v-model:value="form.password" 
              placeholder="Enter password" 
              size="large"
            />
          </a-form-item>

          <a-form-item
            label="Confirm Password"
            name="confirm"
            :rules="[
              { required: true, message: 'Please confirm your password' },
              { validator: validateConfirmPassword },
            ]"
          >
            <a-input-password 
              v-model:value="form.confirm" 
              placeholder="Re-enter password" 
              size="large"
            />
          </a-form-item>

          <!-- <a-form-item
            label="Coupon Code (Optional)"
            name="coupon"
          >
            <a-input 
              v-model:value="form.coupon" 
              placeholder="Type your coupon code" 
              size="large"
            />
          </a-form-item> -->

          <a-button type="primary" block size="large" class="register-btn" @click="handleRegister">
            Register
          </a-button>
        </a-form>

        <div class="login-text">Already have an account? <a href="/login">Log in</a></div>
      </div>

      <!-- 右侧插图 -->
      <div class="login-image-section">
        <div class="image-container">
          <div class="logo-wrapper">
            <img src="@/assets/logo.svg" alt="Login Illustration" class="logo-image" />
            <div class="logo-title">AIforUs</div>
            <div class="logo-subtitle">Your AI Partner for Success</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute,useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { postAction } from "@/services/api";

const route = useRoute();
const router = useRouter();


const formRef = ref();
const form = ref({
  username: "",
  email: "",
  password: "",
  confirm: "",
  coupon: "",
});

// 自定义验证：确认密码
const validateConfirmPassword = (_rule, value) => {
  if (value !== form.value.password) {
    return Promise.reject("Passwords do not match");
  }
  return Promise.resolve();
};

// 注册提交
const handleRegister = async () => {
  try {
    await formRef.value.validate();

    // 构造请求体
    const params = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    };
    const inviteToken = route.query.invite;
    let registerUrl = '/auth/register';
    if (inviteToken) {
      params.inviteToken = inviteToken;
      registerUrl = '/users/inviteRegister';
    }
    // 发送 POST 请求到后端
    const response = await postAction(registerUrl, params);

    if (!response.success) {
      message.error("Registration failed")
      return
    }

    // 成功提示并跳转
    message.success("Registration successful! Redirecting to login...");
    router.push("/login");
  } catch (err) {
    console.log("Validation error:", err);
  }
};
</script>

<style scoped>
::v-deep(.ant-form-item-label > label) {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

::v-deep(.ant-input) {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 12px 16px;
  height: 48px;
}

::v-deep(.ant-input:focus) {
  border-color: #4f6ef7;
  box-shadow: 0 0 0 2px rgba(79, 110, 247, 0.1);
}

::v-deep(.ant-input-password) {
  border-radius: 8px;
  height: 48px;
}

::v-deep(.ant-input-password .ant-input) {
  height: 32px;
  padding: 12px 4px;
}

.center-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 20px;
}

.register-box {
  display: flex;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  width: 70%;
  max-width: 1200px;
  min-height: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.register-form-section {
  background: white;
  color: #333;
  padding: 60px 50px;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.register-form-section .logo {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 12px;
  color: #4f6ef7;
}

.register-form-section h2 {
  font-size: 32px;
  margin-bottom: 0;
  color: #333;
  font-weight: 600;
}

.register-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
  border-radius: 12px;
  height: 48px;
  margin-top: 24px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(79, 110, 247, 0.3);
}

.login-text {
  text-align: center;
  margin-top: 32px;
  font-size: 14px;
  color: #666;
}

.login-text a {
  color: #4f6ef7;
  text-decoration: none;
  font-weight: 500;
}

.login-text a:hover {
  text-decoration: underline;
}

.register-image-section {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}

.login-image-section {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding: 40px;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 24px;
}

.logo-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  /* filter: brightness(0) invert(1); 将logo变为白色 */
  transition: all 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.5);
  /* filter: brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)); */
}

.logo-title {
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.logo-title:hover {
  transform: translateY(-2px);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.logo-subtitle {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

/* 添加动画效果 */
.logo-wrapper {
  animation: fadeInUp 0.8s ease-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-box {
    flex-direction: column;
    max-width: 400px;
  }
  
  .register-form-section,
  .register-image-section {
    width: 100%;
  }
  
  .register-image-section {
    min-height: 200px;
  }
  
  .register-form-section {
    padding: 40px 30px;
  }
}
</style>
