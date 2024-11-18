<template>
    <div class="alert-rooms">
      <ul v-if="data.alertRooms.length">
        <li v-for="room in data.alertRooms" :key="room.roomId" class="room-item">
          <h3>{{ room.name }}</h3>
          <p>방 ID: {{ room.roomId }}</p>
          <p>생성일: {{ room.insertDaytime}}</p>
          <p>타입: {{ room.type }}</p>
        </li>
      </ul>
      <p v-else>알림이 있는 채팅방이 없습니다.</p>
    </div>
  </template>
  
<script setup>
import api from '@/api/api';
import { onMounted, reactive } from 'vue';
      const data = reactive({

        alertRooms : [],
      }); // 알림이 있는 채팅방 목록

      const fetchAlertRooms = async () => {
        try {
          const response = await api.getAlertRooms();
          data.alertRooms = response.data;
        } catch (error) {
          console.error("채팅방 목록을 가져오는 중 오류 발생:", error);
        }
      };
  
      onMounted(fetchAlertRooms);


</script>

<style scope>
.alert-rooms {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.alert-rooms ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-gap: 20px;
}

.room-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #eaeaea;
}

.room-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.room-item h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.room-item p {
  margin: 8px 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

.alert-rooms p:empty {
  color: #999;
  text-align: center;
  padding: 40px 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .alert-rooms {
    padding: 15px;
  }
  
  .room-item {
    padding: 15px;
  }
}
</style>