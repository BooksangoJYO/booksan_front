<template>
    <div class="main-container">
      <div class="page-container">
        <!-- 상단 버튼 영역 -->
        <div class="top-actions" v-if="board">
          <!-- 작성자인 경우와 아닌 경우를 하나의 div로 처리 -->
          <div class="left-buttons">
              <template v-if="isWriter">
                  <button class="edit-button" @click="goToBoardUpdate">수정</button>
                  <button class="delete-button" @click="showDeleteModal">삭제</button>
              </template>
          </div>
          <!-- 목록으로 버튼은 항상 오른쪽에 -->
          <div class="right-buttons">
              <button @click="goToBoardList" class="secondary-button">목록으로</button>
          </div>
        </div>

        <!-- 수평선 추가 -->
        <hr class="section-divider" />

        <div class="board-info" v-if="board">
          <div class="board-header">
            <!-- 상품 이미지 슬라이더 -->
            <div class="slider-container" v-if="images">
              <div class="slider-wrapper">
                <div class="slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                  <div v-for="(image, index) in images" :key="index" class="slide">
                    <div class="image-frame">
                      <img 
                        :src="'/api/board/read/download/' + image.imgId" 
                        :alt="'Image ' + index"
                        class="slide-image"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="controls">
                  <!-- 화살표 버튼 -->
                  <button 
                    @click="prevSlide" 
                    class="arrow-button prev"
                    :disabled="currentIndex === 0"
                  >
                    &#10094;
                  </button>
                  <button 
                    @click="nextSlide" 
                    class="arrow-button next"
                    :disabled="currentIndex === images.length - 1"
                  >
                    &#10095;
                  </button>
                </div>
                
                <!-- 동그라미 인디케이터 -->
                <div class="dot-indicators" v-if="images.length > 0">
                  <button 
                    v-for="(_, index) in images" 
                    :key="index"
                    @click="goToSlide(index)"
                    :class="['dot', { active: currentIndex === index }]"
                    :aria-label="`Go to slide ${index + 1}`"
                  />
                </div>
              </div>
            </div>


            <div class="board-details">
              <button 
                v-if="isWriter"
                class="status-button" 
                @click="toggleSaleStatus"
              >                  
                {{ board.status === 'N' ? '판매 중' : '판매 완료' }}
              </button>
              <button
                v-if="!isWriter"
                class="status-view-button"
              >
                {{  board.status === 'N' ? '판매 중' : '판매 완료' }}            
              </button>
              <h1 class="board-title">{{ board.title }}</h1>
              
              <ul class="board-metadata">
                <li class="aligned-item">
                  <div class="board-title-container">
                    <strong>상품명</strong> {{ book.title }}                      
                  </div>
                </li>
                <li><strong>카테고리</strong> {{ categoryName }}</li>
                <li><strong>판매자</strong> {{ board.email }}</li>
                <li><strong>판매가</strong> {{ board.price.toLocaleString() }}원</li>
              </ul>            
              <div class="button-group">
                <!-- 작성자인 경우 -->
                <div v-if="isWriter">
                  <button class="action-button" @click="openSellerChat"><img :src="ChatIcon" alt="북마크" />  북싼챗</button>
                </div>
                <!-- 작성자가 아닌 경우 -->
                <div v-else>
                  <button
                    :class="[
                      'action-button',
                      !isBookMarked && 'not-bookmarked'
                    ]"
                    @click="toggleBookmark"
                  ><img :src="isBookMarked ? BookMarkIcon : NoneBookMarkIcon" alt="북마크" />
                    책갈피
                  </button>
                  <button class="action-button" @click="openChat"><img :src="ChatIcon" alt="채팅" />  북싼챗</button>
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
        

        <!-- 상품 내용 섹션 -->
        <div class="content-section" v-if="board">
          <strong>상품 내용</strong>
          <textarea class="content-textarea" readonly>{{ board.content }}</textarea>
        </div>

        <!-- 수평선 추가 -->
        <hr class="section-divider" />
        
        <!-- 도서 정보 -->      
        <section v-if="book">
          <div class="book-info">
            <div class="book-image">
              <img :src="book.image" alt="책 이미지" class="image"/>
            </div>
            <div class="book-details">
              <h2>도서 정보</h2>
              <p><strong>책 제목</strong> {{ book.title }}</p>
              <p><strong>저자</strong> {{ book.author }}</p>
              <p><strong>출판사</strong> {{ book.publisher }}</p>
              <p><strong>ISBN</strong> {{ book.isbn }}</p>
              <p class="book-description">
                <strong>책 소개</strong>
                <span class="description-text">{{ bookDescription }}</span>
              </p>
            </div>
          </div>
        </section>     

        <!-- 도서 리뷰 리스트 컴포넌트 사용-->
        <CommentListForm
          v-if="book && book.isbn" 
          :reviews = "reviews"
          :isbn = "book.isbn"
        />

        
      </div>
    </div>  
  </template>
  
