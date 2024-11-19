
import Main from '@/components/Home.vue';
import BoardInsert from '@/components/board/BoardInsert.vue';
import BoardList from '@/components/board/BoardList.vue';
import BoardRead from '@/components/board/BoardRead.vue';
import BoardUpdate from '@/components/board/BoardUpdate.vue';
import BookDetail from '@/components/board/BookDetail.vue';
import BookListSearch from '@/components/board/BookListSearch.vue';
import KakaoCallback from '@/components/user/KakaoCallback.vue';
import SocialLogin from '@/components/user/SocialLoginModal.vue';
import SocialSignup from '@/components/user/SocialSignup.vue';
import BookMarkBooks from '@/components/user/mypage/BookMarkBooks.vue';
import Bookmarks from '@/components/user/mypage/Bookmarks.vue';
import MyPost from '@/components/user/mypage/MyPost.vue';
import Mypage from '@/components/user/mypage/index.vue';
import Chatting from '@/pages/chat/Chatting.vue';
import MainChatting from '@/pages/chat/MainChatting.vue';
import { useMainStore } from '@/store/mainStore';
import { createRouter, createWebHistory } from 'vue-router';

const loginGuard = (to,from,next) =>{
    const store = useMainStore();
    let isAuthenticated = false;
    store.doLogin();
    if(store.loginInfo?.email){
        isAuthenticated = true;
    }
    if (!isAuthenticated) {
        next({
            path: '/login/',
            });
    } else {
        next();
    }
}

const loginGuardForChat = (to,from,next) =>{
    const store = useMainStore();
    let isAuthenticated = false;
    store.doLogin();
    if(store.loginInfo?.email){
        isAuthenticated = true;
    }
    if (!isAuthenticated) {
        window.close();
    } else {
        next();
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Main },
        { path: '/login', name: 'login', component: SocialLogin },
        { path: '/signup', name: 'signup', component: SocialSignup },
        { path: '/mypage', name: 'mypage', component: Mypage,
         beforeEnter: (to, from, next) => {
                loginGuard(to,from,next);
            }},
        { path: '/mypage/bookmarks', name: 'bookmarks', component: Bookmarks,
         beforeEnter: (to, from, next) => {
                loginGuard(to,from,next);
            }},
        { path: '/mypage/myposts', name: 'mypost', component: MyPost,
         beforeEnter: (to, from, next) => {
                loginGuard(to,from,next);
            }},
        { path: '/mypage/bookmarkbooks', name: 'bookmarkbooks', component: BookMarkBooks ,
            beforeEnter: (to, from, next) => {
                    loginGuard(to,from,next);
                }},
        { path: '/auth/kakao/callback', name: 'KakaoCallback', component: KakaoCallback },
        { path: '/board/insert', component: BoardInsert,
            beforeEnter: (to, from, next) => {
                loginGuard(to,from,next);
            }
        },
        { path: '/board/list', component: BoardList},
        { path: '/board/read/:dealId', component: BoardRead},
        { path: '/board/update/:dealId', component: BoardUpdate,
            beforeEnter: (to, from, next) => {
                loginGuard(to,from,next);
            }
        },
        { path: '/book/list', component: BookListSearch},
        { path: '/book/detail/:isbn', component: BookDetail},
        {path: '/chat/room/:dealId?',component: Chatting,
            beforeEnter: (to, from, next) => {
                loginGuardForChat(to,from,next);
            }
        },
        {path: '/main/chatPage',component:MainChatting,
            beforeEnter: (to, from, next) => {
                loginGuard(to,from,next);
            }
        },        
    ]
});

export default router;