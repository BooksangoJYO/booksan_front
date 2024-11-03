<template>    
    <div>
        <!--searchTitle 변수와 양방향 바인딩-->
        <input @keydown.enter="searchBook" type="text" v-model="searchTitle" placeholder="책 제목을 입력해주세요"/>
        <!--검색 버튼 클릭시 searchBook메서드 실행-->
        <button @click="searchBook">검색</button>
        
        <!--books 배열에 데이터가 있는경우 책 리스트 렌더링-->
        <div v-if="data.books.length">
            <!--books 배열을 순회하면서 각 책 정보를 렌더링-->
            <!--index는 books 배열의 각 항목을 나타내는 변수-->
            <div v-for="(book,index) in data.books" :key="index" @click="selectedBook(book)">
                책 이미지:<img :src ="book.image" alt="책 이미지" />
                <h3>책 제목:{{ book.title }}</h3>
                <p>책 저자:{{ book.author }}</p>
                <p>책 출판사:{{ book.publisher }}</p>
            </div>            
        </div>
    </div>
</template>


<script setup>
//Vue Composition API: ref 함수를 사용하여 반응형 데이터 변수를 정의
import {reactive, ref, defineEmits} from 'vue'; 
//HTTP 요청을 보내기 위해 사용되는 라이브러리(네이버 API에 요청하거나 백엔드 서버에 데이터 전송)
import api from '@/api/api';


//Vue.js에서 컴포넌트를 정의할 때 이 문법을 사용하여 해당 컴포넌트를 다른 파일에서 import하여 사용할 수 있도록 합니다.
//다른 파일에서 이 모듈을 import 할때 export default로 내보낸 값을 가져옵니다.
//Vue 컴포넌트 객체 전체를 내보냄


    //Vue3의 Composition API에서 컴포넌트의 상태와 메서드를 정의하는 기본 함수
    //setup 함수 안에서 모든 변수와 메서드를 정의하고 반환해야 외부에서 사용할 수 있습니다.

        /*
        데이터 정의
        saerchQuery:사용자가 입력한 책 제목 변수
        books: 검색된 책 정보 저장하는 배열
        selectedBook:사용자가 선택한 책 정보 저장 변수 
        */
        //반응형 변수 선언
        const emit = defineEmits(); //defineEmits를 사용하여 emit 정의
        const searchTitle = ref('');        
        const data = reactive({
            books : [],
        });

        //책 검색 메서드(서버에 요청)
        const searchBook = async () => {
            try{
                const response = await api.getBookInfo(searchTitle.value);
                data.books.push(...response.data.items);
            } catch (error) {
                console.error('책 검색 오류:', error);
                alert('책 정보를 불러오는데 문제가 발생했습니다.')
            }
        };

        //책 선택 메서드
        const selectedBook = (book)  => {            
            //선택된 책 정보를 등록폼으로 emit
            // selectedBook.value = book;
            //선택한 책 정보를 등록 컴포넌트(BoardInsert.vue)로 emit
            emit('book-selected', book);           
        };

        
</script>