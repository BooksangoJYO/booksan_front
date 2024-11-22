import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/board': {
        target: 'http://localhost:8090',
        changeOrigin: true, // 추가
    secure: false, // 요청을 보낼 프록시 서버 URL
      },
      '/api/books': {
        target: 'http://localhost:8090',
        changeOrigin: true, // 추가
    secure: false, // 요청을 보낼 프록시 서버 URL
      },
      '/api/chat': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 추가
    secure: false, // 요청을 보낼 프록시 서버 URL
      },
      '/api/users': {
        target: 'http://localhost:8081',
        changeOrigin: true, // 추가
    secure: false, // 요청을 보낼 프록시 서버 URL

      },
      '/api/admin': {
        target: 'http://localhost:8081',
        changeOrigin: true, // 추가
    secure: false, // 요청을 보낼 프록시 서버 URL
      },
      '/ws-stomp': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 추가
    secure: false,
        ws: true
      },
      '/pub': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 추가
    secure: false,
        ws: true
      },
      '/sub': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 추가
    secure: false,
        ws: true
      }
    },
    
  },

  define: {
    global: 'window'
  },
})
