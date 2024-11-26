<template>
  <div class="alert-boards">
    <div class="notification-box">
      <h3 class="notification-title">관심 등록한 책에 대한 알림</h3>
      <div class="board-items">
        <ul>
          <li
            v-if="data.reservationBoards.length"
            v-for="board in data.reservationBoards"
            :key="board.dealId"
            class="board-item"
          >
            <div class="book-item" @click="openRead(board.dealId)">
              <div class="image-container" v-if="board.imageFileDTOList && bboard.imageFileDTOList.length > 0">
                <img :src="API_URLS.BOARD+'/api/download'+board.imageFileDTOList[0].imgId" class="book-image"/>
              </div>
              <div class="message">
                <div class="board-title">{{ board.title }}</div>
                <div class="book-title">{{ board.bookTitle }}</div>
              </div>
            </div>
          </li>
          <li v-else class="empty-state">현재 새로운 예약 알림이 없습니다.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/api';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
const API_URLS = {
  BOARD: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_BOARD : '',
};

const router = useRouter();
const emit = defineEmits(["close"]);

const data = reactive({
  reservationBoards: [],
});

const fetchReservationBoards = async () => {
  try {
    const response = await api.getReservationBoards();
    data.reservationBoards = response.data;
  } catch (error) {
    console.error("예약 목록을 가져오는 중 오류 발생:", error);
  }
};

function openRead(dealId) {
  router.push({ path: `/board/read/${dealId}` });
  emit("close");
}

onMounted(fetchReservationBoards);
</script>

<style scoped>
.alert-boards {
  width: 400px;
  margin: 0 auto;
}

.notification-box {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.notification-title {
  padding: 16px;
  margin: 0;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.board-items ul {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 500px;
  overflow-y: auto;
}

.board-item {
  width: 90%;
  padding: 12px 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.board-item:hover {
  background-color: #f8f9fa;
  transform: translateX(2px);
}

.book-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.image-container {
  width: 60px;
  height: 80px;
  flex-shrink: 0;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.message {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-title {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.board-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

@media (max-width: 480px) {
  .alert-boards {
    width: 100%;
    max-width: 400px;
    padding: 10px;
  }
  
  .image-container {
    width: 50px;
    height: 70px;
  }
  
  .book-title, .board-title {
    max-width: 200px;
  }
}
</style>