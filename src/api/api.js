import { useMainStore } from '@/store/mainStore';
import axios from 'axios';
import Cookies from 'js-cookie';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const API_URLS = {
  USERS: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_USER : '',
  BOARD: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_BOARD : '',
  CHAT: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_CHAT : '',
};


const apiClient = axios.create({
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
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
    if(error.response?.status === 500) console.log("서버에러");
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        console.log("refresh토큰 실행");
        
        // 인증 서버로 직접 refresh 요청
        const refreshToken = getCookie('refreshToken');
        const { data } = await apiClient.post(
          `${API_URLS.USERS}/api/users/refresh`,
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
      }
    }
    return Promise.reject(error);
  }
);





export default {
  login(uid, email) {
    return apiClient.post(`${API_URLS.USERS}/api/users/auth/socialLogin`, { uid, email });
  },

  signup(email, uid, nickname) {
    return apiClient.post(`${API_URLS.USERS}/api/users/signup`, { email, uid, nickname });
  },

  handleKakaoCallback(code) {
    return apiClient.get(`${API_URLS.USERS}/api/users/auth/kakao/callback?code=${code}`);
  },

  checkNickname(nickname) {
    return apiClient.get(`${API_URLS.USERS}/api/users/checkNickname?nickname=${nickname}`);
  },

  getUserInfo() {
    return apiClient.get(`${API_URLS.USERS}/api/users/loginInfo`);
  },

  getBookMarks() {
    return apiClient.get(`${API_URLS.BOARD}/api/board/bookMark/list`);
  },

  getMyPosts(params) {
    return apiClient.get(`${API_URLS.BOARD}/api/board/mypage/list`, {params});
  },

  updateProfile(userData) {
    return apiClient.post(`${API_URLS.USERS}/api/users/update`, userData);
  },

  updateProfileImage(formData) {
    return apiClient.put(API_URLS.USERS+'/api/users/update/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteProfileImage() {
    return apiClient.delete('/api/users/delete/image');
  },

  deleteAccount() {
    return apiClient.delete(`${API_URLS.USERS}/api/users/delete`);
  },

  getRecommendedBooks() {
    return apiClient.get(`${API_URLS.BOARD}/api/books/recommended`);
  },

  //네이버 책 검색 api(가판대 등록시 사용)
  getBooksInfo(searchTitle, page, size) {
    const url = `${API_URLS.BOARD}/api/books/searchAll/${searchTitle}/${page}/${size}`;
    return apiClient.get(url);
  },

  //등록된 책정보 얻기(조회페이지에서 사용-선택된 책정보)
  getBookInfo(isbn) {
    const url = `${API_URLS.BOARD}/api/books/search/${isbn}`;
    return apiClient.get(url);
  },

  //책 카테고리 얻기
  getBookCategories() {
    const url = `${API_URLS.BOARD}/api/books/categories`;
    return apiClient.get(url);
  },

  //가판대 등록
  BoardInsert(boardData) {
    const url = `${API_URLS.BOARD}/api/board/insert`;
    console.log(boardData);
    return apiClient.post(url, boardData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  //가판대 단건조회
  getBoardRead(dealId) {
    const url = `${API_URLS.BOARD}/api/board/read/${dealId}`;
    return apiClient.get(url);  
  },

  //가판대 목록 가져오기
  getBoardList(page, size, keyword, availableOnly, booksCategoryId, isbn) {
    const url = `${API_URLS.BOARD}/api/board/list?page=${page}&size=${size}&keyword=${keyword}&availableOnly=${availableOnly}&booksCategoryId=${booksCategoryId}&isbn=${isbn}`;
    return apiClient.get(url);
  },

  //가판대 수정
  updateBoard(dataToSend) {
    const url = `${API_URLS.BOARD}/api/board/update`;
    return apiClient.put(url, dataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  postChatRoom(name,dealId, writerEmail) {
    const url = `${API_URLS.CHAT}/api/chat/room/insert/${writerEmail}`;
    return apiClient.post(url,{name,dealId});
  },

  //게시판 삭제
  deleteBoard(dealId, email) {
    const url = `${API_URLS.BOARD}/api/board/delete/${dealId}`;
    return apiClient.delete(url, {
      data: email
    });
  },

  //댓글 등록
  addComment(isbn, content) {
    const url =`${API_URLS.BOARD}/api/books/comment/insert`;
    return apiClient.post(url, { isbn, content });
  },

  //댓글 목록
  getCommentList(isbn) {
    const url = `${API_URLS.BOARD}/api/books/comment/list/${isbn}`;
    return apiClient.get(url);
  },

  //댓글 수정
  updateBookComment(commentId, content, email) {
    const url = `${API_URLS.BOARD}/api/books/comment/update`;
    return apiClient.put(url, { commentId, content, email });
  },

  //댓글 삭제
  deleteBookComment(commentId, email) {
    const url = `${API_URLS.BOARD}/api/books/comment/delete/${commentId}`;
    return apiClient.delete(url, {
      data : { email }
    });
  },

  //판매 상태 변경 API 메서드 추가
  updateBoardStatus(dealId, status) {
    const url =`${API_URLS.BOARD}/api/board/status/update`;
    return apiClient.put(url, {dealId,status})
  },

  //추천 가격 요청 API 요청
  getRecommendPrice(isbn, publishDate, bookOriginalPrice) {
    const url = `${API_URLS.BOARD}/api/books/recommendPrice`;
    return apiClient.post(url, {
      isbn: isbn,
      publishDate: publishDate,
      bookOriginalPrice: bookOriginalPrice,
      });
  },

  insertBookMark(dealId) {
    const url = `${API_URLS.BOARD}/api/board/bookMark/insert/`+dealId;
    return apiClient.post(url);
  },

  getBookMarkList() {
    const url = `${API_URLS.BOARD}/api/board/bookMark/list`;
    return apiClient.get(url);
  },

  getRoomInfo(roomId) {
    const url = `${API_URLS.CHAT}/api/chat/room/${roomId}`;
    return apiClient.get(url);
  },

  getRoomList() {
    const url =`${API_URLS.CHAT}/api/chat/rooms`;
    return apiClient.get(url);
  },

  getRoomListByDealId(dealId){
    const url = `${API_URLS.CHAT}/api/chat/rooms/seller/`+dealId;
    console.log(url);
    return apiClient.get(url);
  },

  getPrevMessage(roomId) {
    const url = `${API_URLS.CHAT}/api/chat/prevMessage/${roomId}`;
    return apiClient.get(url);
  },

  getAlertRooms() {
    const url =`${API_URLS.CHAT}/api/chat/rooms/alert`;
    return apiClient.get(url);
  },

  getReservationBoards() {
    const url =`${API_URLS.BOARD}/api/board/reservation/list`;
    return apiClient.get(url);
  },

  insertBookMarkBook(isbn) {
    const url =`${API_URLS.BOARD}/api/books/bookMark/book/insert/`+isbn;
    return apiClient.post(url);
  },

  getBookMarkBookList(page,size) {
    const url = `${API_URLS.BOARD}/api/books/bookMark/book/list?page=`+page+'&size='+size
    return apiClient.get(url);
  },

  getRecommendedIsbnList() {
    const url = `${API_URLS.BOARD}/api/board/recommend/books`;
    return apiClient.get(url);
  },

  getWeeklyStats(){
    const url = `${API_URLS.USERS}/api/admin/dashboard/data`;
    return apiClient.get(url);
  }
};

