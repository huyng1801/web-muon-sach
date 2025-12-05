<template>
  <div class="error-page">
    <Navbar />
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-6 text-center">
          <h1 class="display-1 text-danger">404</h1>
          <h2 class="mb-4">Trang không tồn tại</h2>
          <p class="lead mb-4">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <router-link to="/" class="btn btn-primary">
            <i class="bi bi-house"></i>
            Về trang chủ
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Common/Navbar.vue'
</script>

<style scoped>
.error-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
}

.display-1 {
  font-size: 8rem;
  font-weight: bold;
}
</style>
