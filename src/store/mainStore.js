import api from '@/api/api';
import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

export const useMainStore = defineStore('mainStore',()=>{
    const router = useRouter();
    const state = reactive({
        loginInfo: {}
        
    });

    const doLogin= async ()=>{  
        try{
            const response = await api.getUserInfo();
            if(response.data != null){
                state.loginInfo = await response.data;
                router.replace('/');
            }
        }
        catch (error) {
            console.error("API 요청 중 오류 발생:", error);
        }
    };

    const doLogout = async () =>{
        try {
            // 서버 로그아웃 호출 (서버에서 쿠키 삭제)
            await api.logout();
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            sessionStorage.removeItem('userEmail');
            state.loginInfo = {};
            router.push('/');
            alert('로그아웃 되었습니다.');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }

    };

    const loginInfo= computed(()=>state.loginInfo);

    return {
      doLogin, doLogout, loginInfo,
    }
},
);