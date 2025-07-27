<template>
  <div class="login-page">
    <div class="login-box">
      <!-- 左侧登录表单 -->
      <div class="login-form-section">
        <div class="center-header">
          <div class="logo">AIforUs</div>
          <h2>Welcome</h2>
        </div>

        <a-form
          ref="formRef"
          layout="vertical"
          :model="form"
          @submit.prevent="handleLogin"
          @keydown.enter.prevent="handleLogin"
        >
          <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please enter username' }]">
            <a-input 
              v-model:value="form.username" 
              placeholder="Type your username" 
              size="large"
            />
          </a-form-item>

          <a-form-item label="Email" name="email" :rules="[{ required: true, type: 'email', message: 'Please enter a valid email' }]">
            <a-input 
              v-model:value="form.email" 
              placeholder="Enter your email" 
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
          <img src="@/assets/login.jpg" alt="Login Illustration" />
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
    authStore.login({token, role, username, email});
    console.log(licenseStore.getLicense);
    licenseStore.getLicense(email);

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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-image-section img {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  border-radius: 12px;
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
</style>
