<template>
  <div class="reviews-section">
    <h2 class="review-title">REVIEW</h2>
    <div v-if="reviews && reviews.length">
      <div class="review-container" v-for="(review, index) in reviews" :key="index">
        <div class="review-header">
          <span class="review-author">{{ userMap[review.email]?.nickname || 'Unknown User' }}</span>
          <span class="review-date">{{ formatDate(review.insertDatetime) }}</span>
        </div>
        <div class="review-content" v-if="!review.isEditing">
          <p>{{ review.content }}</p>
        </div>
        <div class="review-actions">
          <div v-if="review.isEditing" class="editing-container">
            <textarea v-model="review.newContent" class="editing-textarea"></textarea>
          </div>
          <button @click="updateBookComment(review.commentId, review.newContent, review.email)" class="edit-button" v-if="review.isEditing">수정 완료</button>
          <button @click="review.isEditing = false" class="delete-button" v-if="review.isEditing">취소</button>
          <button class="edit-button" @click="review.isEditing = true; review.newContent = review.content" v-if="!review.isEditing&& review.email == loginInfo.email&& !route.path.includes('board/read')">수정</button>
          <button class="delete-button" @click="deleteBookComment(review.commentId, review.email)" v-if="!review.isEditing&& review.email == loginInfo.email && !route.path.includes('board/read') ">삭제</button>
        </div>
      </div>
    </div>
    <p v-else>등록된 리뷰가 없습니다.</p>
  </div>
</template>


<script setup>
import api from '@/api/api';
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';
import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const userMap = ref({})

//게시글 단건 조회(부모 컴포넌트)에서 책리뷰 목록 (자식 컴포넌트)로 값 전달
const props = defineProps({
  reviews: Array,
  isbn: String
});

// watch로 props.reviews 데이터 변경 감지
watch(() => props.reviews, (newReviews) => {
  if (newReviews && newReviews.length > 0) {
    console.log("새로운 reviews 데이터:", newReviews);
    const reviewsArray = [...newReviews];

    // 비동기 API 호출 및 데이터 처리
    processReviews(reviewsArray);
  }
});

// 리뷰 데이터를 처리하는 함수
const processReviews = async (reviewsArray) => {
  const userPromises = reviewsArray.map(async review => {
    const response = await api.getUserInfoByEmail(review.email);
    console.log("API response for", review.email, ":", response);
    return {
      email: review.email,
      userInfo: {
        nickname: response.data.nickname,
        imgId: response.data.imgId
      }
    };
  });

  const results = await Promise.all(userPromises);

  // userMap 업데이트
  results.forEach(result => {
    userMap.value[result.email] = result.userInfo;
    console.log("User info for", result.email, ":", result.userInfo);
  });

  console.log("최종 userMap:", userMap.value);
};

function formatDate(dateString) {
  const date = new Date(dateString);

  //날짜와 시간 포맷팅
  const year = date.getFullYear();
  const month = String(date.getMonth()+1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2,'0');

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2,'0');

  //오전,오후 처리
  const ampm = hours >= 12 ? '오후' : '오전';
  const formattedHours = hours % 12 || 12;

  //최종 포맷 조합
  return `${year}-${month}-${day} ${ampm} ${formattedHours}: ${minutes}`;
}


const store = useMainStore();
const{loginInfo} = storeToRefs(store);

const route= useRoute();

//책리뷰 목록(자식컴포넌트)에서 게시글 단건조회(부모컴포넌트)로 이벤트 전달
const emit = defineEmits(['updateBookComment', 'deleteBookComment']);

//책 리뷰 수정 완료
const updateBookComment = (commentId, newContent, email) => {
  emit('updateBookComment', { commentId, newContent, email });
};

//책 리뷰 삭제
const deleteBookComment = (commentId, email) => {
  emit('deleteBookComment', {commentId, email});
};
</script>


<style scoped>
button.edit-button {
  background-color: #D7CCC8; /* 밝은 베이지 색상 */
  color: #000; /* 검정 텍스트 */
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}

button.edit-button:hover {
  background-color: #C4B8B3; /* 호버 시 조금 더 진한 베이지 */
}

/* 삭제 버튼 */
button.delete-button {
  background-color: #D7CCC8; /* 밝은 베이지 색상 */
  color: #000; /* 검정 텍스트 */
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}

button.delete-button:hover {
  background-color: #C4B8B3; /* 호버 시 조금 더 진한 베이지 */
}

.reviews-section {
  margin: 20px auto;
  max-width: 800px;
  text-align: center; 
  padding-bottom: 30px;
}

.review-title {
  font-size: 2rem;
  font-weight: bold;
  color: #4E342E;
  margin-bottom: 20px;
  text-transform: uppercase;
  position: relative;
}

.review-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #8D6E63;
  margin: 10px auto;
}

.review-container {
  background-color: #FAF3E0;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  padding: 20px;
  text-align: left;
  
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-author {
  font-size: 1.2rem;
  font-weight: bold;
  color: #8D6E63;
}

.review-date {
  font-size: 0.9rem;
  color: #BCAAA4;
}

.review-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #4E342E;
}

.review-actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 버튼들을 오른쪽 끝으로 정렬 */
  gap: 10px;
}

.edit-button,
.delete-button {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #f5f0e8;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button:hover,
.delete-button:hover {
  background-color: #eae0d3;
}
/* 수정 상자 스타일 */
.editing-textarea {
  width: 320px !important;/* 원하는 너비 지정 */
  height: 100% !important;/* 원하는 높이 지정 */
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  background-color: #fff;
  margin-right: auto; /* 왼쪽으로 붙이기 */
}

.review-actions button {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #f5f0e8;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.review-actions button:hover {
  background-color: #eae0d3;
}

.review-actions .edit-button,
.review-actions .delete-button {
  margin-left: 0; /* 필요 없는 auto 제거 */
}
.editing-container {
  display: flex;
  align-items: flex-start; /* 상자와 버튼의 정렬 */
  gap: 10px; /* 요소 간 간격 */
  margin-right: auto;
  height:75px;
}

</style>