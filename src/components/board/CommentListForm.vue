<template>
  <div class="reviews-section">
    <h2 class="review-title">REVIEW</h2>
    <div v-if="reviews && reviews.length">
      <div class="review-container" v-for="(review, index) in reviews" :key="index">
        <div class="review-header">
          <span class="review-author">{{ review.email }}</span>
          <span class="review-date">{{ review.insertDatetime }}</span>
        </div>
        <div class="review-content">
          <p>{{ review.content }}</p>
        </div>
        <div class="review-actions">
          <button class="edit-button" @click="review.isEditing = true; review.newContent = review.content" v-if="!review.isEditing&& !route.path.includes('board/read')">수정</button>
          <button class="delete-button" @click="deleteBookComment(review.commentId, review.email)" v-if="!review.isEditing&& !route.path.includes('board/read') ">삭제</button>
          <div v-if="review.isEditing">
            <textarea v-model="review.newContent"></textarea>
            <button @click="updateBookComment(review.commentId, review.newContent, review.email)">수정 완료</button>
            <button @click="review.isEditing = false">취소</button>
          </div>
        </div>
      </div>
    </div>
    <p v-else>등록된 리뷰가 없습니다.</p>
  </div>
</template>


<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRoute } from 'vue-router';

const route= useRoute();
//게시글 단건 조회(부모 컴포넌트)에서 책리뷰 목록 (자식 컴포넌트)로 값 전달
const props = defineProps({
  reviews: Array,
  isbn: String
});

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
  gap: 10px;
}
</style>