import Book from '@/components/board/BookSearch.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import ChatRoomList from '@/components/ChatRoomList.vue';
import { createRouter, createWebHistory } from 'vue-router';
import SocialLogin from '@/components/user/SocialLogin.vue';
import SocialSignup from '@/components/user/SocialSignup.vue';
import LogoutTest from '@/components/user/LogoutTest.vue';
import ProfileInfo from '@/components/user/mypage/ProfileInfo.vue';
import Mypage from '@/components/user/mypage/index.vue';
import KakaoCallback from '@/components/user/KakaoCallback.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        //{ path: '/', component: Main },
        { path: '/login', name: 'login', component: SocialLogin },
        { path: '/signup', name: 'signup', component: SocialSignup },
        { path: '/logout', name: 'LogoutTest', component: LogoutTest },
        { path: '/mypage', name: 'mypage', component: Mypage },
        { path: '/profileInfo', name: 'profileInfo', component: ProfileInfo },
        { path: '/auth/kakao/callback', name: 'KakaoCallback', component: KakaoCallback },
        { path: '/book', component: Book },
        { path:'/chat/roomList',component : ChatRoomList },
        { path: '/chat/room/enter/:roomId',component: ChatRoom }
    ]
});

export default router;