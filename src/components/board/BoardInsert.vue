<template>
    <div class="container">
        
      <!-- 실물 이미지 업로드 -->
      <section class="image-upload-section">
        <h2 class="section-title">실물 이미지 업로드</h2>
        <div class="image-grid">
          <div v-for="(image, index) in displaySlots" :key="index" class="image-item" @click="selectImage(index)">
            <div v-if="images[index]">
              <img :src="images[index]" :alt="`업로드된 이미지 ${index + 1}`">
              <button @click.stop="removeImage(index)" class="remove-button">X</button>
            </div>
            <div v-else class="image-placeholder">
              <span class="upload-icon">↑</span>
              <span class="upload-text">IMAGE</span>
            </div>
          </div>
        </div>
      </section>
  
      <!-- 도서 검색 섹션 -->
      <section class="book-search-section">
        <h2 class="section-title">관련한 도서 정보 등록</h2>
        <div class="search-container">
          <!-- 검색창 컴포넌트 -->
          <div class="search-area">
            <BookSearch @book-selected="handleBookSelected" />
          </div>
  
          <!-- 선택된 책 정보 -->
          <div class="selected-book-area">
            <div v-if="selectedBook" class="selected-book-info">
              <img
                :src="selectedBook.image"
                :alt="selectedBook.title"
                class="selected-book-cover"
              />
              <div class="selected-book-details">
                <div class="book-field">
                  <span class="field-label">도서명</span>
                  <span class="field-value">{{ selectedBook.title }}</span>
                </div>
                <div class="book-field">
                  <span class="field-label">저자</span>
                  <span class="field-value">{{ selectedBook.author }}</span>
                </div>
                <div class="book-field">
                  <span class="field-label">출판사</span>
                  <span class="field-value">{{ selectedBook.publisher }}</span>
                </div>
                <div class="book-field">
                  <span class="field-label">ISBN</span>
                  <span class="field-value">{{ selectedBook.isbn }}</span>
                </div>
                <div class="book-field">
                  <span class="field-label">카테고리</span>
                  <div class="dropdown-wrapper">
                    <select v-model="form.booksCategoryId" class="category-dropdown">
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
                </div>
              </div>
            </div>
            <div v-else class="empty-book-info">
              <p>도서가 선택되지 않았습니다. <br>왼쪽에서 책을 선택해주세요.</p>
            </div>
          </div>
        </div>
      </section>

      <!--인쇄일 입력-->
      <section class="publish-and-recommend-section">
        <div class="publish-date-wrapper">
          <h2 class="section-title">인쇄일 입력</h2>        
          <input 
            type="date"
            v-model="form.publishDate"            
            class="publish-date-input"
            placeholder="출판일을 입력해주세요"
          />
        </div>
        <!--추천 가격 표시-->
        <div class="recommend-price-wrapper">          
          <div v-if="recommendedPrice !== null">
            <h2 class="section-title">추천 판매가</h2>            
            <p>                
              추천 판매가: <strong> {{ recommendedPrice.toLocaleString() }}</strong>원 입니다.
            </p>            
          </div>
        </div>
      </section>      
  
      <!-- 판매가 설정 -->
      <section class="price-section">
        <h2 class="section-title">판매가 설정</h2>
        <div class="price-input-wrapper">
          <input
            type="number"
            v-model="form.price"
            class="price-input"
            placeholder="판매가를 입력해주세요"
          >
        </div>
      </section>
  
      <!-- 판매글 작성 -->
      <section class="description-section">
        <h2 class="section-title">판매글 작성</h2>
        <div class="description-wrapper">
          <input
            type="text"
            v-model="form.title"
            class="title-input"
            placeholder="제목을 입력하세요"
          >
          <textarea
            v-model="form.content"
            class="description-textarea"
            placeholder="내용을 입력하세요"
          ></textarea>
        </div>
      </section>
  
      <!-- 등록/취소 버튼 -->
      <div class="button-group">
        <button @click="openModal" class="submit-button">등록하기</button>
        <button @click="goToBoardList" class="cancel-button">취소</button>
      </div>
    </div>

    <!--등록데이터 확인 모달-->
    <!-- 부모 컴포넌트 -->
  <BoardInsertCheck
    :visible="isModalVisible"
    :selectedCategory="selectedCategory" 
    @confirm="submitForm"
    @cancel="closeModal"
  >    
    <div>
      <div><strong>제목:</strong> {{ form.title }}</div>
      <div><strong>내용:</strong> {{ form.content }}</div>
      <div><strong>카테고리:</strong> {{ selectedCategory }}</div>
      <div><strong>판매가:</strong> {{ form.price }}</div>
      <div><strong>출판일:</strong> {{ form.publishDate }}</div>
      <div><strong>선택된 책:</strong> {{ selectedBook?.title || '선택 안됨' }}</div>
    </div>
  </BoardInsertCheck>
  </template>
  

  <script setup>
  import BookSearch from './BookSearch.vue';
  import { ref, onMounted, computed, watch } from 'vue';
  import api from '@/api/api';
  import {useRouter} from 'vue-router';
  import BoardInsertCheck from './BoardInsertCheck.vue';


  const router = useRouter();
  const selectedBook = ref(null); //선택된 책정보 변수
  const recommendedPrice = ref(null); //추천 가격 변수
  const discountValue = computed(() => selectedBook?.value?.discount || '0');

  //모달 열기
  const openModal = () => {
    isModalVisible.value = true;
  };
  //모달 닫기
  const closeModal = () => {
    isModalVisible.value = false;
  };

  //카테고리명 가져오기
  const selectedCategory = computed(() => {
    const category = categories.value.find(
        (cat) => cat.booksCategoryId === form.value.booksCategoryId
    );
    return category ? category.booksCategoryName : '선택되지 않음';
});

  //등록 요청
  const submitForm = async () => {
    //필수 필드 검증
    if (!form.value.title || !form.value.content || !form.value.booksCategoryId) {
      alert('모든 필드를 입력하세요.');
      return;
    }
    
    try {
      //FormData 생성
      const formData = getFormData();

      //API 요청
      const response = await api.BoardInsert(formData);
      if(response.data.status === 'success'){        

        //모달 닫기
        closeModal();

        //페이지 이동
        router.push('/board/list');
      } else {
        alert('등록 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('등록 중 문제가 발생했습니다:', error);
      if (error.status === 401) {
        alert('로그인이 필요한 기능입니다.')
      } else {
        alert('데이터 전송에 문제가 발생했습니다.');
      }      
    }
  };

  const isModalVisible = ref(false);
  //추천 가격 요청 api
  const getRecommendPrice = async () => {
    console.log("출판일 입력 필드 값: " + form.value.publishDate); 
    try{
      if(selectedBook.value && form.value.publishDate && selectedBook.value.discount) {
        
        const response = await api.getRecommendPrice(
          selectedBook.value.isbn,
          form.value.publishDate,
          selectedBook.value.discount, //책 원가 전달
        );        

        if (response.data && response.data.recommendedPrice) {
          recommendedPrice.value = response.data.recommendedPrice; //추천 가격 설정
          console.log("추천 판매가: ", recommendedPrice.value);
        } else {
          recommendedPrice.value =null; //추천가격 초기화
        }
      } else {
          console.error('추천 가격 요청 실패: 필요 정보 누락')
        }
      } catch(error) {
        console.error('추천 가격 요청 중 오류 발생: ', error);
      }
    };
  

  
    //이미지 파일 업로드 관련
    const images = ref([]);
    const imageFiles = ref([]);

  const form = ref({
    title: '',
    content: '',
    booksCategoryId: null,
    price: null,
    publishDate: '', //하나의 String 값으로 관리    
  });
  
  const categories = ref([]);

  // 값 감시
  watch(
    () => [form.value.publishDate, selectedBook.value],
    ([newPublishDate, newSelectedBook]) => {
      if(newPublishDate && newSelectedBook?.discount) {
        getRecommendPrice();
      }
    }
  );
  
  const handleBookSelected = (book) => {
    selectedBook.value = book;

    // 로그 추가
    console.log("선택된 책: ", book);
    console.log("discount 값:", selectedBook.value.discount);
    console.log("price 값:", selectedBook.value.price);
    console.log("discount 타입:", typeof selectedBook.value.discount);
      
};  

  const displaySlots = computed(() => {
    return images.value.length + 1
  })
  
  const selectImage = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const maxSize = 10 * 1024 * 1024; // 10MB로 설정
        // 이미지 파일 크기 확인 및 경고 메시지 표시
        if (file.size > maxSize) {
          alert("이미지 파일 크기가 10MB를 초과합니다. 다시 선택해주세요.");
        } else {
          // 파일 객체 저장
          imageFiles.value[index] = file;
          
          // 미리보기 생성
          const reader = new FileReader();
          reader.onload = (e) => {
            images.value[index] = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    };
    input.click();
  };

  const removeImage = (index) => {
    const imageFiles = images.value.filter((_, idx) => idx !== index)
    images.value = imageFiles
  }

  // FormData 생성
  const getFormData = () => {
    const formData = new FormData()

    // 본문 데이터 추가
    Object.keys(form.value).forEach((key) => {
        if (form.value[key] !== null) formData.append(key, form.value[key])
    })

    // 선택된 도서 정보 추가
    if (selectedBook.value) {
        formData.append('isbn', selectedBook.value.isbn || '');
        formData.append('bookTitle', selectedBook.value.title || '');
        formData.append('bookWriter', selectedBook.value.author || '');
        formData.append('bookPublisher', selectedBook.value.publisher || '');
        formData.append('bookImageUrl', selectedBook.value.image || '');

    }

    // 이미지 파일 추가
    imageFiles.value.forEach((file, index) => {
        if (file) formData.append('files', file, file.name)
    })

    return formData
  }
  
  
  const goToBoardList = () => {
    router.push('/board/list');
  };
  
  const getBookCategories = async () => {
    try {
      const response = await api.getBookCategories();
      categories.value = response.data.booksCategories;
      console.log("카테고리정보:", categories.value);
    } catch (error) {
      console.error('카테고리 데이터를 가져오는 중 오류가 발생했습니다.', error);
    }
  };
  
  onMounted(() => {
    getBookCategories();
  });

  
  </script>
  
  <style scoped>
  /* 전체 레이아웃 */
  .container {
    max-width: 1200px;
    margin-top: auto;
    margin-left: auto;
    margin-right: auto;
    padding: 20px; /* 기존 패딩 */
    display: block;
    box-sizing: border-box; /* 패딩 포함 크기 계산 */
    width: 60%;
  }
  
  /* 헤더 스타일 */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 40px;
  }

  /* 인쇄일 및 추천 판매가를 같은 줄에 배치 */
  .publish-and-recommend-section {
    display: flex;
    align-items: flex-start; /* 상단 정렬 */
    justify-content: space-between; /* 좌우 정렬 */
    gap: 20px; /* 항목 간격 */
    margin-bottom: 30px; /* 하단 여백 */
  }

  .publish-date-wrapper {
    flex: 1; /* 인쇄일이 왼쪽에서 공간 차지 */
  }

  
  .recommend-price-wrapper {
    flex: 1; /* 각 항목이 동일한 비율로 차지 */
    text-align: right; /* 텍스트를 오른쪽 정렬 */
  }

  .publish-date-input {
    width: 60%; /* 입력 필드 너비 설정 */
    max-width: 300px; /* 최대 너비 */
    padding: 8px; /* 내부 여백 */
    font-size: 14px; /* 글자 크기 */
  }

  .recommend-price-wrapper p {
    margin: 5px 0; /* 추천 판매가 텍스트 간격 */
    font-size: 16px; /* 추천 판매가 텍스트 크기 */
    font-weight: bold; /* 굵게 표시 */
  }

  /* 추천 판매가 텍스트 스타일 */
  .recommend-price-wrapper h2 {
    font-size: 18px; /* 추천 판매가 제목 크기 */
    font-weight: bold; /* 굵게 표시 */
  }

  
  .header-left {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  
  .nav-item {
    color: #666;
    margin-right: 20px;
    font-size: 15px;
    cursor: pointer;
  }
  
  .nav-item.active {
    color: #000;
    font-weight: 500;
  }
  
  /* 섹션 타이틀 공통 스타일 */
  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #000;
    margin-bottom: 20px;
  }
  
  /* 이미지 업로드 섹션 */
  .image-upload-section {
    margin-bottom: 40px;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  
  .image-placeholder {
    width: 100%;
    aspect-ratio: 1;
    background-color: #F8F9FA;
    border: 1px dashed #DFE2E6;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .image-item {
    width: 150px;
    height:150px;  
    
    border: 1px solid #DFE2E6;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .image-item img {
    max-width: 100%;
    max-height: 100%;
    width: 100px;
    height: 100px;
    object-fit: contain; /* 이미지를 잘리지 않도록 비율 유지 */
  }
  
  /* 검색 및 선택된 책 섹션 */
  .book-search-section {
  margin-bottom: 40px;
}

.search-container {
  display: flex;
  gap: 20px;
  max-width: 1200px; /* 최대 너비 제한 */
  margin: 0 auto; /* 중앙 정렬 */
  width: 100%; /* 전체 너비 사용 */
}

.search-area {
  flex: 4;
  border: 1px solid #DFE2E6;
  border-radius: 4px;
  padding: 20px;
  background-color: #F8F9FA;
  min-width: 0; /* flex 아이템의 최소 너비 0으로 설정 */
}

.selected-book-area {
  flex: 3;
  border: 1px solid #DFE2E6;
  border-radius: 4px;
  padding: 20px;
  background-color: #F8F9FA;
}

.selected-book-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  text-align: center;
}

.selected-book-cover {
  width: 100%;
  max-width: 150px; /* 최대 너비를 줄임 */
  height: auto; /* 비율 유지 */
  margin-bottom: 10px; /* 아래 여백 줄임 */
}

.selected-book-details {
  margin-top:30px;
  display: flex;
  flex-direction: column;
  gap: 15px; /* 간격 유지 */
  width: 100%;
  font-size: 14px; /* 텍스트 크기 */
}

.book-field {
  display: grid;
  grid-template-columns: 110px 1fr; /* 라벨 영역을 줄여 전체 글씨 왼쪽으로 이동 */
  align-items: center;
  gap: 10px;
  width: 100%;
}

.field-label {
  font-weight: bold;
  text-align: left;
  font-size: 13px;
  color: #555;
  margin-left: 30px; /* 글씨를 왼쪽으로 이동 */
}

.field-value {
  text-align: left;
  font-size: 13px;
  color: #333;
}

/* 반응형 조정 */
@media (max-width: 768px) {
  .book-field {
    grid-template-columns: 90px 1fr; /* 모바일에서는 더욱 왼쪽으로 */
  }

  .field-label {
    font-size: 12px;
    margin-left: -8px; /* 모바일에서도 동일하게 적용 */
  }

  .field-value {
    font-size: 12px;
  }
}
  
  /* 빈 상태 메시지 */
  .empty-book-info {
    font-size: 16px;
    color: #888;
  }
  
  /* 판매가 입력 */
  .price-section {    
    margin-bottom: 40px;
  }
  
  .price-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #DFE2E6;
    border-radius: 4px;
    font-size: 14px;
  }
  
  /* 판매글 작성 */
  .description-section {
    margin-bottom: 40px;
  }
  
  .title-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #DFE2E6;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 15px;
  }
  
  .description-textarea {
    width: 100%; /* 입력창과 동일한 너비 설정 */
    height: 300px;
    padding: 12px;
    border: 1px solid #DFE2E6;
    border-radius: 4px;
    font-size: 14px;
    resize: none; /* 크기 조정 비활성화 */    
    
  }
  
  /* 버튼 스타일 */
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .submit-button,
  .cancel-button {
    padding: 15px 30px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
  
  .submit-button {
    background-color: #8b4513;
    color: white;
    flex: 1;
  }
  
  .cancel-button {
    background-color: #868e96;
    color: white;
    flex: 1;
  }
  
  .submit-button:hover {
    background-color: #693610;
  }
  
  .cancel-button:hover {
    background-color: #495057;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .image-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  
    .search-container {
      flex-direction: column;
      gap: 20px;
    }
  
    .search-area,
    .selected-book-area {
      max-width: 100%;
    }
  
    .selected-book-cover {
      max-width: 200px;
    }
  }

  .dropdown-wrapper {
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: center; /* 세로 정렬 */
  width: 100%; /* 부모 컨테이너의 너비를 채움 */
}

.category-dropdown {
  width: auto; /* 드롭다운 너비 자동 조정 */
  min-width: 150px; /* 최소 너비 설정 */
  padding: 8px; /* 내부 여백 */
  border: 1px solid #DFE2E6;
  border-radius: 4px;
  font-size: 14px;
  text-align: left; /* 드롭다운 텍스트 왼쪽 정렬 */
  background-color: #F8F9FA;
}
  </style>
  