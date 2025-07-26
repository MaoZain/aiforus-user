import { message } from "ant-design-vue"

const setupInterceptors = (axiosInstance) => {
  // 请求拦截器
  axiosInstance.interceptors.request.use(
    (config) => {
      // 在发送请求之前，可以添加认证 token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = token
      }
      return config
    },
    (error) => {
      // 处理请求错误
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      // 对响应数据进行处理
      return response.data
    },
    (error) => {
      // 统一处理错误，如弹窗提示
      console.error('API Error:', error.response?.data)
      message.error(
        error.response?.data?.error.message || 'faild'
      )
      return Promise.reject(error.response?.data.error)
    }
  )
}

export default setupInterceptors
