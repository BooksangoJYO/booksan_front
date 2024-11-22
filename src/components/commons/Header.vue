<template>
    <header class="header">
        <div class="header-left">
            <RouterLink to="/" class="logo" @click="reset">
                <img :src="logoIcon" alt="알림" class="logo-image">
            </RouterLink>
            <nav class="nav-links">
                <RouterLink to="/board/list" class="nav-link" @click="reset">가판대 찾기</RouterLink>
                <RouterLink to="/book/list" class="nav-link" @click="reset">도서 검색</RouterLink>
            </nav>
        </div>
        <LoginContainer/>
    </header>
</template>

<script setup>
import logoIcon from '@/assets/images/logo.png';
import LoginContainer from './LoginContainer.vue';
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';

const store = useMainStore();
const {keyword,paginationData} =storeToRefs(store);
//중고책 찾기 누르면 키워드랑 페이지네이션 초기화
const reset = () => {
  keyword.value = ''; //키워드 초기화
  paginationData.value.page = 1; //페이지 초기화
  fetchBoardList(); //게시글 목록 갱신
};

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
    height: 35px;
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