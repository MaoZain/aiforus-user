<template>
  <div>
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
          title: "Operation",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],
    };
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
  },
};
</script>

<style scoped>
a-button {
  margin-bottom: 20px;
}
</style>