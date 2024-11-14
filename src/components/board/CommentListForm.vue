<template>
    <!-- 도서 리뷰 -->       
    <section v-if="reviews && reviews.length">
        <h2>도서 리뷰</h2>
        <ul>
          <li v-for="(review, index) in reviews" :key="index">
            <p><strong>email:</strong> {{ review.email }}</p>
            <p><strong>날짜:</strong> {{ review.insertDatetime }}</p>

            <!--수정버튼누르면 수정 폼 활성화-->
            <div v-if="review.isEditing">
              <textarea v-model="review.newContent"></textarea>
              <button @click="updateBookComment(review.commentId, review.newContent, review.email)">수정 완료</button>
              <button @click="review.isEditing = false">취소</button>
            </div>
            <div v-else>
              <p><strong>내용:</strong> {{ review.content }}</p>
              <button @click="review.isEditing = true; review.newContent = review.content">수정</button>
              <button @click="deleteBookComment(review.commentId, review.email)">삭제</button>
            </div>
            
          </li>
        </ul>
      </section>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

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

</style>