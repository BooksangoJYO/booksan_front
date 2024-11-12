<template>
    <div>
        <h1>게시글 수정 페이지</h1>
        <!-- 선택된 책 정보 출력 -->
         <h1>선택된 책정보</h1>
        <div v-if="selectedBook">            
            <p>책 이미지: <img :src="selectedBook.image" alt="책 이미지"/></p>
            <p>책 제목: {{ selectedBook.title }}</p>
            <p>책 저자: {{ selectedBook.author }}</p>
            <p>책 출판사: {{ selectedBook.publisher }}</p>
            <p>isbn: {{ selectedBook.isbn }}</p>
        </div>

        <!-- 수정 폼 -->
        <div>
            <h1>게시글 수정폼</h1>
            <form @submit.prevent="updateForm">
                <!-- 제목 입력 -->
                <div>
                    <label for="title">제목:</label>
                    <input type="text" id="title" v-model="form.title" />
                </div>

                <!-- 내용 입력 -->
                <div>
                    <label for="content">내용:</label>
                    <textarea id="content" v-model="form.content"></textarea>
                </div>

                <!-- 책 카테고리 -->
                <div>
                    <label for="category">책 카테고리:</label>
                    <select id="category" v-model.number="form.booksCategoryId">
                        <option :value="null" disabled>카테고리를 선택하세요</option>
                        <option v-for="category in categories" :key="category.booksCategoryId" :value="category.booksCategoryId">
                            {{ category.booksCategoryName }}
                        </option>
                    </select>
                </div>
                
                <!-- 가격 입력 -->
                <div>
                    <label for="price">가격:</label>
                    <input type="number" id="price" v-model="form.price" />
                </div>

                <!-- 닉네임 입력 -->
                <div>
                    <label for="email">email:</label>
                    <input type="text" id="email" v-model="form.email" />
                </div>

                <!--판매 상태 선택 라디오 버튼-->
                <div>
                    <label>
                        <input type="radio" value="Y" v-model="form.status" />판매 완료
                    </label>
                    <label>
                        <input type="radio" value="N" v-model="form.status" />판매 중
                    </label>
                </div>

                <!-- 제출 버튼 -->
                <div>
                    <button type="submit">수정</button>
                    <button type="button" @click="goToBoardRead">취소</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/api/api';

const router = useRouter();
const route = useRoute(); // 라우트에서 dealId 가져오기
const selectedBook = ref(null);
const dealId = route.params.dealId;
const form = ref({
    title: '',
    content: '',
    booksCategoryId: null,
    price: null,
    email: '',
    status: 'N', //기본값을 'N'으로 설정하여 판매중 상태로 초기화
});
const categories = ref([]);


//게시글 정보를 세팅해주기 위해 게시글 데이터를 API 요청
const fetchBoardData = async () => {
    try {
        const response = await api.getBoardRead(dealId);
        const boardData = response.data.data;
        
        // API로 받아온 데이터로 폼 초기화
        form.value = {
            title: boardData.title,
            content: boardData.content,
            booksCategoryId: boardData.booksCategoryId,
            price: boardData.price,
            email: boardData.email,
            status: boardData.status,
        };        
    } catch (error) {
        console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
    }
};

//게시글 수정 요청
const updateForm = async () => {
    try {
        const dataToSend = {
            //수정된 데이터 세팅
            ...form.value,
            isbn: selectedBook.value?.isbn || null,
            bookTitle: selectedBook.value?.title || null,
            bookWriter: selectedBook.value?.author || null,
            bookPublisher: selectedBook.value?.publisher || null,
            dealId : dealId,
        };

        const response = await api.updateBoard(dataToSend);
        if (response.data.status === "success") {
            alert("수정되었습니다.");
            router.push('/board/list');
        } else {
            alert("수정 실패: " + response.data.message);
        }
    } catch (error) {
        console.error("수정 요청 오류:", error);
        alert("수정에 실패했습니다.");
    }
};

// 카테고리 데이터 불러오기
const getBookCategories = async () => {
    try {
        const response = await api.getBookCategories();
        categories.value = response.data.booksCategories;
    } catch (error) {
        console.error("카테고리 데이터 불러오기 오류:", error);
    }
};

// 취소 버튼 누르면 게시글 단건 조회로 이동
const goToBoardRead = () => {
    const dealId = route.params.dealId; //현재 게시물의 dealId 가져오기
    router.push(`/board/read/${dealId}`); //단건 조회 페이지 경로로 이동 
};

onMounted(() => {
    //라우트에서 bookInfo 쿼리 데이터 파싱
    const bookInfoQuery = route.query.bookInfo;
    if(bookInfoQuery) {
        selectedBook.value = JSON.parse(bookInfoQuery);
        console.log("선택된 책 데이터:", selectedBook.value);
    }
    fetchBoardData();
    getBookCategories();
});
</script>
