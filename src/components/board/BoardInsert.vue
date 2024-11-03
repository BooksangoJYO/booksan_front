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
                    <select>
                        <option></option>

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
import {ref} from 'vue';

//검색 상태 관리 변수
let viewSearchStatus = ref(false);
//선택된 책 정보를 저장하는 변수
const selectedBook = ref(null);
//등록폼 데이터
const form = ref({
    title: '',
    content: '',
    category: '',
    price: 'null',
    nickname: '',
});

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
    try{
        //폼 데이터와 선택된 책 정보를 하나의 객체로 결합
        const dataToSend = {
            ...form.value, //폼 데이터
            bookInfo: selectedBook.value, //선택된 책정보
        };

        //백엔드에 POST 요청
        const response = await axios.post('/api/submitBookData', dataToSend);
        if(response.data.status==" success"){
            alert(response.data.mssage);
        }else{
            alert(response.data.mssage);
        }
        
    } catch(error) {
        console.error('데이터 전송 오류', error);
        alert('데이터 전송에 문제가 발생했습니다.')
    }
};

</script>