// auth.js
import apiClient from './api.js';

// 멤버 로그인
function login(uid, email) {
    return apiClient.post('/api/users/auth/socialLogin', { uid, email });
}

// 멤버 로그아웃
function logout() {
    return apiClient.post('/api/users/logout'); 
}

export default {
    login,
    logout,
};