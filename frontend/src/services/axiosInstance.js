import axios from 'axios'
import setupInterceptors from './interceptors'

// Determine API base URL
// const isProduction = process.env.NODE_ENV === "production";
// const API_BASE_URL = isProduction
//   ? "http://127.0.0.1:3001/api" // Replace with your actual backend URL
//   : "/api"; // Development uses Vite proxy
const API_BASE_URL = "http://localhost:3001/api" // http://198.98.55.71/3001/api

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // 后端接口的基础 URL
  timeout: 180000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})
// 应用拦截器
setupInterceptors(axiosInstance)

// 导出实例
export default axiosInstance
