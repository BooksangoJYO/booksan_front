import Book from '@/components/board/BookSearch.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import ChatRoomList from '@/components/ChatRoomList.vue';
import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        //{ path: '/', component: Main },
        { path: '/book', component: Book},
        {path:'/chat/roomList',component : ChatRoomList},
        {path: '/chat/room/enter/:roomId',component: ChatRoom}
    ]
});

export default router;