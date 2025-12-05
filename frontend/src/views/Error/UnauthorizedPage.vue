<template>
  <div class="error-page">
    <Navbar />
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-6 text-center">
          <h1 class="display-1 text-warning">401</h1>
          <h2 class="mb-4">Không có quyền truy cập</h2>
          <p class="lead mb-4">
            Xin lỗi, bạn không có quyền truy cập vào trang này.
          </p>
          <button @click="goBack" class="btn btn-primary me-2">
            <i class="bi bi-arrow-left"></i>
            Quay lại
          </button>
          <router-link to="/" class="btn btn-secondary">
            <i class="bi bi-house"></i>
            Về trang chủ
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Navbar from '@/components/Common/Navbar.vue'

const router = useRouter()

const goBack = () => {
  router.back()
}
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
