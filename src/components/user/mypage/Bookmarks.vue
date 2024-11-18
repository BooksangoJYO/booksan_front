<template>
    <div class="container mt-5">
        <h2 class="mb-4">마이페이지</h2>
        <div class="row" v-if="userInfo">
            <!-- 사이드바 -->
            <SideBar/>

            <!-- 메인 컨텐츠 -->
            <div class="col-md-9">
                <div class="card mb-4 border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3 class="m-0">북마크</h3>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="showOnlySoldOut" id="soldOutCheck" @change="filterBookmarks">
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
                        <div v-else-if="!bookmarks.length" class="text-center py-5">
                            <p class="text-muted">북마크한 게시글이 없습니다.</p>
                        </div>

                        <!-- 북마크 목록 -->
                        <div class="bookmark-list">
                            <div v-for="board in bookmarks" :key="board.id" 
                                class="bookmark-item card border-0 shadow-sm mb-3"
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
         <!-- 페이지네이션 추가 -->
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
</template>

<script setup>
import api from '@/api/api';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SideBar from './SideBar.vue';

const router = useRouter();
const userInfo = ref(null);
const bookmarks = ref([]); // 게시글 목록
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
    loadBookmarks(page);
};

const loadBookmarks = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
        console.log('loadBookmarks 호출:', page);
        const response = await api.getBookmarks({
            page: page,
            size: 10,
            soldOnly: showOnlySoldOut.value
        });
        console.log('북마크 응답:', response);

        // 데이터가 있는 경우 (200 OK)
        if (response.status === 200 && response.data?.data) {
            const boardList = response.data.data;
            bookmarks.value = boardList.dtoList;
            pageInfo.value = {
                page: boardList.page,
                size: boardList.size,
                total: boardList.total,
                start: boardList.start,
                end: boardList.end,
                prev: boardList.prev,
                next: boardList.next
            };
        } else { // 204 NO_CONTENT 또는 데이터가 없는 경우
            bookmarks.value = [];
            pageInfo.value = {
                page: 1,
                size: 10,
                total: 0,
                start: 1,
                end: 1,
                prev: false,
                next: false
            };
        }
    } catch (error) {
        console.error('북마크 로딩 에러:', error);
        error.value = '북마크 목록을 불러오는데 실패했습니다.';
    } finally {
        loading.value = false;
    }
};


const filterBookmarks = () => {
    if (showOnlySoldOut.value) {
        bookmarks.value = bookmarks.value.filter(board => !board.is_sold);
    }
    loadBookmarks(1); // 페이지 초기화하고 데이터 다시 불러오기
};

onMounted(async () => {
    try {
        // 사용자 정보 가져오기
        const userResponse = await api.getUserInfo();
        userInfo.value = userResponse.data;

        // 북마크 목록은 loadBookmarks 함수 재사용
        await loadBookmarks(1);
    } catch (error) {
        console.error('데이터 조회 실패:', error);
    }
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

</script>

<style scoped>
/* 기존 스타일에 페이지네이션 스타일 추가 */
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

/* 북마크 아이템 스타일 */
.bookmark-item {
    transition: transform 0.2s;
    cursor: pointer;
}

.bookmark-item:hover {
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