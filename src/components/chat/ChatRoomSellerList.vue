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
          >
                    <div class="chat-item">
                        <div class="avatar"></div>
                        <div class="message">
                            <div class="text">{{ room.name }}</div>
                            <div class="sub-text">{{room.userCount}}</div>
                        </div>
                    </div>
          </li>
          <li>현재 들어온 거래 요청이 없습니다.</li>
        </ul>
    </div>
</template>

<script setup>
import api from "@/api/api";
import { defineEmits, defineProps, onMounted, reactive } from 'vue';

    const props = defineProps({
      dealId: {
          type: Number,
          required: true
      }
    });

    const emit = defineEmits();
    const data = reactive({
        chatRooms: []
    });


    onMounted(()=>{
        roomListOutput();
    })


    const roomListOutput = async () => {
      console.log("셀러챗룸");
        const response = await api.getRoomListByDealId(props.dealId);
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
    flex : 3.5;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.chat-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.chat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #eee;
  margin-right: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.message {
  flex: 1;
}

.text {
  font-size: 15px;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
}

.sub-text {
  font-size: 13px;
  color: #666;
}
</style>