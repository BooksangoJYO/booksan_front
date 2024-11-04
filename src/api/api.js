import axios from 'axios';

const apiClient = axios.create({
  baseURL : '/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
//클라이언트에서 직접 api요청 --> 서버요청으로 변경
  //const url = "https://openapi.naver.com/v1/search/book.json?query="+searchTitle;


  //책제목으로 검색해서 네이버API서버에 책정보 가져오기
  getBookInfo(searchTitle){
    const url = "/books/search/"+searchTitle;
    return apiClient.get(url);
  }, 

  //책 카테고리 리스트 가져오기
  getBookCategories(){
    const url = "/books/categories";
    return apiClient.get(url);
  },

  postChatRoom(roomName) {
    const url = "/chat/room/insert/"+roomName;
    return apiClient.post(url);
  },
  getRoomInfo(roomId){
    const url = "/chat/room/"+roomId;
    return axios.get(url);

  },
  getRoomList(){
    const url = '/chat/rooms';
    return axios.get(url);
  }
};
