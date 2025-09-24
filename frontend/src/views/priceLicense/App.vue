<template>
  <div style="padding: 24px; background: #fff; min-height: 360px;">
    <!-- 移除外层容器，直接全宽展示 -->
    <h2 class="license-title">License Plans</h2>
    <a-table
      :columns="columns"
      :dataSource="safeData"
      :pagination="false"
      row-key="version"
      bordered
      class="license-table"
    />
    <!-- 调试信息可在开发时临时查看 -->
    <!-- <pre>{{ safeData }}</pre> -->
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";

const columns = [
  { title: "Version", dataIndex: "version", key: "version" },
  { title: "Updates", dataIndex: "updates", key: "updates" },
  { title: "License Expiration", dataIndex: "expiration", key: "expiration" },
  { title: "Technical Support", dataIndex: "support", key: "support" },
  { title: "Online Version", dataIndex: "online", key: "online" },
  { title: "Price", dataIndex: "price", key: "price" },
];

const data = [
  {
    version: "Trial",
    updates: "1 month",
    expiration: "Expires after 1 year",
    support: "Bug reports only",
    online: "optional at $10 per month or $99 per year",
    price: "$0",
  },
  {
    version: "Silver",
    updates: "1 Year",
    expiration: "Expires after 1 year",
    support: "Bug reports only",
    online: "optional at $10 per month or $99 per year",
    price: "$199",
  },
  {
    version: "Gold",
    updates: "3 Years",
    expiration: "Expires after 3 years",
    support: "Bug reports; may fix bugs",
    online: "optional at $10 per month or $99 per year",
    price: "$499",
  },
  {
    version: "Platinum",
    updates: "5 Years",
    expiration: "Never expires",
    support: "Email support; may fix bugs",
    online: "1-year free trial",
    price: "$999",
  },
];

const safeData = computed(() => (Array.isArray(data) ? data : []));

onMounted(() => {
  console.log("[LicenseTable] columns ->", columns);
  console.log("[LicenseTable] data ->", data);
  if (!Array.isArray(data)) {
    console.error("License data is not an array.");
  }
});
</script>

<style scoped>
/* 删除原 .license-page 容器样式，新增标题与表格全宽样式 */
.license-title {
  font-size: 28px;
  font-weight: 600;
  margin: 16px 0;
  padding: 0 8px;
}

.license-table {
  width: 100%;
}

/* 保留表头与单元格样式 */
.license-table :deep(th) {
  background: #f5f7fb;
  font-weight: 600;
}

.license-table :deep(td),
.license-table :deep(th) {
  white-space: normal;
  word-break: break-word;
  padding: 12px 16px;
  vertical-align: top;
}
</style>
