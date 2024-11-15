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
        const { data } = await apiClient.post('/api/users/refresh', {
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
        sessionStorage.removeItem("userData");
        router.replace({ path: '/login' });
      }
    }
    return Promise.reject(error);
  }
);





export default {
  handleKakaoCallback(code) {
    return apiClient.get(`/api/users/auth/kakao/callback?code=${code}`);
  },

  logout() {
    return apiClient.post('/api/users/logout');
  },

  getUserInfo() {
    return apiClient.get('/api/users/mypage');
  },

  updateProfile(userData) {
    return apiClient.post('/api/users/update', userData);
  },

  deleteAccount() {
    return apiClient.delete('/api/users/delete');
  },

  getBooksInfo(searchTitle, page, size) {
    const url = `/api/books/searchAll/${searchTitle}/${page}/${size}`;
    return apiClient.get(url);
  },

  getBookInfo(isbn) {
    const url = `/api/books/search/${isbn}`;
    return apiClient.get(url);
  },

  getBookCategories() {
    const url = '/api/books/categories';
    return apiClient.get(url);
  },

  BoardInsert(boardData) {
    const url = '/api/board/insert';
    return apiClient.post(url, boardData);
  },

  getBoardRead(dealId) {
    const url = `/api/board/read/${dealId}`;
    return apiClient.get(url);
  },

  getBoardList(page, size, keyword) {
    const url = `/api/board/list?page=${page}&size=${size}&keyword=${keyword}`;
    return apiClient.get(url);
  },

  updateBoard(dataToSend) {
    const url = '/api/board/update';
    return apiClient.put(url, dataToSend);
  },

  postChatRoom(name,dealId, writerEmail) {
    const url = `/api/chat/room/insert//${writerEmail}`;
    return apiClient.post(url,{name,dealId});
  },

  deleteBoard(dealId) {
    const url = `/api/board/delete/${dealId}`;
    return apiClient.delete(url);
  },

  addComment(isbn, email, content) {
    const url = '/api/books/comment/insert';
    return apiClient.post(url, { isbn, email, content });
  },

  getCommentList(isbn) {
    const url = `/api/books/comment/list/${isbn}`;
    return apiClient.get(url);
  },

  updateBookComment(commentId, content, email) {
    const url = '/api/books/comment/update';
    return apiClient.put(url, { commentId, content, email });
  },

  deleteBookComment(commentId) {
    const url = `/api/books/comment/delete/${commentId}`;
    return apiClient.delete(url);
  },

  insertFavorite(dealId) {
    const url = '/api/board/favorite/list/'+dealId;
    return apiClient.post(url);
  },

  getFavoriteList() {
    const url = '/api/board/favorite/insert';
    return apiClient.get(url);
  },

  getRoomInfo(roomId) {
    const url = `/api/chat/room/${roomId}`;
    return apiClient.get(url);
  },

  getRoomList() {
    const url = '/api/chat/rooms';
    return apiClient.get(url);
  },

  getPrevMessage(roomId) {
    const url = `/api/chat/prevMessage/${roomId}`;
    return apiClient.get(url);
  },

  getAlarmRooms(email) {
    const url = `/api/chat/rooms/alarm/${email}`;
    return apiClient.get(url);
  },
};

