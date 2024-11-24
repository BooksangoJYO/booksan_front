import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const pinia = createPinia();
const app = createApp(App);

if (process.env.NODE_ENV === 'production') {
    console.log = () => {}
    console.warn = () => {}
    console.error = () => {}
}
  
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(pinia);
app.mount('#app');

