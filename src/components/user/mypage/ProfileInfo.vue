<!-- ProfileInfo.vue (프로필 수정) -->
<template>
    <div>
        <h2>프로필 수정</h2>
        <form @submit.prevent="handleUpdate">
        <div>
            <label>닉네임</label>
            <input type="text" v-model="nickname" />
        </div>
        <button type="submit">수정하기</button>
        <button type="button" @click="goBack">취소</button>
        </form>
    </div>
</template>
   
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/api';

const router = useRouter();
const nickname = ref('');

onMounted(async () => {
try {
    const response = await api.get('/users/mypage');
    nickname.value = response.data.nickname;
} catch (error) {
    console.error('사용자 정보 조회 실패:', error);
}
});

const handleUpdate = async () => {
try {
    const response = await api.post('/users/update', {
    nickname: nickname.value
    });
    if(response.data.status === 'success') {
    alert('수정이 완료되었습니다.');
    router.push('/mypage');
    }
} catch (error) {
    console.error('프로필 수정 실패:', error);
    alert('프로필 수정에 실패했습니다.');
}
};

const goBack = () => {
router.push('/mypage');
};
</script>