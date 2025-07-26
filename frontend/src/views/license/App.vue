<template>
  <div>
    <template v-if="licenseType">
      <a-descriptions bordered class="custom-descriptions" :column="2">
        <template #title>
          <div class="desc-title-row">
            <span>License Info</span>
            <a-button type="primary" class="upgrade-btn" @click="showModal = true">Upgrade</a-button>
          </div>
        </template>
        <a-descriptions-item label="License Type" :span="2">
          {{ licenseType }}
        </a-descriptions-item>
        <a-descriptions-item label="Start Date" :span="1">
          {{ formatDate(licenseStart) }}
        </a-descriptions-item>
        <a-descriptions-item label="Expiry Date" :span="1">
          {{ formatDate(licenseExpire) }}
        </a-descriptions-item>
        <a-descriptions-item label="Status">
          {{licenseState}}
          <!-- <a-badge :status="license.status === 'Active' ? 'success' : 'default'" :text="license.status" /> -->
        </a-descriptions-item>
        <!-- <a-descriptions-item label="License Code" :span="3">
          <span class="license-code">{{ license.code }}</span>
        </a-descriptions-item> -->
      </a-descriptions>
    </template>
    <template v-else>
      <a-empty
        :image-style="{
          height: '160px',
        }"
      >
        <template #description>
          Please
          <div style="margin-top: 16px; display: inline">
            <a href="javascript:void(0);" class="active-link" @click="showModal = true">Active</a>
          </div>
          a license to use AiforUs.
        </template>
      </a-empty>
    </template>

    <a-modal
      v-model:open="showModal"
      title="Upgrade License"
      @ok="handleUpgrade"
      @cancel="showModal = false"
      width="1000px"
    >
      <div class="pricing-modal">
        <h2 class="pricing-title">Choose Your Pricing Plan</h2>
        <div class="pricing-cards">
          <div
            class="pricing-card"
            :class="{
              active: upgradeType === 'Trial',
              'active-trial': upgradeType === 'Trial',
            }"
            @click="upgradeType = 'Trial'"
          >
            <div class="plan-title">Trial</div>
            <div class="plan-desc">Free access to basic features. Perfect for new users to try out the service.</div>
          </div>
          <div
            class="pricing-card"
            :class="{
              active: upgradeType === 'Silver',
              'active-silver': upgradeType === 'Silver',
            }"
            @click="upgradeType = 'Silver'"
          >
            <div class="plan-title">Silver</div>
            <div class="plan-desc">Ideal for individuals and small teams. Enjoy standard support and features.</div>
          </div>
          <div
            class="pricing-card"
            :class="{
              active: upgradeType === 'Gold',
              'active-gold': upgradeType === 'Gold',
            }"
            @click="upgradeType = 'Gold'"
          >
            <div class="plan-title">Gold</div>
            <div class="plan-desc">More resources and premium support for growing businesses.</div>
          </div>
          <div
            class="pricing-card"
            :class="{
              active: upgradeType === 'Platinum',
              'active-platinum': upgradeType === 'Platinum',
            }"
            @click="upgradeType = 'Platinum'"
          >
            <div class="plan-title">Platinum</div>
            <div class="plan-desc">All advanced features and exclusive services for enterprises.</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useLicenseStore } from "@/store/license";
import { useAuthStore } from "@/store/auth";
import { postAction } from "@/services/api";
import { message } from "ant-design-vue"

const licenseStore = useLicenseStore();
const authStore = useAuthStore();


const showModal = ref(false);
const upgradeType = ref("Trial");
const licenseType = computed(() => licenseStore.licenseType);
const licenseStart = computed(() => licenseStore.licenseStart);
const licenseExpire = computed(() => licenseStore.licenseExpire);
const licenseState = computed(() => licenseStore.licenseState);

async function handleUpgrade() {
  try {
    // 显示加载状态
    const loadingKey = 'upgradeLoading';
    message.loading({ content: 'Processing payment...', key: loadingKey, duration: 0 });
    
    // 准备请求参数
    const params = {
      type: upgradeType.value,
      email:authStore.useremail, // 使用当前用户的邮箱
      // 添加成功和取消的回调URL
      successUrl: `${window.location.origin}/payment-success`,
      cancelUrl: `${window.location.origin}/payment-cancel`,
    };
    
    // 对于免费试用版，直接更新许可证
    // if (upgradeType.value === 'Trial') {
    //   licenseStore.getLicense();
    //   showModal.value = false;
    //   message.success({ content: 'Trial license activated successfully!', key: loadingKey });
    //   return;
    // }
    
    // 对于付费版本，创建 Stripe 结账会话
    const response = await postAction("/payment/create-checkout-session", params);
    
    if (response.success && response.data && response.data.url) {
      // 将会话ID存储在本地，以便支付成功后可以验证
      localStorage.setItem('stripeSessionId', response.data.sessionId);
      
      // 重定向到 Stripe 托管的结账页面
      window.location.href = response.data.url;
    } else {
      throw new Error(response.message || 'Failed to create checkout session');
    }
  } catch (error) {
    console.error('Payment error:', error);
    // message.error({ 
    //   content: 'Payment processing failed. Please try again later.', 
    //   key: 'upgradeLoading' 
    // });
  }
}

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

/* 空状态优化 */
:deep(.ant-empty) {
  background: #f9fafc;
  padding: 48px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}


:deep(.ant-empty-description) {
  font-size: 18px;
  color: #555;
  margin-top: 24px;
  font-weight: 500;
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


/* 定价卡片改进 */
.pricing-modal {
  text-align: center;
}

.pricing-title {
  font-size: 28px;
  margin-bottom: 32px;
  font-weight: 600;
  color: #222;
}

.pricing-cards {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.pricing-card {
  width: 210px;
  height: 260px;
  padding: 32px 20px;
  border: 1.5px solid #eee;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.pricing-card.active {
  border-width: 2px;
  transform: translateY(-5px);
}

.pricing-card.active-trial {
  border-color: #91d5ff;
  background-color: #e6f7ff;
  box-shadow: 0 6px 20px rgba(145, 213, 255, 0.3);
}

.pricing-card.active-silver {
  border-color: #bfbfbf;
  background-color: #f5f5f5;
  box-shadow: 0 6px 20px rgba(191, 191, 191, 0.3);
}

.pricing-card.active-gold {
  border-color: #ffe58f;
  background-color: #fffbe6;
  box-shadow: 0 6px 20px rgba(255, 229, 143, 0.3);
}

.pricing-card.active-platinum {
  border-color: #b37feb;
  background-color: #f9f0ff;
  box-shadow: 0 6px 20px rgba(179, 127, 235, 0.3);
}

.plan-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 18px;
  color: #222;
}

.plan-desc {
  font-size: 15px;
  color: #666;
  margin-top: 16px;
  text-align: center;
  line-height: 1.6;
}

.active-link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s;
}

.active-link:hover {
  color: #40a9ff;
}
</style>