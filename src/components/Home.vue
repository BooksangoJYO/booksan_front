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
        <BoardAlertList v-if="viewBoardAlertList" />
        <div>
            <button @click="toggleBoardAlertList">알림창 열기</button>
        </div>
        <ChatAlarmRooms v-if="viewChatAlarmRooms" />
        <div>
            <button @click="toggleChatAlarmRooms">채팅 알림창 열기</button>
        </div>
    </div>
</template>

<script setup>
const openChatWindow= ()=> {
 window.open(
   'http://localhost:5173/chat/room', 
   '채팅방방',
   'width=500,height=600,top=100,left=500,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no'
 );
}
</script>

<style scoped>

</style>