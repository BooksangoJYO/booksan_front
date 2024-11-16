<template>
    <div>
        <div>
            <RouterLink to="/login">Login</RouterLink>
        </div>
        <div>
            <RouterLink to="/board/list">Deals</RouterLink>
        </div>
        <div>
            <a href="#" @click="openChatWindow()" role="button">
                <span class="blind">채팅창 열기</span>
            </a>
        </div>
        <BoardReservationList v-if="viewBoardReservationList" />
        <div>
            <button @click="toggleBoardReservationList">알림창 열기</button>
        </div>
        <ChatAlertRoomList v-if="viewChatAlertList" />
        <div>
            <button @click="toggleChatAlertList">채팅 알림창 열기</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BoardReservationList from './board/BoardReservationList.vue';
import ChatAlertRoomList from './chat/ChatAlertRoomList.vue';

let viewChatAlertList = ref(false);
let viewBoardReservationList = ref(false);

const openChatWindow= ()=> {
 window.open(
   'http://localhost:5173/chat/room', 
   '채팅방방',
   'width=500,height=600,top=100,left=500,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no'
 );
 
}

const toggleBoardReservationList= () => {
    viewBoardReservationList.value = !viewBoardReservationList.value;
};

const toggleChatAlertList = () => {
    viewChatAlertList.value = !viewChatAlertList.value;
};

</script>

<style scoped>

</style>