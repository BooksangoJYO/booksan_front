<template>
    <div class="container mt-5">
        <h2 class="mb-4">마이페이지</h2>
        <div class="row" v-if="userInfo">
            <!-- 사이드바 -->
            <div class="col-md-3">
                <div class="card border-0">
                    <div class="card-body">
                        <h3 class="card-title mb-4">나의 정보</h3>
                        <nav class="nav flex-column">
                            <router-link class="nav-link text-secondary" to="/mypage">프로필</router-link>
                            <router-link class="nav-link text-secondary" to="/mypage/bookmarks">북마크</router-link>
                            <router-link class="nav-link text-secondary" to="/mypage/posts">내가 작성한 글</router-link>
                        </nav>
                    </div>
                </div>
            </div>

            <!-- 메인 컨텐츠 -->
            <div class="col-md-9">
                <div class="card mb-4 border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3 class="m-0">내가 작성한 글</h3>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="showOnlySoldOut" id="soldOutCheck" @change="filterPosts">
                                <label class="form-check-label" for="soldOutCheck">
                                    판매 중인것만 보기
                                </label>
                            </div>
                        </div>

                        <div class="posts-list">
                            <div v-for="board in filteredPosts" :key="board.id" 
                                class="post-item card border-0 shadow-sm mb-3"
                                @click="goToDetail(board.id)">
                                <div class="card-body d-flex align-items-center">
                                    <img :src="board.image_url || '/default-book.jpg'" :alt="board.title" 
                                        class="book-cover me-3" 
                                        style="width: 80px; height: 80px; object-fit: cover;">
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="text-muted small">{{ formatDate(board.created_at) }}</span>
                                            <span class="badge" :class="board.is_sold ? 'bg-secondary' : 'bg-custom-brown'">
                                                {{ board.is_sold ? '판매완료' : '판매중' }}
                                            </span>
                                        </div>
                                        <h5 class="mt-2 mb-1">{{ board.title }}</h5>
                                        <p class="m-0 text-end fw-bold">{{ board.price.toLocaleString() }}원</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/api';

const router = useRouter();
const userInfo = ref(null);
// const posts = ref([]);
const showOnlySoldOut = ref(false);

// 더미데이터 임시
const posts = ref([
    {
        id: 1,
        image_url: '/default-book.jpg',
        created_at: '2024-03-14T10:00:00',
        is_sold: false,
        title: '[미개봉] 객체지향의 사실과 오해',
        price: 15000
    },
    {
        id: 2,
        image_url: '/default-book.jpg',
        created_at: '2024-03-13T15:30:00',
        is_sold: true,
        title: '클린 코드 - 절판된 버전',
        price: 35000
    },
    {
        id: 3,
        image_url: '/default-book.jpg',
        created_at: '2024-03-13T09:15:00',
        is_sold: false,
        title: '[A급] 이펙티브 자바 Effective Java 3/E',
        price: 25000
    },
    {
        id: 4,
        image_url: '/default-book.jpg',
        created_at: '2024-03-12T14:20:00',
        is_sold: false,
        title: '모던 자바스크립트 Deep Dive - 새책급',
        price: 32000
    },
    {
        id: 5,
        image_url: '/default-book.jpg',
        created_at: '2024-03-12T11:45:00',
        is_sold: false,
        title: '[필기X] 리팩터링 2판',
        price: 28000
    },
    {
        id: 6,
        image_url: '/default-book.jpg',
        created_at: '2024-03-11T16:30:00',
        is_sold: true,
        title: 'Real MySQL 8.0 (전2권)',
        price: 45000
    },
    {
        id: 7,
        image_url: '/default-book.jpg',
        created_at: '2024-03-11T13:20:00',
        is_sold: false,
        title: '[한 번 읽음] Node.js 교과서',
        price: 22000
    },
    {
        id: 8,
        image_url: '/default-book.jpg',
        created_at: '2024-03-10T17:10:00',
        is_sold: false,
        title: '도커/쿠버네티스 실전 개발 입문',
        price: 27000
    },
    {
        id: 9,
        image_url: '/default-book.jpg',
        created_at: '2024-03-10T09:45:00',
        is_sold: true,
        title: '[거의새책] 그림으로 배우는 HTTP & Network',
        price: 18000
    },
    {
        id: 10,
        image_url: '/default-book.jpg',
        created_at: '2024-03-09T14:30:00',
        is_sold: false,
        title: '스프링 부트와 AWS로 혼자 구현하는 웹 서비스',
        price: 23000
    }
]);


// 판매중인 항목만 필터링하는 computed 속성
const filteredPosts = computed(() => {
    if (showOnlySoldOut.value) {
        return posts.value.filter(board => !board.is_sold);
    }
    return posts.value;
});

// 날짜 포맷 함수
const formatDate = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffTime = Math.abs(now - postDate);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
        return `${diffHours}시간 전`;
    } else {
        return postDate.toLocaleDateString();
    }
};

// 상세 페이지로 이동
const goToDetail = (boardId) => {
    router.push(`/board/${boardId}`);
};

onMounted(async () => {
    try {
        // 사용자 정보 가져오기
        const userResponse = await api.getUserInfo();
        userInfo.value = userResponse.data;

        // 내가 작성한 글 목록 가져오기
        const postsResponse = await api.getMyPosts(userInfo.value.email);
        posts.value = postsResponse.data;
    } catch (error) {
        console.error('데이터 조회 실패:', error);
    }
});
</script>

<style scoped>
/* 전체 레이아웃 중앙 배치 */
.container {
    max-width: 900px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 0;
}

/* 상단 구분선 */
.container::before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: #8B4513;
    margin-bottom: 2rem;
}

/* 카드 스타일 */
.card {
    background-color: #fff;
    border-radius: 8px;
    border: none;
}

/* 네비게이션 링크 */
.nav-link {
    padding: 0.5rem 0;
    transition: color 0.2s ease-in-out;
}

.nav-link:hover {
    color: #8B4513 !important;
}

/* 게시글 아이템 스타일 */
.post-item {
    transition: transform 0.2s;
    cursor: pointer;
}

.post-item:hover {
    transform: translateY(-2px);
}

.book-cover {
    border-radius: 4px;
}

/* 체크박스와 버튼 스타일 */
.form-check-input:checked {
    background-color: #8B4513;
    border-color: #8B4513;
}

.btn-outline-secondary {
    border-color: #8B4513;
    color: #8B4513;
    transition: all 0.2s ease-in-out;
}

.btn-outline-secondary:hover {
    background-color: #8B4513;
    border-color: #8B4513;
    color: #fff;
}

.bg-custom-brown {
    background-color: #A25D0D !important;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
    .card-body.d-flex {
        flex-direction: column;
        text-align: center;
    }
    
    .book-cover {
        margin-bottom: 1rem;
    }
    
    .text-end {
        text-align: center !important;
    }
}
</style>