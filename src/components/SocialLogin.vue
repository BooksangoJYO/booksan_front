<template>
    <div>
        <h1>소셜 로그인</h1>
        <!-- 카카오 로그인 버튼 -->
        <a id="kakao-login-btn" href="javascript:void(0)" @click="loginWithKakao">
            <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="222" alt="카카오 로그인 버튼" />
        </a>
        <p id="token-result"></p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import apiClient from '../api/api.js'; // api.js를 import합니다.

onMounted(() => {
    // 카카오 SDK 로드
    const script = document.createElement('script');
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.onload = () => {
        Kakao.init('6bb3f52a25bbfb92948bdfd34ce91137'); // 카카오 앱의 JavaScript 키
    };
    document.head.appendChild(script);
});

// 카카오 로그인 함수
function loginWithKakao() {
    Kakao.Auth.authorize({
        redirectUri: 'http://localhost:8081/api/users/auth/kakao/callback', // 본인 서버의 콜백 URL
    });
}

// 로그인 상태를 표시하고 서버에 토큰을 전송하는 함수
async function displayToken() {
    const token = getCookie('authorize-access-token');

    if (token) {
        Kakao.Auth.setAccessToken(token);
        const res = await Kakao.Auth.getStatusInfo();
        if (res.status === 'connected') {
            document.getElementById('token-result').innerText = '로그인 성공, 토큰: ' + Kakao.Auth.getAccessToken();
            sendTokenToServer(Kakao.Auth.getAccessToken()); // 토큰을 서버에 전송
        }
    }
}

// 서버에 토큰을 전송하는 함수
async function sendTokenToServer(token) {
    try {
        const response = await apiClient.post('/api/users/auth/socialLogin', { uid: token }); // 실제 API 경로로 수정
        console.log('서버 응답:', response.data);
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
}

// 쿠키를 가져오는 함수
function getCookie(name) {
    const parts = document.cookie.split(name + '=');
    if (parts.length === 2) { return parts[1].split(';')[0]; }
}
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>