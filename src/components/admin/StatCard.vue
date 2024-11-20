<script setup>
defineProps({
  title: String,
  value: Number,
  icon: String,
  change: String
})
</script>

<template>
  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-icon">
        <i class="material-icons">{{ icon }}</i>
      </div>
      <span class="stat-change">{{ change }}</span>
    </div>
    <h3 class="stat-title">{{ title }}</h3>
    <p class="stat-value">{{ value.toLocaleString() }}</p>
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

.stat-icon {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #e0e7ff;
}

.stat-change {
  color: #10b981;
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

.material-icons {
  font-size: 24px;
}
</style>