<template>
    <div>
      <!-- 검색 입력 및 버튼 -->
      <div>
        <input v-model="keyword" placeholder="검색할 제목을 입력하세요" @keyup.enter="search()" />
        <button @click="fetchBoardList">검색</button>
      </div>
      <!-- 게시글 등록 이동 버튼 -->
      <div>
        <button @click="goToBoardInsert">게시글 등록</button>
      </div>
  
      <!-- 게시글 목록 출력 -->
      <div v-if="boardList.length > 0">
        <div v-for="(board, index) in boardList" :key="index" class="board-item" @click="goToBoardRead(board.dealId)">
          <p>게시글 번호: {{ board.dealId }}</p>
          <h3>게시글 제목: {{ board.title }}</h3>
          <p>작성자: {{ board. nickname }}</p>          
        </div>
      </div>
      <div v-else>
        <p>게시글이 없습니다.</p>
      </div>
  
      <!-- 페이지네이션 -->
      <div v-if="paginationData.totalPages > 1" class="pagination">
        <button @click="goToPage(paginationData.start - 1)" :disabled="!paginationData.prev">이전</button>
        <span v-for="pageNum in pageInCurrentBlock" :key="pageNum">
          <button @click="goToPage(pageNum)" :class="{ active: paginationData.page === pageNum }">{{ pageNum }}</button>
        </span>
        <button @click="goToPage(paginationData.end + 1)" :disabled="!paginationData.next">다음</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/api/api'; // API 요청을 보내는 파일을 import
  
  // 상태 정의
  const router = useRouter();
  const keyword = ref(''); 
  const boardList = ref([]);

  const paginationData = reactive({
    page:1,
    size:10,
    totalPages:1,
    start:1,
    end:10,
    prev:false, 
    next:false
  });

  //블록 내의 페이지 리스트를 계산하는 변수
  const pageInCurrentBlock = computed(()=> {
    const pages = [];
    for( let i = paginationData.start; i <= paginationData.end; i++){
      pages.push(i);
    }
    return pages;
  });
  
  const search = ()=>{
    paginationData.page = 1;
    paginationData.size = 10;
    fetchBoardList();
  }
  // 게시글 목록 가져오기
  const fetchBoardList = async () => {
    console.log("Fetching board list..."); // 추가
    console.log("Fetching board list with keyword:", keyword.value); // 추가
    try {      
      const response = await api.getBoardList(paginationData.page,paginationData.size, keyword.value || '' );
      boardList.value = response.data.data.dtoList;      
      paginationData.page = response.data.data.page;
      paginationData.size = response.data.data.size;
      paginationData.start = response.data.data.start;
      paginationData.end = response.data.data.end;
      paginationData.prev = response.data.data.prev;
      paginationData.next = response.data.data.next;
      paginationData.totalPages = Math.ceil(response.data.data.total / paginationData.size);
    } catch (error) {
      console.error('게시글 목록을 가져오는 중 오류가 발생했습니다:', error);
      alert('게시글을 불러오는 중 문제가 발생했습니다.');
    }
  };
  
  // 페이지 이동
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= paginationData.totalPages) {
      paginationData.page = pageNum;
      fetchBoardList();
    }
  };

  //게시글 등록 이동
  function goToBoardInsert() {
    router.push({ path: '/board/insert'});
  }
  
  
  //게시글 조회 페이지로 이동
  function goToBoardRead(dealId) {
    router.push({path: `/board/read/${dealId}` });
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
  