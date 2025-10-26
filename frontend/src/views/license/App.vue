<template>
  <a-spin :spinning="loading">
    <div>
      <template v-if="licenseType">
        <a-descriptions bordered class="custom-descriptions" :column="2">
          <template #title>
            <div class="desc-title-row">
              <span>License Info</span>
              <div class="title-actions">
                <a-button
                  :disabled="licenseState === 'suspended'"
                  type="primary"
                  class="upgrade-btn"
                  @click="showModal = true"
                  >Upgrade</a-button
                >
                <!-- 新增：捐款按钮 -->
                <a-button
                  :disabled="licenseState === 'suspended'"
                  type="default"
                  class="donate-btn"
                  @click="handleDonate"
                  :loading="donateLoading"
                >
                  Donate $0.50
                </a-button>
              </div>
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
          <a-descriptions-item label="Status" :span="2">
            <a-badge :status="licenseState === 'active' ? 'success' : 'default'" :text="licenseState" />
            <a-button
              v-if="licenseState === 'suspended'"
              type="link"
              size="small"
              @click="resendEmail"
              :loading="resendingEmail"
              class="active-email-btn"
              style="margin-left: 8px;"
            >
              Please active your email
            </a-button>
          </a-descriptions-item>
          <a-descriptions-item label="License Code" :span="3">
            <div class="license-code-wrapper">
              <span class="license-code" @click="copyLicenseCode" :title="licenseCode">
                {{ truncatedLicenseCode }}
              </span>
              <a-button
                type="link"
                size="small"
                @click="copyLicenseCode"
                :icon="copyIcon"
                class="copy-btn"
                :disabled="licenseState === 'suspended'"
              >
                Copy
              </a-button>
              <a-button
                type="link"
                size="small"
                @click="updateLicenseCode"
                :loading="updating"
                class="update-btn"
                :disabled="licenseState === 'suspended'"
              >
                Update
              </a-button>
            </div>
          </a-descriptions-item>
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
        :open="showModal"
        title="Upgrade License"
        @ok="handleUpgrade"
        @cancel="showModal = false"
        width="1000px"
      >
        <div class="pricing-modal">
          <h2 class="pricing-title">Choose Your Pricing Plan</h2>

          <div class="coupon-section">
            <a-input
              v-model:value="couponCode"
              placeholder="Enter coupon code"
              allow-clear
              class="coupon-input"
              size="large"
            />
          </div>
          
          <div class="pricing-cards">
            <div
              v-for="plan in plans"
              :key="plan.type"
              class="pricing-card"
              :class="{
                active: upgradeType === plan.type,
                ['active-' + plan.type.toLowerCase()]: upgradeType === plan.type,
                disabled: isPlanDisabled(plan.type),
              }"
              :aria-disabled="isPlanDisabled(plan.type)"
              @click="selectPlan(plan.type)"
            >
              <div class="plan-title">{{ plan.title }}</div>
              <div class="plan-price">{{ plan.price }}</div>
              <div class="plan-duration">{{ plan.duration }}</div>
              <div class="plan-desc">{{ plan.desc }}</div>
              <div v-if="isPlanDisabled(plan.type)" class="plan-disabled-hint">已高于该等级</div>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </a-spin>
</template>

<script setup>
import { ref, computed, h, watch } from "vue";
import { useLicenseStore } from "@/store/license";
import { useAuthStore } from "@/store/auth";
import { postAction } from "@/services/api";
import { message } from "ant-design-vue";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons-vue";

const licenseStore = useLicenseStore();
const authStore = useAuthStore();

const PLAN_METADATA = [
  {
    type: "Trial",
    title: "Trial",
    duration: "3 Months",
    price: "$0",
    desc: "Free access to core features—perfect for trying AiforUs for the first time.",
  },
  {
    type: "Silver",
    title: "Silver",
    duration: "1 Year",
    price: "$199",
    desc: "Ideal for individuals and small teams with standard features and support.",
  },
  {
    type: "Gold",
    title: "Gold",
    duration: "3 Years",
    price: "$499",
    desc: "More resources and premium support to help growing businesses scale.",
  },
  {
    type: "Platinum",
    title: "Platinum",
    duration: "Forever",
    price: "$999",
    desc: "Enterprise-grade access to every advanced feature and exclusive services.",
  },
];

