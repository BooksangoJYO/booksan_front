<template>
  <div class="page-container">
      

    <!-- 검색 입력 및 버튼 -->
    <div class="search-container">
      <input v-model="keyword" placeholder="책 찾아보기" @keyup.enter="search()" class="search-input" />
      <button @click="fetchBoardList" class="search-button">검색</button>
    </div>
    <div class="category-container">
    <div v-for="(category, index) in categories" :key="index" class="category-item" @click="setCategory(category.id)">
      <img
        v-if="category.icon"
        :src="`https://cdn-icons-png.flaticon.com/512/2933/2933275.png`"
        alt="Category Icon"
        class="category-icon"
      />
      <span class="category-text">{{ category.name }}</span>
    </div>
  </div>

  <div class="filter-container">
    <!-- 체크박스와 라벨 -->
    <div class="left-section">
        <input type="checkbox" id="availableOnly" v-model="availableOnly" @change="search" />
        <label for="availableOnly">판매 중인 것만 보기</label>
      </div>

      <!-- 게시글 등록 버튼 -->
      <button class="register-button" @click="goToBoardInsert">가판대 등록</button>
    </div>
    
    

    <!-- 게시글 목록 출력 -->
    <div v-if="filteredBoardList.length > 0" class="board-list">
      <div v-for="(board, index) in filteredBoardList" :key="index" class="board-item" @click="goToBoardRead(board.dealId)">        
        <div class="board-item-image">
          <button @click.stop="toggleBookmark(board.dealId)" class="bookmark-button">
            <img :src="isBookmarked(board.dealId) ? 'images/bookmark_filled.png' : 'images/bookmark_empty.png'" alt="Bookmark Icon" class="bookmark-icon" />
          </button>
          <img :src="board.imageUrl ? board.imageUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKC5SbJx2Wf9ewguE1uvgE3zc5TRnX1XfOsA&s'" alt="Book Image" />
        </div>
        <div class="board-item-details">
          <div class="board-item-info">
            <span class="board-item-time">{{ formatTimeAgo(board.insertDatetime) }} 전</span>            
            <h3 class="board-title">{{ board.title }}</h3>            
            <p class="board-price">{{ board.status === 'N' ? board.price + '원' : 'SOLD OUT' }}</p>
            <p class="board-condition">[ISBN: {{ board.isbn }}]</p>
            <span class="board-item-status" :class="{ available: board.status === 'N' }">{{ board.status === 'N' ? '판매 중' : '판매 완료' }}</span>
          </div>
          
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-board-message">게시글이 없습니다.</p>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="boardList.length" class="pagination">
      <button @click="goToPage(paginationData.start - 1)" :disabled="!paginationData.prev" class="pagination-button">이전</button>
      <span v-for="pageNum in pageInCurrentBlock" :key="pageNum">
        <button @click="goToPage(pageNum)" :class="{ active: paginationData.page === pageNum }" class="pagination-button">{{ pageNum }}</button>
      </span>
      <button @click="goToPage(paginationData.end + 1)" :disabled="!paginationData.next" class="pagination-button">다음</button>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/api'; // API 요청을 보내는 파일을 import
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// 상태 정의
const router = useRouter();
const keyword = ref('');
const availableOnly = ref(false);
const boardList = ref([]);
const bookmarkedDeals = ref(new Set());
const selectedCategoryId = ref(null);
const categories = ref([
  { id:1, name: "철학", icon: "philosophy.png" },
  { id:2, name: "종교", icon: "religion.png" },
  { id:3, name: "사회 과학", icon: "social_science.png" },
  { id:4, name: "순수 과학", icon: "pure_science.png" },
  { id:5, name: "기술 과학", icon: "technical_science.png" },
  { id:6, name: "예술", icon: "art.png" },
  { id:7, name: "언어", icon: "language.png" },
  { id:8, name: "문학", icon: "literature.png" },
  { id:9, name: "역사", icon: "history.png" },
  { id:10, name: "기타", icon: "others.png" },
]);

const isbn = ref('');

const setCategory = (categoryId) => {
  selectedCategoryId.value = categoryId; // 선택된 카테고리 ID 저장
  paginationData.page = 1;
  paginationData.size = 10;
  console.log(`Selected Category ID: ${categoryId}`);
  fetchBoardList(); // 선택한 카테고리에 따라 게시글 목록 새로고침
};



