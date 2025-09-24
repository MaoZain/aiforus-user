<template>
  <div class="login-page">
    <div class="login-box">
      <!-- 左侧登录表单 -->
      <div class="login-form-section">
        <div class="center-header">
         
          <h2>Welcome</h2>
        </div>

        <a-form
          ref="formRef"
          layout="vertical"
          :model="form"
          @submit.prevent="handleLogin"
          @keydown.enter.prevent="handleLogin"
        >
          <a-form-item label="Username" name="username" 
            :rules="[{ validator: validateUsername }]">
            <a-input 
              v-model:value="form.username" 
              placeholder="Enter username (choose either username or email)" 
              size="large"
            />
          </a-form-item>

          <a-form-item label="Email" name="email" 
            :rules="[{ validator: validateEmail }]">
            <a-input 
              v-model:value="form.email" 
              placeholder="Enter email (choose either username or email)" 
              size="large"
              type="email"
            />
          </a-form-item>

          <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please enter password' }]">
            <a-input-password 
              v-model:value="form.password" 
              placeholder="Password" 
              size="large"
            />
          </a-form-item>

          <a-button type="primary" block size="large" class="login-btn" @click="handleLogin">
            Login
          </a-button>
        </a-form>

        <div class="register-text">Haven't sign up yet? <a href="#" @click="signUp">Sign up</a></div>
      </div>

      <!-- 右侧插画图 -->
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
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useAuthStore } from "@/store/auth";
import { postAction } from "@/services/api";
import { useLicenseStore } from "@/store/license";


// 绑定路由与状态
const router = useRouter();
const authStore = useAuthStore();
const licenseStore = useLicenseStore();

// 表单数据
const form = ref({
  username: "",
  email: "",
  password: "",
});

// 表单引用（可选用于 validate）
const formRef = ref(null);

// 登录提交方法
const handleLogin = async () => {
  try {
    await formRef.value.validate();

    const { username, email, password } = form.value;

    // 构造请求体
    const params = {
      username: username,
      email: email,
      password: password,
    };

    // 发送 POST 请求到后端
    const response = await postAction("/auth/login", params);

    if (!response.success) {
      throw new Error("Invalid username or password");
    }

    // 保存 token 到本地存储
    const {token, role } = response.data;
    authStore.login({token, role, username:response.data.username, email:response.data.email});
    console.log(licenseStore.getLicense);
    licenseStore.getLicense(response.data.email);

    // 成功提示并跳转
    message.success("Login successful! Redirecting to dashboard...");
    if(role == "admin"){
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard");
    }
  } catch (err) {
    console.log("Validation failed", err);
  }
};

// 跳转到注册页面
const signUp = () => {
  router.push("/register");
};

const validateUsername = async (_rule, value) => {
  const { username, email } = form.value;
  if (!username && !email) {
    return Promise.reject('Either username or email is required');
  }
  return Promise.resolve();
};

const validateEmail = async (_rule, value) => {
  const { username, email } = form.value;
  if (!username && !email) {
    return Promise.reject('Either username or email is required');
  }
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Promise.reject('Please enter a valid email address');
    }
  }
  return Promise.resolve();
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

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  background: #fff;
  padding: 20px;
}

.login-box {
  display: flex;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  width: 70%;
  max-width: 1200px;
  min-height: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-form-section {
  background: white;
  color: #333;
  padding: 60px 50px;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form-section .logo {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 12px;
  color: #4f6ef7;
}

.login-form-section h2 {
  font-size: 32px;
  margin-bottom: 0;
  color: #333;
  font-weight: 600;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
  border-radius: 12px;
  height: 48px;
  margin-top: 24px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(79, 110, 247, 0.3);
}

.register-text {
  text-align: center;
  margin-top: 32px;
  font-size: 14px;
  color: #666;
}

.register-text a {
  color: #4f6ef7;
  text-decoration: none;
  font-weight: 500;
}

.register-text a:hover {
  text-decoration: underline;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    flex-direction: column;
    max-width: 400px;
  }
  
  .login-form-section,
  .login-image-section {
    width: 100%;
  }
  
  .login-image-section {
    min-height: 200px;
  }
  
  .login-form-section {
    padding: 40px 30px;
  }
}

@media (max-width: 768px) {
  .login-image-section {
    padding: 30px 20px;
    min-height: 250px;
  }
  
  .logo-wrapper {
    gap: 16px;
  }
  
  .logo-image {
    width: 80px;
    height: 80px;
  }
  
  .logo-title {
    font-size: 28px;
  }
  
  .logo-subtitle {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .logo-image {
    width: 60px;
    height: 60px;
  }
  
  .logo-title {
    font-size: 24px;
  }
  
  .logo-subtitle {
    font-size: 12px;
  }
}

/* 为深色logo添加备选方案 */
@media (prefers-color-scheme: dark) {
  .logo-image {
    /* filter: brightness(0) invert(1); */
  }
}

/* 如果logo本身是白色或透明背景，移除filter */
/* .logo-image {
  filter: none;
} */
</style>