const PLAN_ORDER = PLAN_METADATA.map((plan) => plan.type);
const plans = PLAN_METADATA;

const showModal = ref(false);
const upgradeType = ref("");
const updating = ref(false);
const copyIcon = ref(h(CopyOutlined));
const couponCode = ref("");

// 新增：捐款状态
const donateLoading = ref(false);

const licenseType = computed(() => licenseStore.licenseType);
const licenseStart = computed(() => licenseStore.licenseStart);
const licenseExpire = computed(() => licenseStore.licenseExpire);
const licenseState = computed(() => licenseStore.licenseState);
const licenseCode = computed(() => licenseStore.licenseCode);

const loading = ref(false);

const getPlanIndex = (type) => PLAN_ORDER.indexOf(type);

const isPlanDisabled = (planType) => {
  const current = licenseType.value;
  if (!current) return false;
  const currentIdx = getPlanIndex(current);
  if (currentIdx === -1) return false;
  const planIdx = getPlanIndex(planType);
  if (planIdx === -1) return false;
  return planIdx < currentIdx;
};

const selectPlan = (planType) => {
  if (isPlanDisabled(planType)) return;
  upgradeType.value = planType;
};

const setDefaultUpgradeType = () => {
  const firstAvailable = PLAN_METADATA.find((plan) => !isPlanDisabled(plan.type));
  upgradeType.value = firstAvailable ? firstAvailable.type : PLAN_METADATA[PLAN_METADATA.length - 1].type;
};

watch(licenseType, setDefaultUpgradeType, { immediate: true });

// 当模态框关闭时清空优惠券代码
watch(showModal, (open) => {
  if (!open) {
    couponCode.value = "";
  }
});

// 截断显示的许可证代码
const truncatedLicenseCode = computed(() => {
  if (!licenseCode.value) return "";
  const code = licenseCode.value;
  if (code.length <= 20) return code;
  return `${code.substring(0, 10)}...${code.substring(code.length - 10)}`;
});

// 重新发送验证邮件
const resendEmail = async () => {
  loading.value = true;
  try {
    const response = await postAction("/users/resendVerificationEmailToken", { email: authStore.useremail });

    if (response.success) {
      message.success("Verification email resent successfully. Please check your inbox.");
    } else {
      throw new Error(response.message || "Failed to resend verification email");
    }
  } catch (error) {
    console.log("Error resending verification email:", error);
  } finally {
    loading.value = false;
  }
};

