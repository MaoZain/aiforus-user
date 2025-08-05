<template>
  <div class="download-page">
    <a-layout>
      <a-layout-content>
        <a-card class="download-container">
          <a-typography-title :level="2" style="text-align: center"> AIforUs Download Center </a-typography-title>

          <a-typography-paragraph class="description">
            Welcome to download AIforUs application and start your AI journey.
          </a-typography-paragraph>

          <div class="platform-selector">
            <a-radio-group v-model:value="selectedPlatform" button-style="solid">
              <a-radio-button value="mac">
                <span class="platform-icon">
                  <apple-outlined  style="font-size: 20px;" />
                </span>
                <span style="font-size: 16px;">macOS</span>
              </a-radio-button>
              <a-radio-button value="windows">
                <span class="platform-icon">
                  <windows-outlined  style="font-size: 20px;"/>
                </span>
                <span style="font-size: 16px;">windows</span>
              </a-radio-button>
            </a-radio-group>
          </div>

          <a-row v-if="selectedPlatform === 'mac'" class="download-section">
            <a-col :span="24">
              <a-card class="download-card">
                <a-row :gutter="24">
                  <a-col :xs="24" :md="12" class="download-info">
                    <a-typography-title :level="3"> AIforUs Desktop App for macOS </a-typography-title>

                    <a-descriptions :column="1">
                      <a-descriptions-item label="Version">{{ macVersion }}</a-descriptions-item>
                      <a-descriptions-item label="Platform">macOS</a-descriptions-item>
                      <a-descriptions-item label="File Size">{{ macFileSize }}</a-descriptions-item>
                      <a-descriptions-item label="Last Updated">{{ macUpdateDate }}</a-descriptions-item>
                    </a-descriptions>
                  </a-col>

                  <a-col :xs="24" :md="12" class="download-actions">
                    <a-button
                      type="primary"
                      size="large"
                      block
                      href="/download/AIforUs.dmg"
                      @click="trackDownload('mac')"
                    >
                      <template #icon>
                        <DownloadOutlined style="font-size: 22px;"  />
                      </template>
                      <span style="font-size: 18px;">Download for macOS</span>
                      
                    </a-button>

                    <a-card title="System Requirements" class="system-requirements">
                      <a-list size="small">
                        <a-list-item>macOS</a-list-item>
                        <!-- <a-list-item>4GB RAM or more</a-list-item> -->
                        <a-list-item>4GB available disk space</a-list-item>
                      </a-list>
                    </a-card>
                  </a-col>
                </a-row>
              </a-card>
            </a-col>
          </a-row>

          <a-row v-if="selectedPlatform === 'windows'" class="download-section">
            <a-col :span="24">
              <a-card class="download-card">
                <a-row :gutter="24">
                  <a-col :xs="24" :md="12" class="download-info">
                    <a-typography-title :level="3"> AIforUs Desktop App for Windows </a-typography-title>

                    <a-descriptions :column="1">
                      <a-descriptions-item label="Version">{{ windowsVersion }}</a-descriptions-item>
                      <a-descriptions-item label="Platform">Windows</a-descriptions-item>
                      <a-descriptions-item label="File Size">{{ windowsFileSize }}</a-descriptions-item>
                      <a-descriptions-item label="Last Updated">{{ windowsUpdateDate }}</a-descriptions-item>
                    </a-descriptions>
                  </a-col>

                  <a-col :xs="24" :md="12" class="download-actions">
                    <a-button
                      type="primary"
                      size="large"
                      block
                      href="/download/AIforUs-setup.exe"
                      @click="trackDownload('windows')"
                    >
                      <template #icon>
                        <DownloadOutlined style="font-size: 22px;"  />
                      </template>
                      Download for Windows
                    </a-button>

                    <a-card title="System Requirements" class="system-requirements">
                      <a-list size="small">
                        <a-list-item>Windows 10 or later</a-list-item>
                        <a-list-item>4GB RAM or more</a-list-item>
                        <a-list-item>1GB available disk space</a-list-item>
                        <a-list-item>.NET Framework 4.7.2 or later</a-list-item>
                      </a-list>
                    </a-card>
                  </a-col>
                </a-row>
              </a-card>
            </a-col>
          </a-row>

          <a-divider />

          <a-row class="installation-guide">
            <a-col :span="24">
              <a-typography-title :level="3"> Installation Guide </a-typography-title>

              <div v-if="selectedPlatform === 'mac'">
                <a-steps direction="vertical" :current="-1">
                  <a-step title="Download the DMG file" />
                  <a-step title="Double-click to open the DMG file" />
                  <a-step title="Drag the application to your Applications folder" />
                  <a-step title="Launch the application from your Applications folder" />
                </a-steps>
              </div>

              <div v-if="selectedPlatform === 'windows'">
                <a-steps direction="vertical" :current="-1">
                  <a-step title="Download the EXE installer file" />
                  <a-step title="Double-click the installer to run it" />
                  <a-step title="Follow the installation wizard instructions" />
                  <a-step title="Launch AIforUs from your Start menu or desktop shortcut" />
                </a-steps>
              </div>
            </a-col>
          </a-row>

          <a-divider />

          <a-row class="questions">
            <a-col :span="24">
              <a-typography-title :level="3"> Having Issues? </a-typography-title>

              <a-alert
                message="If you encounter any problems during download or installation, please contact our support team."
                type="info"
                show-icon
              />

              <a-button type="link" href="mailto:support@AIforUs.com" class="support-link">
                <template #icon>
                  <MailOutlined />
                </template>
                Support Email: support@AIforUs.com
              </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { DownloadOutlined, AppleOutlined, WindowsOutlined, MailOutlined } from "@ant-design/icons-vue";

