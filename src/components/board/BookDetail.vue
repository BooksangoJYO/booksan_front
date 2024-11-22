<template>
    <div class="book-detail-container">
      <div class="alarm-setting" :class="{ 'bookmarked': isBookMarkedBook }" @click="insertBookMarkBook">
        <img :src="isBookMarkedBook ? AlarmIcon : NotAlarmIcon" alt="Alarm Icon" class="alarm-icon" />
        <span class="alarm-text">알림 설정</span>
      </div>
      <!-- 책 이미지와 정보 -->
       
      <div class="book-info">
        <img :src="book.image" alt="책 이미지" class="book-image" />
        <div class="book-details">
          <h1 class="h1-style">{{ book.title }}</h1>
          <div class="book-details-notitle">
            <p>저자: {{ book.author }}</p>
            <p>출판사: {{ book.publisher }}</p>
            <p>ISBN: {{ book.isbn }}</p>
          </div>
        </div>
      </div>
      <h2>책 소개</h2>
      <textarea class="book-description-textarea" readonly>{{ book.description }}</textarea>

      <hr>

        <!-- 게시글 목록 -->
        <div class="board-section">
            <template v-if="boards && boardsData.boards.length>0">
                <h2>해당 책 가판대 목록</h2>
                <div v-for="(board, index) in boardsData.boards" :key="index" class="board-item" @click="openRead(board.dealId)">
                  <p class="board-time">{{ board.postedTime }} 전</p>
                  <p><strong>{{ board.title }}</strong></p>
                  <p>가격: {{ board.price }}원</p>
                </div>
            </template>
            <template v-else>
                <div class="no-boards">
                <p>등록된 게시글이 없습니다.</p>
                </div>
            </template>
        </div>
        <div class="pagination">
            <button @click="goToPage(boardsData.page - 1)" :disabled="!boardsData.prev" class="pagination-button">이전</button>
            <span v-for="pageNum in pagesInCurrentBlock" :key="pageNum">
                <button @click="goToPage(pageNum)" :class="{ active: pageNum === boardsData.page }" class="pagination-button">
                  {{ pageNum }}
                </button>
            </span>
            <button @click="goToPage(boardsData.page + 1)" :disabled="!boardsData.next" class="pagination-button">다음</button>
        </div>
  


      <hr>
        
      <!-- 리뷰 섹션 -->
      <CommentForm @comment-submitted="addComment" />
      <CommentListForm
          :reviews = "boardsData.reviews"
          :isbn = "book.isbn"
          @updateBookComment = "updateBookComment"
          @deleteBookComment = "deleteBookComment"
        />
    </div>
  </template>
  
  <script setup>
import api from '@/api/api';
import AlarmIcon from '@/assets/images/bell.svg';
import NotAlarmIcon from '@/assets/images/bellNot.svg';
import emitter from '@/emitter/emitter';
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CommentForm from './CommentForm.vue';
import CommentListForm from './CommentListForm.vue';

  const store = useMainStore();
  const {loginInfo} = storeToRefs(store);
  const isBookMarkedBook = ref(false);
  const router = useRouter();
  const route = useRoute(); //라우터에서 파라미터 가져오기
  const book = ref({}); // 책 데이터를 저장할 ref 객체
  const boards = ref([]); // 게시글 데이터를 저장할 ref 객체
  
function openRead(dealId) {
  router.push({ path: `/board/read/${dealId}` });
}    

onMounted(async () => {
    const isbn = route.params.isbn;
    console.log("현재 ISBN 값:", isbn);

    // 책 정보 가져오기
    const response = await api.getBookInfo(isbn);
    book.value = response.data.bookInfo;
    isBookMarkedBook.value = response.data.isBookMarkedBook;
    fetchBoards();
    getCommentList(isbn);
});

    const boardsData = reactive({
        reviews:[],
        boards: [],
        page: 1,
        size: 3, // 한 페이지당 게시물 수
        totalPages: 1,
        start: 1,
        end: 5,
        prev: false,
        next: false,
    });

    const pagesInCurrentBlock = computed(() => {
        const pages = [];
        for (let i = boardsData.start; i <= boardsData.end; i++) {
            pages.push(i);
        }
        return pages;
    });

