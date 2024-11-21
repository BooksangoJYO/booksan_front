<template>
    <div class="header-right"  v-if="loginInfo.email">
        <div class="dropdown-container">
            <button class="icon-button" @click="toggleBoardReservationList">
                <img :src="loginInfo.bookAlert > 0 ? bookNoticeIcon : bookIcon" alt="메시지" ref="noticeImg">
            </button>
            <Transition name="dropdown">
                <BoardReservationList v-if="viewBoardReservationList" class="dropdown-content" @close="closeBoardReservationList()"/>
            </Transition>
        </div>
        <div class="dropdown-container">
            <button class="icon-button" @click="toggleChatAlertList">
                <img :src="loginInfo.chatAlert > 0 ?chatNoticeIcon : chatIcon" alt="메시지" ref="chatImg">
            </button>
            <Transition name="dropdown">
                <ChatAlertRoomList v-if="viewChatAlertList" class="dropdown-content" @close="closeAlertList()"/>
            </Transition>
        </div>
        <RouterLink to="/main/chatPage" class="nav-link">북싼챗</RouterLink>
        <RouterLink to="/mypage" class="nav-link">마이페이지</RouterLink>
        <button class="icon-button" @click="handleLogout">로그아웃</button>
        <p>{{loginInfo.nickName}}</p>
    </div>
    <div class="header-right" v-else>
        <button class="icon-button" @click="showModal = true">로그인</button>
    </div>
    <SocialLoginModal :is-open="showModal" @close="showModal = false" />
</template>

<script setup>
import bookNoticeIcon from '@/assets/images/bell.svg';
import bookIcon from '@/assets/images/bellNot.svg';
import chatIcon from '@/assets/images/chatIcon.svg';
import chatNoticeIcon from '@/assets/images/chatNotice.svg';
import emitter from '@/emitter/emitter';
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BoardReservationList from '../board/BoardReservationList.vue';
import ChatAlertRoomList from '../chat/ChatAlertRoomList.vue';
import SocialLoginModal from '../user/SocialLoginModal.vue';

let viewChatAlertList = ref(false);
let viewBoardReservationList = ref(false);

const store = useMainStore();
const {loginInfo} = storeToRefs(store);
const { doLogin,doLogout} = store;
const showModal = ref(false);
const router = useRouter();

emitter.on('show-modal', () => {
  showModal.value = true
})

const closeBoardReservationList = () => {
    doLogin();
    viewBoardReservationList.value = !viewBoardReservationList.value;
}

const closeAlertList = () => {
    doLogin();
    viewChatAlertList.value = !viewBoardReservationList.value;
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

// 로그아웃시 메인페이지로 돌아가기
const handleLogout = async () => {
    await doLogout();  // 기존 로그아웃 함수 실행
    router.push('/');  // 메인 페이지로 이동
};
</script>

<style scoped>
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

.nav-link {
    border-bottom: none;
    color: black;
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