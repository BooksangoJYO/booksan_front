<template>
   <div class="container" id="app">
        <div>
            <h2 id="room-info">
            	<span id="name">{{ data.chatRoom.name }}</span>
                <span id="userCount">{{ data.chatRoom.userCount }}</span>
                <span id="sender">{{ data.chatRoom.sender }}</span>
            </h2>
                <button class="btn btn-primary" type="button" id="char_room_list_button" @click="goToRoomList()">목록</button>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <label class="input-group-text">내용</label>
            </div>
            <input type="text" class="form-control" v-model="inputMessage" id="message" @keydown.enter="sendMessage()" >
            <div class="input-group-append">
                <button class="btn btn-primary" type="button" id="send_message_button" @click="sendMessage()">보내기</button>
            </div>
        </div>
        <ul class="list-group" id="message_list" v-for="(message,index) in data.messages" :key="index">
            <li class="list-group-item"> {{message.sender}} : {{message.message}} </li>
        </ul>
    </div>
</template>

<script setup>
import api from "@/api/api";
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

    const inputMessage = ref('');
    const router = useRouter();
    const roomId = localStorage.getItem('chat.roomId');
    const sender = localStorage.getItem('chat.sender');
    let subscription = null;

    const ws = new StompJs.Client({
        webSocketFactory: () => {
            return new SockJS('/ws-stomp');
        },
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => {
            console.log('Connected: ' + frame);
            subscribe();
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });



    const data = reactive({
        chatRoom:{
            name : '',
            userCount : '',
            sender : sender,

        },
        messages :[
        ]
    });
		  
    // pub/sub 이벤트 설정 
    const goToRoomList = () => {
      router.push({ path: '/chat/roomList' });
    };

    onMounted(() => {
        unsubscribe();
        // STOMP 연결 활성화
        ws.activate();
        getRoomInfo();
    });
    
    onUnmounted(() => {
        // STOMP 연결 해제
        if (ws.connected) {
            ws.deactivate();
        }
    });


    const subscribe = () => {
        const url = '/sub/chat/room/'+roomId;
        subscription = ws.subscribe(url, message => {
            const recv = JSON.parse(message.body);
            recvMessage(recv);
        }, {sender:sender});
    };

    const unsubscribe = () => {
        console.log("subscription", subscription);
        
        if(subscription != null) {
            subscription.unsubscribe();
            subscription = null;
        }
    }

    const getRoomInfo = async () => {
        const response = await api.getRoomInfo(roomId);
        data.chatRoom.name = response.data.name;
        data.chatRoom.sender=response.data.sender;
        data.chatRoom.userCount=response.data.userCount;
    }

      //채팅방에 입장한 사용자수  
    const displayEnterUserCount = userCount => {
        data.chatRoom.userCount=userCount;
    }

    const sendMessage = () => {
        if (subscription == null || !ws.connected) {
            console.log('연결 상태 확인:', {
                subscription: subscription ? '존재' : '없음',
                connected: ws.connected
            });
            return;
        }
        
        try {
            ws.publish({
                destination: '/pub/chat/message',
                body: JSON.stringify({ 
                    type: 'TALK', 
                    roomId: roomId, 
                    sender: sender, 
                    message: inputMessage.value 
                })
            });
            
            // 메시지 전송 후 입력창 초기화
            inputMessage.value = '';
            
        } catch (error) {
            console.error('메시지 전송 중 오류:', error);
        }
    };
         
    const recvMessage = recv =>  {
    console.log(recv);
    if (recv.type == 'ENTER' || recv.type == 'LEAVE') {
        displayEnterUserCount(recv.userCount);
    }
        data.messages.push({ sender: recv.sender, message: recv.message });
    }
</script>

