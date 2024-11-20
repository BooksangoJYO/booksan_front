<!-- LoginModal.vue -->
<template>
    <Transition name="modal">
        <div v-if="isOpen" class="modal-wrapper">
            <div class="modal show d-block" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            소셜 로그인
                        </div>
                        <div class="modal-body border-0">
                            <div class="text-center">
                                <button id="kakao-login-btn" @click="handleKakaoLogin" style="border: none; background-color: white;">
                                    <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" 
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
    window.location.href = '/api/users/auth/kakao/login';
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
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
}

.modal {
    z-index: 1045;
}

.modal-header {
    font-size: 25px;
    text-align: center;
}
</style>