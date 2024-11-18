<template>
    <div class="reservation-boards">
      <ul v-if="data.reservationBoards.length">
        <li v-for="board in data.reservationBoards" :key="board.dealId" class="board-item">
          <img :src="board.image"/>
          <p>책 이름: {{ board.bookTitle }}</p>
          <p @click="openRead(board.dealId)">게시글 제목: {{ board.title}}</p>
        </li>
      </ul>
      <p v-else>현재 알림이 없습니다.</p>
    </div>
  </template>
  
<script setup>
import api from '@/api/api';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits(["close"]);

const data = reactive({
  reservationBoards : [],
}); // 알림이 있는 채팅방 목록

const fetchReservationBoards = async () => {
  try {
    const response = await api.getReservationBoards();
    data.reservationBoards = response.data;
  } catch (error) {
    console.error("예약 목록을 가져오는 중 오류 발생:", error);
    emit("close");
  }
};

function openRead(dealId) {
  router.push({ path: `/board/read/${dealId}` });
}
onMounted(fetchReservationBoards);


</script>

<style scope>
.reservation-boards {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.reservation-boards ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.board-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #eaeaea;
}

.board-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.board-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eaeaea;
}

.board-item p {
  margin: 0;
  padding: 12px 16px;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
}

.board-item p:first-of-type {
  font-weight: 600;
  color: #2c3e50;
  padding-bottom: 8px;
}

.reservation-boards > p {
  text-align: center;
  color: #666;
  padding: 40px 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .reservation-boards {
    padding: 15px;
  }
  
  .reservation-boards ul {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .board-item img {
    height: 160px;
  }
}
</style>