const fetchBoards = async () => {
    try {
        const isbn = route.params.isbn;
        const response = await api.getBoardList(boardsData.page, boardsData.size, '', true, 0, isbn);
        console.log("게시판 응답:", response);

        if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.dtoList)
        ) {
        boardsData.boards = response.data.data.dtoList.map((board) => ({
            title: board.title,
            price: board.price,
            dealId: board.dealId,
            postedTime: calculatePostedTime(board.insertDatetime),
        }));
        boardsData.page = response.data.data.page;
        boardsData.size = response.data.data.size;
        boardsData.start = response.data.data.start;
        boardsData.end = response.data.data.end;
        boardsData.prev = response.data.data.prev;
        boardsData.next = response.data.data.next;
        boardsData.totalPages = Math.ceil(response.data.data.total / boardsData.size);
        console.log("게시물 데이터:", boardsData.boards);
        } else {
        boardsData.boards = [];
        console.log("게시글이 없습니다.");
        }
    } catch (error) {
        console.error("게시물 데이터를 불러오는 중 오류 발생:", error);
    }
};

const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > boardsData.totalPages) return; // 페이지 범위 확인
    boardsData.page = pageNum; // 현재 페이지 업데이트
    fetchBoards(); // 새 페이지 데이터 호출
    };

    // 게시글 작성 시간을 계산
    function calculatePostedTime(insertDatetime) {
    const now = new Date();
    const created = new Date(insertDatetime);
    const diff = Math.floor((now - created) / 1000 / 60); // 분 단위
    if (diff < 60) return `${diff}분`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}시간`;
    const days = Math.floor(hours / 24);
    return `${days}일`;
}

async function addComment(commentData) {
      if(!commentData || !commentData.content) {
        console.warn("댓글 데이터가 올바르지 않습니다.", commentData);
        return;
      }

      console.log("댓글 등록 요청 데이터:", {
        isbn: book.value.isbn,        
        content: commentData.content
      });

      try {
        const response = await api.addComment(
          book.value.isbn,           
          commentData.content
        );

        if (response.data.status === 'success') {
          alert('댓글이 성공적으로 등록되었습니다.');
          //댓글 등록후 최신 리뷰 목록 가져오기
          await getCommentList(book.value.isbn);
        } else {
            alert('댓글 등록 실패: ' + response.data.message);
        }
      } catch (error) {
          console.error('댓글 등록 중 오류 발생:', error);
          if(error.status === 401){
            alert('로그인이 필요한 기능입니다.')
          }
          else{
              alert('삭제에 실패했습니다.')
          }
      }
    }

    async function getCommentList(isbn) {
      try {
        const response = await api.getCommentList(isbn);
        if (response.data.status === 'success') {
          boardsData.reviews = response.data.bookCommentList; //최신 댓글 목록으로 업데이트
        } else {
          console.error('댓글 목록을 가져오는데 실패했습니다.',response.data.message);
        } 
      } catch (error) {
          console.error('댓글 목록을 가져오는 중 오류 발생:', error);
      }
    }

    //댓글 수정 함수
    async function updateBookComment({commentId, newContent, email}) {
      try {
        console.log("댓글 수정 요청 데이터: ", {commentId,newContent, email});

        //책 리뷰 수정 요청
        const response = await api.updateBookComment(commentId, newContent, email);
        if( response.data.status === 'success') {
          alert('댓글이 성공적으로 수정되었습니다.');
          await getCommentList(book.value.isbn); //수정 후 댓글 목록 갱신
        } else {
          alert('댓글 수정 실패:' + response.data.message);
        }
      } catch (error) {
        console.error('댓글 수정 중 오류 발생:', error);
        if(error.status === 401){
            alert('로그인이 필요한 기능입니다.')
        }
        else{
            alert('삭제에 실패했습니다.')
        }
      }
    }

    //댓글 삭제 함수
    async function deleteBookComment({commentId,email}) {
      try{
        const response = await api.deleteBookComment(commentId,email);
        if (response.data.status === 'success') {
          alert('댓글이 성공적으로 삭제되었습니다.');
          await getCommentList(book.value.isbn,email); //삭제후 댓글 목록 갱신
        } else {
          alert('댓글 삭제 실패: ' + response.data.message);
        }        
      } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        if(error.status === 401){
            alert('로그인이 필요한 기능입니다.')
        }
        else{
            alert('삭제에 실패했습니다.')
        }
      }
    }

    const insertBookMarkBook = async ()=>{ 
      if(!loginInfo.value.email){
        emitter.emit('show-modal');
      }
      else{
        const response = await api.insertBookMarkBook(book.value.isbn); 
        if(response.data.status == "success"){
          isBookMarkedBook.value = !isBookMarkedBook.value;
        } else{ 
          window.alert(response.data.message); 
        } 
      }
    }
  </script>
  
<style scoped>



  .book-detail-container {
    padding: 10px;
    width: 800px;
    margin: 0 auto; /* 중앙 정렬 */
  }
  
  .book-info {
    display: flex;
    gap: 15px;
  }
  
  .book-image {
    max-width: 150px;
    border-radius: 8px;
  }
  
  .book-details {
    flex: 1;
  }
  
  .review-section {
    margin-top: 20px;
  }
  
  .review {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
  }

.board-section {
  margin-top: 50px; /* 위쪽 간격 */
  margin-bottom: 15px; /* 아래쪽 간격 */
}

.board-item {
  position: relative;
  padding: 10px;
  margin-bottom: 15px; /* 게시글 간 간격 */
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: transform 0.2s, border-color 0.2s;
}

.board-item:hover {
  transform: translateY(-3px);
  border-color: #8b4513;
}

.board-time {
  position: absolute; /* 부모 요소를 기준으로 위치 설정 */
  top: 10px; /* 상단 여백 */
  right: 10px; /* 오른쪽 여백 */
  font-size: 14px; /* 글씨 크기 조정 */
  color: #888; /* 색상 설정 */
  text-align: right; /* 텍스트 정렬 */
}

.pagination {
  display: flex; /* 플렉스 박스 사용 */
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  gap: 0px; /* 버튼 간 간격 제거 */
  margin-top: 50px; /* 위쪽 간격 */
  margin-bottom: 50px; /* 아래쪽 간격 */
}


.pagination-button {
  padding: 10px 20px;
  border: 0.5px solid #ccc;
  border-radius: 1px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.pagination-button:hover {
  background-color: #8b4513;
  color: #fff;
}

.pagination-button.active {
  background-color: #5a321f;
  color: #fff;
  font-weight: bold;
}

.pagination-button:disabled {
  background-color: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}


.alarm-setting {
display: flex;
align-items: center;
justify-content: flex-end;
cursor: pointer;
margin-top: 1.5%;
margin-bottom: 1.5%;
background-color: #f0f0f0;
border-radius: 20px;
padding: 8px 12px;
width: fit-content;
height: 32px;
margin-left: auto;
}

.alarm-icon {
width: 18px;
height: 18px;
margin-right: 8px;
}

.alarm-text {
font-size: 14px;
color: #333;
font-weight: bold;
}

.alarm-setting.bookmarked {
background-color: #daa681;
}

.alarm-setting.bookmarked .alarm-text {
  color: #ffffff; /* 선택되었을 때 텍스트 색상을 흰색으로 변경 */
}

.alarm-setting:not(.bookmarked) {
opacity: 0.7;
}


.book-description-textarea {
  width: 100%; /* 너비를 책 상세정보에 맞게 설정 */
  height: 250px; /* 높이 설정 */
  padding: 8px; /* 내부 여백 */
  font-size: 13px; /* 글씨 크기 */
  border: 1px solid #ddd; /* 테두리 */
  border-radius: 6px; /* 둥근 모서리 */
  background-color: #f9f9f9; /* 배경색 */
  resize: none; /* 크기 조정 비활성화 */
  color: #333; /* 글씨 색상 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤 표시 */
  line-height: 1.5; /* 줄 간격 */
  margin-bottom: 40px;
}


.h1-style{
  margin-bottom: 40px;
}

.book-details-notitle p{
  margin-bottom:20px;
}
</style>
  