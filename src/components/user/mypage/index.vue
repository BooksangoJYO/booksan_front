<template>
    <div>
        <h2>마이페이지</h2>
        <div v-if="userInfo">
            <p>이메일: {{ userInfo.email }}</p>
            <p>닉네임: {{ userInfo.nickname }}</p>
            <button @click="deleteAccount">회원 탈퇴</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/api.js';  // api로 직접 시도

const router = useRouter();
const userInfo = ref(null);

onMounted(async () => {
    try {
        const response = await api.apiClient.get('/users/mypage');
        userInfo.value = response.data;
        console.log('사용자 정보:', userInfo.value);
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        console.log('에러 상세:', error.response);  // 에러 상세 정보 확인
    }
});

const deleteAccount = async () => {
    if(confirm('정말 탈퇴하시겠습니까?')) {
        try {
            await api.apiClient.post('/users/delete', {
                email: userInfo.value.email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            alert('탈퇴가 완료되었습니다.');
            router.push('/login');
        } catch (error) {
            console.error('회원탈퇴 실패:', error);
            alert('회원탈퇴에 실패했습니다.');
        }
    }
};
</script>