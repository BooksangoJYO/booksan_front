import api from '@/api/api';
import { defineStore } from 'pinia';
import { ref } from 'vue'; // reactive 대신 ref 사용
import { useRouter } from 'vue-router';

export const useMainStore = defineStore('mainStore', () => {
    const router = useRouter();
    const loginInfo = ref({}); // reactive 대신 ref 사용

    const doLogin = async () => {  
        try {
            const response = await api.getUserInfo();
            if(response.data != null) {
                loginInfo.value = response.data; // .value 사용
                router.replace('/');
            }
        }
        catch (error) {
            console.error("API 요청 중 오류 발생:", error);
        }
    };

    const doLogout = async () => {
        try {
            await api.logout();
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            sessionStorage.removeItem('userEmail');
            loginInfo.value = {}; // .value 사용
            router.push('/');
            alert('로그아웃 되었습니다.');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    // computed는 필요 없습니다 - ref를 직접 반환하면 됩니다
    
    return {
        loginInfo, // computed 대신 ref 직접 반환
        doLogin, 
        doLogout,
    }
}, {
    persist: true // persist 옵션은 여기에 위치
});