<script setup>
import api from '@/api/api'; //api.js파일 import
import NoneBookMarkIcon from '@/assets/images/bookMarkWhite.svg';
import BookMarkIcon from '@/assets/images/bookMarkWhiteFill.svg';
import ChatIcon from '@/assets/images/chatWhite.svg';
import emitter from '@/emitter/emitter';
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CommentListForm from './CommentListForm.vue'; //댓글 목록 컴포넌트 import
import DeleteModal from './DeleteModal.vue'; //삭제 모달창 import

//책소개 부분에 정보가 없을 경우 글씨 띄우는 부분
const bookDescription = computed (() => {
  return book.value?.description || "책 소개 정보가 없습니다.";
});

const store = useMainStore();
const{loginInfo} = storeToRefs(store);
const route = useRoute();
const router = useRouter();
const board = ref(null); // 게시물 정보
const book = ref(null); // 도서 정보
const reviews = ref([]); // 리뷰 정보
const isModalVisible = ref(false); //삭제 모달 표시 여부
const isWriter = ref(false); // 작성자인지 여부
const isBookMarked = ref(false);

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

//가판대 판매여부 변경 버튼
async function toggleSaleStatus() {
  const newStatus = board.value.status === 'N' ? 'Y' : 'N';
  
  try{
    // API 호출로 서버에 변경 사항 저장
    await api.updateBoardStatus(board.value.dealId, newStatus)
    
    //상태 업데이트
    board.value.status = newStatus;

    //알림 메세지
    alert(`판매 상태가 ${newStatus === 'N' ? '판매중' : '판매완료'}로 변경되었습니다.`);

  } catch(error) {
    console.error('판매 상태 변경 오류: ',error);
    alert('판매 상태를 변경하지 못했습니다.')
  }
  }
// 이미지 슬라이드 관련 코드
const images = ref([]);
const currentIndex = ref(0)

