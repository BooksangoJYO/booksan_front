<template>
    <div class="container">
      <h1>가판대 수정 페이지</h1>

      <!--첨부파일 들어가야 될 부분-->      
      <!-- 실물 이미지 업로드 -->
      <section class="image-upload-section">
        <h2 class="section-title">실물 이미지 업로드</h2>
        <div class="image-grid">
          <div v-for="(image, index) in [...existingImages, ...newImages]"
              :key="index" class="image-item" 
              >
            <img :src="image.preview" />
            <button @click="image.type === 'existing' ?
                            removeImage(index, 'existing') :
                            removeImage(index, 'new')"
                    class="remove-button">X</button>
          </div>
          
          <div v-if ="displaySlots > [...existingImages, ...newImages].length"
              class="image-item"
              @click="selectImage([...existingImages, ...newImages].length)" >
            <div class="image-placeholder">
              <span class="upload-icon">↑</span>
              <span class="upload-text">IMAGE</span>
            </div>
          </div>
        </div>
      </section>

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
          <dl class="selected-book-details">
            <div class="book-field">
              <dt class="field-label">책 제목:</dt>
              <dd class="field-value">{{ selectedBook.title }}</dd>
            </div>
            <div class="book-field">
              <dt class="field-label">저자:</dt>
              <dd class="field-value">{{ selectedBook.author }}</dd>
            </div>
            <div class="book-field">
              <dt class="field-label">출판사:</dt>
              <dd class="field-value">{{ selectedBook.publisher }}</dd>
            </div>
            <div class="book-field">
              <dt class="field-label">ISBN:</dt>
              <dd class="field-value">{{ selectedBook.isbn }}</dd>
            </div>
            <div class="book-field">
              <dt class="field-label">카테고리</dt>
              <dd class="field-value">
                <select
                  id="category"
                  v-model.number="form.booksCategoryId"
                  class="category-dropdown"
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
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- 수평선 추가 -->
      <hr class="section-divider" />
  
      <!-- 판매가 섹션 -->
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
      
      <!-- 판매글 섹션 -->
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

      <!-- 판매 상태 선택 -->
      <section class="status-section">
        <div class="status-wrapper">
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
      </section>

      <!-- 제출 버튼 -->
      <div class="button-group">
        <button @click="updateForm" class="submit-button">수정</button>
        <button
          type="button"
          @click="goToBoardRead"
          class="cancel-button"
        >
          취소
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from "vue-router";
  import { ref, onMounted, computed } from "vue";
  import api from "@/api/api";
  
  const router = useRouter();
  const route = useRoute(); // 라우트에서 dealId 가져오기
  const selectedBook = ref(null);
  const dealId = route.params.dealId;
  const form = ref({
    title: "",
    content: "",
    price: null,
    status: "N", // 기본값을 'N'으로 설정하여 판매중 상태로 초기화
    email: ""
  });
  const categories = ref([]);
  
  const existingImages = ref([]);
  const newImages = ref([]);
  const imageFiles = ref([]);
  const displaySlots = computed(() => {
    const totalImages = existingImages.value.length + newImages.value.length;
    return totalImages + 1
  })
  const selectImage = (index) => {
    const input = document.createElement("input");
    input.type = 'file';
    input.accept = 'image/*'; // 이미지 파일만 선택할 수 있도록 설정
    input.onchange = (e) => {
      const file = e.target.files[0]; // 선택한 파일 가져오기
      if (file) {
        const maxSize = 10 * 1024 * 1024; // 10MB로 설정
        // 이미지 파일 크기 확인 및 경고 메시지 표시
        if (file.size > maxSize) {
          alert("이미지 파일 크기가 10MB를 초과합니다. 다시 선택해주세요.");
          return;
        }
        // 파일 객체 저장
        imageFiles.value[index] = file;
        console.log("Selected file:", file);

        // 선택한 파일을 미리보기 이미지로 설정
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.value = [
            ...newImages.value,
            {
              type: "new",
              preview: e.target.result,
              file: file
            }
          ]
          // newImages.value[index] = { .......... 이렇게 하면 existingImage 있을 때 오류남.. 왜지?
          //   type: "new",
          //   preview: e.target.result,
          //   file: file
          // }
        }
        reader.readAsDataURL(file);
      }
    }
    input.click();
  }
  
  const removeImage = (index, type) => {
    if (type == 'existing') {
      existingImages.value = existingImages.value.filter((_, idx) => idx !== index);
    } else {
      newImages.value = newImages.value.filter((_, idx) => idx !== index);
      imageFiles.value = imageFiles.value.filter((_, idx) => idx !== index);
    }
  }

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

      // 기존 이미지 설정
      existingImages.value = boardData.imageFileDTOList.map(img => ({
        type: "existing",
        imgId: img.imgId,
        preview: `/api/board/read/download/${img.imgId}`
      }))
    } catch (error) {
      console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const renderImage = (image, index) => {
    if (image.type === "existing") {
      // 기존 이미지의 경우, 서버에서 가져온 이미지를 표시
      return {
        src: image.preview,
        onRemove: () => removeImage(index, "existing")
      }
    } else {
      return {
        src: image.preview,
        onRemove: () => removeImage(index, "new")
      }
    }
  }

  const getFormData = () => {
    const formData = new FormData(); // FormData 객체 생성

    formData.append("dealId", dealId) // dealId 추가
    
    // 본문 데이터 추가
    Object.keys(form.value).forEach((key) => {
        if (form.value[key] !== null) formData.append(key, form.value[key])
    })

    if(existingImages.value.length > 0) {
      existingImages.value.forEach((img) => {
        formData.append('existingImageIds', img.imgId)
      })
    }

    // 이미지 파일 추가
    imageFiles.value.forEach((file, index) => {
      if (file) formData.append('files', file, file.name)
    })
    return formData
  }

  
  
  // 게시글 수정 요청
  const updateForm = async () => {
    //!imageFiles.value.some(file => file != null) ||
    if (!form.value.title || !form.value.content || !form.value.booksCategoryId || !form.value.price) {

      alert('모든 필드를 입력하세요.');
      return;
    }
    
    try {
      const response = await api.updateBoard(getFormData());
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
  
