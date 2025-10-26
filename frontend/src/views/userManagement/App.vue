<template>
  <div>
    <!-- 新增：数据统计卡片区域 -->
    <div class="stats-container" style="margin-bottom: 24px;">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-card class="stats-card">
            <a-statistic
              title="Total Users"
              :value="statsData.totalUsers"
              :value-style="{ color: '#1890ff' }"
            />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card class="stats-card">
            <a-statistic
              title="Active Licenses"
              :value="statsData.activeLicenses"
              :value-style="{ color: '#52c41a' }"
            />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card class="stats-card">
            <a-statistic
              title="Paid Licenses"
              :value="statsData.paidLicenses"
              :value-style="{ color: '#722ed1' }"
            />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div style="text-align: right; margin-bottom: 20px;">
      <!-- <a-button type="primary" @click="showAddUserModal">Add User</a-button> -->
    </div>
    <a-table :columns="columns" :data-source="data" row-key="id" style="margin-top: 20px">
      <template  #operation="{ record }">
        <!-- <a-button type="link" @click="showEditUserModal(record)">Edit</a-button> -->
        <a-button type="link" danger @click="deleteUser(record.id)">Delete</a-button>
      </template>
    </a-table>

    <!-- Modal -->
    <a-modal
      v-if="isModalVisible"
      v-model:visible="isModalVisible"
      :title="modalTitle"
      width="800px"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :model="form" layout="vertical">
        <div style="display: flex; gap: 16px;">
          <a-form-item label="User Name" style="flex: 1;">
            <a-input v-model:value="form.userName" />
          </a-form-item>
          <a-form-item label="Email" style="flex: 1;">
            <a-input v-model:value="form.email" />
          </a-form-item>
          <a-form-item label="Registration Date" style="flex: 1;">
            <a-date-picker v-model:value="form.registrationDate" style="width: 100%" />
          </a-form-item>
        </div>
        <div style="display: flex; gap: 16px;">
          <a-form-item label="License Type" style="flex: 1;">
            <a-select v-model:value="form.licenseType" style="width: 100%">
              <a-select-option value="type1">Type 1</a-select-option>
              <a-select-option value="type2">Type 2</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="License Code" style="flex: 1;">
            <a-input v-model:value="form.licenseCode" />
          </a-form-item>
          <a-form-item label="License Expiration Date" style="flex: 1;">
            <a-date-picker v-model:value="form.licenseExpirationDate" style="width: 100%" />
          </a-form-item>
        </div>
        <div style="display: flex; gap: 16px;">
          <a-form-item label="License Status" style="flex: 1;">
            <a-select v-model:value="form.licenseStatus" style="width: 100%">
              <a-select-option value="active">Active</a-select-option>
              <a-select-option value="inactive">Inactive</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Coupon Code" style="flex: 1;">
            <a-input v-model:value="form.couponCode" />
          </a-form-item>
          <a-form-item label="Coupon URL" style="flex: 1;">
            <a-input v-model:value="form.couponUrl" />
          </a-form-item>
        </div>
        <div style="display: flex; gap: 16px;">
          <a-form-item label="Discount" style="flex: 1;">
            <a-input v-model:value="form.discount" />
          </a-form-item>
        </div>
        <a-form-item label="Notes">
          <a-textarea v-model:value="form.notes" rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getAction } from "@/services/api";

export default {
  data() {
    return {
      isModalVisible: false,
      modalTitle: "Add User",
      form: {
        userName: "",
        email: "",
        registrationDate: null,
        licenseType: "",
        licenseCode: "",
        licenseExpirationDate: null,
        licenseStatus: "",
        couponCode: "",
        couponUrl: "",
        discount: "",
        notes: "",
      },
      data: [
        {
          id: 1,
          username: "John Doe",
          email: "john@example.com",
          licenseType: "Type 1",
          expireDate: "2025-12-31",
          registrationDate: "2023-01-01",

        },
      ],
      columns: [
        {
          title: "Username",
          dataIndex: "username",
          key: "username",
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "License Type",
          dataIndex: "licenseType",
          key: "licenseType",
        },
        {
          title: "Expire Date",
          dataIndex: "expireDate",
          key: "expireDate",
        },
        {
          title: "Registration Date",
          dataIndex: "registrationDate",
          key: "registrationDate",
        },
        {
          title: "License Status",
          dataIndex: "licenseState",
          key: "licenseState",
        },
        {
          title: "Credits",
          dataIndex: "credits",
          key: "credits",
        },
        {
          title: "Operation",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],
      // 新增：统計数据
      statsData: {
        totalUsers: 0,
        activeLicenses: 0,
        paidLicenses: 0,
      },
    };
  },
  mounted() {
    this.fetchStatsData();
  },
  methods: {
    showAddUserModal() {
      this.modalTitle = "Add User";
      this.resetForm();
      this.isModalVisible = true;
    },
    showEditUserModal(record) {
      this.modalTitle = "Edit User";
      this.form = { ...record };
      this.isModalVisible = true;
    },
    handleOk() {
      console.log("Form data:", this.form);
      this.isModalVisible = false;
    },
    handleCancel() {
      this.isModalVisible = false;
    },
    deleteUser(id) {
      this.data = this.data.filter((item) => item.id !== id);
    },
    resetForm() {
      this.form = {
        userName: "",
        email: "",
        registrationDate: null,
        licenseType: "",
        licenseCode: "",
        licenseExpirationDate: null,
        licenseStatus: "",
        couponCode: "",
        couponUrl: "",
        discount: "",
        notes: "",
      };
    },
    // 新增：获取统计数据的方法
    async fetchStatsData() {
      try {
        // 模拟API调用，实际应该调用真实的API
        const response = await getAction('/users/stats');
        const { totalUsers, activeLicenses, paidLicenses, users } = response.data;
        // 模拟数据
        this.statsData = {
          totalUsers,
          activeLicenses,
          paidLicenses,
        };
        this.data=users;
      } catch (error) {
        console.error('Failed to fetch stats data:', error);
        // 使用模拟数据作为fallback
        this.statsData = {
          totalUsers: 1250,
          activeLicenses: 890,
          paidLicenses: 650,
        };
      }
    },
  },
};
</script>

<style scoped>
a-button {
  margin-bottom: 20px;
}

/* 新增：统计卡片样式 */
.stats-container {
  margin-bottom: 24px;
}

.stats-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stats-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.stats-card :deep(.ant-card-body) {
  padding: 20px;
}

/* 新增：统计标题样式 */
.stats-card :deep(.ant-statistic-title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.stats-card :deep(.ant-statistic-content) {
  font-size: 32px;
  font-weight: bold;
}
</style>