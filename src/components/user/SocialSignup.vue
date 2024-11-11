<template>
    <div>
        <div class="test-form">
			<div class="join-container">
                <div class="member-container">
                <div class="title">
                    <div>회원 가입을 위해</div>
                    <div>정보를 입력해주세요</div>
                </div>
                    <form @submit.prevent="handleSignup"
                            novalidate>
						<input type="hidden" v-model="uid" /> <!-- hidden input 추가 -->
                        <div class="user-info">
                            <div> 이메일
                                <input type="email" class="form-control" id="memail" name="memail" readonly :value="email"/>
                            </div>
                            <div class="nickname-container">
                                <div>닉네임
                                    <div class="nickname-input-group">
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="mname" 
                                            name="mname" 
                                            v-model="nickname"
                                        />
                                        <button 
                                            type="button" 
                                            class="check-button" 
                                            @click.prevent="checkNickname"
                                        >
                                            중복확인
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <span :class="['message', { 'success': isAvailable, 'error': !isAvailable }]">
                                {{ nicknameMessage }}
                            </span>
                        </div>
                        <div class="btn-test">
                            <button type="submit" class="button-test">가입하기</button>
                        </div>
                    </form>
		     	 </div>
		   	 </div>
		</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../api/api.js';

const email = ref('');      // 카카오에서 받은 이메일
const uid = ref('');        // uid는 소셜 로그인 후 받아온 값을 사용
const nickname = ref('');   // 닉네임
const route = useRoute();   // 현재 라우트 정보를 가져오기
const router = useRouter(); // useRouter를 통해 router 인스턴스 가져오기
const isAvailable = ref(false); //사용가능한 닉네임
const nicknameMessage = ref('닉네임을 입력해주세요.'); //닉네임 검사

onMounted(() => {
    email.value = route.query.email; // 쿼리 파라미터에서 이메일 가져오기
    uid.value = route.query.code;       // 쿼리 파라미터에서 UID 가져오기

	console.log('회원가입 폼 초기 데이터:', {
        email: email.value,
        uid: uid.value
    });
});

// 닉네임 중복검사
const checkNickname = async () => {
    if (!nickname.value) {
        nicknameMessage.value = '닉네임을 입력해주세요.';
        isAvailable.value = false;
        return;
    }

    try {
        const response = await api.apiClient.get(`/users/checkNickname?nickname=${nickname.value}`);
        isAvailable.value = response.data.available;
        nicknameMessage.value = response.data.available ? 
            '사용 가능한 닉네임입니다.' : 
            '이미 사용 중인 닉네임입니다.';
    } catch (error) {
        console.error("닉네임 체크 실패:", error);
        nicknameMessage.value = "닉네임 확인 중 오류가 발생했습니다.";
        isAvailable.value = false;
    }
};

const handleSignup = async () => {
    if (!nickname.value) {
        alert("닉네임은 필수입니다!");
        return;
    }
    if (!isAvailable.value) {
        alert("닉네임 중복확인이 필요합니다.");
        return;
    }
	// 이메일과 uid가 있는지 확인
	if (!email.value || !uid.value) {
        alert("필수 정보가 누락되었습니다.");
        router.push('/login');
        return;
    }
    try {
         // email과 uid 함께 전송
		 const response = await api.apiClient.post('/users/signup', {
            email: email.value,
            uid: uid.value,
            nickname: nickname.value
        });

        if (response.data.status === "success") {
            // 두 토큰 모두 저장
            if (response.data.accessToken && response.data.refreshToken) {
                console.log('발급된 JWT 토큰:', {
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                });
                
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);

                // API 클라이언트에 액세스 토큰 설정
                api.apiClient.defaults.headers.common['Authorization'] = 
                    `Bearer ${response.data.accessToken}`;
            }
            
            alert("회원가입이 성공적으로 완료되었습니다!");
            router.push('/chat/roomList'); // 메인 페이지로 리다이렉트
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("회원가입 실패:", error.response?.data || error);
		console.error('상세 에러 정보:', error.response?.data);
        alert(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
};

</script>

<style scoped>

</style>