import { defineStore } from 'pinia'
import { getAction } from '@/services/api'

export const useLicenseStore = defineStore('license', {
  state: () => ({
    licenseType: null,
    licenseStart: null,
    licenseExpire: null,
    licenseState: null,
    licenseCode: null,
  }),
  actions: {
    async getLicense(email) {
      // 从后端获取许可证信息
      const response = await getAction(`/users/licenseInfo/${email}`)
      if (!response || !response.data) {
        throw new Error('Failed to fetch license data')
      }
      const { licenseType, licenseStart, licenseExpire, licenseState, licenseCode } = response.data
      this.licenseType = licenseType
      this.licenseStart = licenseStart
      this.licenseExpire = licenseExpire
      this.licenseState = licenseState
      this.licenseCode = licenseCode

      // 持久化许可证数据
      localStorage.setItem(
        'licenseData',
        JSON.stringify({ licenseType, licenseStart, licenseExpire, licenseState, licenseCode })
      )
    },
    restoreLicense() {
      // 从 localStorage 恢复许可证数据
      const licenseData = localStorage.getItem('licenseData')
      if (licenseData) {
        const { licenseType, licenseStart, licenseExpire, licenseState, licenseCode } = JSON.parse(licenseData)
        this.licenseType = licenseType
        this.licenseStart = licenseStart
        this.licenseExpire = licenseExpire
        this.licenseState = licenseState
        this.licenseCode = licenseCode
      }
    },
    clearLicense() {
      // 清除状态和持久化数据
      this.licenseType = null
      this.licenseStart = null
      this.licenseExpire = null
      this.licenseState = null
      this.licenseCode = null
      localStorage.removeItem('licenseData')
    },
  },
})