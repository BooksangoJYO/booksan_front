<template>
  <div class="container py-4">
      <!-- 헤더 -->
      <header class="d-flex justify-content-between align-items-center py-3 mb-4 border-bottom">
          <div class="d-flex align-items-center gap-4">
              <div class="shopping-bag">
                  <img alt="장바구니" />
              </div>
              <nav>
                  <span class="me-3 nav-link active">중고책 찾기</span>
                  <span class="nav-link">도서 검색</span>
              </nav>
          </div>
          <div class="d-flex gap-3">
              <i class="notification-icon"></i>
              <i class="user-icon"></i>
          </div>
      </header>

      <!-- 실물 이미지 업로드 -->
      <section class="mb-5">
          <h2 class="h5 mb-4">실물 이미지 업로드</h2>
          <div class="row row-cols-1 row-cols-md-4 g-4">
              <div class="col" v-for="(image, index) in images" :key="index">
                  <div class="image-upload-card" @click="selectImage(index)">
                      <img v-if="image" :src="image" :alt="`업로드된 이미지 ${index + 1}`" 
                           class="img-fluid w-100 h-100 object-fit-cover">
                      <div v-else class="upload-placeholder d-flex flex-column align-items-center justify-content-center">
                          <span class="upload-icon mb-2">↑</span>
                          <span class="text-secondary">IMAGE</span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- 도서 검색 및 정보 섹션 -->
      <section class="mb-5">
          <h2 class="h5 mb-4">관련한 도서 정보 등록</h2>
          <div class="row g-4">
              <!-- 왼쪽: 검색 영역 -->
              <div class="col-md-6">
                  <div class="card">
                      <div class="card-body">
                          <div class="d-flex gap-2 mb-3">
                              <input type="text" 
                                     v-model="searchQuery" 
                                     class="form-control" 
                                     placeholder="도서를 검색해주세요">
                              <button class="btn btn-primary">검색</button>
                          </div>
                          <div class="search-results">
                              <div v-for="book in searchResults" 
                                   :key="book.id" 
                                   class="search-result-item p-3 border rounded mb-2"
                                   :class="{ 'border-primary': selectedBookId === book.id }"
                                   @click="selectBook(book)">
                                  <div class="d-flex gap-3">
                                      <img :src="book.cover" :alt="book.title" 
                                           class="book-thumbnail">
                                      <div>
                                          <h6 class="mb-1">{{ book.title }}</h6>
                                          <p class="text-secondary mb-1">{{ book.author }}</p>
                                          <small class="text-secondary">{{ book.publisher }}</small>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- 오른쪽: 선택된 도서 정보 -->
              <div class="col-md-6" v-if="selectedBook">
                  <div class="card">
                      <div class="card-body">
                          <div class="row">
                              <div class="col-4">
                                  <img :src="selectedBook.cover" :alt="selectedBook.title" 
                                       class="img-fluid rounded">
                              </div>
                              <div class="col-8">
                                  <div class="mb-3">
                                      <label class="form-label text-secondary">도서명</label>
                                      <p class="mb-1">{{ selectedBook.title }}</p>
                                  </div>
                                  <div class="mb-3">
                                      <label class="form-label text-secondary">저자</label>
                                      <p class="mb-1">{{ selectedBook.author }}</p>
                                  </div>
                                  <div class="mb-3">
                                      <label class="form-label text-secondary">출판사</label>
                                      <p class="mb-1">{{ selectedBook.publisher }}</p>
                                  </div>
                                  <div class="mb-3">
                                      <label class="form-label text-secondary">ISBN</label>
                                      <p class="mb-1">{{ selectedBook.isbn }}</p>
                                  </div>
                                  <div>
                                      <label class="form-label text-secondary">카테고리</label>
                                      <select class="form-select" v-model="selectedCategory">
                                          <option value="" disabled>Common State Options</option>
                                          <option v-for="option in categoryOptions" 
                                                  :key="option.value" 
                                                  :value="option.value">
                                              {{ option.label }}
                                          </option>
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- 판매가 설정 -->
      <section class="mb-5">
          <h2 class="h5 mb-4">판매가 설정</h2>
          <input type="number" 
                 v-model="price" 
                 class="form-control" 
                 placeholder="판매가를 입력해주세요">
      </section>

      <!-- 판매글 작성 -->
      <section class="mb-5">
          <h2 class="h5 mb-4">판매글 작성</h2>
          <div class="mb-3">
              <input type="text" 
                     v-model="title" 
                     class="form-control" 
                     placeholder="제목을 입력하세요">
          </div>
          <div class="mb-4">
              <textarea v-model="description" 
                        class="form-control" 
                        rows="8"
                        placeholder="내용을 입력하세요"></textarea>
          </div>
      </section>

      <!-- 등록 버튼 -->
      <button @click="submitForm" class="btn btn-primary w-100 py-3">
          등록하기
      </button>
  </div>
