<template>
  <div class="container mt-5">
      <h2 class="mypage mb-4">마이페이지</h2>
      <div class="row" v-if="loginInfo.email">
          <!-- 사이드바 -->
          <SideBar/>

          <!-- 메인 컨텐츠 -->
          <div class="col-md-9">
              <div class="card mb-4 border-0 shadow-sm">
                  <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center mb-4">
                          <h3 class="m-0">책갈피한 서재</h3>
                      </div>

                      <!-- 북마크 도서 목록 -->
                      <div class="bookmark-list">
                          <div v-for="book in data.books" 
                              :key="book.isbn" 
                              class="bookmark-item card border-0 shadow-sm mb-3"
                              @click="selectBook(book)">
                              <div class="card-body d-flex align-items-center">
                                  <img :src="book.bookImageUrl || '/default-book.jpg'" 
                                      :alt="book.bookTitle" 
                                      class="book-cover me-3">
                                  <div class="flex-grow-1">
                                      <h5 class="mt-2 mb-1">{{ book.bookTitle }}</h5>
                                      <p class="m-0">{{ book.bookWriter }}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- 페이지네이션 -->
      <nav v-if="data.books.length" aria-label="Page navigation" class="mt-4">
          <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: !data.prev }">
                  <a class="page-link" href="#" @click.prevent="goToPage(data.page - 1)">이전</a>
              </li>
              <li class="page-item" v-for="pageNum in pagesInCurrentBlock" 
                  :key="pageNum"
                  :class="{ active: pageNum === data.page }">
                  <a class="page-link" href="#" @click.prevent="goToPage(pageNum)">{{ pageNum }}</a>
              </li>
              <li class="page-item" :class="{ disabled: !data.next }">
                  <a class="page-link" href="#" @click.prevent="goToPage(data.page + 1)">다음</a>
              </li>
          </ul>
      </nav>
  </div>
</template>


<script setup>
import api from "@/api/api";
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive } from "vue";
import { useRouter } from 'vue-router';
import SideBar from "./SideBar.vue";

const store = useMainStore();
const {loginInfo} = storeToRefs(store);

const router = useRouter();
const data = reactive({
  books: [],
  page: 1,
  size: 5, 
  totalPages: 1,
  start: 1,
  end: 5,
  prev: false,
  next: false,
});

onMounted(()=>{
    getBookMarkBookList();
});
// 페이지 목록 계산
const pagesInCurrentBlock = computed(() => {
  const pages = [];
  for (let i = data.start; i <= data.end; i++) {
    pages.push(i);
  }
  return pages;
});

// 검색 API 호출
const getBookMarkBookList = async () => {
  try {
    const response = await api.getBookMarkBookList(data.page, data.size);
    const responseData = response.data.data;
    console.log(response.data);
    data.books = responseData.dtoList || [];
    data.page = responseData.page;
    data.size = responseData.size;
    data.start = responseData.start;
    data.end = responseData.end;
    data.prev = responseData.prev;
    data.next = responseData.next;
    data.totalPages = Math.ceil(responseData.total / responseData.size);
  } catch (error) {
    console.error("도서 검색 실패:", error);
    alert("도서 정보를 불러오는 데 문제가 발생했습니다.");
  }
};

// 특정 페이지로 이동
const goToPage = (pageNum) => {
  if (pageNum < 1 || pageNum > data.totalPages) return;
  data.page = pageNum;
  getBookMarkBookList();
};

// 선택된 도서 데이터 전달
const selectBook = (book) => {
  try{
    router.push({ path: `/book/detail/${book.isbn}`  });
  } catch (error) {
    console.error('라우터 이동 중 오류: ', error);
  }  
};

</script>



<style scoped>
.mypage {
    font-weight: 700;
    color: #8B4513;
    margin-left: 20px;
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

/* 북마크 아이템 스타일 */
.bookmark-item {
    transition: transform 0.2s;
    cursor: pointer;
}

.bookmark-item:hover {
    transform: translateY(-2px);
}

.book-cover {
    width: 80px;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
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