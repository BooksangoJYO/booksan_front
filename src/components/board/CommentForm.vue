<template>
    <div class="review-form">
      <h2>리뷰 작성</h2>
      <form @submit.prevent="submitComment">
        <textarea v-model="commentContent" placeholder="리뷰 내용을 입력하세요..." required></textarea>
        <button type="submit">등록</button>
      </form>
    </div>
  </template>

<script setup>
import { ref } from 'vue';

const commentContent=ref('');
const emit = defineEmits(['comment-submitted']); //comment-submitted 이벤트 정의

const submitComment = () => {    
    
    //trim():문자열 앞뒤의 공백이 제거됨 =>사용자가 댓글을 입력할 떄 공백만 입력했는지 확인하기 위한 용도 
    if (commentContent.value.trim() === '') {
        alert('댓글 내용을 입력하세요.');
        return;
    }

    //댓글 내용을 부모 컴포넌트로 전달
    emit('comment-submitted', {content: commentContent.value});
    
    //입력 필드 초기화    
    commentContent.value = ''; 
};
</script>

<style scoped>
/* textarea 스타일 */
textarea {
    resize: none; /* 크기 조절 비활성화 */
    width: 100%; /* 너비를 100%로 고정 */
    height: 100px; /* 높이를 원하는 크기로 설정 */
    padding: 10px; /* 내부 여백 추가 */
    font-size: 1rem; /* 글꼴 크기 설정 */
    border-radius: 5px; /* 모서리 둥글게 */
    border: 1px solid #ccc; /* 테두리 추가 */
    background-color: #f9f9f9; /* 배경색 설정 */
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* 내부 그림자 */
}

/* textarea 포커스 시 스타일 */
textarea:focus {
    outline: none; /* 포커스 시 기본 윤곽선 제거 */
    border-color: #8D6E63; /* 포커스 시 테두리 색상 */
}

/* .review-form 스타일 */
.review-form {
  margin: 20px auto; /* 중앙 정렬 및 여백 추가 */
  max-width: 800px; /* 최대 너비 설정 */
  text-align: center; /* 텍스트 중앙 정렬 */
}

/* .review-form 내 textarea 스타일 */
.review-form textarea {
  width: 100%; /* 부모 요소 너비에 맞춤 */
  height: 100px; /* 높이를 고정 */
  border: 1px solid #ccc; /* 테두리 */
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 10px; /* 내부 여백 추가 */
  font-size: 1rem; /* 글꼴 크기 */
  margin-bottom: 10px; /* 아래 여백 추가 */
}

/* .review-form 내 button 스타일 */
.review-form button {
  background-color: #8D6E63; /* 버튼 배경색 */
  color: #fff; /* 버튼 텍스트 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 버튼 모서리 둥글게 */
  padding: 10px 20px; /* 버튼 여백 */
  font-size: 1rem; /* 버튼 글꼴 크기 */
  cursor: pointer; /* 마우스 포인터 변경 */
  margin-bottom: 50px; /* 등록 버튼 아래 공간 추가 */
}

/* 버튼 hover 시 스타일 */
.review-form button:hover {
  background-color: #6D4C41; /* hover 시 버튼 배경색 변경 */
}
</style>