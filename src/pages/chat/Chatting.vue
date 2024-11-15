<template>
  <div class="chat-container">
    <ChatRoomList v-show="isWideScreen" @enterChatRoom="enterChatRoom" ref="chatRoomRef"/>
    <ChatRoom :data="chatRoomData" @sendMessage="sendMessage"/>
  </div>
</template>

<script setup>

import api from '@/api/api';
import ChatRoom from '@/components/chat/ChatRoom.vue';
import ChatRoomList from '@/components/chat/ChatRoomList.vue';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const email = sessionStorage.getItem('userEmail');
const router = useRouter();
let subscriptionAlarm = null;
let subscriptionChatRoom = null;

const chatRoomRef = ref(null);
const isWideScreen = ref(window.innerWidth >= 800);

const chatRoomData = reactive({
    roomId: '',
    chatRoom:{
        name : '',
        userCount : '',
        sender : email,

    },
    messages :[
    ]
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const stompClient = new StompJs.Client({
  webSocketFactory: () => {
    return new SockJS('/ws-stomp');
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
    window.alert('웹소켓 연결이 종료되었습니다.');
    router.replace('/').then(() => {
      window.location.reload();  // 페이지 새로 고침
    }).catch((error) => {
      console.error('라우터 이동 오류:', error);
    });
  },
});

const subscribeAlarm = () => {
  const url = '/sub/alarm';
  subscriptionAlarm = stompClient.subscribe(url, message => {
    const recv = JSON.parse(message.body);
    recvMessage(recv);
  }, {});
}

const subscribeChatRoom = () => {
  if(chatRoomData.roomId){
    const url = '/sub/chat/room/'+chatRoomData.roomId;
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
              sender : email
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
    chatRoomData.chatRoom.sender=response.data.sender;
    chatRoomData.chatRoom.userCount=response.data.userCount;
}

const displayEnterUserCount = userCount => {
    chatRoomData.chatRoom.userCount=userCount;
}

onMounted(() => {
  stompClient.activate();
  chatRoomData.roomId='';
  sessionStorage.getItem('chat.roomId');
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

const enterChatRoom = () => {
  unsubscribeChatRoom();
  chatRoomData.roomId = '';
  chatRoomData.messages = [];
  chatRoomData.roomId = sessionStorage.getItem('chat.roomId'),
  getRoomInfo();
  subscribeChatRoom();
  getPrevMessage();
}

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: #f4f4f4;
}

#app {
  width: 100%;
  height: 100%;
  min-width: 300px; /* 최소 너비 설정 */
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
  