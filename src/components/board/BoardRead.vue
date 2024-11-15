<template>
    <div>
      <div class="page-container">
        
        <!-- 수평선 추가 -->
        <hr class="section-divider" />

        <div class="board-info" v-if="board">
          <div class="board-header">
            <img :src="book.image" alt="책 이미지" class="book-image" />
            <div class="board-details">
              <h1 class="board-title">{{ board.title }}</h1>
              <ul class="board-metadata">
                <li><strong>상품명:</strong> {{ book.title }}</li>
                <li><strong>카테고리:</strong> {{ categoryName }}</li>
                <li><strong>판매자:</strong> {{ board.email }}</li>
                <li><strong>판매가:</strong> {{ board.price }}원</li>
              </ul>            
              <div class="button-group">
                <!-- 작성자인 경우 -->
                <div v-if="isWriter">
                  <button class="edit-button" @click="goToBoardUpdate">수정하기</button>
                  <button class="delete-button" @click="showDeleteModal">삭제하기</button>
                  <button class="action-button">북싼챗</button>
                  <button @click="goToBoardList" class="secondary-button">목록으로</button>
                </div>
                <!-- 작성자가 아닌 경우 -->
                <div v-else>
                  <button class="action-button">책갈피</button>
                  <button class="action-button">북싼챗</button>
                  <button @click="goToBoardList" class="secondary-button">목록으로</button>
                </div>
              </div>
            </div>
          </div>
        </div>


       

        <!--삭제 확인 모달 컴포넌트 사용-->
        <DeleteModal
          :isVisible="isModalVisible"
          @confirmDelete="confirmDelete"
          @cancelDelete="closeModal"
        />

        <!-- 수평선 추가 -->
        <hr class="section-divider" />

        <!-- 상품 내용 섹션 -->
        <div class="content-section" v-if="board">
          <strong>상품 내용:</strong>
          <textarea class="content-textarea" readonly>{{ board.content }}</textarea>
        </div>
        
        <!-- 도서 정보 -->      
        <section v-if="book">
          <h2>도서 정보</h2>
          <p><strong>책 이미지:</strong><img :src="book.image" alt="책 이미지"/></p>
          <p><strong>책 제목:</strong> {{ book.title }}</p>
          <p><strong>저자:</strong> {{ book.author }}</p>
          <p><strong>출판사:</strong> {{ book.publisher }}</p>
          <p><strong>ISBN:</strong> {{ book.isbn }}</p>
          <p><strong>책 소개:</strong> {{ book.description }}</p>
        </section>     

        <!-- 도서 리뷰 리스트 컴포넌트 사용-->
        <CommentListForm
          v-if="book && book.isbn" 
          :reviews = "reviews"
          :isbn = "book.isbn"
          @updateBookComment = "updateBookComment"
          @deleteBookComment = "deleteBookComment"
        />

        <!--댓글 작성 폼-->
        <CommentForm @comment-submitted="addComment" />
      </div>
    </div>  
  </template>
  
