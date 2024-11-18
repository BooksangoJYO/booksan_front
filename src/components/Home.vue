<template>
    <div class="main-container">
      <!-- 로고 섹션 -->
      <div class="logo-container">
        <img :src="MainLogo" alt="북산장터 로고" class="logo">
        <h1 class="title">북산장터</h1>
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
      <h2 class="recommendation-title">오직 당신만을 위한 큐레이션</h2>
      <div class="book-container">
        <div v-for="board in data.boards" :key="board.id" class="book-card">
          <img :src="board.image" :alt="board.title" class="book-image">
          <h3 class="book-title">{{ board.title }}</h3>
          <p class="book-author">{{ board.author }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import SampleBook from '@/assets/images/bookSampleImage.png';
import MainLogo from '@/assets/images/mainLogo.png';
import SearchIcon from '@/assets/images/searchIcon.png';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

  const router = useRouter();
  const searchQuery = ref('');
const data = reactive({
    boards : [
    {
    id: 1,
    title: "제식주의자",
    author: "한강 · 장비",
    image: SampleBook
    },
    {
    id: 2,
    title: "제식주의자",
    author: "한강 · 장비",
    image: SampleBook
    },
    {
    id: 3,
    title: "제식주의자",
    author: "한강 · 장비",
    image: SampleBook
    },
    {
    id: 4,
    title: "제식주의자",
    author: "한강 · 장비",
    image: SampleBook
    }
]
});
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
  position: relative;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #8B4513;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
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
  gap: 40px;
  flex-wrap: wrap;
}

.book-card {
  width: 160px; /* 카드 크기 축소 */
  text-align: center;
}

.book-image {
  width: 100%;
  height: auto;
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