<template>
    <div class="alarm-rooms">
      <ul v-if="data.alarmRooms.length">
        <li v-for="room in data.alarmRooms" :key="room.roomId" class="room-item">
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

        alarmRooms : [],
      }); // 알림이 있는 채팅방 목록

      const fetchAlarmRooms = async () => {
        try {
          const response = await api.getAlarmRooms();
          data.alarmRooms = response.data;
        } catch (error) {
          console.error("채팅방 목록을 가져오는 중 오류 발생:", error);
        }
      };
  
      onMounted(fetchAlarmRooms);


  </script>