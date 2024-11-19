<template>
  <div class="col-md-3">
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <h5 class="card-title mb-4 text-center text-primary">관리자 메뉴</h5>
        <nav class="nav flex-column">
          <router-link class="nav-link text-secondary mb-3 p-2 rounded" to="/admin/dashboard">
            대시보드
          </router-link>
          <router-link class="nav-link text-secondary mb-3 p-2 rounded" to="/admin/userManagement">
            유저 관리
          </router-link>
          <router-link class="nav-link text-secondary mb-3 p-2 rounded" to="/admin/dealManagement">
            가판대 관리
          </router-link>
          <router-link class="nav-link text-secondary mb-3 p-2 rounded" to="/admin/dataUpload">
            데이터 업로드
          </router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 300px; /* 카드 너비 제한 */
  margin: 0 auto; /* 카드 가운데 정렬 */
}

.nav-link {
  font-size: 1.1rem;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;
  white-space: nowrap; /* 텍스트가 자동으로 줄 바꿈되지 않게 */
}

.nav-link:hover {
  background-color: #3b82f6;
  color: white;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.mb-3 {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .card {
    max-width: 100%; /* 작은 화면에서는 카드가 전체 너비를 차지하도록 */
  }

  .nav-link {
    font-size: 1rem; /* 작은 화면에서는 글자 크기 줄이기 */
  }
}
</style>