const nextSlide = () => {
  if (currentIndex.value < images.value.length - 1) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToSlide = (index) => {
  currentIndex.value = index
}
// 여기까지

// 계산된 속성(카테고리 명 이름 보여주기 위한 함수)
const categoryName = computed(() => {
  if (board.value) {
    return categoryMap[board.value.booksCategoryId] || "알 수 없음";
  }
  return "알 수 없음";
});



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
                isbn: book.value.isbn //ISBN만 전달
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
      board.value = response.data.data; //게시물 데이터
      images.value = board.value.imageFileDTOList; //이미지 데이터
      book.value = response.data.bookData; //책 데이터
      isWriter.value = response.data.isWriter; // 작성자인지 여부
      isBookMarked.value =  response.data.data.isBookMarked === 'Y'
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

//채팅방 생성후 이동
const openChat = async () =>{
    if(!loginInfo.value.email){
      emitter.emit('show-modal');
    }
    else{
      console.log("오픈챗실행");
      const writerEmail = board.value.email;
      const dealId = board.value.dealId;
      await api.postChatRoom(board.value.title,dealId,writerEmail)
      .then(response => {
          const chatRoom = response.data; // 서버에서 반환된 데이터
          sessionStorage.setItem('chat.roomId',chatRoom.roomId);
          window.open(
            'http://localhost:5173/chat/room',
            '채팅방',
            'width=500,height=600,top=100,left=500,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no'
          );
      })
      .catch(err => {
          alert("서버 오류입니다. 다시시도해주세요");
      });
    }
}

const openSellerChat = async () => {
  window.open(
          'http://localhost:5173/chat/room/'+board.value.dealId,
          '채팅방',
          'width=800,height=600,top=100,left=500,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no'
        );
}

const toggleBookmark = async ()=>{
  if(!loginInfo.value.email){
    emitter.emit('show-modal');
  }
  else{
    const response = await api.insertBookMark(board.value.dealId); 
    if(response.data.status){
      isBookMarked.value = !isBookMarked.value;
    } 
  }
}
</script>
  
<style scoped>
.main-container {
  max-width: 1010px;
  width: 100%;
  margin: 0 auto;  /* 중앙 정렬을 위해 필수 */
}

.top-actions {
  display: flex;
  justify-content: space-between;  /* 양끝 정렬 */
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 10px;
}

.left-buttons {
  display: flex;
  font-size: 14px;
  gap: 5px;
}

.right-buttons {
  margin-left: auto;  /* 오른쪽으로 밀기 */
  font-size: 14px;
}

.board-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 우측 정렬 */
  gap: 10px; /* 버튼과 아이콘 간격 */
  margin-top: 10px;
}

.status-button {
  margin-left: auto; /* 왼쪽 여백을 자동으로 설정해 오른쪽으로 밀림 */
  background-color: #8b4513; 
  color: #ffffff; /* 버튼 텍스트 색상 */
  padding: 5px 10px; /* 좌우 패딩을 줄임 */
  border: none;
  border-radius: 5px;
  font-size: 16px; /* 텍스트 크기 조정 */
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  flex-shrink: 0; /* 버튼 크기 고정 */
  min-width: 80px; /* 최소 너비 */
  max-width: 100px; /* 최대 너비 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */

}

.status-button:hover {
  background-color: #693610; /* 더 어두운 갈색 */
}

.bookmark-icon img {
  width: 24px; /* 아이콘 크기 */
  height: 24px;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease; /* 부드러운 애니메이션 */
}

.board-info {
  display: flex;
  justify-content: center; /* 전체를 수평으로 중앙 정렬 */
  margin: 20px auto; /* 위아래 간격 및 중앙 정렬 */
  width: 90%; /* 너비를 90%로 설정하여 좌우 여백 조정 */
}

.board-header {
  display: flex;
  align-items: flex-start;
  margin: 0 100px 0 0;
  position: relative; /* 버튼 위치를 고정하기 위해 사용 */
}

.board-header .book-image {
  width: 200px; /* 위쪽 이미지 크기를 200px로 줄임 */
  height: auto; /* 비율 유지 */
  border-radius: 8px; /* 둥근 모서리 */
  border: 1px solid #ccc; /* 테두리 */
}

.book-image .image {
  height: 540px;
  width: 350px;
}

.board-details {
  position: relative; /* 상대적 위치 설정 */  
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  margin-left: 0px; /* 왼쪽 여백 제거 */
  max-width: 100%; /* 텍스트 영역의 최대 너비 설정 */
}

.book-info {
  display: flex;
  align-items: flex-start;
  justify-content: center; /* 중앙 정렬 */
  gap: 20px; /* 이미지와 텍스트 간격 */
  max-width: 1200px;
  margin: 0 auto; /* 중앙 정렬 */
  padding: 20px 0;
}


.aligned-item {
  display: flex; /* 플렉스 박스로 설정 */
  align-items: flex-start; /* 항목을 위쪽 정렬 */
  
  height: 40px;
}


.aligned-item .status-button {
  margin-left: 20px;
  padding: 5px 15px;
  font-size: 0.9em;
  height: 30px;
  min-width: 80px;
}

.aligned-item strong {
  flex-shrink: 0; /* 강제로 줄바꿈되지 않도록 설정 */
}

