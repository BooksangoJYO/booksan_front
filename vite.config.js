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
        target: 'http://localhost:8090', // 요청을 보낼 프록시 서버 URL
      },
      '/api/books': {
        target: 'http://localhost:8090', // 요청을 보낼 프록시 서버 URL
      },
      '/api/chat': {
        target: 'http://192.168.0.21:8190', // 요청을 보낼 프록시 서버 URL
      },
      '/api/users': {
        target: 'http://192.168.0.15:8081', // 요청을 보낼 프록시 서버 URL

      },
      '/ws-stomp': {
        target: 'http://192.168.0.21:8190',
        ws: true
      },
      '/pub': {
        target: 'http://192.168.0.21:8190',
        ws: true
      },
      '/sub': {
        target: 'http://192.168.0.21:8190',
        ws: true
      }
    },
    
  },

  define: {
    global: 'window'
  },
})
