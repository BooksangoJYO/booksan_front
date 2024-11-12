<template>
    <div>
      <h1>게시물 단건 조회 페이지</h1>
      
      <!-- 게시물 정보 -->
      <section v-if="board">
        <h2>게시물 정보</h2>
        <p><strong>게시글 번호:</strong> {{ board.dealId }}</p>
        <p><strong>제목:</strong> {{ board.title }}</p>
        <p><strong>작성자:</strong> {{ board.email }}</p>
        <p><strong>가격:</strong> {{ board.price }}원</p>
        <p><strong>내용:</strong> {{ board.content }}</p>
      </section>

      <div>
        <button @click="goToBoardUpdate">수정</button>
        <button @click="showDeleteModal">삭제</button>
        <button @click="goToBoardList">목록으로</button>
      </div>

      <!--삭제 확인 모달 컴포넌트 사용-->
      <DeleteModal
        :isVisible="isModalVisible"
        @confirmDelete="confirmDelete"
        @cancelDelete="closeModal"
      />
      
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
  </template>
  
<script setup>
    import { ref, onMounted } from 'vue';
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
    
    //댓글 등록 함수
    async function addComment(commentData) {
      if(!commentData || !commentData.email || !commentData.content) {
        console.warn("댓글 데이터가 올바르지 않습니다.", commentData);
        return;
      }

      console.log("댓글 등록 요청 데이터:", {
        isbn: book.value.isbn,
        email: commentData.email,
        content: commentData.content
      });

      try {
        const response = await api.addComment(
          book.value.isbn, 
          commentData.email, 
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
          alert('댓글 등록에 실패했습니다.');
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
        alert('댓글 수정에 실패했습니다.');
      }
    }

    //댓글 삭제 함수
    async function deleteBookComment(commentId) {
      try{
        const response = await api.deleteBookComment(commentId);
        if (response.data.status === 'success') {
          alert('댓글이 성공적으로 삭제되었습니다.');
          await getCommentList(book.value.isbn); //삭제후 댓글 목록 갱신
        } else {
          alert('댓글 삭제 실패: ' + response.data.message);
        }        
      } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        alert('댓글 삭제에 실패했습니다.')
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
        const response = await api.deleteBoard(board.value.dealId);
        if (response.data.status === "success") {
          alert("게시글이 삭제되었습니다.");
          goToBoardList(); // 삭제후 목록 페이지로 이동
        } else {
          alert("삭제 실패: " + response.data.message);
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류발생:",error);
        alert("삭제에 실패했습니다.");
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
        board.value = response.data.data;
        reviews.value = response.data.bookCommentList;
    } catch (error) {
        console.error('게시물 정보를 가져오는 중 오류 발생:', error);
    }
    }

    // 도서 정보 조회 함수(isbn) (네이버 API 호출)
    async function getBookInfo(isbn) {
    try{
        const response = await api.getBookInfo(isbn);
        console.log("도서정보 데이터확인: ",response.data); //도서정보확인
        book.value = response.data.items[0];            
    } catch (error) {
        console.error('도서 정보를 가져오는 중 오류 발생:', error);
    }
    }  
    

    // 페이지 마운트 시 호출
    onMounted(async () => {
        const dealId = route.params.dealId;
        
        // 게시물 정보를 먼저 가져온 후, ISBN을 통해 도서 정보 가져오기(도서 리뷰 목록은 백엔드에서 게시물 단건 조회시 같이 불러오게 만들어둠)
        await getBoardRead(dealId); //게시글 단건조회
        if (board.value && board.value.isbn) {
            await getBookInfo(board.value.isbn);  //책정보 얻기    
            await getCommentList(book.value.isbn); //책리뷰 목록 가져오기       
        }
    });
  
      
    
</script>
  
  <style scoped>
  /* 스타일은 필요에 따라 추가 */
  </style>
  