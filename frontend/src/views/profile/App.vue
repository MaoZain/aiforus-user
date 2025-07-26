<template>
  <a-descriptions
    bordered
    class="custom-descriptions"
    :column="2"
  >
    <template #title>
      <div class="desc-title-row">
        <span>User Info</span>
        <a-button
          v-if="!isEditing"
          type="primary"
          @click="isEditing = true"
        >Edit</a-button>
        <a-button
          v-else
          type="primary"
          :loading="loading"
          @click="saveUserProfile"
        >Save</a-button>
      </div>
    </template>
    <a-descriptions-item label="First Name" :span="1">  
      <template v-if="!isEditing">{{ userProfile.first_name }}</template>
      <template v-else>
        <a-input v-model:value="userProfile.first_name" />
      </template>
    </a-descriptions-item>
    <a-descriptions-item label="Last Name" :span="1">
      <template v-if="!isEditing">{{ userProfile.last_name }}</template>
      <template v-else>
        <a-input v-model:value="userProfile.last_name" />
      </template>
    </a-descriptions-item>
    <a-descriptions-item label="Email" :span="2">
      {{ userProfile.email }}
    </a-descriptions-item>
    <a-descriptions-item label="Registration Date" :span="2">
      {{ formatDate(userProfile.registration_date) }}
    </a-descriptions-item>
    <a-descriptions-item label="Age" :span="2">
      <template v-if="!isEditing">{{ getDictLabelByCode(ageOptions, userProfile.age_range) }}</template>
      <template v-else>
        <a-select v-model:value="userProfile.age_range" style="width: 100%" :loading="loading">
          <a-select-option v-for="age in ageOptions" :key="age.code" :value="age.code">
            {{ age.label }}
          </a-select-option>
        </a-select>
      </template>
    </a-descriptions-item>
    <a-descriptions-item label="Occupation" :span="2">
      <template v-if="!isEditing">{{ getDictLabelByCode(occupationOptions, userProfile.occupation) }}</template>
      <template v-else>
        <a-select v-model:value="userProfile.occupation" style="width: 100%" :loading="loading">
          <a-select-option v-for="job in occupationOptions" :key="job.code" :value="job.code">
            {{ job.label }}
          </a-select-option>
        </a-select>
      </template>
    </a-descriptions-item>
    <a-descriptions-item label="Education" :span="2">
      <template v-if="!isEditing">{{ getDictLabelByCode(educationOptions, userProfile.education) }}</template>
      <template v-else>
        <a-select v-model:value="userProfile.education" style="width: 100%" :loading="loading">
          <a-select-option v-for="edu in educationOptions" :key="edu.code" :value="edu.code">
            {{ edu.label }}
          </a-select-option>
        </a-select>
      </template>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDictionaryDataByType, getDictLabelByCode } from '@/utils/dictUtils' // 假设您有一个服务来获取字典数据
import { useAuthStore } from "@/store/auth";
import {getAction, postAction} from '@/services/api';
import { message } from "ant-design-vue";

const authStore = useAuthStore();
const isEditing = ref(false)
const loading = ref(false)

const userProfile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@example.com',
  registrationDate: '2023-05-15',
  age: 'AGE_18_24',
  occupation: 'SOFT_ENG',
  education: 'BACHELOR',
  // 保留原有的其他字段，以备将来使用
  status: 'Active',
  region: 'East China 1'
})

// 字典选项 - 从API获取
const ageOptions = ref([])
const occupationOptions = ref([])
const educationOptions = ref([])


// 格式化日期函数
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取所有字典数据
const loadDictionaries = async () => {
  loading.value = true
  try {
    const [ages, occupations, educations] = await Promise.all([
      getDictionaryDataByType('age'),
      getDictionaryDataByType('occupation'),
      getDictionaryDataByType('education')
    ])
    
    ageOptions.value = ages
    occupationOptions.value = occupations
    educationOptions.value = educations
  } catch (error) {
    console.error('Error loading dictionaries:', error)
  } finally {
    loading.value = false
  }
}

const getUserProfile = async () => {
  let email = authStore.useremail
  loading.value = true
  try {
    // 这里替换为您的实际API端点
    const response =  await getAction(`/users/profile/${email}`)
    if (response.success) {
     userProfile.value = response.data
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  } finally {
    loading.value = false
  }
}

// 保存用户资料
const saveUserProfile = async () => {
  loading.value = true
  try {
    const params = {
      first_name: userProfile.value.first_name,
      last_name: userProfile.value.last_name,
      email: userProfile.value.email,
      age_range: userProfile.value.age_range,
      occupation: userProfile.value.occupation,
      education: userProfile.value.education
    }
    const response = await postAction('/users/updateProfile', params )
    
    if (!response.success) {
      throw new Error('Failed to save user profile')
    }    
    message.success('Profile updated successfully')
    getUserProfile()
    isEditing.value = false
  } catch (error) {
    console.error('Error saving profile:', error)
    // 显示错误消息
    // message.error('Failed to save profile')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载字典数据
onMounted(() => {
  loadDictionaries()
  getUserProfile() // 假设您有一个函数来获取用户资料
})
</script>

<style scoped>
.desc-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-descriptions {
  border-radius: 8px;
  overflow: hidden;
}

.custom-descriptions :deep(.ant-descriptions-view) {
  background: #fff !important;
  border: 2px solid #f0f1f2 !important;
}

.custom-descriptions :deep(.ant-descriptions-item-label) {
  background-color: #fafafa;
  font-weight: 500;
  width: 180px; /* 设置固定宽度 */
  min-width: 180px; /* 确保最小宽度 */
  max-width: 180px; /* 确保最大宽度 */
  white-space: nowrap; /* 防止文本换行 */
}

.custom-descriptions :deep(.ant-descriptions-item-content) {
  padding-left: 16px;
  width: 220px; /* 设置内容固定宽度 */
  min-width: 220px; /* 确保最小宽度 */
  max-width: 220px; /* 确保最大宽度 */
}

/* 适应那些设置了span属性的项 */
.custom-descriptions :deep(.ant-descriptions-item[colspan="2"] .ant-descriptions-item-content) {
  width: 440px; /* 220px * 2 */
  min-width: 440px;
  max-width: 440px;
}

.custom-descriptions :deep(.ant-descriptions-item[colspan="3"] .ant-descriptions-item-content) {
  width: 660px; /* 220px * 3 */
  min-width: 660px;
  max-width: 660px;
}

/* 许可证代码样式 */
.license-code {
  font-family: 'Courier New', monospace;
  background-color: #f7f7f7;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 1px;
}

/* 升级按钮优化 */
.upgrade-btn {
  font-weight: 500;
  border-radius: 6px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}
</style>