// 复制许可证代码
const copyLicenseCode = async () => {
  try {
    if(navigator.clipboard){
      await navigator.clipboard.writeText(licenseCode.value);
    } else {
      // 兼容不支持 Clipboard API 的浏览器
      const textArea = document.createElement("textarea");
      textArea.value = licenseCode.value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    copyIcon.value = h(CheckOutlined);
    message.success("License code copied to clipboard!");

    // 2秒后恢复复制图标
    setTimeout(() => {
      copyIcon.value = h(CopyOutlined);
    }, 2000);
  } catch (error) {
    console.error("Failed to copy:", error);
    message.error("Failed to copy license code");
  }
};

// 更新许可证代码
const updateLicenseCode = async () => {
  try {
    updating.value = true;

    // 调用API更新许可证代码
    const response = await postAction("/users/updateLicenseCode", {
      email: authStore.useremail,
    });

    if (response.success) {
      // 更新store中的许可证信息
      await licenseStore.getLicense(authStore.useremail);
      message.success("License code updated successfully!");
    } else {
      throw new Error(response.message || "Failed to update license code");
    }
  } catch (error) {
    console.error("Update license code error:", error);
    message.error("Failed to update license code");
  } finally {
    updating.value = false;
  }
};

async function handleUpgrade() {
  if (!upgradeType.value) {
    message.warning("Please select a plan to upgrade.");
    return;
  }
  if(upgradeType.value === "Trial"){
    message.info("Trial plan is free. No need to upgrade.");
    return;
  }
  try {
    // 显示加载状态
    const loadingKey = "upgradeLoading";
    message.loading({ content: "Processing payment...", key: loadingKey, duration: 0 });

    // 准备请求参数
    const params = {
      type: upgradeType.value,
      email: authStore.useremail, // 使用当前用户的邮箱
      // 添加成功和取消的回调URL
      successUrl: `${window.location.origin}/payment-success`,
      cancelUrl: `${window.location.origin}/payment-cancel`,
    };

    // 如果有优惠券代码，则添加到参数中
    if (couponCode.value && couponCode.value.trim()) {
      params.couponCode = couponCode.value.trim();
    }

    console.log(params);

    // 对于付费版本，创建 Stripe 结账会话
    const response = await postAction("/payment/create-checkout-session", params);

    if (response.success && response.data && response.data.url) {
      // 将会话ID存储在本地，以便支付成功后可以验证
      localStorage.setItem("stripeSessionId", response.data.sessionId);

      // 重定向到 Stripe 托管的结账页面
      window.location.href = response.data.url;
    } else {
      throw new Error(response.message || "Failed to create checkout session");
    }
  } catch (error) {
    console.error("Payment error:", error);
    // message.error({
    //   content: 'Payment processing failed. Please try again later.',
    //   key: 'upgradeLoading'
    // });
  }
}

// 新增：处理捐款逻辑（每次固定 0.01）
const handleDonate = async () => {
	if (!authStore.useremail) {
		message.error("User email not available");
		return;
	}
	try {
		const loadingKey = "donateLoading";
		message.loading({ content: "Processing donation...", key: loadingKey, duration: 0 });
		donateLoading.value = true;

		const params = {
			amount: 0.01,
			email: authStore.useremail,
			successUrl: `${window.location.origin}/donation-success`,
			cancelUrl: `${window.location.origin}/donation-cancel`,
		};

		// 调用后端创建捐款会话（参照 handleUpgrade 的接口风格）
		const response = await postAction("/payment/create-donation-session", params);

		if (response && response.success && response.data && response.data.url) {
			// 可选：存会话 id
			if (response.data.sessionId) {
				localStorage.setItem("stripeSessionId", response.data.sessionId);
			}
			// 跳转到托管的付款页面
			window.location.href = response.data.url;
		} else if (response && response.success) {
			// 如果后端直接返回成功，则感谢捐款
			message.success({ content: "Thank you for your donation!", key: loadingKey });
		} else {
			message.error({ content: response.message || "Failed to process donation", key: loadingKey });
		}
	} catch (error) {
		console.error("Donation error:", error);
		message.error("Donation processing failed. Please try again later.");
	} finally {
		donateLoading.value = false;
	}
};

// 格式化日期函数
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
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

/* 许可证代码样式更新 */
.license-code-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.license-code {
  font-family: "Courier New", monospace;
  background-color: #f7f7f7;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e1e1e1;
  min-width: 200px;
  user-select: none;
}

.license-code:hover {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  transform: translateY(-1px);
}

.copy-btn,
.update-btn {
  padding: 0 8px;
  height: 28px;
  font-size: 12px;
}

.copy-btn {
  color: #1890ff;
}

.copy-btn:hover {
  color: #40a9ff;
}

.update-btn {
  color: #52c41a;
}

.update-btn:hover {
  color: #73d13d;
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

.coupon-section {
  margin-bottom: 32px;
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.coupon-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.coupon-input {
  width: 100%;
}

.pricing-cards {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.pricing-card {
  width: 210px;
  height: 300px;
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

.plan-price {
  font-size: 28px;
  font-weight: 700;
  color: #101010;
}

.plan-duration {
  font-size: 16px;
  color: #555;
  margin-top: 12px;
}

.plan-desc {
  font-size: 15px;
  color: #666;
  margin-top: 16px;
  text-align: center;
  line-height: 1.6;
}

.pricing-card.disabled {
  cursor: not-allowed;
  opacity: 0.45;
  box-shadow: none;
  border-color: #d9d9d9;
  background-color: #f5f5f5;
}

.pricing-card.disabled:hover {
  transform: none;
  box-shadow: none;
}

.plan-disabled-hint {
  margin-top: 12px;
  font-size: 13px;
  color: #8c8c8c;
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

/* 新增：捐款按钮样式，与 Upgrade 按钮协调 */
.title-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.donate-btn {
	border-radius: 6px;
	padding: 0 12px;
	height: 36px;
	color: #fa8c16;
	border-color: #ffd591;
	background: linear-gradient(180deg, #fff 0%, #fff 100%);
	box-shadow: none;
}

.donate-btn:hover {
	color: #ffa940;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .license-code-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .license-code {
    min-width: 100%;
  }
}
</style>
