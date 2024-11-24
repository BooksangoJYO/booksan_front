<!-- LoginModal.vue -->
<template>
    <Transition name="modal">
        <div v-if="isOpen" class="modal-wrapper">
            <div class="modal show d-block" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header mt-2 border-0" style="margin: auto;">
                            소셜 로그인
                        </div>
                        <div class="modal-body mt-3 border-0">
                            <div class="text-center">
                                <button id="kakao-login-btn" @click="handleKakaoLogin" style="border: none; background-color: white;">
                                    <img :src="kakaoIcon" 
                                         width="222" 
                                         alt="카카오 로그인" />
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-secondary" @click="closeModal">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        </div>
    </Transition>
</template>

<script setup>
import kakaoIcon from '@/assets/images/kakaoLogin.png';

const API_URLS = {
  USERS: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_USER : '',
};
    
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};

const handleKakaoLogin = () => {
    window.location.href = API_URLS.USERS+'/api/users/auth/kakao/login';
};
</script>

<style scoped>
/* 모달 트랜지션 효과 */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999; /* 이 줄 추가 */
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9998; /* 더 높은 값으로 변경 */
}

.modal {
    z-index: 9999; /* 더 높은 값으로 변경 */
    position: absolute;
}

.modal-header {
    font-size: 27px;
    text-align: center;
    font-weight: 800;
    color: #A25D0D;
    padding: 1.5rem 1rem;
}

.modal-dialog {
    max-width: 400px !important; /* 원하는 크기로 조정 */
    width: 400px !important;
    margin: 1.75rem auto;
}

.modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    aspect-ratio: 1 / 1;
}

.modal-body {
    flex: 1; /* 남은 공간 채우기 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-footer {
    padding: 1rem; /* 여백 조정 */
}

.btn-secondary {
    width: 200px;
    margin: auto;
}
</style>
