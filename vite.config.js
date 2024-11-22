import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
 // 개발 환경과 프로덕션 환경 구분
 const env = loadEnv(mode, process.cwd());
 
 return {
   plugins: [vue()],
   resolve: {
     alias: {
       '@': fileURLToPath(new URL('./src', import.meta.url)),
     },
   },
   
   define: {
     global: 'window',
   },
 };
});
