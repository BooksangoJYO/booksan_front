<script setup>
import AdminHeader from '@/components/admin/AdminHeader.vue';
import ChartCard from '@/components/admin/ChartCard.vue';
import StatCard from '@/components/admin/StatCard.vue';
import { computed, ref } from 'vue';
const currentPage = ref('대시보드');

const weekDates = ref(['11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18']);
const stats = ref({
  users: [120, 145, 135, 150, 170, 160, 180],
  trades: [85, 90, 100, 110, 120, 115, 125],
  chats: [200, 220, 240, 230, 250, 260, 280],
  signups: [50, 55, 60, 65, 70, 75, 80]
});

const statsData = computed(() => [
  {
    title: '총 이용자',
    value: stats.value.users[stats.value.users.length - 1],
    icon: 'group',
    change: '+12%'
  },
  {
    title: '거래 수',
    value: stats.value.trades[stats.value.trades.length - 1],
    icon: 'shopping_cart',
    change: '+8%'
  },
  {
    title: '채팅방',
    value: stats.value.chats[stats.value.chats.length - 1],
    icon: 'chat',
    change: '+15%'
  },
  {
    title: '신규 가입',
    value: stats.value.signups[stats.value.signups.length - 1],
    icon: 'person_add',
    change: '+5%'
  }
]);

const chartData = computed(() => [
  {
    title: '일일 이용자 수',
    chartId: 'userChart',
    data: weekDates.value.map((date, i) => ({
      date,
      value: stats.value.users[i]
    })),
    color: '#3B82F6'
  },
  {
    title: '일일 거래 수',
    chartId: 'tradeChart',
    data: weekDates.value.map((date, i) => ({
      date,
      value: stats.value.trades[i]
    })),
    color: '#EF4444'
  },
  {
    title: '일일 채팅방 수',
    chartId: 'chatChart',
    data: weekDates.value.map((date, i) => ({
      date,
      value: stats.value.chats[i]
    })),
    color: '#10B981'
  },
  {
    title: '일일 가입자 수',
    chartId: 'signupChart',
    data: weekDates.value.map((date, i) => ({
      date,
      value: stats.value.signups[i]
    })),
    color: '#F59E0B'
  }
]);

const menuItems = [
  { name: '대시보드', path: '/dashboard' },
  { name: '유저 관리', path: '/users' },
  { name: '가판대 관리', path: '/stores' },
  { name: '데이터 업로드', path: '/upload' }
];
</script>

<template>
  <AdminHeader/>
  <div class="dashboard">
    <!-- 사이드바 -->
    <div class="sidebar">
      <h2 class="menu-title">관리자 메뉴</h2>
      <nav class="menu-list">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          :class="{ active: currentPage === item.name }"
          @click="currentPage = item.name"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <header class="dashboard-header">
        <h1 class="dashboard-title">대시보드 현황</h1>
        <p class="dashboard-subtitle">지난 7일간의 서비스 현황입니다.</p>
      </header>

      <div class="stats-grid">
        <StatCard
          v-for="stat in statsData"
          :key="stat.title"
          v-bind="stat"
        />
      </div>

      <div class="charts-grid">
        <ChartCard
          v-for="chart in chartData"
          :key="chart.title"
          v-bind="chart"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 0 2rem;
}

.sidebar {
  width: 200px;
  background: white;
  padding: 2rem 0;
  height: 100vh;
  border-right: 1px solid #e5e7eb;
}

.menu-title {
  color: #2563eb;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0 1.25rem;
  margin-bottom: 1.5rem;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 0.625rem 1.25rem;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.925rem;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #2563eb;
}

.menu-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.main-content {
  flex: 1;
  padding: 2rem 1.5rem;
  margin-left: 1rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #111827;
}

.dashboard-subtitle {
  color: #6b7280;
  margin-top: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>