<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRoute,useRouter } from 'vue-router';
    import api from '@/api/api';  //api.js파일 import
    import DeleteModal from './DeleteModal.vue';  //삭제 모달창 import
    import CommentForm from './CommentForm.vue';  //댓글 작성 폼 컴포넌트 import
    import CommentListForm from './CommentListForm.vue'; //댓글 목록 컴포넌트 import
     
        
    const route = useRoute();
    const router = useRouter();
    const board = ref(null); // 게시물 정보
    const book = ref(null); // 도서 정보
    const reviews = ref([]); // 리뷰 정보
    const isModalVisible = ref(false); //삭제 모달 표시 여부
    const isWriter = ref(false); // 작성자인지 여부

    const categoryMap = {
      1: "철학",
      2: "종교",
      3: "사회 과학",
      4: "순수 과학",
      5: "기술 과학",
      6: "예술",
      7: "언어",
      8: "문학",
      9: "역사",
      10: "기타",
    };


    // 계산된 속성(카테고리 명 이름 보여주기 위한 함수)
    const categoryName = computed(() => {
      if (board.value) {
        return categoryMap[board.value.booksCategoryId] || "알 수 없음";
      }
      return "알 수 없음";
    });
    
    //댓글 등록 함수
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

    //댓글 목록을 가져와서 reviews 배열을 갱신하는 함수
    async function getCommentList(isbn) {
      try {
        const response = await api.getCommentList(isbn);
        if (response.data.status === 'success') {
          reviews.value = response.data.bookCommentList; //최신 댓글 목록으로 업데이트
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

    
    

    //삭제 모달 열기
    function showDeleteModal() {
      isModalVisible.value = true;
    }

    //삭제 모달 닫기
    function closeModal() {
      isModalVisible.value = false;
    }

    //삭제 확인 함수
    async function confirmDelete() {
      try {
        const response = await api.deleteBoard(board.value.dealId, {email: board.value.email});
        if (response.data.status === "success") {
          alert("게시글이 삭제되었습니다.");
          goToBoardList(); // 삭제후 목록 페이지로 이동
        } else {
          alert("삭제 실패: " + response.data.message);
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류발생:",error);
        if(error.status === 401){
            alert('로그인이 필요한 기능입니다.')
        }
        else{
            alert('삭제에 실패했습니다.')
        }        
      } finally{
        closeModal(); // 모달 닫기
      }
    }


    //수정 페이지로 이동하는 함수
    function goToBoardUpdate() {
        const dealId = board.value.dealId;
        console.log("책정보 보내기:", book.value);
        if(dealId) {
            router.push({
                path: `/board/update/${dealId}`,
                query: {
                    bookInfo: JSON.stringify(book.value) //bookInfo를 JSON 문자열로 전달
                }
            });
        }
    }

    //목록 페이지로 이동
    function goToBoardList() {
        router.push('/board/list');
    }
      
    //게시물 정보 조회 함수
    async function getBoardRead(dealId) {
    try{
        const response = await api.getBoardRead(dealId);
        console.log('게시물 정보 :', response.data);  //게시물 정보와 댓글 정보 확인
        console.log('isWriter 값:', response.data.isWriter);  // 작성자 여부 확인
        board.value = response.data.data; //게시물 데이터
        book.value = response.data.bookData; //책 데이터
        isWriter.value = response.data.isWriter; // 작성자인지 여부
    } catch (error) {
        console.error('게시물 정보를 가져오는 중 오류 발생:', error);
    }
    }
    

    // 페이지 마운트 시 호출
    onMounted(async () => {
        const dealId = route.params.dealId;
        
        // 게시물 정보를 먼저 가져온 후, ISBN을 통해 도서 정보 가져오기(도서 리뷰 목록은 백엔드에서 게시물 단건 조회시 같이 불러오게 만들어둠)
        await getBoardRead(dealId); //게시글 단건조회
        if (board.value && board.value.isbn) {
            await getCommentList(book.value.isbn); //책리뷰 목록 가져오기       
        }
    });
  
      
    
</script>
  
<style scoped>
.board-info {
  display: flex;
  justify-content: center; /* 전체를 수평으로 중앙 정렬 */
  margin: 20px auto; /* 위아래 간격 및 중앙 정렬 */
  width: 90%; /* 너비를 90%로 설정하여 좌우 여백 조정 */
}

.board-header {
  display: flex; /* 이미지와 정보 나란히 배치 */
  align-items: flex-start; /* 상단 정렬 */
  gap: 20px; /* 이미지와 정보 간 간격 */
  width: 95%; /* 부모 컨테이너 너비에 맞춤 (더 넓게 설정) */
  margin: 0 auto; /* 중앙 정렬 */
  position: relative; /* 버튼 위치를 고정하기 위해 사용 */
}

.board-details {
  flex: 1; /* 정보 영역 확장 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 정보 상단 정렬 */
  text-align: left; /* 텍스트 정렬 */
  margin-left: auto; /* 오른쪽으로 이동 */
  max-width: 500px; /* 상세 정보 너비 제한 (원하는 너비 설정 가능) */
}

.book-image {
  width: 300px; /* 고정된 너비 */
  height: 400px; /* 고정된 높이 */
  object-fit: cover; /* 이미지가 박스에 맞게 채워짐 */
  border: 1px solid #ccc; /* 테두리 추가 */
  border-radius: 10px; /* 둥근 모서리 */
}

.board-details {
  flex: 1; /* 정보 영역 확장 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 정보 상단 정렬 */
}

.board-title {
  font-size: 1.8em; /* 제목 크기 */
  margin-bottom: 20px; /* 아래 여백 */
  text-align: left; /* 왼쪽 정렬 */
}

.board-metadata {
  list-style: none; /* 리스트 스타일 제거 */
  padding: 0;
  margin: 0; /* 리스트 간격 제거 */
}

.board-metadata li {
  margin-bottom: 10px; /* 각 항목 간 간격 */
  display: flex; /* 라벨과 값을 나란히 배치 */
}

.board-metadata li strong {
  width: 100px; /* 라벨 고정 너비 */
  text-align: left; /* 라벨 왼쪽 정렬 */
  display: inline-block; /* 강제 정렬 */
  color: #8D6E63; /* 라벨 색상 (임의) */
}

.board-metadata li span {
  flex: 1; /* 값을 확장하여 고정 너비에 맞춤 */
  text-align: left; /* 값 왼쪽 정렬 */
  color: #4E342E; /* 값 색상 (임의) */
}

.button-group {
  display: flex;
  gap: 10px; /* 버튼 간 간격 */
  position: absolute; /* 부모 컨테이너 안에서 위치 고정 */
  bottom: 10px; /* 아래쪽으로 10px 위치 */
  right: 10px; /* 오른쪽으로 10px 위치 */
}

/* 기본 버튼 스타일 */
button {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #ffffff;
}

/* 버튼별 색상 설정 */
.edit-button {
  background-color: #FFA726; /* 주황색 */
}

.delete-button {
  background-color: #E53935; /* 빨간색 */
}

.action-button {
  background-color: #8D6E63; /* 갈색 */
}

.secondary-button {
  background-color: #D7CCC8; /* 밝은 베이지 */
  color: #000;
}

/* 목록으로 버튼 스타일 */
button.secondary-button {
  background-color: #D7CCC8; /* 밝은 베이지 */
  color: #000; /* 글씨 검은색 */
}

.section-divider {
  border: none;
  height: 2px;
  background-color: #ccc;
  margin: 30px 0; /* 수평선 위아래 간격 */
  width: 100%; /* 화면 끝까지 늘리기 */
}

.content-section {
  margin: 0 auto; /* 중앙 정렬 */
  padding: 10px;
  max-width: 800px; /* 좌우 크기 조정 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
}

.content-textarea {
  width: 100%; /* 텍스트 영역 너비 */
  min-height: 100px; /* 최소 높이 */
  margin-top: 10px; /* "상품 내용"과 텍스트 영역 간 간격 */
  padding: 10px; /* 내부 여백 */
  font-size: 14px;
  border: 1px solid #ccc; /* 테두리 */
  border-radius: 5px; /* 둥근 모서리 */
  background-color: #f9f9f9;
  color: #333;
  resize: none; /* 크기 조정 불가 */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* 내부 그림자 */
  display: block; /* 블록 요소로 강제 */
}
</style>


  