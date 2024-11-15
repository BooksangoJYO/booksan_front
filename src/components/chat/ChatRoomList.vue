<template>
    <div class="chat-left">
        <div class="row">
            <div class="col-md-12">
                <h3>채팅방 리스트</h3>
            </div>
        </div>
        <!-- <div class="input-group">
            <div class="input-group-prepend">
                <label class="input-group-text">방제목</label>
            </div>
            <input type="text"  @keydown.enter="createRoom()" class="form-control" v-model="roomName" id="room_name">
            <div class="input-group-append">
                <button class="btn btn-primary" @click="createRoom()" type="button" id="create_room_button">채팅방 개설</button>
            </div>
        </div> -->
        <!-- 방 목록은 비동기로 서버에서 얻어 출력한다 -->
        <ul id="roomList">
			<li
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
		</ul>
        <!-- <AlarmRooms v-if="viewAlarmRooms" />
        <div>
            <button @click="toggleAlarmRooms">알림창 열기</button>
        </div> -->
    </div>
</template>

<script setup>
import api from "@/api/api";
import { defineEmits, onMounted, reactive, ref } from 'vue';

    const roomName = ref(null);
    const emit = defineEmits();
    const data = reactive({
        chatRooms: []
    });

    let viewAlarmRooms = ref(false);


    onMounted(()=>{
        roomListOutput();
    })


    const roomListOutput = async () => {
        const response = await api.getRoomList();
        console.log(response);
        console.log(response.data);
        data.chatRooms = response.data;  // 받아온 방 목록을 상태에 저장
        console.log(data.chatRooms);
    };

    const createRoom = async () =>{
        if("" === roomName.value) {
            alert("방 제목을 입력해 주십시요.");
            return;
        }
        const writerEmail = "gdh6356@naver.com"
        const dealId = 1;
        await api.postChatRoom(roomName.value,dealId,writerEmail)
        .then(response => {
            const chatRoom = response.data; // 서버에서 반환된 데이터
            alert(chatRoom.name + "방 개설에 성공하였습니다.");
            roomName.value='';
            // 다른 사람이 개설한 방 목록과 내가 개설한 목록을 전체를 얻어 출력한다
            roomListOutput();
        })
        .catch(err => {
            alert("채팅방 개설에 실패하였습니다.");
        });
    };

    const enterRoom = roomId => {
        //입장하는 사람의 이름과 채팅방이름을 지역저장소에 저장한다
        //이렇게 저장하면 다른 페이지에서 해당 키를 이용하여 값을 읽을 수 있다
        sessionStorage.setItem('chat.roomId', roomId);
        emit('enterChatRoom');
    }

    const toggleAlarmRooms = () => {
        viewAlarmRooms.value = !viewAlarmRooms.value;
    };


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