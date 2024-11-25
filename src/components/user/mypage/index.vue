<template>
    <div class="container mt-5">
        <h2 class="mypage mb-4">마이페이지</h2>
        <div class="row" v-if="loginInfo.email">
            <!-- 사이드바 -->
            <SideBar/>
            <!-- 메인 컨텐츠 -->
            <div class="col-md-9">
                <!-- 프로필 섹션 -->
                <div class="card mb-4 border-0 shadow-sm">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <!-- 프로필 이미지 -->
                            <div class="col-md-4 text-center" @click="selectImage">
                                <div class="position-relative d-inline-block">
                                    <div class="rounded-circle overflow-hidden" 
                                         style="width: 125px; height: 125px; background: #f8f9fa">
                                        <img :src="renderImage()" alt="프로필 이미지" class="w-100 h-100 object-fit-cover" />
                                    </div>
                                </div>
                                <div>
                                    <button v-if="!renderImage() || renderImage().value !== defaultImage"
                                            @click.stop="removeImage"
                                            class="remove-button">X</button>
                                </div>    
                            </div>

                            <!-- 사용자 정보 -->
                            <div class="col-md-8">
                                <div class="user-info-container">
                                    <div class="user-info">
                                        <h4 class="mb-2">{{ loginInfo?.nickname }}</h4>
                                        <p class="text-secondary mb-3">{{ loginInfo?.email }}</p>
                                    </div>
                                    <!-- 버튼 클릭 이벤트 확인을 위한 콘솔 로그 추가 -->
                                    <button class="btn btn-outline-secondary" @click="openModal">
                                        <i class="bi bi-pencil"></i> 닉네임 수정
                                    </button>
                                </div>

                                <!-- v-show를 사용하여 모달 표시/숨김 -->
                                <div v-show="showModal">
                                    <div class="modal d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <div>
                                                        <h5 class="modal-title">닉네임 수정</h5>
                                                        <p class="text-secondary mb-0 mt-2" style="font-size: 0.875rem">
                                                            다른 사용자들에게 표시될 새로운 닉네임을 입력해주세요.<br>
                                                            닉네임은 2~20자 이내여야 하며, 특수문자는 '_'만 사용 가능합니다.
                                                        </p>
                                                    </div>
                                                    <button type="button" class="btn-close" @click="closeModal"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="nickname-container">
                                                        <div class="nickname-input-group mb-3">
                                                            <input 
                                                                type="text" 
                                                                class="form-control" 
                                                                v-model="newNickname"
                                                                placeholder="새로운 닉네임을 입력하세요"
                                                            />
                                                            <button 
                                                                type="button" 
                                                                class="btn btn-outline-secondary" 
                                                                @click="checkNickname"
                                                            >
                                                                중복확인
                                                            </button>
                                                        </div>
                                                        <span :class="['message', { 'text-success': isAvailable, 'text-danger': !isAvailable }]">
                                                            {{ nicknameMessage }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" @click="closeModal">취소</button>
                                                    <button 
                                                        type="button" 
                                                        class="btn btn-button" 
                                                        @click="updateNickname"
                                                        :disabled="!isAvailable || isLoading"
                                                    >
                                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
                                                        수정하기
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 회원탈퇴 섹션 -->
                <div class="card withdrawal-section">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="">회원탈퇴</h6>
                            <p class="text-secondary mb-0" style="font-size: 0.8rem">
                                회원탈퇴시 삭제된데이터는 복구가 불가능합니다.<br>
                                회원 탈퇴 후에는 서비스를 이용하실 수 없습니다.
                            </p>
                        </div>
                        <button class="btn" style="font-size: 12px;" @click="deleteAccount">
                            탈퇴하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from '@/api/api';
import { useMainStore } from '@/store/mainStore';
import Cookies from 'js-cookie';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SideBar from './SideBar.vue';

const API_URLS = {
  USERS: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_USER : '',
};

const router = useRouter();
const store = useMainStore();
const { loginInfo } = storeToRefs(store);
const showModal = ref(false);
const newNickname = ref('');
const isAvailable = ref(false);
const nicknameMessage = ref('');
const isLoading = ref(false);
const defaultImage = `${API_URLS.USERS}/api/users/read/download/524`
const image = ref(null);
const imageFile = ref({});

const deleteAccount = async () => {
    if(confirm('정말 탈퇴하시겠습니까?')) {
        try {
            await api.deleteAccount();

            // 쿠키 삭제
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            
            // 로컬 스토리지 데이터 삭제
            localStorage.clear();
            
            alert('탈퇴가 완료되었습니다.');
            router.push('/login');
        } catch (error) {
            console.error('회원탈퇴 실패:', error);
            alert('회원탈퇴에 실패했습니다.');
        }
    }
};

const openModal = () => {
    showModal.value = true;
    newNickname.value = loginInfo.value?.nickname || '';
};

// 모달 닫기 함수 수정
const closeModal = () => {
    showModal.value = false;
    newNickname.value = '';
    isAvailable.value = false;
    nicknameMessage.value = '';
};
//닉네임 중복검사
const checkNickname = async () => {
    if (!newNickname.value) {
        nicknameMessage.value = '닉네임을 입력해주세요.';
        isAvailable.value = false;
        return;
    }

    if (newNickname.value === loginInfo.value?.nickname) {
        nicknameMessage.value = '현재 닉네임과 동일합니다.';
        isAvailable.value = false;
        return;
    }

    try {
        const response = await api.checkNickname(newNickname.value);
        console.log('중복체크 응답:', response);
        isAvailable.value = response.data.available;
        nicknameMessage.value = response.data.available ? 
            '사용 가능한 닉네임입니다.' : 
            '이미 사용 중인 닉네임입니다.';
    } catch (error) {
        console.error("닉네임 체크 실패:", error);
        console.error('response:', error.response);
        nicknameMessage.value = "닉네임 확인 중 오류가 발생했습니다.";
        isAvailable.value = false;
    }
};

const updateNickname = async () => {
    if (!isAvailable.value) {
        alert("닉네임 중복확인이 필요합니다.");
        return;
    }

    try {
        isLoading.value = true;
        // updateProfile 호출하고 응답 처리
        const response = await api.updateProfile({
            nickname: newNickname.value
        });
        
        // 성공 시 처리 (response.data가 없어도 성공으로 처리)
        loginInfo.value.nickname = newNickname.value;
        closeModal();
        alert("닉네임이 성공적으로 변경되었습니다.");

    } catch (error) {
        // 실제 에러가 발생했을 때만 에러 메시지 출력
        console.error("닉네임 업데이트 실패:", error);
        alert("닉네임 변경 중 오류가 발생했습니다.");
    } finally {
        isLoading.value = false;
    }
};

const removeImage = () => {
    image.value = defaultImage;
    api.deleteProfileImage();
}

// 이미지 렌더링 함수
const renderImage = () => {
    return image.value;
};

const selectImage = () => {
    const input = document.createElement("input");
    input.type = 'file';
    input.accept = 'image/*'; // 이미지 파일만 선택할 수 있도록 설정
    input.onchange = (e) => {
        const file = e.target.files[0]; // 선택한 파일 가져오기
        if (file) {
            const maxSize = 10 * 1024 * 1024; // 10MB로 설정
            // 이미지 파일 크기 확인 및 경고 메시지 표시
            if (file.size > maxSize) {
                alert("이미지 파일 크기가 10MB를 초과합니다. 다시 선택해주세요.");
                return;
            }
            // 파일 객체 저장
            imageFile.value = file;
            console.log("Selected file:", file);

            // 선택한 파일을 미리보기 이미지로 설정
            const reader = new FileReader();
            reader.onload = (e) => {
                image.value = e.target.result;
            }
            reader.readAsDataURL(file);
        }
        updateProfileImage();
        imageFile.value = null;
    }
    input.click();
}

const getFormData = () => {
    const formData = new FormData();
    if (imageFile.value) {
        formData.append('file', imageFile.value);
        return formData;
    } else {
        formData.append('imgId', 514);
    }
    
}

const updateProfileImage = async () => {
    try {
        isLoading.value = true;
        const formData = getFormData();
        console.log("formData 생성 완료")
        const response = await api.updateProfileImage(formData);
        loginInfo.value.imgId = response.data.imgId;
        alert("프로필 이미지가 성공적으로 변경되었습니다.");
    } catch (error) {
        console.error("프로필 이미지 업데이트 실패:", error);
        alert("프로필 이미지 변경 중 오류가 발생했습니다.");
    } finally {
        isLoading.value = false;
    }
}

const readProfileImage = async () => {
    try {
        if(!loginInfo.value.imgId) {
            console.log("loginfo에 imgId가 없을때")
        } else {
            image.value = `${API_URLS.USERS}/api/users/read/download/${loginInfo.value.imgId}`;
        }
    } catch (error) {
        console.error("프로필 데이터를 불러오는 중 오류 발생:", error);
    }
};

onMounted(() => {
    readProfileImage();
});

</script>

<style scoped>
.mypage {
    font-weight: 700;
    color: #8B4513;
    margin-left: 20px;
}

.user-info-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nickname-input-group {
    display: flex;
    gap: 0.5rem;
}

.message {
    display: block;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.modal-dialog {
    position: relative;
    margin: auto;
    width: 90%;
    max-width: 500px;
    transform: none !important;
}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    outline: 0;
}

/* 전체 레이아웃 중앙 배치 */
.container {
    max-width: 900px;
    display: flex;
    flex-direction: column;
    justify-content: center; /* 세로 중앙 정렬 */
    padding: 2rem 0; /* 상하 여백 */
}

/* 상단 구분선 */
.container::before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: #8B4513;
    margin-bottom: 2rem;
}

/* 사용자 정보 레이아웃 */
.user-info-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.withdrawal-section {
    margin-top: 450px !important; /* 위쪽 여백 강제 적용 */
    margin-bottom: 50px;
}

/* 편집하기 버튼 */
.btn-outline-secondary {
    margin-left: auto; /* 버튼을 오른쪽으로 밀기 */
}

.btn-button {
    background-color: #8B4513;
    border-color: #8B4513;
    color: #fff;
}

.btn-button:hover {
    background-color: #733A0F;  /* 살짝 더 어두운 갈색 */
    border-color: #733A0F;
}

.btn-button:disabled {
    background-color: #B88E6F;  /* 좀 더 연한 갈색 */
    border-color: #B88E6F;
}

/* 나머지 스타일 */
.card {
    background-color: #fff;
    border-radius: 8px;
    border: none;
}

.nav-link {
    padding: 0.5rem 0;
    transition: color 0.2s ease-in-out;
}

.nav-link:hover {
    color: #8B4513 !important;
}

.btn-outline-secondary {
    border-color: #8B4513;
    color: #8B4513;
    transition: all 0.2s ease-in-out;
}

.btn-outline-secondary:hover {
    background-color: #8B4513;
    border-color: #8B4513;
    color: #fff;
}

</style>
