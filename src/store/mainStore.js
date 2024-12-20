import api from '@/api/api';
import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { ref } from 'vue'; // reactive 대신 ref 사용

export const useMainStore = defineStore('mainStore', () => {
    const keyword = ref('');
    const paginationData = ref({
        page: 1,
        size: 10,
        totalPages: 1,
        start: 1,
        end: 10,
        prev: false,
        next: false
      });


    const loginInfo = ref({}); // reactive 대신 ref 사용
    const doLogin = async () => {  
        try {
            const response = await api.getUserInfo();
            if(response.data != null) {
                loginInfo.value = response.data; // .value 사용
                console.log(response.data.nickname)
                console.log(response.data.imgId)
            }
        }
        catch (error) {
        }
    };

    const doLogout = async () => {
        try {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            loginInfo.value={};
            sessionStorage.removeItem('userEmail');
            localStorage.clear();
        } catch (error) {
        }
    };

    // computed는 필요 없습니다 - ref를 직접 반환하면 됩니다
    return {
        loginInfo, // computed 대신 ref 직접 반환
        paginationData,
        keyword,
        doLogin, 
        doLogout,
    }
}, {
    persist: true // persist 옵션은 여기에 위치
});