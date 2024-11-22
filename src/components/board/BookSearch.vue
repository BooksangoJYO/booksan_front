<template>
    <div class="book-search-container">
      <!-- 검색창 -->
      <div class="search-input-wrapper">
        <input
          type="text"
          v-model="keyword"
          placeholder="도서 제목을 입력해주세요"
          @keydown.enter="searchBook"
          class="search-input"
        />
        <button @click="searchBook" class="search-button">검색</button>
      </div>
  
      <!-- 검색 결과 리스트 -->
      <div class="book-list-wrapper">
        <div
          v-for="(book, index) in data.books"
          :key="index"
          @click="selectBook(book)"
          class="book-list-item"
        >
          <img :src="book.image" alt="책 이미지" class="book-image" />
          <div class="book-details">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">저자: {{ book.author }}</p>
            <p class="book-publisher">출판사: {{ book.publisher }}</p>
            <p class="book-isbn">ISBN: {{ book.isbn }}</p>
          </div>
        </div>
  
        <!-- 페이지네이션 -->
        <nav v-if="data.books.length" aria-label="페이지 탐색" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: !data.prev }">
              <a class="page-link" href="#" @click.prevent="goToPage(data.start - 1)">이전</a>
            </li>
            <li 
              class="page-item" 
              v-for="pageNum in pagesInCurrentBlock" 
              :key="pageNum"
              :class="{ active: pageNum === data.page }"
            >
              <a class="page-link" href="#" @click.prevent="goToPage(pageNum)">
                {{ pageNum }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: !data.next }">
              <a class="page-link" href="#" @click.prevent="goToPage(data.end + 1)">다음</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from "vue";
  import api from "@/api/api";

  const emit = defineEmits(["book-selected"]); // 부모로 선택된 책 정보를 전달
  const keyword = ref("");
  const data = reactive({
    books: [],
    page: 1,
    size: 10,
    totalPages: 1,
    start: 1,
    end: 10,
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
      const response = await api.getBooksInfo(keyword.value, data.page || 1, data.size || 10);
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
      console.error("도서 검색 오류:", error);
      alert("도서 정보를 불러오는 데 문제가 발생했습니다.");
    }
  };
  
  // 특정 페이지로 이동
  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > data.totalPages) return;
    data.page = pageNum;
    searchBook();
  };
  
  // 선택된 책 정보 부모로 전달
  const selectBook = (book) => {
    emit("book-selected", book); // 부모에게 선택된 책 데이터 전달
  };
  </script>
  
  <style scoped>
  .book-search-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width:500px;
    width: 100%;
  }
  
  /* 검색 입력 필드 스타일 */
  .search-input-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
    height: 50px;
    box-sizing: border;
    width : 80%;
  }


  
  .search-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 500px;
  }
  
  .search-button {
    padding: 10px 20px;
    background-color: #8b4513;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .search-button:hover {
    background-color: #693610;
  }
  
  /* 검색 결과 리스트 스타일 */
  .book-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
  }
  
  .book-list-item {
    display: flex;
    gap: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f9f9f9;
    transition: border-color 0.3s;
  }
  
  .book-list-item:hover {
    border-color: #8b4513;
  }
  
  .book-image {
    width: 80px;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .book-details {
    flex: 1;
  }
  
  .book-title {
    font-size: 16px;
    margin: 0 0 5px;
  }
  
  .book-author,
  .book-publisher,
  .book-isbn {
    font-size: 14px;
    margin: 0;
    color: #555;
  }
  
  /* 페이지네이션 */
  .page-link {
  color: #8B4513;
  padding: 0.25rem 0.3rem;  /* 패딩 조금 줄임 */
  font-size: 0.875rem;  /* 폰트 크기 약간 줄임 */
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
  