const paginationData = reactive({
  page: 1,
  size: 10,
  totalPages: 1,
  start: 1,
  end: 10,
  prev: false,
  next: false
});

// 판매 중인 것만 보기 체크박스 상태에 따른 필터링
const filteredBoardList = computed(() => {
  if (availableOnly.value) {
    return boardList.value.filter(board => board.status === 'N');
  }
  return boardList.value;
});

// 블록 내의 페이지 리스트를 계산하는 변수
const pageInCurrentBlock = computed(() => {
  const pages = [];
  for (let i = paginationData.start; i <= paginationData.end; i++) {
    pages.push(i);
  }
  return pages;
});

const search = () => {
  paginationData.page = 1;
  paginationData.size = 10;
  fetchBoardList();
};

// 게시글 목록 가져오기
const fetchBoardList = async () => {
  console.log("현재 isbn 값: ", keyword.value);
  try {
      const response = await api.getBoardList(
      paginationData.page, 
      paginationData.size, 
      keyword.value || '', 
      availableOnly.value,
      selectedCategoryId.value || 0, //선택된 카테고리 ID 전달
      isbn.value || '' //ISBN 값 추가
    );

    if (response.data && response.data.data && response.data.data.dtoList) {
      boardList.value = response.data.data.dtoList;
      paginationData.page = response.data.data.page;
      paginationData.size = response.data.data.size;
      paginationData.start = response.data.data.start;
      paginationData.end = response.data.data.end;
      paginationData.prev = response.data.data.prev;
      paginationData.next = response.data.data.next;
      paginationData.totalPages = Math.ceil(response.data.data.total / paginationData.size);
    } else {
      boardList.value = [];
    }
  } catch (error) {
    console.error('게시글 목록을 가지오는 중 오류가 발생했습니다:', error);
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

// 게시글 등록 이동
function goToBoardInsert() {
  router.push({ path: '/board/insert' });
}

// 게시글 조회 페이지로 이동
function goToBoardRead(dealId) {
  router.push({ path: `/board/read/${dealId}` });
}

// 북마크 토글
const toggleBookmark = (dealId) => {
  if (bookmarkedDeals.value.has(dealId)) {
    bookmarkedDeals.value.delete(dealId);
  } else {
    bookmarkedDeals.value.add(dealId);
  }
};

// 북마크 여부 확인
const isBookmarked = (dealId) => {
  return bookmarkedDeals.value.has(dealId);
};

// 시간 포맷팅 함수
function formatTimeAgo(datetime) {
  const date = new Date(datetime);
  const now = new Date();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일`;
  if (hours > 0) return `${hours}시간`;
  if (minutes > 0) return `${minutes}분`;
  return `${seconds}초`;
}

onMounted(fetchBoardList);

const goToHome = () => {
  router.replace('/');
};
</script>

<style scoped>
/* 페이지 전체를 감싸는 div */
.page-container {
  margin: 0 auto; /* 좌우 여백을 자동으로 맞추어 중앙에 배치 */
  max-width: 1200px; /* 최대 너비 설정 */
  padding: 20px; /* 내부 여백 추가 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
}

/* 전체 스타일 */
div {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* 검색 및 카테고리 스타일 */
.search-container {
  display: flex;
  align-items: center;
  justify-content: center; /* 검색 창 중앙 정렬 */
  margin-bottom: 30px;
}

.search-input {
  width: 500px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-right: 20px;
  font-size: 1.2em;
}

.search-button {
  padding: 15px 25px;
  background-color: #5a321f;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
}

/* 카테고리 스타일 */
.category-container {
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  gap: 20px; /* 각 카테고리 간 간격 */
  margin-bottom: 30px;
}

.category-item {
  display: flex;
  flex-direction: column; /* 아이콘과 텍스트를 세로로 배치 */
  align-items: center; /* 중앙 정렬 */
  text-align: center;
}

.category-icon {
  width: 50px; /* 아이콘 크기 조정 */
  height: 50px;
  object-fit: contain; /* 아이콘 비율 유지 */
  margin-bottom: 5px;
}

.category-text {
  font-size: 1em;
  font-weight: bold;
  color: #7b4f22; /* 글씨 색상 */
  cursor: pointer;
  transition: color 0.3s;
}

.category-text:hover {
  color: #5a321f; /* 호버 시 글씨 색상 변경 */
}

/* 판매 중인 것만 보기와 게시글 등록 버튼 */
.filter-container {
  display: flex;
  justify-content: space-between; /* 양쪽 정렬 */
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
  max-width: 1000px; /* 너비 통일 */
  margin-left: auto;
  margin-right: auto; /* 중앙 정렬 */
}


/* 체크박스와 라벨 정렬 */
.left-section {
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: 10px; /* 체크박스와 라벨 간 간격 */
}

/* 기본 체크박스 숨김 */
.left-section input[type="checkbox"] {
  display: none; /* 기본 체크박스를 숨깁니다 */
}

/* 커스텀 체크박스 스타일 */
.left-section label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #333; /* 텍스트 색상 */
}

.left-section label::before {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid #8B4513; /* 테두리 갈색 */
  border-radius: 4px; /* 둥근 모서리 */
  background-color: #fff; /* 기본 흰색 배경 */
  display: inline-block;
  margin-right: 8px; /* 텍스트와의 간격 */
  transition: all 0.3s ease; /* 애니메이션 효과 */
}

/* 체크된 상태의 스타일 */
.left-section input[type="checkbox"]:checked + label::before {
  background-color: #8B4513; /* 체크 시 배경 갈색 */
  border-color: #8B4513; /* 테두리 갈색 */
  display: flex;
  align-items: center;
  justify-content: center;
  content: '✔'; /* 체크 표시 */
  color: #fff; /* 체크 표시 흰색 */
  font-size: 14px;
  font-weight: bold;
}

.right-align {
  display: flex;
  justify-content: flex-end;
}

/* 게시글 목록 스타일 */
.board-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px; /* 동일한 너비 설정 */
  margin: 0 auto; /* 목록 중앙 정렬 */
}

/* 게시글 아이템 */
/* 게시글 박스를 감싸는 스타일 */
.board-item {
  display: flex;
  justify-content: space-between; /* 이미지와 텍스트 영역 좌우 배치 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 100%;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

/* 이미지 영역 */
.board-item-image {
  flex: 0 0 20%; /* 이미지 영역 크기 조정 */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
}

.board-item-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

/* 텍스트 상세 정보 */
.board-item-details {
  flex: 1; /* 텍스트 영역 확장 */
  display: flex;
  justify-content: flex-end; /* 텍스트를 오른쪽 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  text-align: right; /* 텍스트 오른쪽 정렬 */
  padding-left: 20px; /* 이미지와 텍스트 간 간격 */
}

/* 텍스트 세부 정보 */
.board-item-info {
  max-width: 75%; /* 텍스트 영역 너비 제한 */
}

.board-item-time {
  font-size: 1em;
  color: #888;
  margin-bottom: 10px;
}

.board-title {
  font-size: 1.4em;
  font-weight: bold;
  margin-bottom: 5px;
}

.board-price {
  font-weight: bold;
  color: #e84343;
  margin-bottom: 10px;
}

.board-condition {
  color: #6c757d;
  margin-bottom: 10px;
}

.board-item-status {
  display: inline-block;
  padding: 5px 10px;
  font-size: 0.9em;
  border-radius: 15px;
  color: #fff;
}

.board-item-status.available {
  background-color: #28a745; /* 판매 중 색상 */
}

.board-item-status:not(.available) {
  background-color: #6c757d; /* 판매 완료 색상 */
}

/* 북마크 버튼 */
.bookmark-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 10px; /* 북마크 버튼과 이미지 간 여백 */
}

.bookmark-icon {
  width: 24px;
  height: 24px;
}

/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.pagination-button {
  margin: 0 5px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.pagination-button.active {
  background-color: #5a321f;
  color: #fff;
  font-weight: bold;
}

/* 홈 버튼 */
.home-button {
  padding: 15px 35px;
  background-color: #ffc107;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.home-button:hover {
  background-color: #e0a800;
}

/* 게시글 등록 버튼 오른쪽 정렬 */
.register-button {
  padding: 10px 20px;
  background-color: #d59144;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  margin-left: auto; /* 오른쪽 정렬 */
}

.register-button:hover {
  background-color: #b57836;
}
</style>

