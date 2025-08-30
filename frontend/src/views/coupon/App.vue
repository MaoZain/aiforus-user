<template>
  <div class="points-page">
    <!-- Your Points -->
    <a-card title="Your Points" class="points-card">
      <a-descriptions bordered>
        <a-descriptions-item label="Total Points">
          <span class="total-points">{{ totalPoints }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- Invite Others -->
    <a-card title="Invite friends to earn more points or extend validity!" class="invite-card">
      <a-form layout="inline" @submit.prevent="handleInvite">
        <a-form-item>
          <a-input
            v-model:value="inviteEmail"
            placeholder="Enter email"
            type="email"
            :rules="[{ required: true, message: 'Please enter a valid email address' }]"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleInvite">Invite</a-button>
        </a-form-item>
      </a-form>
      
      <!-- 显示邀请链接 -->
      <div v-if="showInviteLink" class="invite-link-container">
        <a-divider />
        <h4>Invite Link:</h4>
        <a-input-group compact>
          <a-input
            v-model:value="inviteLink"
            readonly
            style="width: calc(100% - 80px)"
            placeholder="invite link"
          />
          <a-button type="primary" @click="copyInviteLink">
            Copy
          </a-button>
        </a-input-group>
        <p class="link-info">Please send this link to your friends. The link is valid for 7 days.</p>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { postAction, getAction } from "@/services/api";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
const totalPoints = ref(0) // Example total points
const inviteEmail = ref('') // Input email
const inviteLink = ref('') // 存储生成的邀请链接
const showInviteLink = ref(false) // 控制是否显示邀请链接

// Invitation records data
const invitationRecords = ref([
  { email: 'user1@example.com', points: 20, status: 'Active' },
  { email: 'user2@example.com', points: 15, status: 'Inactive' },
  { email: 'user3@example.com', points: 25, status: 'Active' }
])

// Table column definitions
const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Earned Points',
    dataIndex: 'points',
    key: 'points'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  }
]

// Query user's total points
async function fetchTotalPoints() {
  try {
    if (!authStore.useremail) {
      console.error('User email not available');
      message.error('用户信息未找到');
      return;
    }
    
    const result = await getAction(`/users/points/${authStore.useremail}`);
    if (result && result.data) {
      totalPoints.value = result.data.totalPoints || 0;
    }
  } catch (error) {
    console.error('Failed to fetch total points:', error);
    message.error('获取积分信息失败');
  }
}

// Initialize data when component mounts
onMounted(() => {
  fetchTotalPoints();
})

// Invitation handling logic
async function handleInvite() {
  if (!inviteEmail.value) {
    message.error('Please enter a valid email address')
    return
  }
  
  try {
    const params = {
      inviteeEmail: inviteEmail.value,
      inviterEmail: authStore.useremail,
    }
    
    const result = await postAction('/users/generateInviteLink', params);
    console.log('Invitation result:', result);
    
    if (result && result.data && result.data.inviteUrl) {
      inviteLink.value = result.data.inviteUrl;
      showInviteLink.value = true;
      message.success(`Invite link generated, send to ${inviteEmail.value}`);

      // Simulate adding to invitation records
      invitationRecords.value.push({
        email: inviteEmail.value,
        points: 10,
        status: 'Pending'
      });
    } else {
      message.error('Failed to generate invite link');
    }
  } catch (error) {
    console.error('Error generating invite link:', error);
    message.error('Failed to generate invite link');
  }
  
  // inviteEmail.value = '' // Clear input field
}

// 复制邀请链接
async function copyInviteLink() {
  try {
    if(navigator.clipboard){
      await navigator.clipboard.writeText(inviteLink.value);
    } else {
      // 兼容不支持 Clipboard API 的浏览器
      const textArea = document.createElement("textarea");
      textArea.value = inviteLink.value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    message.success('Invite link copied to clipboard');
  } catch (error) {
    console.error('Failed to copy link:', error);
    // fallback方法
    const textArea = document.createElement('textarea');
    textArea.value = inviteLink.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    message.success('邀请链接已复制到剪贴板');
  }
}
</script>

<style scoped>
.points-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
}

.points-card,
.invite-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.total-points {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}

.records-table {
  margin-top: 16px;
}

.points-info {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #1890ff;
}

.invite-link-container {
  margin-top: 16px;
}

.invite-link-container h4 {
  color: #1890ff;
  margin-bottom: 12px;
}

.link-info {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  font-style: italic;
}
</style>