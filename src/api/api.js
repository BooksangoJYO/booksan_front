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
  getBooksInfo(keyword, page, size){
    const url = "/books/searchAll/"+keyword;
    return apiClient.get(url, {
        params: {page, size}
    });
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


  postChatRoom(roomName,email,writerEmail) {
    const url = "/chat/room/insert/"+roomName + "/" + email + "/" + writerEmail;

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

  postChatRoom(roomName) {
    const url = "/chat/room/insert/"+roomName;
    return apiClient.post(url);
  },
  getRoomInfo(roomId){
    const url = "/chat/room/"+roomId;
    return apiClient.get(url);

  },
  getRoomList(email){
    console.log("방 목록 요청"+email);
    const url = '/chat/rooms/'+email;
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
