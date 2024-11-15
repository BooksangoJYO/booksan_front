<template>
    <div class="chat-right">
        <div class="chat-box" v-if="data.roomId && data.roomId.length>0">
            <div class="header">
                <div class="header-content">
                    <div>
                        <div class="title">{{ data.chatRoom.name }}</div>
                        <div class="price">5,000원</div>
                    </div>
                    <div class="menu-button" @click="toggleMenu">⋮</div>
                </div>
            </div>
            <div v-if="showMenu" class="dropdown-menu">
                <button @click="exitChat">나가기</button>
            </div>
            <div class="messages-container"> <!-- 새로운 컨테이너 추가 -->
                <ul class="messages" id="message_list">
                    <li class="chat-bubble" v-for="(message,index) in data.messages" :key="index">
                        {{message.sender}} : {{message.message}}
                    </li>
                </ul>
            </div>
            <div class="input-container">
                <input type="text" class="form-control" v-model="inputMessage" id="send_message_button" @keydown.enter="sendMessage()" placeholder="메시지를 입력해주세요.">
                <button class="send-button">
                    <span class="send-icon" @click="sendMessage()">➤</span>
                </button>
            </div>
        </div>
        <div class="chat-box" v-else>
            <p>열려있는 채팅방이 존재하지 않습니다.</p>
        </div>
    </div>
</template>


<script setup>
import { defineEmits, defineProps, ref } from 'vue';

    // 부모로부터 전달된 data 객체를 props로 받음
    const props = defineProps({
        data: {
            type: Object,
            required: true
        }
    });
    const emit = defineEmits();
    const inputMessage = ref('');
    const showMenu = ref(false);

    const toggleMenu = () => {
        showMenu.value = !showMenu.value;  // 메뉴를 토글
    };

    const sendMessage = ()=> {
        emit('sendMessage',inputMessage.value);
        inputMessage.value='';
    }
    const exitChat = () => {
        console.log("나가기 실행!!");
        //emit('exitChat');  // 부모 컴포넌트로 나가기 이벤트 전송
        showMenu.value = false;  // 메뉴 숨기기
    };

</script>

<style scoped>
.chat-right {
    height: 100%;
    overflow: hidden;
    flex: 6.5;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.chat-box {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.messages-container {
    flex: 1;
    overflow: hidden;
    position: relative;
    background: #fafafa;
}

.messages {
    height: 100%;
    overflow-y: auto;
    padding: 24px;
    margin: 0;
    list-style: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.header {
  padding: 24px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  background: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-button {
  font-size: 20px;
  cursor: pointer;
}

.dropdown-menu {
  margin: 16px 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 10px;
  width: 100px;
  z-index: 1;
}

.dropdown-menu button {
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.dropdown-menu button:hover {
  background: #f5f5f5;
}


.chat-bubble {
  background: white;
  padding: 16px;
  border-radius: 20px;
  margin-bottom: 12px;
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.input-container {
  display: flex;
  padding: 20px;
  border-top: 1px solid rgba(0,0,0,0.08);
  background: white;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.02);
}

input {
  flex: 1;
  padding: 16px 24px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 30px;
  margin-right: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

input:focus {
  outline: none;
  border-color: #a08e83;
  box-shadow: 0 2px 8px rgba(160,142,131,0.2);
}

.send-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #a08e83;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(160,142,131,0.3);
}

.send-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(160,142,131,0.4);
}

.send-icon {
  font-size: 16px;
}
</style>