<template>
    <div>
        <h1>리뷰 등록</h1>
        <form @submit.prevent="submitComment">
            <div>
                <label for="email">email:</label>
                <input id="email" v-model="email" required />
            </div>
            <div>
                <label for="content">내용:</label>
                <textarea id="content" v-model="commentContent" required></textarea>
            </div>
            <button type="submit">등록</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref(''); 
const commentContent=ref('');

const emit = defineEmits(['comment-submitted']); //comment-submitted 이벤트 정의

const submitComment = () => {
    if(email.value.trim() ==='') {
        alert('email를 입력하세요.');
        return;
    }
    
    //trim():문자열 앞뒤의 공백이 제거됨 =>사용자가 댓글을 입력할 떄 공백만 입력했는지 확인하기 위한 용도 
    if (commentContent.value.trim() === '') {
        alert('댓글 내용을 입력하세요.');
        return;
    }

    //댓글 내용을 부모 컴포넌트로 전달
    emit('comment-submitted', {email: email.value, content: commentContent.value});
    
    //입력 필드 초기화
    email.value = '';
    commentContent.value = ''; 
};
</script>

<style scoped>

</style>