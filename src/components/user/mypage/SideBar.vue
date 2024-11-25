<template>
<div class="col-md-3">
    <div class="card border-0">
        <div class="card-body">
            <nav class="nav flex-column">
                <router-link class="nav-link" :class="{ 'active': $route.path === '/mypage' }" to="/mypage">프로필 정보</router-link>
                <router-link class="nav-link" :class="{ 'active': $route.path === '/mypage/bookmarkbooks' }" to="/mypage/bookmarkbooks">알림 설정 도서</router-link>
                <router-link class="nav-link" :class="{ 'active': $route.path === '/mypage/bookmarks' }" to="/mypage/bookmarks">책갈피한 가판대</router-link>
                <router-link class="nav-link" :class="{ 'active': $route.path === '/mypage/myposts' }" to="/mypage/myposts">나의 판매 가판대</router-link>
            </nav>
        </div>
    </div>
</div>
</template>

<style scoped>
.nav-link {
    color: #6c757d;  /* 기본 색상 (text-secondary) */
    transition: all 0.3s ease;  /* 부드러운 전환 효과 */
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

.nav-link:hover {
    color: #8B4513;  /* 호버시 색상 */
    background-color: rgba(139, 69, 19, 0.1);  /* 호버시 배경색 */
}

.nav-link.active {
    color: #8B4513 !important;  /* 선택된 상태 색상 */
    background-color: rgba(139, 69, 19, 0.1);  /* 선택된 상태 배경색 */
    font-weight: 600;  /* 선택된 상태 폰트 두께 */
}


</style>