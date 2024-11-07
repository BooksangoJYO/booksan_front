<template>
    <div>
        <!--책 검색 컴포넌트(BookSearch) 포함-->
        <button @click="viewSearch">검색</button>
        <BookSearch v-if="viewSearchStatus" @book-selected="handleBookSelected"/>
    
        <!--선택된 책 정보 출력-->
        <div v-if="selectedBook">
            <h3>선택된 책 정보</h3>
            <p>책 이미지: <img :src="selectedBook.image" alt="책 이미지"/></p>
            <p>책 제목: {{ selectedBook.title }}</p>
            <p>책 저자: {{ selectedBook.author }}</p>
            <p>책 출판사: {{ selectedBook.publisher }}</p>
        </div>

        <h3>게시물 수정폼</h3>
        <!--게시물 수정 폼-->
        <form @submit.prevent="submitUpdateForm">
            <!--제목 입력-->
            <div>
                <label for="title">제목:</label>
                <input type="text" id="title" v-model="form.title" />                
            </div>
            <!--내용 입력-->
            <div>
                <label for="content">내용:</label>
                <textarea id="content" v-model="form.content"></textarea>
            </div>

            <!--책 카테고리(드롭다운)-->
            <div>
                <label for="category">책 카테고리:</label>
                <select id="category" v-model.number="form.booksCategoryId">
                    <option :value="null" disabled>카테고리를 선택하세요</option>
                    <option v-for="category in categories" :key="category.booksCategoryId" :value="category.booksCategoryId">
                        {{ category.booksCategoryName }}
                    </option>
                </select>
            </div>

            <!--제출 버튼-->
            <div>
                <button type="submit">수정하기</button>
                <button>취소</button>
            </div>
        </form>
    </div>
</template>


<script setup>
import {ref, onMounted} from 'vue';
import api from '@/api/api';
import {useRoute} from 'vue-router';

//라우터를 통한 전달된 게시물 ID 가져오기
const route = useRoute();
//라우트에서 dealId를 가져옴
const dealId= route.params.dealId;

//등록 폼 데이터(수정할 데이터 포함)
const form = ref({
    title:'',
    content:'',
    booksCategoryId: null,
    price: null,
    nickname: '', //변경불가
});

//카테고리 데이터를 저장하는 변수
const categories = ref([]);

//게시물 데이터를 가져와서 폼에 채우는 함수
const getBoardData= async() => {
    try{
        const response = await api.getBoardById(dealId); //게시물 데이터 가져오기
        const boardData = response.data;

        //폼 데이터에 기존 게시물 데이터 설정
        form.value.title = boardData.title;
        form.value.content = boardData.content;
        form. value.booksCategoryId = boardData.booksCategoryId;
        form.value.price = boardData.price;
        form.value.nickname = boardData.nickname; //추후에 로그인 정보에서 가져올수있음(변경사항)
    } catch(error) {
        console.log("게시물 데이터를 가져오는 중 오류 발생:", error);
    }
};

//카테고리 데이터를 가져오는 함수
const getBookCategories = async () => {
    try{
        const response = await api.getBookCategories();
        categories.value = response.data.booksCategories;
    }catch(error) {
        console.log("카테고리 데이터를 가져오는 중 오류 발생:", error);
    }
};

//폼 제출 메서드(수정 요청)
const submitUpdateForm = async () => {
    //유효성 검사 추가
    if(!form.value.title || !form.value.content || !form.value.booksCategoryId || !form.value.price){
        alert("모든 필드를 입력하세요.");
        return;
    }

    try {
        const response = await api.updateBoard(dealId, form.value); // 수정 요청
        if (response.data.status === "success") {
            alert("게시물이 성공적으로 수정되었습니다.");
        } else {
            alert("게시물 수정에 실패했습니다.");
        }
    } catch (error) {
        console.error('게시물 수정 오류', error);
        alert('게시물 수정에 문제가 발생했습니다.');
    }
    
};


// 컴포넌트가 마운트될 때 게시물 및 카테고리 데이터 가져오기
onMounted(() => {
    getBoardData();
    getBookCategories();
});


</script>


<style>

</style>