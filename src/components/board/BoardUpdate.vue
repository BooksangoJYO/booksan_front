<template>
    <div class="container">
      <h1>가판대 수정 페이지</h1>

      <!--첨부파일 들어가야 될 부분-->      

      <!-- 수평선 추가 -->
      <hr class="section-divider" />
  
      <!-- 선택된 책 정보 출력 -->
      <section class="selected-book-section">
        <h2 class="section-title">책 정보</h2>
        <div v-if="selectedBook" class="selected-book-info">
          <img
            :src="selectedBook.image"
            alt="책 이미지"
            class="selected-book-cover"
          />
          <div class="selected-book-details">
            <p class="book-field">
              <span class="field-label">책 제목:</span>
              <span class="field-value">{{ selectedBook.title }}</span>
            </p>
            <p class="book-field">
              <span class="field-label">저자:</span>
              <span class="field-value">{{ selectedBook.author }}</span>
            </p>
            <p class="book-field">
              <span class="field-label">출판사:</span>
              <span class="field-value">{{ selectedBook.publisher }}</span>
            </p>
            <p class="book-field">
              <span class="field-label">ISBN:</span>
              <span class="field-value">{{ selectedBook.isbn }}</span>
            </p>
          </div>
        </div>
      </section>

      <!-- 수평선 추가 -->
      <hr class="section-divider" />
  
      <!-- 수정 폼 -->
      <section class="edit-form-section">
        <h2 class="section-title">가판대 수정 폼</h2>
        <form @submit.prevent="updateForm">
          <!-- 제목 입력 -->
          <div class="form-group">
            <label for="title" class="field-label">제목:</label>
            <input
              type="text"
              id="title"
              v-model="form.title"
              class="form-input"
              placeholder="제목을 입력하세요"
            />
          </div>
  
          <!-- 내용 입력 -->
          <div class="form-group">
            <label for="content" class="field-label">내용:</label>
            <textarea
                id="content"
                v-model="form.content"
                class="form-textarea"
                placeholder="내용을 입력하세요"
            ></textarea>
          </div>
  
          <!-- 책 카테고리 -->
          <div class="form-group">
            <label for="category" class="field-label">책 카테고리:</label>
            <select
              id="category"
              v-model.number="form.booksCategoryId"
              class="form-select"
            >
              <option :value="null" disabled>카테고리를 선택하세요</option>
              <option
                v-for="category in categories"
                :key="category.booksCategoryId"
                :value="category.booksCategoryId"
              >
                {{ category.booksCategoryName }}
              </option>
            </select>
          </div>
  
          <!-- 가격 입력 -->
          <div class="form-group">
            <label for="price" class="field-label">가격:</label>
            <input
              type="number"
              id="price"
              v-model="form.price"
              class="form-input"
              placeholder="가격을 입력하세요"
            />
          </div>
          <!-- 판매 상태 선택 -->
          <div class="form-group">
            <label class="field-label">판매 상태:</label>
            <div class="radio-group">
              <label>
                <input type="radio" value="Y" v-model="form.status" /> 판매 완료
              </label>
              <label>
                <input type="radio" value="N" v-model="form.status" /> 판매 중
              </label>
            </div>
          </div>
  
          <!-- 제출 버튼 -->
          <div class="button-group">
            <button type="submit" class="submit-button">수정</button>
            <button
              type="button"
              @click="goToBoardRead"
              class="cancel-button"
            >
              취소
            </button>
          </div>
        </form>
      </section>
    </div>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from "vue-router";
  import { ref, onMounted } from "vue";
  import api from "@/api/api";
  
  const router = useRouter();
  const route = useRoute(); // 라우트에서 dealId 가져오기
  const selectedBook = ref(null);
  const dealId = route.params.dealId;
  const form = ref({
    title: "",
    content: "",
    booksCategoryId: null,
    price: null,
    status: "N", // 기본값을 'N'으로 설정하여 판매중 상태로 초기화
    email: ""
  });
  const categories = ref([]);
  
  // 게시글 정보를 세팅해주기 위해 게시글 데이터를 API 요청
  const fetchBoardData = async () => {
    try {
      const response = await api.getBoardRead(dealId);
      const boardData = response.data.data;
  
      // API로 받아온 데이터로 폼 초기화
      form.value = {
        title: boardData.title,
        content: boardData.content,
        booksCategoryId: boardData.booksCategoryId,
        price: boardData.price,
        status: boardData.status,
        email: boardData.email
      };
    } catch (error) {
      console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
    }
  };
  
  // 게시글 수정 요청
  const updateForm = async () => {
    try {
      const dataToSend = {
        ...form.value,
        isbn: selectedBook.value?.isbn || null,
        bookTitle: selectedBook.value?.title || null,
        bookWriter: selectedBook.value?.author || null,
        bookPublisher: selectedBook.value?.publisher || null,
        dealId: dealId,
      };
  
      const response = await api.updateBoard(dataToSend);
      if (response.data.status === "success") {
        alert("수정되었습니다.");
        router.push("/board/list");
      } else {
        alert("수정 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("수정 요청 오류:", error);
      if (error.status === 401) {
            alert('로그인이 필요한 기능입니다.');
        } else {
            alert('데이터 전송에 문제가 발생했습니다.');
        }
      
    }
  };
  
  // 카테고리 데이터 불러오기
  const getBookCategories = async () => {
    try {
      const response = await api.getBookCategories();
      categories.value = response.data.booksCategories;
    } catch (error) {
      console.error("카테고리 데이터 불러오기 오류:", error);
    }
  };
  
  // 취소 버튼 누르면 게시글 단건 조회로 이동
  const goToBoardRead = () => {
    const dealId = route.params.dealId; // 현재 게시물의 dealId 가져오기
    router.push(`/board/read/${dealId}`); // 단건 조회 페이지 경로로 이동
  };
  
  onMounted(() => {
    const bookInfoQuery = route.query.bookInfo;
    if (bookInfoQuery) {
      selectedBook.value = JSON.parse(bookInfoQuery);
    }
    fetchBoardData();
    getBookCategories();
  });
  </script>
  
<style scoped>
  /* 기존 CSS와 동일하게 스타일 적용 */
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .selected-book-cover {
  width: 150px; /* 이미지 너비 설정 */
  height: auto; /* 비율 유지 */
  object-fit: contain; /* 이미지 비율 유지 및 잘리지 않도록 설정 */
  margin-right: 20px; /* 이미지와 텍스트 간 여백 추가 */
}  

.form-textarea {
  width: 100%; /* 부모 요소에 맞춰 너비를 설정 */
  max-width: 800px; /* 최대 너비 설정 */
  height: 200px; /* 고정 높이 설정 */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: none; /* 크기 조정 비활성화 */  
  overflow: auto; /* 텍스트 초과 시 스크롤 */  
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.field-label {
  font-weight: bold;
  margin-right: 10px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.radio-group label {
  margin-right: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.submit-button,
.cancel-button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  background-color: #8b4513;
  color: white;
}

.cancel-button {
  background-color: #868e96;
  color: white;
}

.section-divider {
border: none;
height: 2px;
background-color: #ccc;
margin: 20px 0; /* 위아래 간격 */
}
</style>
  
