<template>
    <div class="reservation-boards">
      <ul v-if="data.reservationBoards.length">
        <li v-for="board in data.reservationBoards" :key="board.dealId" class="board-item">
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
        reservationBoards : [],
      }); // 알림이 있는 채팅방 목록

      const fetchReservationBoards = async () => {
        try {
          const response = await api.getReservationBoards();
          data.reservationBoards = response.data;
        } catch (error) {
          console.error("예약 목록을 가져오는 중 오류 발생:", error);
        }
      };
  
      onMounted(fetchReservationBoards);


  </script>