<template>
    <div class="book-search-container">
        <!-- 도서 검색 제목 -->
        <h1 class="search-title">도서 검색</h1>

      <!-- 검색창 -->
      <div class="search-input-wrapper">
        <input
          type="text"
          v-model="keyword"
          placeholder="책 제목을 입력해주세요"
          @keydown.enter="searchBook"
          class="search-input"
        />
        <button @click="searchBook" class="search-button">검색</button>
      </div>
  
      <!-- 도서 리스트 그리드 -->
      <div class="book-grid-wrapper">
        <div
          v-for="(book, index) in data.books"
          :key="index"
          @click="selectBook(book)"
          class="book-grid-item"
        >
          <img :src="book.image" alt="책 이미지" class="book-image" />
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
        </div>
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
import { ref, reactive, computed, defineEmits,onMounted } from "vue";
import api from "@/api/api";
import { useRoute, useRouter } from 'vue-router'; // useRoute 가져오기

const route = useRoute();
const router = useRouter();
const emit = defineEmits(["book-selected"]);
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
    alert("도서 정보를 불러오는 데 문제가 발생했습니다.");
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
   keyword.value = route.params.keyword || ''
   if(keyword.value.length){
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
  margin: 100px 0 20px; /* 헤더와 간격 추가 (40px 위쪽, 20px 아래쪽) */
  color: #693610; /* 제목 색상 */
}

.book-search-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center; /* 검색창 중앙 정렬 */
  padding: 0 20px; /* 좌우 여백 추가 */
}

/* 검색 입력 필드 스타일 */
.search-input-wrapper {
  display: flex;
  gap: 10px;
  max-width: 600px; /* 검색창의 최대 너비를 제한 */
  width: 100%;
  margin-bottom: 30px; /* 검색창과 그리드 사이의 간격 추가 */
}

.search-input {
  flex: 1;
  padding: 8px; /* 내부 여백 줄이기 */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-button {
  padding: 8px 15px; /* 버튼 크기 조절*/
  font-size: 14px; /* 글씨 크기 줄이기 */
  background-color: #8b4513;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
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
  margin-top: 20px; /* 위쪽 여백 추가 */
}

.book-grid-item {
  background-color: #f9f9f9;
  padding: 10px;
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
  max-width: 120px; /* 최대 너비 제한 */
  height: auto;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 4px;
}

.book-title {
  font-size: 14px;
  margin: 10px 0 5px;
}

.book-author {
  font-size: 12px;
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
