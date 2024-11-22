<script setup>
defineProps({
  title: String,
  value: Number,
  icon: String,
  iconClass: String,
  change: String
});
</script>

<template>
  <div class="stat-card">
    <div class="stat-header">
      <i class="material-icons" :class="iconClass">{{ icon }}</i>
      <span :class="[
        'change-value',
        change.includes('+') ? 'text-emerald-500' : 'text-red-500'
      ]">
        {{ change }}
      </span>
    </div>
    <div class="stat-content">
      <h3 class="stat-title">{{ title }}</h3>
      <p class="stat-value">{{ value }}</p>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.material-icons {
  padding: 8px;
  border-radius: 8px;
  background-color: rgb(243 244 246);
  font-size: 24px;
}

.text-blue-500 {
  color: #3B82F6;
}

.text-red-500 {
  color: #EF4444;
}

.text-green-500, .text-emerald-500 {
  color: #10B981;
}

.text-yellow-500 {
  color: #F59E0B;
}

.change-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-title {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}
</style>