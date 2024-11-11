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
  
      <!-- 도서 리뷰 -->       
      <section v-if="reviews && reviews.length">
        <h2>도서 리뷰</h2>
        <ul>
          <li v-for="(review, index) in reviews" :key="index">
            <p><strong>UID:</strong> {{ review.uid }}</p>
            <p><strong>날짜:</strong> {{ review.insertDatetime }}</p>
            <p><strong>내용:</strong> {{ review.content }}</p>
          </li>
        </ul>
      </section>
    </div>
  </template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute,useRouter } from 'vue-router';
    import api from '@/api/api';  //api.js파일 import
    import DeleteModal from './DeleteModal.vue';  //삭제 모달창 import
  
    const route = useRoute();
    const router = useRouter();
    const board = ref(null); // 게시물 정보
    const book = ref(null); // 도서 정보
    const reviews = ref([]); // 리뷰 정보
    const isModalVisible = ref(false); //삭제 모달 표시 여부
    
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
        }
    });
  
      
    
</script>
  
  <style scoped>
  /* 스타일은 필요에 따라 추가 */
  </style>
  