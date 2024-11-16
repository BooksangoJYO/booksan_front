<template>
    <div class="alert-boards">
      <ul v-if="data.alertBooks.length">
        <li v-for="board in data.alertBoards" :key="board.dealId" class="board-item">
          <img :src="board.image"/>
          <p>책 이름: {{ board.bookTitle }}</p>
          <p>게시글 제목: {{ board.title}}</p>
        </li>
      </ul>
      <p v-else>현재 알림이 없습니다.</p>
    </div>
  </template>
  
  <script setup>
import api from '@/api/api';
import { onMounted, reactive } from 'vue';
      const data = reactive({
        alertBoards : [],
      }); // 알림이 있는 채팅방 목록

      const fetchAlertBoards = async () => {
        try {
          const response = await api.getAlertBoards();
          data.alertBoards = response.data;
        } catch (error) {
          console.error("채팅방 목록을 가져오는 중 오류 발생:", error);
        }
      };
  
      onMounted(fetchAlertBoards);


  </script>