.aligned-item span {
  flex: 1; /* 값 영역이 남은 공간을 채우도록 설정 */
  white-space: normal; /* 줄바꿈 허용 */
  word-wrap: break-word; /* 단어가 너무 길 경우 줄바꿈 */
  overflow-wrap: break-word; /* 단어가 화면을 넘어갈 경우 줄바꿈 */
  line-height: 1.5; /* 줄 간격 */
}

/* 이미지 슬라이더 관련 */
.slider-container {
  max-width: 600px;
  margin: 0 auto;
  width: 300px;
}

.slider-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.slides {
  display: flex;
  transition: transform 0.3s ease-in-out;
}

.slide {
  min-width: 100%;
  height: 100%;
}

/* 정사각형 프레임 설정 */
.image-frame {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 정사각형 비율 유지 */
  background-color: #f0f0f0; /* 빈 공간 회색 처리 */
}

.slide-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}
/* 화살표 버튼 스타일 */
.arrow-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  z-index: 2;
}

.arrow-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.arrow-button:disabled {
  background-color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

/* 동그라미 인디케이터 스타일 */
.dot-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot:hover {
  background-color: #999;
}

.dot.active {
  background-color: #4CAF50;
}
/* 여기까지 */

.book-image {
  flex: 0 0 350px; /* 고정 너비 */
}



.book-image img {
  width: 100%;
  height: auto;
  border-radius: 8px; /* 둥근 모서리 */
  border: 1px solid #ccc; /* 테두리 */
}

.book-details {
  flex: 1; /* 나머지 공간 채움 */
  text-align: left;
}

.book-details h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.book-details p {
  margin: 10px 0;
  line-height: 1.6;
}

.book-details p strong {
  color: #8D6E63; /* 상품명, 카테고리 등과 동일한 색상 */
  font-weight: bold; /* 강조 */
}

.board-details {
  flex: 1; /* 정보 영역 확장 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 정보 상단 정렬 */
}

.board-title {
  font-size: 2.5em; /* 제목 크기 */
  font-weight: bold;
  text-align: left; /* 왼쪽 정렬 */
  word-wrap: break-word; /* 단어가 길면 줄바꿈 */
  overflow-wrap: break-word; /* 단어가 길어질 경우 줄바꿈 */
  line-height: 1.4; /* 줄 간격 */
  white-space: normal; /* 텍스트 줄바꿈 허용 */
  max-width: 100%; /* 부모 요소의 너비를 넘지 않도록 제한 */
}

.status-view-button {
  margin-left: auto; /* 왼쪽 여백을 자동으로 설정해 오른쪽으로 밀림 */  
  background-color: #8b4513; 
  color: #ffffff; /* 버튼 텍스트 색상 */
  padding: 5px 10px; /* 좌우 패딩을 줄임 */
  border: none;
  border-radius: 5px;
  font-size: 16px; /* 텍스트 크기 조정 */
  text-align: center;
  cursor: default; /* 버튼 클릭 비활성화 */
  font-weight: bold;
  flex-shrink: 0; /* 버튼 크기 고정 */
  min-width: 80px; /* 최소 너비 */
  max-width: 100px; /* 최대 너비 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

.board-title-container {
  display: block; /* flex 대신 block 사용 */
  word-wrap: break-word; /* 긴 단어 줄바꿈 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
  max-width: 100%; /* 부모 컨테이너 너비를 초과하지 않도록 설정 */
  line-height: 1.5; /* 줄 간격 */
}

.board-title-container strong {
  display: inline-block; /* strong 태그를 블록 형태로 변경 */
  margin-bottom: 5px; /* 제목과 텍스트 사이 여백 */
}

.board-title-container span {
  display: block; /* 텍스트 줄바꿈 허용 */
  word-wrap: break-word; /* 긴 단어 줄바꿈 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
  white-space: normal; /* 텍스트 줄바꿈 허용 */
  max-width: 100%; /* 부모 컨테이너 초과 방지 */
}


.board-metadata {
  list-style: none; /* 리스트 스타일 제거 */
  padding: 0;
  margin: 0; /* 리스트 간격 제거 */
}

.board-metadata li {
  font-size: 1.2em;
  margin: 15px 0;
  display: block; /* 텍스트 줄바꿈을 위해 flex 제거 */
  white-space: normal; /* 줄바꿈 허용 */
  word-wrap: break-word; /* 긴 단어 줄바꿈 */
  overflow-wrap: break-word; /* CSS3 표준 줄바꿈 */
}

ul.board-metadata {
  width: 600px; /* 기존 크기에서 좌우 너비를 확장 */
  max-width: 100%; /* 부모 요소의 크기를 초과하지 않도록 설정 */
  margin: 0 auto; /* 중앙 정렬 */
}

.board-metadata li {
  font-size: 1.2em; /* 항목 글씨 크기 */
  margin: 15px 0; /* 상품명과 동일한 위아래 간격 */
  display: flex; /* 라벨과 값을 나란히 배치 */
  align-items: center; /* 수직 정렬 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}


.board-metadata li strong {
  width: 150px; 
  text-align: left;
  display: inline-block;
  color: #8D6E63;
  font-size: 1.4em;
  white-space: nowrap;
}

.board-metadata li span {
  display: inline-block; /* inline 요소의 크기 제어 */
  max-width: 100%; /* 부모 요소 너비에 맞게 제한 */
  font-size: 1.1em; /* 글자 크기 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
  color: #8B4513; /* 텍스트 색상 */
  white-space: normal; /* 줄 바꿈 허용 */
  word-wrap: break-word; /* 단어가 너무 길 경우 줄 바꿈 */
  overflow-wrap: break-word; /* 단어가 화면을 넘어갈 경우 줄 바꿈 */
  line-height: 1.5; /* 줄 간격 설정 */
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 47px; /* 버튼과 텍스트 사이의 간격 */
  justify-content: flex-start;
}

/* 기본 버튼 스타일 */
button {
  font-size: 1.1em; /* 버튼 텍스트 크기 증가 */
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #ffffff;
}
.action-button.not-bookmarked {
  opacity: 0.5;
  background-color: #8D6E63;  /* 더 밝은 브라운 */
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);  /* 안쪽 하얀 테두리 효과 */
  margin-right:5px;
}

