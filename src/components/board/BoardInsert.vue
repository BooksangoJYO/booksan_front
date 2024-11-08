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

        <!--등록폼-->
        <div>
            <h3>책 등록 폼</h3>
            <form @submit.prevent="submitForm">
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
                
                <!--가격 입력-->
                <div>
                    <label for="price">가격:</label>
                    <input type="number" id="price" v-model="form.price" />
                </div>

                <!--닉네임 입력(변경될부분 나중에 로그인정보에서 가져옴)-->
                <div>
                    <label for="nickname">닉네임:</label>
                    <input type="text" id="nickname" v-model="form.nickname" />
                </div>

                <!--제출 버튼-->
                <div>
                    <button type="submit">등록</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script setup>
import BookSearch from './BookSearch.vue';
import {ref,onMounted} from 'vue';
import api from '@/api/api';

//검색 상태 관리 변수
let viewSearchStatus = ref(false);
//선택된 책 정보를 저장하는 변수
const selectedBook = ref(null);
//등록폼 데이터
const form = ref({
    title: '',
    content: '',
    booksCategoryId: null,
    price: null,
    nickname: '',
});

//카테고리 데이터를 저장하는 변수
const categories = ref([]);

//BookSearch 컴포넌트에서 선택된 책 정보를 받는 메서드
const handleBookSelected = (book) => {
    //선택된 책 정보를 등록 컴포넌트에 전달
    selectedBook.value = book;
    //책 정보가 선택되면 BookSearch 컴포넌트를 비활성화
    viewSearchStatus.value= false;
};

//검색 창 열고 닫기
const viewSearch=() =>{
    viewSearchStatus.value = !viewSearchStatus.value;
    // if(viewSearchStatus.value){viewSearchStatus.value = false;}
    // else{viewSearchStatus.value=true;}
};

//폼 제출 메서드
const submitForm = async () => {
    // 유효성 검사 추가
    if (!form.value.title || !form.value.content || !form.value.booksCategoryId || !form.value.price || !form.value.nickname) {
        alert("모든 필드를 입력하세요.");
        return;
    }

    try{
        //폼 데이터와 선택된 책 정보를 하나의 객체로 결합
        const dataToSend = {
            ...form.value, //폼 데이터(객체를 복사하여 포함)
            isbn: selectedBook.value?.isbn || null,//선택된 책의 ISBN 없으면 null
            bookTitle: selectedBook.value?.title || null,
            bookWriter: selectedBook.value?.author || null,
            bookPublisher: selectedBook.value?.publisher || null
            
        };

        //디버깅용 코드
        console.log("전송할 데이터:", dataToSend);

        //백엔드에 POST 요청
        const response = await api.BoardInsert(dataToSend);
        
        if(response.data.status==" success"){
            alert(response.data.message);
        }else{
            alert(response.data.message);
        }
        
    } catch(error) {
        console.error('데이터 전송 오류', error);
        alert('데이터 전송에 문제가 발생했습니다.')
    }
};

//카테고리 데이터를 가져오는 함수
const getBookCategories = async () => {
    try{
        const response = await api.getBookCategories();
        //첫번째 data는 응답 객체의 data필드, 두번째 data는 booksCategories 배열
        console.log(response.data);
        categories.value = response.data.booksCategories;
    } catch(error) {
        console.log("카테고리 데이터를 가져오는중 오류가 발생했습니다.", error);
    }
};


//컴포넌트가 마운트될 때 카테고리 데이터를 가져옴
onMounted(()=>{
    getBookCategories();
});
</script>