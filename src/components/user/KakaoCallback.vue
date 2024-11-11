<template>
    <div>카카오 로그인 처리중...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/api.js';
import Cookies from 'js-cookie';

const router = useRouter();
const route = useRoute();

onMounted(async () => {
    const code = route.query.code;
    
    if (!code) {
        console.error('인증 코드가 없습니다.');
        router.push('/login');
        return;
    }

    try {
        const response = await api.apiClient.get(`/users/auth/kakao/callback?code=${code}`);
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
                router.push('/chat/roomList');
            } else {
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
        router.push('/login');
    }
});
</script>