/* 버튼별 색상 설정 */
.edit-button {
  background-color: #808080;
}

.delete-button {
  background-color: #808080;
}

.action-button {
  background-color: #8D6E63; /* 갈색 */
  width: 294px;
  margin-left: 1px;
}
.action-button:hover {
  background-color: #6D4C41; /* 좀 더 진한 갈색 */
}
.secondary-button {
  background-color: #D7CCC8; /* 밝은 베이지 */
  color: #000;
  margin-left: 600px;
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
  margin: 10px auto; /* 수평선 위아래 간격 및 중앙 정렬 */
  width: 100%;
}

.content-section {
  margin: 0 auto; /* 중앙 정렬 */
  padding: 10px;
  max-width: 1200px; /* 위의 board-header와 동일한 max-width로 맞춤 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
}

.content-textarea {
  width: 100%; /* 텍스트 영역 너비 */
  min-height: 150px; /* 최소 높이 */
  margin-top: 10px; /* "상품 내용"과 텍스트 영역 간 간격 */
  padding: 10px; /* 내부 여백 */
  font-size: 14px;
  border: 1px solid #ccc; /* 테두리 */
  border-radius: 5px; /* 둥근 모서리 */
  background-color: #f9f9f9;
  color: #333;
  resize: none; /* 크기 조정 불가 */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* 내부 그림자 */
  max-width: 1200px; /* 위의 컨텐츠와 동일한 넓이 설정 */
  margin-left: auto; /* 좌우 중앙 정렬 */
  margin-right: auto; /* 좌우 중앙 정렬 */
}


.book-description strong {
  color: #8D6E63;
  font-size: 1.1em;
  display: block;
}

.description-text {
  margin-top: 14px;
  display: block;
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  line-height: 1.6;
  font-size: 17px;
  color: #333;
}
</style>


  