import router from '@/router';
import { useMainStore } from '@/store/mainStore';
import axios from 'axios';
import Cookies from 'js-cookie';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}


const apiClient = axios.create({
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
    if(error.response?.status === 500){router.replace('/');}
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        console.log("refresh토큰 실행");
        
        // 인증 서버로 직접 refresh 요청
        const refreshToken = getCookie('refreshToken');
        const { data } = await apiClient.post(
          '/api/users/refresh',
          {}, // 요청 바디가 비어있다면 빈 객체로 보냄
          {
            headers: {
              refreshToken: refreshToken // 헤더에 리프레시 토큰 추가
            }
          }
        );
        
        // 새 access token으로 원래 요청 재시도
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;
        Cookies.set('accessToken', newAccessToken, { 
          httpOnly: false, 
          secure: true 
        });
        if(newRefreshToken){
          console.log("새로운 리플레쉬 토큰",newRefreshToken);
          Cookies.set('refreshToken', newRefreshToken, { 
            httpOnly: false, 
            secure: true 
          });
        }
        error.config.headers.accesstoken = newAccessToken;
        return apiClient(error.config);
      } catch (error) { 
        // refresh 실패시 로그인으로
        const store = useMainStore();
        store.doLogout();
        router.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);





export default {
  login(uid, email) {
    return apiClient.post('/api/users/auth/socialLogin', { uid, email });
  },

  signup(email, uid, nickname) {
    return apiClient.post('/api/users/signup', { email, uid, nickname });
  },

  handleKakaoCallback(code) {
    return apiClient.get(`/api/users/auth/kakao/callback?code=${code}`);
  },

  checkNickname(nickname) {
    return apiClient.get(`/api/users/checkNickname?nickname=${nickname}`);
  },

  getUserInfo() {
    return apiClient.get('/api/users/loginInfo');
  },

  getBookmarks() {
    return apiClient.get('/api/board/favorite/list');
  },

  getMyPosts(params) {
    return apiClient.get('/api/board/mypage/list', {params});
  },

  updateProfile(userData) {
    return apiClient.post('/api/users/update', userData);
  },

  deleteAccount() {
    return apiClient.delete('/api/users/delete');
  },

  //네이버 책 검색 api(가판대 등록시 사용)
  getBooksInfo(searchTitle, page, size) {
    const url = `/api/books/searchAll/${searchTitle}/${page}/${size}`;
    return apiClient.get(url);
  },

  //등록된 책정보 얻기(조회페이지에서 사용-선택된 책정보)
  getBookInfo(isbn) {
    const url = `/api/books/search/${isbn}`;
    return apiClient.get(url);
  },

  //책 카테고리 얻기
  getBookCategories() {
    const url = '/api/books/categories';
    return apiClient.get(url);
  },

  //가판대 등록
  BoardInsert(boardData) {
    const url = '/api/board/insert';
    console.log(boardData);
    return apiClient.post(url, boardData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  //가판대 단건조회
  getBoardRead(dealId) {
    const url = `/api/board/read/${dealId}`;
    return apiClient.get(url);  
  },

  //가판대 목록 가져오기
  getBoardList(page, size, keyword, availableOnly, booksCategoryId, isbn) {
    const url = `/api/board/list?page=${page}&size=${size}&keyword=${keyword}&availableOnly=${availableOnly}&booksCategoryId=${booksCategoryId}&isbn=${isbn}`;
    return apiClient.get(url);
  },

  //가판대 수정
  updateBoard(dataToSend) {
    const url = '/api/board/update';
    return apiClient.put(url, dataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  postChatRoom(name,dealId, writerEmail) {
    const url = `/api/chat/room/insert//${writerEmail}`;
    return apiClient.post(url,{name,dealId});
  },

  //게시판 삭제
  deleteBoard(dealId, email) {
    const url = `/api/board/delete/${dealId}`;
    return apiClient.delete(url, {
      data: email
    });
  },

  //댓글 등록
  addComment(isbn, content) {
    const url = '/api/books/comment/insert';
    return apiClient.post(url, { isbn, content });
  },

  //댓글 목록
  getCommentList(isbn) {
    const url = `/api/books/comment/list/${isbn}`;
    return apiClient.get(url);
  },

  //댓글 수정
  updateBookComment(commentId, content, email) {
    const url = '/api/books/comment/update';
    return apiClient.put(url, { commentId, content, email });
  },

  //댓글 삭제
  deleteBookComment(commentId, email) {
    const url = `/api/books/comment/delete/${commentId}`;
    return apiClient.delete(url, {
      data : { email }
    });
  },

  //판매 상태 변경 API 메서드 추가
  updateBoardStatus(dealId, status) {
    const url = `/api/board/status/update`;
    return apiClient.put(url, {dealId,status})
  },

  insertFavorite(dealId) {
    const url = '/api/board/favorite/insert/'+dealId;
    return apiClient.post(url);
  },

  getFavoriteList() {
    const url = '/api/board/favorite/list'
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

  getRoomListByDealId(dealId){
    const url = '/api/chat/rooms/seller/'+dealId;
    console.log(url);
    return apiClient.get(url);
  },

  getPrevMessage(roomId) {
    const url = `/api/chat/prevMessage/${roomId}`;
    return apiClient.get(url);
  },

  getAlertRooms() {
    const url = `/api/chat/rooms/alert`;
    return apiClient.get(url);
  },

  getReservationBoards() {
    const url = `/api/board/reservation/list`;
    return apiClient.get(url);
  },

  insertFavoriteBook(isbn) {
    const url = '/api/books/favorite/book/insert/'+isbn;
    return apiClient.post(url);
  },

  getFavoriteBookList(page,size) {
    const url = '/api/books/favorite/book/list?page='+page+'&size='+size
    return apiClient.get(url);
  },

  getRecommendedIsbnList() {
    const url = '/api/board/recommend/books';
    return apiClient.get(url);
  }
};

