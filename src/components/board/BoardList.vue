<template>
  <div class="page-container">
      

    <!-- 검색 입력 및 버튼 -->
    <h4 class="bookList-title"> 가판대 </h4>
    <div class="search-container">
      <input 
          type="text" 
          class="search-input" 
          placeholder="가판대 찾아보기"
          v-model="keyword"
          @keyup.enter="search()"
      >
      <img :src="SearchIcon" alt="검색" class="search-icon" @click="fetchBoardList">
    </div>
    <div class="category-container">

      <div 
        v-for="(category, index) in categories" 
        :key="index" 
        class="category-item" 
        @click="setCategory(category.id)"
        :class="{ selected: selectedCategoryId === category.id }"
      >
        <img
          v-if="category.icon"
          :src="category.icon"
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
          <img :src="board.imageFileListDTO?.length ? API_URLS.BOARD + '/api/board/read/download/' + board.imageFileListDTO[0].imgId : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKC5SbJx2Wf9ewguE1uvgE3zc5TRnX1XfOsA&s'" alt="Book Image" />
        </div>
        <div class="board-item-details">
          <div class="board-item-info">
            <span class="board-item-time">{{ formatTimeAgo(board.insertDatetime) }} 전</span>
            <button class="bookmark-button">
              <img :src="board.isBookMarked == 'Y'? BookMarkIcon : NotBookMarkIcon" alt="Bookmark Icon" class="bookmark-icon" />
            </button>
            <div class="board-item-status" :class="{ available: board.status === 'N' }">{{ board.status === 'N' ? '판매 중' : '판매 완료' }}</div>            
            <h3 class="board-title">{{ board.title }}</h3>            
            <p class="board-price">{{ board.status === 'N' ? formatPrice(board.price) : 'SOLD OUT' }}</p>
            
            
          </div>
          
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-board-message">거래중인 가판대가 없습니다.</p>
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
import BookMarkIcon from '@/assets/images/bookMarkFillIcon.svg';
import NotBookMarkIcon from '@/assets/images/bookMarkIcon.svg';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import art from '@/assets/images/art.png';
import entire from '@/assets/images/entire.png';
import history from '@/assets/images/history.png';
import language from '@/assets/images/language.png';
import literature from '@/assets/images/literature.png';
import others from '@/assets/images/others.png';
import Philosophy from '@/assets/images/philosophy.png';
import pureScience from '@/assets/images/pureScience.png';
import religion from '@/assets/images/religion.png';
import SearchIcon from '@/assets/images/searchIcon.svg';
import socialScience from '@/assets/images/socialScience.png';
import technicalScience from '@/assets/images/technicalScience.png';
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';

const API_URLS = {
  BOARD: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_BOARD : '',
};

// 상태 정의
const route = useRoute(); // useRoute를 사용하여 현재 경로 정보를 가져옴
const router = useRouter();
const availableOnly = ref(false);
const boardList = ref([]);
const store = useMainStore();
const{paginationData,keyword} = storeToRefs(store);

const selectedCategoryId = ref(0);
const categories = ref([
  { id:0, name:"전체", icon:entire},
  { id:1, name: "철학", icon: Philosophy },
  { id:2, name: "종교", icon: religion },
  { id:3, name: "사회 과학", icon: socialScience },
  { id:4, name: "순수 과학", icon: pureScience },
  { id:5, name: "기술 과학", icon: technicalScience },
  { id:6, name: "예술", icon: art },
  { id:7, name: "언어", icon: language },
  { id:8, name: "문학", icon: literature },
  { id:9, name: "역사", icon: history },
  { id:10, name: "기타", icon: others },
]);

const isbn = ref('');

const setCategory = (categoryId) => {
  selectedCategoryId.value = categoryId; // 선택된 카테고리 ID 저장
  keyword.value=''; // 키워드 초기화
  paginationData.value.page = 1;
  paginationData.value.size = 10;
  console.log(`Selected Category ID: ${categoryId}`);  
  fetchBoardList(); // 선택한 카테고리에 따라 게시글 목록 새로고침
};


// 가격 표시
const formatPrice = (price) => {
    return `${price.toLocaleString('ko-KR')}원`;
};

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
  for (let i = paginationData.value.start; i <= paginationData.value.end; i++) {
    pages.push(i);
  }
  return pages;
});

const search = () => {
  paginationData.value.page = 1;
  paginationData.value.size = 10;
  fetchBoardList();
};

