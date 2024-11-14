// auth.js
import api from './api.js';


// 멤버 로그인
function login(uid, email) {
    return api.login(uid, email);
}

// 카카오 콜백 처리
function handleKakaoCallback(code) {
    return api.handleKakaoCallback(code);
}

// 멤버 회원가입
function signup(email, uid, nickname) {
    return api.signup(email, uid, nickname);
}

// 닉네임 중복 체크
function checkNickname(nickname) {
    return api.checkNickname(nickname);
}

// 멤버 로그아웃
function logout() {
    return api.logout();
}

// 마이페이지 정보 조회
function getUserInfo() {
    return api.getUserInfo();
}

// 프로필 정보 수정
function updateProfile(userData) {
    return api.updateProfile(userData);
}

// 회원 탈퇴
function deleteAccount() {
    return api.deleteAccount();
}

export default {
    login,
    handleKakaoCallback,
    signup,
    checkNickname,
    logout,
    getUserInfo,
    updateProfile,
    deleteAccount,
};