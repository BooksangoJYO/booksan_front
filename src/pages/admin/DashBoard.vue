<script setup>
import api from '@/api/api';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import ChartCard from '@/components/admin/ChartCard.vue';
import StatCard from '@/components/admin/StatCard.vue';
import { computed, onMounted, ref } from 'vue';

const currentPage = ref('대시보드');
const weekDates = ref([]);

const stats = ref({
  users: [],
  trades: [],
  chats: [],
  signups: []
});

const getWeeklyStats = async () => {
  try {
    const response = await api.getWeeklyStats();
    const data = await response.data.weeklyData;
    const sortedData = [...data].reverse();

    weekDates.value = sortedData.map(item => item.date);
    stats.value = {
      users: sortedData.map(item => item.users),
      trades: sortedData.map(item => item.deals),
      chats: sortedData.map(item => item.chats),
      signups: sortedData.map(item => item.signups)
    };
  } catch (error) {
    console.error('통계 데이터 가져오기 실패:', error)
  }
};

const calculateDailyGrowth = (today, yesterday) => {
  if (yesterday === 0) return today > 0 ? '+100%' : '0%';
  const growthRate = ((today - yesterday) / yesterday) * 100;
  return growthRate > 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`;
};

const statsData = computed(() => {
  const lastIndex = stats.value.users.length - 1;
  const secondLastIndex = lastIndex - 1;
  
  return [
    {
      title: '이용자 수',
      value: stats.value.users[lastIndex] || 0,
      icon: 'group',
      iconClass: 'text-blue-500',
      change: calculateDailyGrowth(stats.value.users[lastIndex] || 0, stats.value.users[secondLastIndex] || 0)
    },
    {
      title: '거래 수',
      value: stats.value.trades[lastIndex] || 0,
      icon: 'shopping_cart',
      iconClass: 'text-red-500',
      change: calculateDailyGrowth(stats.value.trades[lastIndex] || 0, stats.value.trades[secondLastIndex] || 0)
    },
    {
      title: '채팅방',
      value: stats.value.chats[lastIndex] || 0,
      icon: 'chat',
      iconClass: 'text-green-500',
      change: calculateDailyGrowth(stats.value.chats[lastIndex] || 0, stats.value.chats[secondLastIndex] || 0)
    },
    {
      title: '신규 가입',
      value: stats.value.signups[lastIndex] || 0,
      icon: 'person_add',
      iconClass: 'text-yellow-500',
      change: calculateDailyGrowth(stats.value.signups[lastIndex] || 0, stats.value.signups[secondLastIndex] || 0)
    }
  ];
});

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
  { name: '대시보드', path: '/dashboard' }
];

onMounted(async () => {
  await getWeeklyStats();
});
</script>

<template>
  <AdminHeader/>
  <div class="dashboard">
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

    <div class="main-content">
      <header class="dashboard-header">
        <h1 class="dashboard-title">대시보드 현황</h1>
        <p class="dashboard-subtitle">오늘의 서비스 현황입니다.</p>
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
  background-color: #f3f4f6;
  padding: 0 2rem;
  height: auto; /* 100%에서 변경 */
}

.sidebar {
  width: 200px;
  background: white;
  padding: 2rem 0;
  height: auto;
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
  height: auto;
  background-color: #f3f4f6; /* 추가 */
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
  padding-bottom: 2rem; /* 추가 */
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