</template>
  
  <script>
  export default {
    name: 'BookUpload',
    data() {
      return {
        images: [null, null, null, null],
        searchQuery: '',
        selectedBookId: null,
        selectedBook:  {
            id: 1,
            cover: 'cosmos-cover.jpg',
            title: '코스모스',
            author: '칼 세이건',
            publisher: '사이언스북스',
            isbn: '9788983711892'
          },
        searchResults: [
          {
            id: 1,
            cover: 'cosmos-cover.jpg',
            title: '코스모스',
            author: '칼 세이건',
            publisher: '사이언스북스',
            isbn: '9788983711892'
          },
          {
            id: 2,
            cover: 'cosmos-cover.jpg',
            title: '코스모스 2',
            author: '칼 세이건',
            publisher: '사이언스북스',
            isbn: '9788983711893'
          },
          {
            id: 3,
            cover: 'cosmos-cover.jpg',
            title: '코스모스 3',
            author: '칼 세이건',
            publisher: '사이언스북스',
            isbn: '9788983711894'
          }
        ],
        selectedCategory: '',
        price: '',
        title: '',
        description: '',
        categoryOptions: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
          { value: '4', label: 'Option 4' },
          { value: '5', label: 'Option 5' },
          { value: '6', label: 'Option 6' },
          { value: '7', label: 'Option 7' },
        ]
      }
    },
    methods: {
      selectImage(index) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.$set(this.images, index, e.target.result);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      },
      selectBook(book) {
        this.selectedBookId = book.id;
        this.selectedBook = book;
      },
      submitForm() {
        console.log({
          images: this.images,
          selectedBook: this.selectedBook,
          category: this.selectedCategory,
          price: this.price,
          title: this.title,
          description: this.description
        });
      }
    }
  }
  </script>
  
  <style scoped>
  /* 전체 레이아웃 */
  .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
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
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      border: 1px solid #DFE2E6;
      border-radius: 4px;
  }
  
  .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
  
  .upload-icon {
      font-size: 24px;
      color: #868E96;
      margin-bottom: 8px;
  }
  
  .upload-text {
      color: #868E96;
      font-size: 14px;
  }
  
  /* 도서 검색 섹션 */
  .book-search-section {
      margin-bottom: 40px;
  }
  
  .book-search-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      min-height: 400px;
  }
  
  /* 검색 영역 스타일 */
  .search-area {
      border: 1px solid #DFE2E6;
      border-radius: 4px;
      padding: 20px;
      background-color: #F8F9FA;
  }
  
  .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
  }
  
  .search-input {
      flex: 1;
      padding: 12px;
      border: 1px solid #DFE2E6;
      border-radius: 4px;
      font-size: 14px;
  }
  
  .search-button {
      padding: 12px 24px;
      background-color: #8B4513;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
  }
  
  .search-results {
      max-height: 500px;
      overflow-y: auto;
  }
  
  .search-result-item {
      display: flex;
      gap: 15px;
      padding: 15px;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
  }
  
  .search-result-item:hover {
      background-color: #fff;
      border-color: #DFE2E6;
  }
  
  .search-result-item.active {
      background-color: #fff;
      border-color: #8B4513;
  }
  
  .result-book-cover {
      width: 60px;
      height: 85px;
      object-fit: cover;
      border-radius: 4px;
  }
  
  .result-book-info {
      flex: 1;
  }
  
  .result-book-title {
      font-weight: 500;
      margin-bottom: 5px;
  }
  
  .result-book-author,
  .result-book-publisher {
      font-size: 13px;
      color: #868E96;
  }
  
  /* 선택된 도서 영역 스타일 */
  .selected-book-area {
      border: 1px solid #DFE2E6;
      border-radius: 4px;
      padding: 20px;
      background-color: #F8F9FA;
  }
  
  .selected-book-info {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 20px;
  }
  
  .selected-book-cover {
      width: 100%;
      border-radius: 4px;
  }
  
  .selected-book-details {
      display: flex;
      flex-direction: column;
      gap: 15px;
  }
  
  /* 판매가 입력 */
  .price-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #DFE2E6;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 40px;
  }
  
  /* 판매글 작성 */
  .title-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #DFE2E6;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 15px;
  }
  
  .description-textarea {
      width: 100%;
      height: 200px;
      padding: 12px;
      border: 1px solid #DFE2E6;
      border-radius: 4px;
      font-size: 14px;
      resize: vertical;
      margin-bottom: 40px;
  }
  
  /* 등록 버튼 */
  .submit-button {
      width: 100%;
      padding: 15px;
      background-color: #8B4513;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
  }
  


    .submit-button:hover {
        background-color: #693610;
    }

    /* 반응형 디자인 */
    @media (max-width: 768px) {
        .image-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .book-info {
            grid-template-columns: 1fr;
        }
        
        .book-cover {
            width: 120px;
            margin: 0 auto;
        }
        
        .book-field {
            grid-template-columns: 80px 1fr;
        }
    }
</style>