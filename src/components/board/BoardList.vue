<template>
    <div>
      <!-- 검색 입력 및 버튼 -->
      <div>
        <input v-model="searchTitle" placeholder="검색할 제목을 입력하세요" @keyup.enter="fetchBoardList" />
        <button @click="fetchBoardList">검색</button>
      </div>
  
      <!-- 게시글 목록 출력 -->
      <div v-if="boardList.length > 0">
        <div v-for="(board, index) in boardList" :key="index" class="board-item">
          <h3>{{ board.title }}</h3>
          <p>{{ board.content }}</p>
          <p>작성자: {{ board.author }}</p>
          <p>작성일: {{ board.pubdate }}</p>
        </div>
      </div>
      <div v-else>
        <p>게시글이 없습니다.</p>
      </div>
  
      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="goToPage(page - 1)" :disabled="page === 1">이전</button>
        <span v-for="pageNum in totalPages" :key="pageNum">
          <button @click="goToPage(pageNum)" :class="{ active: page === pageNum }">{{ pageNum }}</button>
        </span>
        <button @click="goToPage(page + 1)" :disabled="page === totalPages">다음</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import api from '@/api/api'; // API 요청을 보내는 파일을 import
  
  // 상태 정의
  const searchTitle = ref('');
  const page = ref(1);
  const size = ref(10); // 페이지당 표시할 게시물 개수
  const boardList = ref([]);
  const totalPages = ref(1);
  
  // 게시글 목록 가져오기
  const fetchBoardList = async () => {
    try {
      const response = await api.getBoardList({ searchTitle: searchTitle.value, page: page.value, size: size.value });
      boardList.value = response.data.dtoList;
      totalPages.value = Math.ceil(response.data.total / size.value);
    } catch (error) {
      console.error('게시글 목록을 가져오는 중 오류가 발생했습니다:', error);
      alert('게시글을 불러오는 중 문제가 발생했습니다.');
    }
  };
  
  // 페이지 이동
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages.value) {
      page.value = pageNum;
      fetchBoardList();
    }
  };
  
  // 컴포넌트가 처음 로드될 때 게시글 목록 가져오기
  onMounted(fetchBoardList);
  </script>
  
  <style scoped>
  .board-item {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  .pagination button.active {
    font-weight: bold;
  }
  </style>
  