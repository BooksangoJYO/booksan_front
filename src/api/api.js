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