// 게시글 목록 가져오기
const fetchBoardList = async () => {
  console.log("현재 isbn 값: ", keyword.value);
  try {
      const response = await api.getBoardList(
      paginationData.value.page, 
      paginationData.value.size, 
      keyword.value || '', 
      availableOnly.value,
      selectedCategoryId.value || 0, //선택된 카테고리 ID 전달
      isbn.value || '' //ISBN 값 추가
    );

    if (response.data && response.data.data && response.data.data.dtoList) {
      boardList.value = response.data.data.dtoList;
      paginationData.value.page = response.data.data.page;
      paginationData.value.size = response.data.data.size;
      paginationData.value.start = response.data.data.start;
      paginationData.value.end = response.data.data.end;
      paginationData.value.prev = response.data.data.prev;
      paginationData.value.next = response.data.data.next;
      paginationData.value.totalPages = Math.ceil(response.data.data.total / paginationData.value.size);
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
  if (pageNum >= 1 && pageNum <= paginationData.value.totalPages) {
    paginationData.value.page = pageNum;
    fetchBoardList();
  }
};

// 게시글 등록 이동
function goToBoardInsert() {  
  router.push({ path: '/board/insert' });
  keyword.value ='';
  paginationData.value.page= 1;
  fetchBoardList();
}

// 게시글 조회 페이지로 이동
function goToBoardRead(dealId) {
  router.push({ 
    path: `/board/read/${dealId}`,
    query: { page: paginationData.value.page }, // 현재 페이지 전달
   });
}

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

onMounted(() => {
  const pageFromQuery = route.query.page;
  if (pageFromQuery) {
    paginationData.value.page = parseInt(pageFromQuery, 10); // 쿼리에서 페이지 번호 복원
  }
  fetchBoardList(); // 목록 데이터 가져오기
});

</script>

<style scoped>
/* 페이지 전체를 감싸는 div */
.page-container {
  margin: 0 auto; /* 좌우 여백을 자동으로 맞추어 중앙에 배치 */
  max-width: 1200px; /* 최대 너비 설정 */
  padding: 20px; /* 내부 여백 추가 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
}

.bookList-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px; /* 검색창과의 간격 */
  margin: 30px 0 30px; /* 헤더와 간격 추가*/
  color: #8B4513; /* 제목 색상 */
}

/* 검색 및 카테고리 스타일 */
.search-container {
  max-width: 800px;
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
  width: 70px; /* 모든 카테고리의 너비를 동일하게 고정 */
  cursor: pointer;
}

/* 선택된 카테고리 스타일 */
.category-item.selected .category-text {
  border-bottom: 3px solid #7b4f22; /* 선택된 글씨 밑줄 */
  font-weight: bold; /* 강조 */
}

.category-icon {
  width: 40px; /* 아이콘 크기 조정 */
  height: 40px;
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
  content: '✓'; /* 다른 체크 표시 문자 사용 */
  color: white !important; /* 체크 표시 색상 강제 지정 */
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
  width: 98%;
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
  padding:10px 20px 0px;
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
  text-align: rigth;
  width: 100%;  
}

.board-item-time {
  font-size: 1em;
  color: #888;
  margin-bottom: 10px;
  margin-right: 10px;
}

.board-title {
  color:#5a321f;
  font-size: 1.4em;
  font-weight: 500;
  margin-bottom: 5px;
  margin-top: 5px
}

.board-price {
  font-size: 24px;
  font-weight: 800;
  color: #5a321f !important;
  margin-bottom: 0px;  
  margin-top: 15px;
  text-align: right;
  width: 100%;
  padding: 0 !important;
}



.board-item-status {
  display: inline-block;
  padding: 5px 10px;
  font-size: 0.9rem;
  border-radius: 8px;
  color: #ffffff;
  background-color: #ffcc80;
  width: 80px;
  height: 30px;
  text-align: center;
}

.board-item-status.available {
  background-color: #ba7933; /* 판매 중 색상 */
  text-align: center;
  font-size: 0.93rem !important;
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
  margin-right: 10px;
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
  padding: 10px 20px;
  border: 0.5px solid #ccc;
  border-radius: 1px;
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

.no-board-message {
  text-align: center;
  font-size: 1.5rem; /* 글씨 크기 */
  color: #888; /* 색상 */
  margin-top: 50px; /* 상단 여백 */
  font-weight: bold; /* 글씨 강조 */
  padding: 20px; /* 내부 여백 */
  border: 1px solid #ddd; /* 테두리 추가 */
  border-radius: 8px; /* 둥근 모서리 */
  background-color: #f9f9f9; /* 부드러운 배경 색 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

</style>

