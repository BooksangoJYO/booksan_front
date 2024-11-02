<template>    
    <div>
        <!--searchQuery 변수와 양방향 바인딩-->
        <input type="text" v-model="searchTitle" placeholder="책 제목을 입력해주세요"/>
        <!--검색 버튼 클릭시 searchBook메서드 실행-->
        <button @click="searchBook">검색</button>
        <!--books 배열에 데이터가 있는경우 책 리스트 렌더링-->
        <div v-if="books.length">
            <!--순서가 없는 항목의 리스트 생성(ul)-->
            
                <!--books 배열을 순회하면서 각 책 정보를 리스트 항목으로 렌더링-->
                <!--index는 books 배열의 각 항목을 나타내는 변수-->
                <!--<li>는 list item(리스트 항목)을 의미-->
            <div v-for="(book,index) in bookData" :key="index" @click="selectBook(book)">
                <img :src ="book.image" alt="책 이미지" />
                <h3>{{ book.title }}</h3>
                <p>{{ book.writer }}</p>
                <p>{{ book.publisher }}</p>
            </div>            
        </div>
    </div>
</template>


<script>
//Vue Composition API: ref 함수를 사용하여 반응형 데이터 변수를 정의
import {ref} from 'vue'; 
//HTTP 요청을 보내기 위해 사용되는 라이브러리(네이버 API에 요청하거나 백엔드 서버에 데이터 전송)
import axios from 'axios'; 
import api from '@/api/api';
//Vue.js에서 컴포넌트를 정의할 때 이 문법을 사용하여 해당 컴포넌트를 다른 파일에서 import하여 사용할 수 있도록 합니다.
//다른 파일에서 이 모듈을 import 할때 export default로 내보낸 값을 가져옵니다.
//Vue 컴포넌트 객체 전체를 내보냄
export default {

    //Vue3의 Composition API에서 컴포넌트의 상태와 메서드를 정의하는 기본 함수
    //setup 함수 안에서 모든 변수와 메서드를 정의하고 반환해야 외부에서 사용할 수 있습니다.
    setup() {
        /*
        데이터 정의
        saerchQuery:사용자가 입력한 책 제목 변수
        books: 검색된 책 정보 저장하는 배열
        selectedBook:사용자가 선택한 책 정보 저장 변수 
        */
        const searchTitle = ref('');
        const books = ref([]);
        const selectedBook = ref(null);
    

        //백엔드 API 호출
        const searchBook = async () => {
            
            const response = await api.getBookInfo(searchTitle.value);

        };

        //사용자가 책 리스트에서 특정 책을 클릭했을때 호출됨
        const selectBook = book => {
            //클릭된 책 정보를 selectedBook 변수에 저장
            selectedBook.value =book;
            //선택된 책정보를 백엔드로 전송
            //JSON 형식으로 전송
            axios
                .post('/api/board/books', {
                    isbn:book.isbn,
                    bookTitle:book.title,
                    bookWriter:book.writer,
                    bookPublisher: book.publisher,
                    imgUrl: book.image,                
                })
                //응답 처리
                .then(()=> {
                    alert('책 정보가 성공적으로 등록되었습니다.');
                })
                //오류 처리
                .catch(error => {
                    console.error('책 등록 오류:', error);
                });
        };

        //setup 함수 안에서 정의된 변수와 메서드를 반환합니다.
        //이렇게 해야 템플릿에서 이 변수와 메서드를 사용할 수 있습니다.
        return {
            searchTitle,
            books,
            selectedBook,
            searchBook,
            selectBook,
        };
    },
};
</script>