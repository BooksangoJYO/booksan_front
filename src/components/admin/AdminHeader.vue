<script setup>
import { useMainStore } from '@/store/mainStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useMainStore();
const { doLogout } = store;

const handleLogout = () => {
    doLogout();
};

const handleSiteOut = () => {
    router.replace('/');
};
</script>

<template>
  <header class="admin-header">
    <h1>관리자 페이지</h1>
    <div class="button-group">
      <button @click="handleLogout" class="header-btn">
        <span>로그아웃</span>
      </button>
      <button @click="handleSiteOut" class="header-btn">
        <span>나가기</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 2rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.admin-header h1 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.button-group {
  display: flex;
  gap: 0.75rem;
}

.header-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  color: #4b5563;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.header-btn:hover {
  background-color: #e5e7eb;
}
</style>