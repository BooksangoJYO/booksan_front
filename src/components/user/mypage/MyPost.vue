<template>
    <div class="container mt-5">
        <h2 class="mb-4">마이페이지</h2>
        <div class="row" v-if="loginInfo">
            <!-- 사이드바 -->
            <SideBar/>

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

                        <!-- 로딩 상태 표시 -->
                        <div v-if="loading" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <!-- 에러 메시지 -->
                        <div v-else-if="error" class="alert alert-danger">
                            {{ error }}
                        </div>

                        <!-- 데이터가 없을 때 -->
                        <div v-else-if="!posts.length" class="text-center py-5">
                            <p class="text-muted">작성한 게시글이 없습니다.</p>
                        </div>

                        <!-- 게시글 목록 -->
                        <div v-else class="posts-list">
                            <div v-for="board in posts" :key="board" 
                                class="post-item card border-0 shadow-sm mb-3"
                                @click="goToDetail(board)">
                                <div class="card-body d-flex align-items-center">
                                    <img 
                                        :src="`/api/board/read/download/${board.dealId}`"  
                                        class="book-cover me-3" 
                                        style="width: 80px; height: 80px; object-fit: cover;">
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="text-muted small">{{ formatDate(board.insertDatetime) }}</span>
                                            <span class="badge" :class="board.status === 'Y' ? 'bg-secondary' : 'bg-custom-brown'">
                                                {{ board.status === 'Y' ? '판매완료' : '판매중' }}
                                            </span>
                                        </div>
                                        <h5 class="mt-2 mb-1">{{ board.title }}</h5>
                                        <p class="m-0 text-end fw-bold">{{ board.price.toLocaleString() }}원</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 페이지네이션 -->
                        <nav v-if="pageInfo.total > 0" aria-label="Page navigation" class="mt-4">
                            <ul class="pagination justify-content-center">
                                <li class="page-item" :class="{ disabled: !pageInfo.prev }">
                                    <a class="page-link" href="#" @click.prevent="changePage(pageInfo.start - 1)">이전</a>
                                </li>
                                <li class="page-item" v-for="pageNum in pageNumbers" :key="pageNum"
                                    :class="{ active: pageNum === pageInfo.page }">
                                    <a class="page-link" href="#" @click.prevent="changePage(pageNum)">{{ pageNum }}</a>
                                </li>
                                <li class="page-item" :class="{ disabled: !pageInfo.next }">
                                    <a class="page-link" href="#" @click.prevent="changePage(pageInfo.end + 1)">다음</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from '@/api/api';
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SideBar from './SideBar.vue';


const store = useMainStore();
const {loginInfo} = storeToRefs(store);
const router = useRouter();
const posts = ref([]);
const showOnlySoldOut = ref(false);
const pageInfo = ref({
    page: 1,
    size: 10,
    total: 0,
    start: 1,
    end: 1,
    prev: false,
    next: false
});
const error = ref(null);
const loading = ref(false);

// 페이지 번호 배열 계산
const pageNumbers = computed(() => {
    const numbers = [];
    for(let i = pageInfo.value.start; i <= pageInfo.value.end; i++) {
        numbers.push(i);
    }
    return numbers;
});

// 페이지 변경 함수
const changePage = async (page) => {
    console.log('changePage 호출됨:', page);
    await loadPosts(page);
};

onMounted(() => {
    loadPosts(1); // 단순히 loadPosts 호출만 하기
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
const goToDetail = (board) => {
    router.push(`/board/read/${board.dealId}`);
};

const loadPosts = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
        const response = await api.getMyPosts({
            page,
            size: 10,
        });

        if (response.status === 200 && response.data?.data) {
            const boardList = response.data.data;
            // 일단 이미지 관련 처리 제거하고 기본 데이터만 표시
            posts.value = boardList.dtoList;
            
            pageInfo.value = {
                page: boardList.page,
                size: boardList.size,
                total: boardList.total,
                start: boardList.start,
                end: boardList.end,
                prev: boardList.prev,
                next: boardList.next
            };
            
            console.log('페이지 정보:', pageInfo.value);
            console.log('게시글 목록:', posts.value);
        }
    } catch (error) {
        console.error('게시글 로딩 에러:', error);
        // 에러가 나도 기존 데이터 유지
    } finally {
        loading.value = false;
    }
};

// 필터링 함수
const filterPosts = () => {
    pageInfo.value.page = 1; // 페이지 초기화
    loadPosts(1);
};

</script>

<style scoped>
/* 전체 레이아웃 중앙 배치 */
.container {
    max-width: 900px;
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

/* 페이지네이션 스타일  */
.page-link {
    color: #8B4513;
}

.page-item.active .page-link {
    background-color: #8B4513;
    border-color: #8B4513;
    color: white;
}

.page-link:hover {
    color: #A25D0D;
}
</style>