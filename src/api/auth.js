// auth.js
import api from './api.js';

// 멤버 로그인
function login(uid, email) {
    return api.apiClient.post('/users/auth/socialLogin', { uid, email });
}

// 멤버 회원가입
function signup(email, uid, nickname) {
    return api.apiClient.post('/users/signup', {uid, email, nickname});
}

// 멤버 로그아웃
function logout() {
    return api.apiClient.post('/users/logout');
}

// 마이페이지 정보 조회
function getUserInfo() {
    return api.apiClient.get('/users/mypage');
}

// 프로필 정보 수정
function updateProfile(userData) {
    return api.apiClient.post('/users/update', userData);
}

// 회원 탈퇴
function deleteAccount() {
    return api.apiClient.delete('/users/delete');
}

export default {
    login,
    logout,
    signup,
    getUserInfo,
    updateProfile,
    deleteAccount,
};