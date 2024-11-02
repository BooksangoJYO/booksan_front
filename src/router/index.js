import { createRouter, createWebHistory } from 'vue-router';
import Book from '@/components/board/BookSearch.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        //{ path: '/', component: Main },
        { path: '/book', component: Book},
    ]
});

export default router;