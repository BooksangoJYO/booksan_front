import router from '@/router';
import axios from 'axios';
import Cookies from 'js-cookie';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}


const apiClient = axios.create({
  baseURL : '/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});


apiClient.interceptors.request.use(
  config => {
  
  const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers.accessToken = accessToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        console.log("refresh토큰 실행");
        
        // 인증 서버로 직접 refresh 요청
        const refreshToken = getCookie('refreshToken');
        const { data } = await apiClient.post('/users/refresh', {
          refreshToken
        });
        
        // 새 access token으로 원래 요청 재시도
        const newAccessToken = data.accessToken;
        console.log("새로운 엑세스 토큰 "+ newAccessToken);
        Cookies.set('accessToken', newAccessToken, { 
          httpOnly: false, 
          secure: true 
        });
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(error.config);
      } catch (error) {
        // refresh 실패시 로그인으로
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        localStorage.removeItem("userData");
        router.replace({ path: '/login' });
      }
    }
    return Promise.reject(error);
  }
);




export default {
//클라이언트에서 직접 api요청 --> 서버요청으로 변경
//const url = "https://openapi.naver.com/v1/search/book.json?query="+searchTitle;
apiClient,

  // 카카오 콜백 처리를 위한 메서드 추가
  handleKakaoCallback(code) {
    return apiClient.get(`/users/auth/kakao/callback?code=${code}`);
  },

  logout() {
    return apiClient.post('/users/logout');
  },

  getUserInfo() {
    return apiClient.get('/users/mypage');
  },

  updateProfile(userData) {
    return apiClient.post('/users/update', userData);
  },

  deleteAccount() {
    return apiClient.delete('/users/delete');
  },



  //isbn으로 책 정보 가져오기(1건)
  getBookInfo(isbn){
    const url = "/books/search/"+isbn;
    return apiClient.get(url);
  },

  //책 카테고리 리스트 가져오기
  getBookCategories(){
    const url = "/books/categories";
    return apiClient.get(url);
  },

  //게시물 등록(boardData는 책정보+게시물 등록 정보)
  BoardInsert(boardData){
    const url = "/board/insert";
    return apiClient.post(url, boardData);
  },

  //게시물 단건조회
  getBoardRead(dealId) {
    const url = `/board/read/${dealId}`;
    return apiClient.get(url)
  },

  //게시물 목록(페이지네이션)(쿼리스트링방식으로 수정)
  getBoardList(page, size, keyword) {
    console.log("페이지는"+page);
    const url = "/board/list?page=" + page +"&size=" + size +"&keyword="+ keyword;
    return apiClient.get(url);
  },
  
  //게시물 수정
  updateBoard(dataToSend){
    const url = "/board/update";
    return apiClient.put(url, dataToSend);
  },

  postChatRoom(roomName,writerEmail) {
    const url = "/chat/room/insert/"+roomName+ "/"+ writerEmail;
    return apiClient.post(url);
  },
  
  getRoomInfo(roomId){
    const url = "/chat/room/"+roomId;
    return apiClient.get(url);

  },
  getRoomList(){
    const url = '/chat/rooms';
    return apiClient.get(url);
  },
  
  getPrevMessage(roomId){
    const url = '/chat/prevMessage/'+roomId;
    return apiClient.get(url);
  },

  getAlarmRooms(email){
    const url = '/chat/rooms/alarm/'+email;
    return apiClient.get(url);
  }
};
