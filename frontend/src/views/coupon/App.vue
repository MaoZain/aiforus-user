<template>
  <div class="points-page">
    <!-- Your Points -->
    <a-card title="Your Points" class="points-card">
      <a-descriptions bordered>
        <a-descriptions-item label="Total Points">
          <span class="total-points">{{ totalPoints }}</span>
        </a-descriptions-item>
      </a-descriptions>
      <p class="points-info">
        Points can be used to extend validity. 20 points = 1 month.
      </p>
      <a-table
        :columns="columns"
        :data-source="invitationRecords"
        row-key="email"
        class="records-table"
        bordered
      />
    </a-card>

    <!-- Invite Others -->
    <a-card title="Invite friends to earn more points!" class="invite-card">
      <a-form layout="inline" @submit.prevent="handleInvite">
        <a-form-item>
          <a-input
            v-model="inviteEmail"
            placeholder="Enter email"
            type="email"
            :rules="[{ required: true, message: 'Please enter a valid email address' }]"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleInvite">Invite</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const totalPoints = ref(120) // Example total points
const inviteEmail = ref('') // Input email

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

// Invitation handling logic
function handleInvite() {
  if (!inviteEmail.value) {
    message.error('Please enter a valid email address')
    return
  }
  // Simulate invitation logic
  invitationRecords.value.push({
    email: inviteEmail.value,
    points: 10, // Example points
    status: 'Inactive'
  })
  message.success(`Invitation sent to ${inviteEmail.value}`)
  inviteEmail.value = ''
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
</style>