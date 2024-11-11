
import BoardInsert from '@/components/board/BoardInsert.vue';
import ChatRoom from '@/components/chat/ChatRoom.vue';
import ChatRoomList from '@/components/chat/ChatRoomList.vue';
import BoardList from '@/components/board/BoardList.vue';
import BoardRead from '@/components/board/BoardRead.vue';
import BoardUpdate from '@/components/board/BoardUpdate.vue';
import { createRouter, createWebHistory } from 'vue-router';
import SocialLogin from '../components/SocialLogin.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        //{ path: '/', component: Main },
        { path: '/login', component: SocialLogin  },
        { path: '/board/insert', component: BoardInsert},
        { path: '/board/list', component: BoardList},
        { path: '/board/read/:dealId', component: BoardRead},
        { path: '/board/update/:dealId', component: BoardUpdate},
        {path:'/chat/roomList',component : ChatRoomList},
        {path: '/chat/room/enter/:roomId',component: ChatRoom}
    ]
});

export default router;