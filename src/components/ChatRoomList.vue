<template>
    <div class="container" id="app">
        <div class="row">
            <div class="col-md-12">
                <h3>채팅방 리스트</h3>
            </div>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <label class="input-group-text">방제목</label>
            </div>
            <input type="text"  @keydown.enter="createRoom()" class="form-control" v-model="roomName" id="room_name">
            <div class="input-group-append">
                <button class="btn btn-primary" @click="createRoom()" type="button" id="create_room_button">채팅방 개설</button>
            </div>
        </div>
        <!-- 방 목록은 비동기로 서버에서 얻어 출력한다 -->
        <ul id="roomList">
			<li
			v-for="room in data.chatRooms"
			:key="room.roomId"
			class="list-group-item list-group-item-action"
			@click="enterRoom(room.roomId)"
			>
				{{ room.name }} ({{ room.userCount }})
			</li>
		</ul>
    </div>
</template>

<script setup>
import api from "@/api/api";
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
    const router = useRouter();
    const roomName = ref(null);
	let subscription = null;

    const data = reactive({
        chatRooms: []
    });

    const stompClient = new StompJs.Client({
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

    onMounted(() => {
        // STOMP 연결 활성화
        stompClient.activate();
        roomListOutput();
    });
    
    onUnmounted(() => {
        // STOMP 연결 해제
        if (stompClient.connected) {
            stompClient.deactivate();
        }
    });

    const roomListOutput = async () => {
        const response = await api.getRoomList();
        console.log(response);
        console.log(response.data);
        data.chatRooms.push(...response.data);  // 받아온 방 목록을 상태에 저장
    };

    const createRoom = async () =>{
        if("" === roomName.value) {
            alert("방 제목을 입력해 주십시요.");
            return;
        }
        await api.postChatRoom(roomName.value)
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
        const sender = prompt('대화명을 입력해 주세요.');
        if (sender == '' || typeof sender == 'undefined') {
        	alert("대화명은 필수 입력입니다");
        	return false;
        }
        //입장하는 사람의 이름과 채팅방이름을 지역저장소에 저장한다
        //이렇게 저장하면 다른 페이지에서 해당 키를 이용하여 값을 읽을 수 있다
        localStorage.setItem('chat.sender', sender);
        localStorage.setItem('chat.roomId', roomId);
        router.push({ path: '/chat/room/enter/'+roomId });
    }

    const subscribe = () => {
    const url = '/sub/alarm';
        subscription = stompClient.subscribe(url, message => {
            const recv = JSON.parse(message.body);
            recvMessage(recv);
        }, {});
    };

    const recvMessage = recv =>  {
        console.log(recv);
        recv.sender = recv.type == 'ENTER' ? '[알림]' : recv.sender;
        //서버에서 처리할 수 있게 개능 개선함
        if (recv.type == 'CHAT_INFO_UPDATE') {
            //채팅목록을 다시 로딩하여 출력한다
            roomListOutput();
        }
    }
</script>