const selectedPlatform = ref("mac");

// macOS version info
const macVersion = ref("1.0.0");
const macFileSize = ref("3.3GB");
const macUpdateDate = ref("August 01, 2025");

// Windows version info
const windowsVersion = ref("1.0.0");
const windowsFileSize = ref("3.3GB");
const windowsUpdateDate = ref("August 01, 2025");

function trackDownload(platform) {
  // Add download tracking logic here
  console.log(`Download started for ${platform}`);
  // If you have analytics tools like Google Analytics, you can add event tracking here
  // analytics.trackEvent('download', platform, platform === 'mac' ? macVersion.value : windowsVersion.value);
}

onMounted(() => {
  // Auto-detect platform
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("windows")) {
    selectedPlatform.value = "windows";
  } else if (userAgent.includes("mac")) {
    selectedPlatform.value = "mac";
  }

  // Here you can fetch the latest version information from API
  // Example:
  // const fetchVersionInfo = async () => {
  //   try {
  //     const response = await fetch('/api/version-info');
  //     const data = await response.json();
  //     macVersion.value = data.macVersion;
  //     macFileSize.value = data.macSize;
  //     macUpdateDate.value = data.macDate;
  //     windowsVersion.value = data.windowsVersion;
  //     windowsFileSize.value = data.windowsSize;
  //     windowsUpdateDate.value = data.windowsDate;
  //   } catch (error) {
  //     console.error('Failed to fetch version info', error);
  //   }
  // };
  // fetchVersionInfo();
});
</script>

<style scoped>
.download-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 40px 20px;
}

.download-container {
  max-width: 900px;
  margin: 0 auto;
}

.description {
  text-align: center;
  margin-bottom: 32px;
  font-size: 16px;
}

.platform-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.platform-icon {
  margin-right: 8px;
}

.download-section {
  margin-bottom: 32px;
}

.download-card {
  background-color: #fafafa;
}

.download-info {
  margin-bottom: 24px;
}

.download-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.system-requirements {
  margin-top: 16px;
}

.installation-guide,
.questions {
  margin-top: 32px;
  margin-bottom: 32px;
}

.support-link {
  margin-top: 16px;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .download-container {
    padding: 24px 16px;
  }
}
</style>
