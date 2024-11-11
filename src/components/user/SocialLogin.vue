<template>
    <div>
        <h1>소셜 로그인</h1>
        <a id="kakao-login-btn" @click="handleKakaoLogin">
            <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" 
                 width="222" 
                 alt="카카오 로그인 버튼" />
        </a>
    </div>
</template>

<script setup>
const handleKakaoLogin = () => {
  window.location.href = '/api/users/auth/kakao/login';
};
</script>

<style scoped>

</style>