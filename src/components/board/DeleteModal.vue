<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <h2>삭제 여부 확인 ...</h2>
            <p>정말로 삭제 하시겠습니까? 삭제 내용은 복구 할수 없습니다.</p>
            <button @click="$emit('confirmDelete')" class="confirm-button">삭제</button>
            <button @click="$emit('cancelDelete')" class="cancel-button">취소</button>
        </div>
    </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
    isVisible: Boolean // 모달 표시 여부
});

const emit = defineEmits(['confirmDelete', 'cancelDelete']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.confirm-button {
  background-color: #d17a22;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}

.cancel-button {
  background-color: white;
  color: #333;
  border: 1px solid #333;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}
</style>