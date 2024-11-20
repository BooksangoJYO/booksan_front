<template>
    <div class="main-container">
      <!-- 로고 섹션 -->
      <div class="logo-container">
        <img :src="MainLogo" alt="북산장터 로고" class="logo">
        <h1 class="title">북싼장터</h1>
        <p class="subtitle">Booksan Market</p>
      </div>
  
      <!-- 검색창 -->
      <div class="search-container">
        <input 
            type="text" 
            class="search-input" 
            placeholder="책 찾아보기"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
        >
        <img :src="SearchIcon" alt="검색" class="search-icon" @click="handleSearch">
      </div>
  
      <!-- 추천 도서 섹션 -->
      <h2 class="recommendation-title">책 추천</h2>
      <div class="book-container">
        <div v-for="board in data.boards" :key="board.id" class="book-card">
          <img :src="board.image" :alt="board.title" class="book-image">
          <h3 class="book-title">{{ board.title }}</h3>
          <p class="book-author">{{ board.author }}</p>
        </div>
      </div>
      <h2 class="recommendation-title">오직 당신만을 위한 큐레이션</h2>
      <div class="book-container">
        <div v-for="book in books" :key="book.isbn" class="book-card">
          <img :src="book.image" :alt="book.title" class="book-image">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <p class="book-author">{{ book.publisher }}</p>
        </div>
      </div>
    </div>
    
</template>
  
<script setup>
import api from '@/api/api';
import MainLogo from '@/assets/images/mainLogo.png';
import SearchIcon from '@/assets/images/searchIcon.svg';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const data = reactive({
    boards: []  // 빈 배열로 초기화
});

// 추천 도서 로드
const loadRecommendedBooks = async () => {
    try {
        const response = await api.getRecommendedBooks();
        if (response.data?.status === 'success') {
            data.boards = response.data.data.map(book => ({
                id: book.isbn,
                title: book.bookTitle,
                author: `${book.bookWriter} · ${book.bookPublisher}`,
                image: book.bookImageUrl || '/default-book.jpg'
            }));
        }
    } catch (error) {
        console.error('추천 도서 로딩 실패:', error);
    }
}

onMounted(() => {
    loadRecommendedBooks();
});



const books = ref([]);

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({
        path: '/book/list',
        query: {  // params 대신 query 사용
            keyword: searchQuery.value.trim()
        }
        })
    }
}

const getRecommendedIsbnList = async () => {
    try {
        const response = await api.getRecommendedIsbnList();
        books.value = response.data;
        console.log(response.data);
    } catch (error) {
        console.error('추천 도서 데이터를 불러오지 못함');
    }
};

onMounted(async () => {
    console.log("onMounted 호출됨");
    await getRecommendedIsbnList();
    for (let i = 0; i < books.value.length; i++) {
        const isbn = books.value[i];
        const response = await api.getBookInfo(isbn);
        console.log(response.data.bookInfo);
        books.value[i] = response.data.bookInfo;
        console.log(books.value[i]);
    }
    console.log(books.value);
})
</script>
  
<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.logo-container {
  text-align: center;
  margin: 80px 0 60px; /* 로고 위치를 아래로 내림 */
}

.logo {
  width: 120px;
  height: auto;
}

.title {
  font-size: 24px;
  color: #8B4513;
  margin: 10px 0;
}

.subtitle {
  font-size: 14px;
  color: #D2691E;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 60px;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: -35px; /* 아이콘을 input 안으로 넣기 위해 음수값 사용 */
}

.search-input {
  width: 100%;
  padding: 15px 45px 15px 20px; /* 오른쪽에 아이콘 들어갈 공간 */
  border: 2px solid #8B4513;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.search-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: -40px; /* 아이콘을 input 안으로 이동 */
}

.recommendation-title {
  text-align: center;
  font-size: 20px;
  color: #333;
  margin: 40px 0 30px; /* 위쪽 여백 추가 */
}

.book-container {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.book-card {
  width: 140px; /* 카드 크기 축소 */
  text-align: center;
}

.book-image {
  width: 160px;
  height: 240px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.book-image:hover {
  transform: translateY(-5px);
}

.book-title {
  margin: 10px 0 5px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.book-author {
  font-size: 14px;
  color: #666;
}
</style>