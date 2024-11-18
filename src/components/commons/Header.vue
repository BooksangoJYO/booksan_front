<template>
    <header class="header">
        <div class="header-left">
            <RouterLink to="/" class="logo">
                <img :src="logoIcon" alt="알림" class="logo-image">
            </RouterLink>
            <nav class="nav-links">
                <RouterLink to="/board/list" class="nav-link">중고책 찾기</RouterLink>
                <RouterLink to="/board/list" class="nav-link">도서 검색</RouterLink>
            </nav>
        </div>
        <LoginContainer/>
    </header>
</template>

<script setup>
import logoIcon from '@/assets/images/logo.png';
import LoginContainer from './LoginContainer.vue';


</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    border-bottom: 1px solid #e5e5e5;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.logo-image {
    height: 30px;
    width: auto;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
}

.nav-link {
    color: #333;
    text-decoration: none;
    font-weight: 500;
}

.nav-link:hover {
    color: #666;
}
</style>