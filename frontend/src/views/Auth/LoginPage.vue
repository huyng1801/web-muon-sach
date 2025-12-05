<template>
  <div class="login-page">
    <Navbar />
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">
                <i class="bi bi-box-arrow-in-right"></i>
                Đăng Nhập
              </h3>

              <ul class="nav nav-tabs mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link active" 
                    id="staff-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#staff"
                    type="button"
                  >
                    Nhân viên
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    id="reader-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#reader"
                    type="button"
                  >
                    Độc giả
                  </button>
                </li>
              </ul>

              <div class="tab-content">
                <!-- Staff Login -->
                <div class="tab-pane fade show active" id="staff">
                  <form @submit.prevent="handleStaffLogin">
                    <div v-if="error" class="alert alert-danger">
                      {{ error }}
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Số điện thoại</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="staffForm.SoDienThoai"
                        required
                        placeholder="Nhập số điện thoại"
                      >
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Mật khẩu</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="staffForm.Password"
                        required
                        placeholder="Nhập mật khẩu"
                      >
                    </div>

                    <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      Đăng nhập
                    </button>
                  </form>
                </div>

                <!-- Reader Login -->
                <div class="tab-pane fade" id="reader">
                  <form @submit.prevent="handleReaderLogin">
                    <div v-if="error" class="alert alert-danger">
                      {{ error }}
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="readerForm.Email"
                        required
                        placeholder="Nhập email"
                      >
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Mật khẩu</label>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="readerForm.Password"
                        required
                        placeholder="Nhập mật khẩu"
                      >
                    </div>

                    <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      Đăng nhập
                    </button>
                  </form>
                </div>
              </div>

              <hr class="my-4">
              
              <p class="text-center mb-0">
                Chưa có tài khoản? 
                <router-link to="/register" class="text-decoration-none">
                  Đăng ký ngay
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading :show="loading" message="Đang đăng nhập..." />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Common/Navbar.vue'
import Loading from '@/components/Common/Loading.vue'

const router = useRouter()
const authStore = useAuthStore()

const staffForm = ref({
  SoDienThoai: '',
  Password: ''
})

const readerForm = ref({
  Email: '',
  Password: ''
})

const loading = ref(false)
const error = ref(null)

const handleStaffLogin = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Đang đăng nhập nhân viên...', staffForm.value)
    const result = await authStore.loginNhanVien(staffForm.value)
    console.log('Đăng nhập thành công:', result)
    router.push('/admin/dashboard')
  } catch (err) {
    console.error('Lỗi đăng nhập:', err)
    error.value = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
  } finally {
    loading.value = false
  }
}

const handleReaderLogin = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Đang đăng nhập độc giả...', readerForm.value)
    const result = await authStore.loginDocGia(readerForm.value)
    console.log('Đăng nhập thành công:', result)
    router.push('/reader/books')
  } catch (err) {
    console.error('Lỗi đăng nhập:', err)
    error.value = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border: none;
  border-radius: 15px;
}

.nav-tabs .nav-link {
  color: #6c757d;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
  font-weight: bold;
}
</style>
