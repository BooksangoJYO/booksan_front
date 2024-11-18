<template>
    <div class="book-detail-container">
      <!-- 책 이미지와 정보 -->
      <div class="book-info">
        <img :src="book.image" alt="책 이미지" class="book-image" />
        <div class="book-details">
          <h1>{{ book.title }}</h1>
          <p>저자: {{ book.author }}</p>
          <p>출판사: {{ book.publisher }}</p>
          <p>ISBN: {{ book.isbn }}</p>
        </div>
      </div>
      <h2>책 소개</h2>
    <p>{{ book.description }}</p>

      <hr>

        <!-- 게시글 목록 -->
        <div class="board-section">
            <template v-if="boards && boardsData.boards.length>0">
                <h2>이 책 지금 바로 살 수 있어요</h2>
                <div v-for="(board, index) in boardsData.boards" :key="index" class="board-item" @click="openRead(board.dealId)">
                <p><strong>{{ board.title }}</strong></p>
                <p>{{ board.postedTime }} 전</p>
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
  import { ref, onMounted, reactive ,computed} from 'vue';
  import { useRoute,useRouter } from 'vue-router';
  import api from '@/api/api';
  import CommentListForm from './CommentListForm.vue';
  import CommentForm from './CommentForm.vue';

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
    console.log("책 정보:", book.value);
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
  </script>
  
  <style scoped>
  .book-detail-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto; /* 중앙 정렬 */
  }
  
  .book-info {
    display: flex;
    gap: 20px;
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
  </style>
  