<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-wrapper">
      <h2>작성 내용 확인</h2>
      <div class="modal-body">
        <slot></slot> <!-- 부모에서 전달받은 내용 -->
      </div>
      <div class="modal-buttons">
        <button @click="$emit('confirm')" class="confirm-button">등록</button>
        <button @click="$emit('cancel')" class="cancle-button">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['visible','selectedCategory']); // 모달 표시 여부 제어
</script>

<style scoped>
/* 모달 배경 (화면을 어둡게 덮음) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); /* 어두운 반투명 배경 */
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  z-index: 999; /* 화면 최상위로 */
}

/* 모달 창 */
.modal-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* 그림자를 추가하여 입체감 부여 */
  width: 90%;
  max-width: 500px; /* 최대 크기 설정 */
  padding: 20px;
  z-index: 1000; /* 배경보다 앞으로 */
  position: relative;
  text-align: center;
}

/* 닫기 버튼 (사용하지 않는 경우 제거 가능) */
.modal-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* 모달 제목 */
h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

/* 모달 본문 */
.modal-body {
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
  text-align: left; /* 내용 정렬 */
  line-height: 1.5; /* 가독성을 위해 줄 간격 추가 */
}

/* 버튼 그룹 */
.modal-buttons {
  display: flex;
  justify-content: center; /* 버튼 간격 설정 */
  gap: 20px;
}

.confirm-button,
.cancle-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

/* 확인 버튼 */
.confirm-button {
  background-color: #8b4513;
  color: white;
}

.confirm-button:hover {
  background-color: #693610; /* 호버 시 어두운 색상 */
}

/* 취소 버튼 */
.cancle-button {
  background-color: #868e96;
  color: white;
}

.cancle-button:hover {
  background-color: #495057; /* 호버 시 어두운 색상 */
}


</style>