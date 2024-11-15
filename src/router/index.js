
import Main from '@/components/Home.vue';
import BoardInsert from '@/components/board/BoardInsert.vue';
import BoardList from '@/components/board/BoardList.vue';
import BoardRead from '@/components/board/BoardRead.vue';
import BoardUpdate from '@/components/board/BoardUpdate.vue';
import KakaoCallback from '@/components/user/KakaoCallback.vue';
import LogoutTest from '@/components/user/LogoutTest.vue';
import SocialLogin from '@/components/user/SocialLogin.vue';
import SocialSignup from '@/components/user/SocialSignup.vue';
import ProfileInfo from '@/components/user/mypage/ProfileInfo.vue';
import Chatting from '@/pages/chat/Chatting.vue';
import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Main },
        { path: '/login', name: 'login', component: SocialLogin },
        { path: '/signup', name: 'signup', component: SocialSignup },
        { path: '/logout', name: 'LogoutTest', component: LogoutTest },
        // { path: '/mypage', name: 'mypage', component: Mypage },
        { path: '/profileInfo', name: 'profileInfo', component: ProfileInfo },
        { path: '/auth/kakao/callback', name: 'KakaoCallback', component: KakaoCallback },
        { path: '/board/insert', component: BoardInsert},
        { path: '/board/list', component: BoardList},
        { path: '/board/read/:dealId', component: BoardRead},
        { path: '/board/update/:dealId', component: BoardUpdate},
        {path: '/chat/room',component: Chatting}


    ]
});

export default router;