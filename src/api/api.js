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
  withCredentials: false,
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
        const { data } = await apiClient.post('http://3.38.92.146:8080/api/users/refresh', {
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
  handleKakaoCallback(code) {
    return axios.get(`http://3.38.92.146:8080/api/users/auth/kakao/callback?code=${code}`);
  },

  logout() {
    return axios.post('http://3.38.92.146:8080/api/users/logout');
  },

  getUserInfo() {
    return axios.get('http://3.38.92.146:8080/api/users/mypage');
  },

  updateProfile(userData) {
    return axios.post('http://3.38.92.146:8080/api/users/update', userData);
  },

  deleteAccount() {
    return axios.delete('http://3.38.92.146:8080/api/users/delete');
  },

  getBooksInfo(searchTitle, page, size) {
    const url = `http://13.125.214.144:8080/api/books/searchAll/${searchTitle}/${page}/${size}`;
    return axios.get(url);
  },

  getBookInfo(isbn) {
    const url = `http://13.125.214.144:8080/api/books/search/${isbn}`;
    return axios.get(url);
  },

  getBookCategories() {
    const url = 'http://13.125.214.144:8080/api/books/categories';
    return axios.get(url);
  },

  BoardInsert(boardData) {
    const url = 'http://13.125.214.144:8080/api/board/insert';
    return axios.post(url, boardData);
  },

  getBoardRead(dealId) {
    const url = `http://13.125.214.144:8080/api/board/read/${dealId}`;
    return axios.get(url);
  },

  getBoardList(page, size, keyword) {
    const url = `http://13.125.214.144:8080/api/board/list?page=${page}&size=${size}&keyword=${keyword}`;
    return axios.get(url);
  },

  updateBoard(dataToSend) {
    const url = 'http://13.125.214.144:8080/api/board/update';
    return axios.put(url, dataToSend);
  },

  postChatRoom(roomName, writerEmail) {
    const url = `http://3.39.238.25:8080/api/chat/room/insert/${roomName}/${writerEmail}`;
    return axios.post(url);
  },

  deleteBoard(dealId) {
    const url = `http://13.125.214.144:8080/api/board/delete/${dealId}`;
    return axios.delete(url);
  },

  addComment(isbn, email, content) {
    const url = 'http://13.125.214.144:8080/api/books/comment/insert';
    return axios.post(url, { isbn, email, content });
  },

  getCommentList(isbn) {
    const url = `http://13.125.214.144:8080/api/books/comment/list/${isbn}`;
    return axios.get(url);
  },

  updateBookComment(commentId, content, email) {
    const url = 'http://13.125.214.144:8080/api/books/comment/update';
    return axios.put(url, { commentId, content, email });
  },

  deleteBookComment(commentId) {
    const url = `http://13.125.214.144:8080/api/books/comment/delete/${commentId}`;
    return axios.delete(url);
  },

  getRoomInfo(roomId) {
    const url = `http://3.39.238.25:8080/api/chat/room/${roomId}`;
    return axios.get(url);
  },

  getRoomList() {
    const url = 'http://3.39.238.25:8080/api/chat/rooms';
    return axios.get(url);
  },

  getPrevMessage(roomId) {
    const url = `http://3.39.238.25:8080/api/chat/prevMessage/${roomId}`;
    return axios.get(url);
  },

  getAlarmRooms(email) {
    const url = `http://3.39.238.25:8080/api/chat/rooms/alarm/${email}`;
    return axios.get(url);
  },
};

