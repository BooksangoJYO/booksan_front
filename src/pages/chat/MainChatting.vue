<template>
  <div class="main-chat">
    <div class="chat-container">
      <ChatRoomSellerList
        v-if="dealId"
        v-show="isWideScreen"
        :dealId="dealId"
        @enterChatRoom="enterChatRoom"
        ref="chatRoomRef"
      />
      <ChatRoomList
        v-else
        v-show="isWideScreen"
        @enterChatRoom="enterChatRoom"
        ref="chatRoomRef"
      />
      <ChatRoom :data="chatRoomData" @sendMessage="sendMessage" @exitChat="exitChat"/>
    </div>
  </div>
</template>

<script setup>
const API_URLS = {
  CHAT: import.meta.env.VITE_API_CHAT,
  WS_URL: import.meta.env.VITE_WS_URL
};
import api from '@/api/api';
import ChatRoom from '@/components/chat/ChatRoom.vue';
import ChatRoomList from '@/components/chat/ChatRoomList.vue';
import ChatRoomSellerList from '@/components/chat/ChatRoomSellerList.vue';
import { useMainStore } from '@/store/mainStore';
import * as StompJs from '@stomp/stompjs';
import { storeToRefs } from 'pinia';
import SockJS from 'sockjs-client';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const store = useMainStore();
const {loginInfo} =storeToRefs(store);
const router = useRouter();
const route = useRoute();
const dealId = route.params.dealId ? Number(route.params.dealId) : null

let subscriptionAlarm = null;
let subscriptionChatRoom = null;

const chatRoomRef = ref(null);
const isWideScreen = ref(window.innerWidth >= 800);

const chatRoomData = reactive({
    roomId: '',
    chatRoom:{
        name : '',
        userCount : '',
        dealId : '',

    },
    messages :[
    ],
    boardInfo:{},
    bookInfo:{}
});

const getBoardInfo = async (dealId)=>{
  console.log("dealID="+dealId);
  const response = await api.getBoardRead(dealId);
  chatRoomData.boardInfo = response.data.data;
  chatRoomData.bookInfo =  response.data.bookData;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const stompClient = new StompJs.Client({
  webSocketFactory: () => {
    return new SockJS(API_URLS.CHAT+'/ws-stomp');
  },
  connectHeaders: {
    accessToken: getCookie('accessToken'),
    refreshToken: getCookie('refreshToken'),
  },
  debug: function (str) {
    console.log(str);
  },
  reconnectDelay: 0,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  onConnect: (frame) => {
    console.log('Connected: ' + frame);
    subscribeAlarm();
    subscribeChatRoom();
  },
  onStompError: (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
    router.replace('/');
  },
  onWebSocketClose: () => {
    window.close();
  },
});

const subscribeAlarm = () => {
  const url = API_URLS.CHAT+'/sub/alarm';
  subscriptionAlarm = stompClient.subscribe(url, message => {
    const recv = JSON.parse(message.body);
    recvMessage(recv);
  }, {});
}

const subscribeChatRoom = () => {
  if(chatRoomData.roomId){
    const url = API_URLS.CHAT+'/sub/chat/room/'+chatRoomData.roomId;
    subscriptionChatRoom = stompClient.subscribe(url, message => {
      const recv = JSON.parse(message.body);
      recvMessage(recv);
    }, {});
  }
}

const unsubscribeAlarm = () => {
  if(subscriptionAlarm != null) {
    subscriptionAlarm.unsubscribe();
    subscriptionAlarm = null;
  }
}

const unsubscribeChatRoom = () => {
  if(subscriptionChatRoom != null) {
    subscriptionChatRoom.unsubscribe();
    subscriptionChatRoom = null;
  }
}
const sendMessage = (content) => {
  if (subscriptionChatRoom == null || !stompClient.connected) {
      console.log('연결 상태 확인:', {
        subscriptionChatRoom: subscriptionChatRoom ? '존재' : '없음',
          connected: stompClient.connected
      });
      return;
  }
  
  try {
      stompClient.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify({
              type: 'TALK',
              roomId: chatRoomData.roomId,
              message: content,
              sender : loginInfo.value.email
          })
      });
      
      // 메시지 전송 후 입력창 초기화
      
  } catch (error) {
      console.error('메시지 전송 중 오류:', error);
  }
};
const recvMessage = recv => {
  recv.sender = recv.type == 'ENTER' ? '[알림]' : recv.sender;
  if (recv.type == 'CHAT_INFO_UPDATE') {
    chatRoomRef.value.roomListOutput();
  }
  else{
    if (recv.type == 'ENTER' || recv.type == 'LEAVE') {
          displayEnterUserCount(recv.userCount);
    }
    chatRoomData.messages.push({ sender: recv.sender, message: recv.message });
  }
}

const getPrevMessage = async ()=>{
    const response = await api.getPrevMessage(chatRoomData.roomId);
    chatRoomData.messages = chatRoomData.messages.concat(response.data.map(item => ({
        sender: item.sender,
        message: item.message
    })));
}

const getRoomInfo = async () => {
    const response = await api.getRoomInfo(chatRoomData.roomId);
    chatRoomData.chatRoom.name = response.data.name;
    chatRoomData.chatRoom.dealId = response.data.dealId;
    chatRoomData.chatRoom.userCount=response.data.userCount;
}

const displayEnterUserCount = userCount => {
    chatRoomData.chatRoom.userCount=userCount;
}


const exitChat = ()=>{
  console.log("나가기 실행!!");
}

onMounted(async () => {
  stompClient.activate();
  chatRoomData.roomId='';
  const roomId = sessionStorage.getItem('chat.roomId')
  if(roomId){
    chatRoomData.roomId=roomId;
    await getRoomInfo();
    getPrevMessage();
    getBoardInfo(chatRoomData.chatRoom.dealId);
  }
  // 윈도우 크기 변경 시 반응형 처리
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  unsubscribeAlarm();
  unsubscribeChatRoom();
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
  }
  sessionStorage.removeItem('chat.roomId');
  window.removeEventListener('resize', handleResize);
});

// 화면 크기 변경 시 isWideScreen 업데이트
const handleResize = () => {
  isWideScreen.value = window.innerWidth >= 800;
};

const enterChatRoom = async () => {
  unsubscribeChatRoom();
  chatRoomData.roomId = '';
  chatRoomData.messages = [];
  chatRoomData.roomId = sessionStorage.getItem('chat.roomId'),
  await getRoomInfo();
  subscribeChatRoom();
  getPrevMessage();
  getBoardInfo(chatRoomData.chatRoom.dealId);
}

</script>

<style scoped>

.main-chat {
  width: 85%; /* 메인 영역의 전체 너비를 화면의 80%로 조정 */
  margin: 30px auto; /* 헤더와 간격을 위해 상단 마진 추가 */
  max-width: 1200px; /* 너무 큰 화면에서 제한 */
  height: 80vh; /* 화면 높이의 80%로 설정 */
  background-color: #f9f9f9; /* 배경색 (필요하면 변경) */
  border-radius: 10px; /* 모서리 둥글게 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
}

.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  gap: 16px;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

@media (min-width: 800px) {
  .chat-container {
    flex-direction: row;
    gap: 32px;
  }

  .chat-container > .chat-room-list {
    width: 30%; /* 채팅방 리스트의 크기 */
  }

  .chat-container > .chat-room {
    width: 70%; /* 채팅방의 크기 */
  }
}

@media (max-width: 799px) {
  .chat-container {
    flex-direction: column;
  }
}

@media (max-width: 500px) {
  .chat-container {
    padding: 8px;
    gap: 8px;
  }
}
</style>
  
