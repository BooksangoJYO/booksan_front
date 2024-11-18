<template>
    <div class="chat-left">
        <div class="row">
            <div class="col-md-12">
                <h3>채팅방 리스트</h3>
            </div>
        </div>
        <!-- 방 목록은 비동기로 서버에서 얻어 출력한다 -->
        <ul id="roomList">
			<li
            v-if="data.chatRooms.length"
			v-for="room in data.chatRooms"
			:key="room.roomId"
			@click="enterRoom(room.roomId)"
            class="room-item"
			>
        <div class="chat-item">
            <div class="avatar"></div>
            <div class="message">
                <div class="text">{{ room.name }}</div>
                <div v-if="getUserRole(room)">
                    <span 
                    class="type-tag"
                    :class="{
                        'purchase': getUserRole(room) === '구매',
                        'sale': getUserRole(room) === '판매'
                    }"
                    >{{getUserRole(room)}}</span>
                </div>
            </div>
        </div>
			</li>
		</ul>
    </div>
</template>

<script setup>
import api from "@/api/api";
import { defineEmits, onMounted, reactive } from 'vue';

    const email = sessionStorage.getItem('userEmail');
    const emit = defineEmits();
    const data = reactive({
        chatRooms: []
    });


    onMounted(()=>{
        roomListOutput();
    })

    const getUserRole= (room)=> {
        const userType = room.userMap[email];
      if (email && userType != null) {
        return userType == "customer" ? "구매" : "판매";
      }
      return null; // 해당 이메일이 없으면 null 반환
    }

    const roomListOutput = async () => {
        const response = await api.getRoomList();
        data.chatRooms = response.data;  // 받아온 방 목록을 상태에 저장
    };


    const enterRoom = roomId => {
        //입장하는 사람의 이름과 채팅방이름을 지역저장소에 저장한다
        //이렇게 저장하면 다른 페이지에서 해당 키를 이용하여 값을 읽을 수 있다
        sessionStorage.setItem('chat.roomId', roomId);
        emit('enterChatRoom');
    }



</script>

<style scoped>
ul {
    list-style-type: none;  /* 기본 마커 제거 */
    padding-left: 0;         /* 왼쪽 여백도 제거 */
}
.chat-left {
    flex : 3;
  width: 100%;
  height: 95%;
  padding: 20px;
  overflow-y: auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
#roomList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.room-item {
  cursor: pointer;
  padding: 12px;
  transition: background-color 0.2s ease;
}

.room-item:hover {
  background-color: #f5f5f5;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #f0f0f0;
}

.message {
  flex: 1;
}

.text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.room-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.type-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

.type-tag.purchase {
  background-color: #e6f4ff;
  color: #0066cc;
  border: 1px solid #91caff;
}

.type-tag.sale {
  background-color: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffa39e;
}

.sub-text {
  font-size: 14px;
  color: #666;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>