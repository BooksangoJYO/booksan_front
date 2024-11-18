<template>
    <header class="header">
        <div class="header-left">
            <RouterLink to="/" class="logo">
                <img :src="logoIcon" alt="알림" class="logo-image" ref="logoImg">
            </RouterLink>
            <nav class="nav-links">
                <RouterLink to="/board/list" class="nav-link">중고책 찾기</RouterLink>
                <RouterLink to="/book/list" class="nav-link">도서 검색</RouterLink>
            </nav>
        </div>
        <div class="header-right">
            <div class="dropdown-container">
                <button class="icon-button" @click="toggleBoardReservationList">
                    <img :src="noticeIcon" alt="알림" ref="noticeImg">
                </button>
                <Transition name="dropdown">
                    <BoardReservationList v-if="viewBoardReservationList" class="dropdown-content"/>
                </Transition>
            </div>
            <div class="dropdown-container">
                <button class="icon-button" @click="toggleChatAlertList">
                    <img :src="chatNoticeIcon" alt="메시지" ref="chatImg">
                </button>
                <Transition name="dropdown">
                    <ChatAlertRoomList v-if="viewChatAlertList" class="dropdown-content"/>
                </Transition>
            </div>
            <RouterLink to="/main/chatPage">채팅</RouterLink>
            <RouterLink to="/login" class="icon-button">로그인</RouterLink>
        </div>
    </header>
</template>

<script setup>
import chatNoticeIcon from '@/assets/images/chatNotice.png';
import logoIcon from '@/assets/images/logo.png';
import noticeIcon from '@/assets/images/notice.png';
import { onMounted, ref } from 'vue';
import BoardReservationList from '../board/BoardReservationList.vue';
import ChatAlertRoomList from '../chat/ChatAlertRoomList.vue';

let viewChatAlertList = ref(false);
let viewBoardReservationList = ref(false);
const noticeImg = ref(null);
const chatImg = ref(null);
const logoImg = ref(null);
let chatWindow = null;

const openChatWindow = () => {
    chatWindow = window.open(
        'http://localhost:5173/chat/room',
        '채팅방방',
        'width=500,height=600,top=100,left=500,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no'
    );

    if (chatWindow) {
        chatWindow.onbeforeunload = () => {
            // 이미지 강제 리렌더링
            if (noticeImg.value) {
                const src = noticeImg.value.src;
                noticeImg.value.src = '';
                setTimeout(() => {
                    noticeImg.value.src = src;
                }, 0);
            }
            if (chatImg.value) {
                const src = chatImg.value.src;
                chatImg.value.src = '';
                setTimeout(() => {
                    chatImg.value.src = src;
                }, 0);
            }
            if (noticeImg.value) {
                const src = logoImg.value.src;
                logoImg.value.src = '';
                setTimeout(() => {
                    logoImg.value.src = src;
                }, 0);
            }
        };
    }
}

const toggleBoardReservationList = () => {
    viewBoardReservationList.value = !viewBoardReservationList.value;
    if (viewBoardReservationList.value) {
        viewChatAlertList.value = false;
    }
};

const toggleChatAlertList = () => {
    viewChatAlertList.value = !viewChatAlertList.value;
    if (viewChatAlertList.value) {
        viewBoardReservationList.value = false;
    }
};

// 드롭다운 외부 클릭시 닫기
const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-container')) {
        viewBoardReservationList.value = false;
        viewChatAlertList.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    border-bottom: 1px solid #e5e5e5;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.logo-image {
    height: 30px;
    width: auto;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
}

.nav-link {
    color: #333;
    text-decoration: none;
    font-weight: 500;
}

.nav-link:hover {
    color: #666;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.dropdown-container {
    position: relative;
}

.icon-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
}

.icon-button img {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.dropdown-content {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    min-width: 200px;
    z-index: 1000;
    margin-top: 0.5rem;
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>