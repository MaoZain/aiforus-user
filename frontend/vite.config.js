import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  // assetsInclude: ['**/*.PNG'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 根据你的 Vue 源码目录调整路径
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 允许使用 Less 的动态特性
        modifyVars: {
          // 如果使用 Ant Design Vue，可以覆盖默认样式变量
          'primary-color': '#1DA57A' // 主色
        }
      }
    }
  },
  server: {
    port: 3000, // 开发服务器端口
    open: true, // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // 后端服务地址 http://198.98.55.71:3001
        changeOrigin: true, // 支持跨域
        rewrite: (path) => path.replace(/^\/api/, 'api') // 去掉 /api 前缀
      }
    }
  },
  base: '/', // 确保资源路径正确
  build: {
    outDir: 'dist' // 输出目录
  },
  publicDir: 'public',  // 默认是 public 文件夹
})
