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
        target: 'http://13.125.214.144:8080', // 요청을 보낼 프록시 서버 URL
      },
      '/api/books': {
        target: 'http://13.125.214.144:8080', // 요청을 보낼 프록시 서버 URL
      },
      '/api/chat': {
        target: 'http://3.39.238.25:8080', // 요청을 보낼 프록시 서버 URL
      },
      '/api/users': {
        target: 'http://3.38.92.146:8080', // 요청을 보낼 프록시 서버 URL

      },
      '/ws-stomp': {
        target: 'http://3.39.238.25:8080',
        ws: true
      },
      '/pub': {
        target: 'http://3.39.238.25:8080',
        ws: true
      },
      '/sub': {
        target: 'http://3.39.238.25:8080',
        ws: true
      }
    },
    
  },

  define: {
    global: 'window'
  },
})
