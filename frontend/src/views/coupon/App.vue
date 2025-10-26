<template>
  <div class="points-page">
    <!-- Your Credits -->
    <a-card title="Coupon"  class="points-card" >
      <a-descriptions bordered :column="1">
        <a-descriptions-item label="Your Coupon Code">
          <span class="total-points">{{ couponCode }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Total Credits">
          <span class="total-points">{{ totalPoints }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 新增：积分转让功能 -->
    <a-card title="Transfer Credits" class="transfer-card">
      <a-form layout="vertical" @submit.prevent="handleTransfer">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Recipient Email" required>
              <a-input
                v-model:value="transferEmail"
                placeholder="Enter recipient's email"
                type="email"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Amount" required>
              <a-input-number
                v-model:value="transferAmount"
                :min="1"
                :max="totalPoints"
                placeholder="Enter amount"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label=" ">
              <a-button type="primary" @click="handleTransfer" :loading="transferLoading">
                Transfer
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      
      <a-alert
        message="Transfer Notice"
        description="Please ensure the recipient email is correct. Transfers cannot be reversed."
        type="info"
        show-icon
        style="margin-top: 16px"
      />
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
          <a-input v-model:value="inviteLink" readonly style="width: calc(100% - 80px)" placeholder="invite link" />
          <a-button type="primary" @click="copyInviteLink"> Copy </a-button>
        </a-input-group>
        <p class="link-info">Please send this link to your friends. The link is valid for 7 days.</p>
      </div>
    </a-card>


    <!-- 新增：独立 Invitation History 卡片 -->
    <a-card title="Invitation History" class="history-card">
      <a-table
        :columns="inviteColumns"
        :dataSource="invitationRecords"
        row-key="inviteeEmail"
        size="middle"
        bordered
        :pagination="false"
        locale="{ emptyText: 'No invitation history' }"
      />
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { postAction, getAction } from "@/services/api";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
const totalPoints = ref(0); // Example total points
const couponCode = ref(null); // User's coupon code, if any
const inviteEmail = ref(""); // Input email
const inviteLink = ref(""); // 存储生成的邀请链接
const showInviteLink = ref(false); // 控制是否显示邀请链接

// Invitation records data
const invitationRecords = ref([]);

// 邀请历史表格列
const inviteColumns = [
  // { title: 'Inviter Email', dataIndex: 'inviterEmail', key: 'inviterEmail' },
  { title: "Invitee Email", dataIndex: "inviteeEmail", key: "inviteeEmail" },
  { title: "Invite Time", dataIndex: "inviteTime", key: "inviteTime" },
  { title: "State", dataIndex: "state", key: "state" },
  { title: "Active Time", dataIndex: "activeTime", key: "activeTime" },
  { title: "Memo", dataIndex: "memo", key: "memo" },
];

// 新增：积分转让相关数据
const transferEmail = ref("");
const transferAmount = ref(null);
const transferLoading = ref(false);
const transferRecords = ref([]);

// 积分转让历史表格列
const transferColumns = [
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Recipient/Sender", dataIndex: "otherParty", key: "otherParty" },
  { title: "Amount", dataIndex: "amount", key: "amount" },
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Status", dataIndex: "status", key: "status" },
];

// Query user's total points
async function fetchTotalPoints() {
  try {
    if (!authStore.useremail) {
      console.error("User email not available");
      message.error("用户信息未找到");
      return;
    }

    const result = await getAction(`/users/points/${authStore.useremail}`);
    if (result && result.data) {
      totalPoints.value = result.data.totalPoints || 0;
      couponCode.value = result.data.couponCode || null;
    }
  } catch (error) {
    console.error("Failed to fetch total points:", error);
    message.error("获取积分信息失败");
  }
}

async function fetchHistoricalInvites() {
  try {
    if (!authStore.useremail) {
      console.error("User email not available");
      message.error("用户信息未找到");
      return;
    }

    const result = await getAction(`/users/couponHistory/${authStore.useremail}`);
    if (result && result.data) {
      invitationRecords.value = Array.isArray(result.data) ? result.data : [result.data];
      console.log("Invitation history:", invitationRecords.value);
    }
  } catch (error) {
    console.error("Failed to fetch invitation records:", error);
    message.error("获取邀请记录失败");
  }
}

// Initialize data when component mounts
onMounted(() => {
  fetchTotalPoints();
  fetchHistoricalInvites();
});

// Invitation handling logic
async function handleInvite() {
  if (!inviteEmail.value) {
    message.error("Please enter a valid email address");
    return;
  }

  try {
    const params = {
      inviteeEmail: inviteEmail.value,
      inviterEmail: authStore.useremail,
    };

    const result = await postAction("/users/generateInviteLink", params);
    console.log("Invitation result:", result);

    if (result && result.data && result.data.inviteUrl) {
      inviteLink.value = result.data.inviteUrl;
      showInviteLink.value = true;
      message.success(`Invite link generated, send to ${inviteEmail.value}`);
      fetchHistoricalInvites(); // Refresh invitation records
    } else {
      message.error("Failed to generate invite link");
    }
  } catch (error) {
    console.error("Error generating invite link:", error);
    message.error("Failed to generate invite link");
  }

  // inviteEmail.value = '' // Clear input field
}

// 新增：积分转让处理逻辑
async function handleTransfer() {
  if (!transferEmail.value) {
    message.error("Please enter recipient's email address");
    return;
  }

  if (!transferAmount.value || transferAmount.value <= 0) {
    message.error("Please enter a valid transfer amount");
    return;
  }

  if (transferAmount.value > totalPoints.value) {
    message.error("Transfer amount cannot exceed your current credits");
    return;
  }

  if (transferEmail.value === authStore.useremail) {
    message.error("Cannot transfer credits to yourself");
    return;
  }
  const params = {
    senderEmail: authStore.useremail,
    recipientEmail: transferEmail.value,
    amount: transferAmount.value,
  };
  console.log("Transfer parameters:", params);
  transferLoading.value = true;
  try {
    const result = await postAction("/users/transferPoints", params);
    console.log("Transfer result:", result);

    if (result && result.success) {
      message.success(`Successfully transferred ${transferAmount.value} credits to ${transferEmail.value}`);
      // Refresh total points
      await fetchTotalPoints();
      await fetchHistoricalInvites(); // Refresh transfer history
      // Clear input fields
      transferEmail.value = "";
      transferAmount.value = null;
    } else {
      const errorMsg = (result && result.data && result.data.message) || "Transfer failed";
      message.error(errorMsg);
    }
  } catch (error) {
    console.error("Error during transfer:", error);
    message.error("Transfer failed due to an error");
  } finally {
    transferLoading.value = false;
  }
}

// 复制邀请链接
async function copyInviteLink() {
  try {
    if (navigator.clipboard) {
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
    message.success("Invite link copied to clipboard");
  } catch (error) {
    console.error("Failed to copy link:", error);
    // fallback方法
    const textArea = document.createElement("textarea");
    textArea.value = inviteLink.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    message.success("邀请链接已复制到剪贴板");
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
.invite-card,
.history-card,
.transfer-card,
.transfer-history-card {
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
