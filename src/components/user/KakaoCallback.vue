<template>
    <div class="loading-spinner">
        <p>Loading...</p>
    </div>
</template>

<script setup>
// import axios from 'axios';
import api from '@/api/api';
import { useMainStore } from '@/store/mainStore';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const store = useMainStore();
const {doLogin} = store;
const isLoading = ref(true);

onMounted(async () => {
    const code = route.query.code;
    
    if (!code) {
        console.error('인증 코드가 없습니다.');
        router.push('/login');
        return;
    }

    try {
        const response = await api.handleKakaoCallback(code);
        const responseData = response.data;
        
        if (responseData.status === 'success') {
            if (responseData.type === 'existing') {
                Cookies.set('accessToken', responseData.accessToken, { 
                    httpOnly: false, 
                    secure: true 
                });
                Cookies.set('refreshToken', responseData.refreshToken, { 
                    httpOnly: false, 
                    secure: true
                });
                doLogin();
                router.replace('/');
                //그전 url이 있으면 전페이지로 이동, 없으면 메인페이지
            } else if(responseData.type === 'new'){
                // 신규 회원이거나 탈퇴했던 회원인 경우
                router.push({
                    path: '/signup',
                    query: {
                        email: responseData.email,
                        code: responseData.kakaoId
                    }
                });
            }
        } else {
            throw new Error(responseData.message || '로그인 실패');
        }
    } catch (error) {
        console.error('로그인 처리 실패:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
        router.push('/login');
    }
});
</script>

<style scoped>
/* 스피너 커스텀 스타일 */
.loading-spinner {
   position: fixed;
   top: 20px;  
   left: 20px; 
   width: 60px;  /* 크기 키움 */
   height: 60px;
   border: 4px solid #f3f3f3;
   border-top: 4px solid #8B4513;
   border-radius: 50%;
   animation: spin 1s linear infinite;
   display: flex;
   justify-content: center;
   align-items: center;
}

p {
    margin: 0;
    font-size: 12px;
    color: #8B4513;
}
</style>