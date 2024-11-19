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
import { onMounted } from 'vue';

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

onMounted(() => {
  const ctx = document.getElementById(props.chartId).getContext('2d');
  new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: props.data.map(d => d.date),
      datasets: [{
        label: props.title,
        data: props.data.map(d => d.value),
        borderColor: props.color,
        tension: 0.1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
})
</script>

<template>
  <div class="chart-card">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="chart-container">
      <canvas :id="chartId"></canvas>
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.chart-container {
  height: 16rem;
  position: relative;
}
</style>