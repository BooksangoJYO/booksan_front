<template>
  <div class="chat-right">
      <div class="chat-box" v-if="data.roomId && data.roomId.length>0">
        <div class="header">
          <div class="header-content">
            <div class="book-info">
              <img 
                :src="data.bookInfo.image"
                class="book-image"
                alt="Book cover"
              >
              <div class="text-info">
                <h1 class="title" @click="">{{ data.bookInfo.title }}</h1>
                <p class="title" @click="">{{ data.boardInfo.title }}</p>
                <p class="title" @click="">{{ data.boardInfo.price }}원</p>
              </div>
            </div>
          </div>
        </div>
          <div class="messages-container">
            <div class="messages" id="message_list" ref="messageContainer">
              <div 
                  v-for="(message,index) in data.messages" 
                  :key="index"
                  :class="[
                      'message-wrapper',
                      message.sender === loginInfo.email ? 'message-right' : 'message-left'
                  ]"
              >
                  <div class="chat-bubble">
                      <div class="sender-name" v-if="message.sender !== loginInfo.email">
                          {{ message.sender }}
                      </div>
                      <div class="message-content">
                          {{ message.message }}
                      </div>
                  </div>
              </div>
          </div>
          </div>
          <div class="input-container">
              <input 
                  type="text" 
                  class="form-control" 
                  v-model="inputMessage" 
                  id="send_message_button" 
                  @keydown.enter="sendMessage()" 
                  placeholder="메시지를 입력해주세요."
              >
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
import { defineEmits, defineProps, nextTick, ref, watchEffect } from 'vue';
import { useMainStore } from '@/store/mainStore';
import { storeToRefs } from 'pinia';

const store = useMainStore();
const {loginInfo} = storeToRefs(store);

const props = defineProps({
  data: {
      type: Object,
      required: true
  }
});

const emit = defineEmits();
const inputMessage = ref('');
const showMenu = ref(false);
const messageContainer = ref(null);



// 스크롤을 맨 아래로 이동시키는 함수
const scrollToBottom = async () => {
  await nextTick(() => {
      if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
      }
  });
};

// 메시지 목록이 변경될 때마다 스크롤 자동 이동
watchEffect(() => {
  if (props.data.messages && props.data.messages.length) {
      scrollToBottom();
  }
});

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const sendMessage = async () => {
  if (inputMessage.value.trim()) {
      emit('sendMessage', inputMessage.value);
      inputMessage.value = '';
      await scrollToBottom();
  }
};

const exitChat = async() => {
  showMenu.value = false;
  emit('exitChat');

};


// 컴포넌트가 마운트된 후 초기 스크롤
nextTick(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-right {
  height: 100%;
  overflow: hidden;
  flex: 7;
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
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  margin: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.messages::-webkit-scrollbar {
  display: none;
}

.header {
  padding: 1.5rem;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.book-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.book-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.text-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.title:hover {
  color: #4a4a4a;
}

.price {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  cursor: pointer;
}

.menu-wrapper {
  position: relative;
}

.menu-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  color: #666;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 120px;
}

.exit-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: #ff4d4f;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.exit-button:hover {
  background-color: rgba(255, 77, 79, 0.05);
}
.message-wrapper {
    display: flex;
    margin-bottom: 16px;
    width: 100%;
}

.message-left {
    justify-content: flex-start;
}

.message-right {
    justify-content: flex-end;
}

.message-left .chat-bubble {
    background-color: white;
    margin-right: 20%;
}

.message-right .chat-bubble {
    background-color: #a08e83;
    color: white;
    margin-left: 20%;
}

.chat-bubble {
    padding: 12px 16px;
    border-radius: 20px;
    max-width: 70%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.sender-name {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.message-content {
    word-break: break-word;
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