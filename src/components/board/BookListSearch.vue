<template>
    <div class="book-search-container">
        <!-- 도서 검색 제목 -->
        <h1 class="search-title">도서 검색</h1>

      <!-- 검색창 -->
      <div class="search-container">
        <input 
            type="text" 
            class="search-input" 
            placeholder="가판대 찾아보기"
            v-model="keyword"
            @keyup.enter="searchBook"
        >
        <img :src="SearchIcon" alt="검색" class="search-icon" @click="searchBook">
      </div>
      <!-- 도서 리스트 그리드 -->
      <div class="book-grid-wrapper" v-if="data.books.length">
        <div
          v-for="(book, index) in data.books"
          :key="index"
          @click="selectBook(book)"
          class="book-grid-item"
        >
          <img :src="book.image" alt="도서 이미지" class="book-image" />
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
        </div>
      </div>
      <div v-else>
        <p class="no-board-message">해당 책에 대한 정보가 없습니다.</p>
      </div>
      <!-- 페이지네이션 -->
      <div class="pagination" v-if="data.books.length">
        <button
          @click="goToPage(data.page - 1)"
          :disabled="!data.prev"
          class="pagination-button"
        >
          이전
        </button>
        <span v-for="pageNum in pagesInCurrentBlock" :key="pageNum">
          <button
            @click="goToPage(pageNum)"
            :class="{ active: pageNum === data.page }"
            class="pagination-button"
          >
            {{ pageNum }}
          </button>
        </span>
        <button
          @click="goToPage(data.page + 1)"
          :disabled="!data.next"
          class="pagination-button"
        >
          다음
        </button>
      </div>
    </div>
  </template>


<script setup>
import api from "@/api/api";
import SearchIcon from '@/assets/images/searchIcon.svg';
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from 'vue-router'; // useRoute 가져오기

const route = useRoute();
const router = useRouter();
const keyword = ref("");
const data = reactive({
  books: [],
  page: 1,
  size: 10, 
  totalPages: 1,
  start: 1,
  end: 5,
  prev: false,
  next: false,
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
const searchBook = async () => {
  try {
    const response = await api.getBooksInfo(keyword.value, data.page, data.size);
    const responseData = response.data;
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
  }
};

// 특정 페이지로 이동
const goToPage = (pageNum) => {
  if (pageNum < 1 || pageNum > data.totalPages) return;
  data.page = pageNum;
  searchBook();
};

// 선택된 도서 데이터 전달
const selectBook = (book) => {
  try{
    router.push({ path: `/book/detail/${book.isbn}`  });
  } catch (error) {
    console.error('라우터 이동 중 오류: ', error);
  }  
};

onMounted(()=>{
   keyword.value = route.query.keyword || ''
   if(keyword.value){
    searchBook();
   }
});

</script>



<style scoped>
/* 검색 제목 스타일 */
.search-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px; /* 검색창과의 간격 */
  margin: 30px 0 0; /* 헤더와 간격 추가*/
  color: #693610; /* 제목 색상 */
}

.book-search-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center; /* 검색창 중앙 정렬 */
  padding: 0 20px; /* 좌우 여백 추가 */
}

/* 검색 및 카테고리 스타일 */
.search-container {
  width: 800px;
  margin: 0 auto 50px;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: -35px; /* 아이콘을 input 안으로 넣기 위해 음수값 사용 */
}

.search-input {
  width: 100%;
  padding: 15px 45px 15px 20px; /* 오른쪽에 아이콘 들어갈 공간 */
  border: 3px solid #8B4513;
  border-radius: 25px;
  font-size: 17px;
  outline: none;
}

.search-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-left: -50px; /* 아이콘을 input 안으로 이동 */
}

.search-button:hover {
  background-color: #693610;
}

/* 도서 리스트 그리드 스타일 */
.book-grid-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 한 줄에 5개 */
  gap: 20px; /* 카드 간 간격 */
  width: 100%; /* 그리드 너비 조정 */
  max-width: 1200px; /* 그리드 최대 너비 */
  margin-top: 10px; /* 위쪽 여백 추가 */
}

.book-grid-item {
  background-color: #f9f9f9;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.book-grid-item:hover {
  transform: translateY(-5px);
  border-color: #8b4513;
}

.book-image {
  width: 100%; /* 이미지 크기 자동 조정 */
  max-width: 100px; /* 최대 너비 제한 */
  height: auto;
  object-fit: cover;
  margin-bottom: 8px;
  border-radius: 4px;
}

.book-title {
  font-size: 13px;
  margin: 8px 0 4px;
}

.book-author {
  font-size: 11px;
  color: #555;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 30px; /* 그리드 아래 페이지네이션 간격 */
}

.pagination-button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-button:hover {
  background-color: #8b4513;
  color: #fff;
}

.pagination-button.active {
  background-color: #693610;
  color: #fff;
}

.pagination-button:disabled {
  background-color: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}
</style>
