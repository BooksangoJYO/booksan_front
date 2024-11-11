<template>
    <div>
        <h1>로그아웃 테스트 페이지</h1>
        <button @click="handleLogout">로그아웃</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import auth from '../../api/auth';

const router = useRouter();

const handleLogout = async () => {
    try {
        // 서버 로그아웃 호출 (서버에서 쿠키 삭제)
        await auth.logout();
        
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push('/login');
        alert('로그아웃 되었습니다.');
    } catch (error) {
        console.error('로그아웃 실패:', error);
    }
};

</script>