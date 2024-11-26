<template>
  <div class="alert-rooms">
    <div class="notification-box">
      <h3 class="notification-title">채팅 알림</h3>
      <div class="room-items">
        <ul>
          <li
            v-if="data.alertRooms.length"
            v-for="room in data.alertRooms"
            :key="room.roomId"
            @click="openChat(room.roomId)"
            class="room-item"
          >
            <div class="chat-item">
              <div class="message">
                <div class="text">{{ room.name }}</div>
                <div class="notification-indicator" v-if="room.hasNewMessage">
                  새 메시지
                </div>
              </div>
            </div>
          </li>
          <li v-else class="empty-state">현재 새로운 채팅방 알림이 없습니다.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/api';
import { onMounted, reactive } from 'vue';
const API_URLS = {
  USERS: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_USER : '',
};
const defaultProfile = `${API_URLS.USERS}/api/users/read/download/524`;
const data = reactive({
  alertRooms: [],
});

const emit = defineEmits(["close"]);

const fetchAlertRooms = async () => {
  try {
    const response = await api.getAlertRooms();
    if(response.data){
    data.alertRooms = response.data.map(room => ({
      ...room,
      hasNewMessage: true
    }));
  }
  } catch (error) {
    console.error("채팅방 목록을 가져오는 중 오류 발생:", error);
    emit("close");
  }
};

const getOtherUserEmail = (room) => {
  return Object.keys(room.userMap).find(email => email !== loginInfo.value.email);
};

const fetchUserProfile = async (room) => {
  const otherEmail = getOtherUserEmail(room);
  try {
    const response = await api.getUserInfoByEmail(otherEmail);
    room.otherUserProfile = `${API_URLS.USERS}/api/users/read/download/${response.data.imgId}`;
  } catch (error) {
    console.error('프로필 이미지를 불러오는데 실패했습니다:', error);
    room.otherUserProfile = defaultProfile;
  }
};

onMounted(fetchAlertRooms);

const openChat = (roomId) => {
  emit("close");
  sessionStorage.setItem('chat.roomId', roomId);
  const chatWindow = window.open(
    'https://www.booksan.shop/chat/room',
    '채팅방',
    'width=500,height=600,top=100,left=500,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no'
  );
  emit("close");
};
</script>

<style scoped>
.alert-rooms {
  width: 400px;
  margin: 0 auto;
}

.notification-box {
  width : 100%;
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

.alert-rooms ul {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 500px;
  overflow-y: auto;
}
.room-items{
  width: 100%;
  align-items: center;
}
.room-item {
  width: 90%;
  padding: 12px 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.room-item:hover {
  background-color: #f8f9fa;
  transform: translateX(2px);
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f0f0f0;
  flex-shrink: 0;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  background-color: #ff4757;
  border-radius: 50%;
  border: 2px solid #fff;
  animation: pulse 2s infinite;
}

.message {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  
  max-width: 200px;
}

.notification-indicator {
  font-size: 12px;
  color: #ff4757;
  background-color: #ffe0e3;
  padding: 4px 8px;
  border-radius: 12px;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}



@media (max-width: 480px) {
  .alert-rooms {
    width: 100%;
    max-width: 400px;
    padding: 10px;
  }
  
  .text {
    max-width: 150px;
  }
  
  .notification-indicator {
    font-size: 11px;
    padding: 2px 6px;
  }
}
</style>