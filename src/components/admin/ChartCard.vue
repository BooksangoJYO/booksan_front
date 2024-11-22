<script setup>
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { onBeforeUnmount, onMounted, watch } from 'vue';

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  title: String,
  chartId: String,
  data: Array,
  color: String
});

let chart = null;

const createChart = () => {
  if (chart) {
    chart.destroy();  // 기존 차트가 있다면 제거
  }

  const ctx = document.getElementById(props.chartId).getContext('2d');
  chart = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: props.data.map(d => d.date),
      datasets: [{
        label: props.title,
        data: props.data.map(d => d.value),
        borderColor: props.color,
        backgroundColor: props.color,
        tension: 0.1,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#000',
          bodyColor: '#000',
          borderColor: '#ddd',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f0f0f0'
          },
          ticks: {
            color: '#666'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#666'
          }
        }
      }
    }
  });
};

// props.data가 변경될 때마다 차트 다시 생성
watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    createChart();
  }
}, { deep: true });

onMounted(() => {
  if (props.data && props.data.length > 0) {
    createChart();
  }
});

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();  // 컴포넌트 제거 시 차트도 제거
  }
});
</script>

<template>
  <div class="chart-card bg-white rounded-lg shadow-sm p-4">
    <h3 class="chart-title text-lg font-medium mb-4">{{ title }}</h3>
    <div class="chart-container h-[300px]">
      <canvas :id="chartId"></canvas>
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.chart-title {
  color: #1a1a1a;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>