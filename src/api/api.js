import axios from 'axios';

const apiClient = axios.create({
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
 getBookInfo(searchTitle){
  const url = "/api/books/search";
  //params: { query: searchTitle }: axios의 get 메서드에서 params 옵션을 사용하여 URL에 쿼리 파라미터를 추가합니다.

  apiClient.get(url,{ params: {query:searchTitle}});
 },
};
