import { defineStore } from 'pinia'
import { getAction } from '@/services/api'

export const useLicenseStore = defineStore('license',  {
  state: () => ({
    licenseType: null,
    licenseStart: null,
    licenseExpire: null,
    licenseState: null,
  }),
  actions: {
    async getLicense(email) {
      // 假设 data 是从后端获取的许可证信
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
    },
  },
})