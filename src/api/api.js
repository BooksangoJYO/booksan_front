import axios from 'axios';

const apiClient = axios.create({
  baseURL : '/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// request 인터셉터
apiClient.interceptors.request.use(config => {
  return config;
});

// response 인터셉터
apiClient.interceptors.response.use(
  response => response,
  error => {
      if  (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
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


  getBookInfo(searchTitle){
    const url = "/api/books/search/"+searchTitle;

    //params: { query: searchTitle }: axios의 get 메서드에서 params 옵션을 사용하여 URL에 쿼리 파라미터를 추가합니다.
    apiClient.get(url);
  },

  postChatRoom(roomName) {
    const url = "/api/chat/room/insert/"+roomName;
    return apiClient.post(url);
  },
  getRoomInfo(roomId){
    const url = "/api/chat/room/"+roomId;
    return axios.get(url);

  },
  getRoomList(){
    const url = '/api/chat/rooms';
    return axios.get(url);
  }
};
