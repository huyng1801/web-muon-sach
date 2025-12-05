<template>
  <div class="register-page">
    <Navbar />
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100 py-5">
        <div class="col-md-7">
          <div class="card shadow">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">
                <i class="bi bi-person-plus"></i>
                Đăng Ký Độc Giả
              </h3>

              <form @submit.prevent="handleRegister">
                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>

                <div v-if="success" class="alert alert-success">
                  {{ success }}
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ và tên đệm <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.HoTenDem"
                      required
                    >
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Tên <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.Ten"
                      required
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Ngày sinh</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      v-model="form.NgaySinh"
                    >
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Giới tính</label>
                    <select class="form-select" v-model="form.Phai">
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.DiaChi"
                  >
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      v-model="form.DienThoai"
                      required
                      pattern="[0-9]{10}"
                      title="Số điện thoại phải có 10 chữ số"
                    >
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      v-model="form.Email"
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu <span class="text-danger">*</span></label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="form.Password"
                    required
                    minlength="6"
                  >
                  <small class="text-muted">Mật khẩu phải có ít nhất 6 ký tự</small>
                </div>

                <div class="mb-3">
                  <label class="form-label">Xác nhận mật khẩu <span class="text-danger">*</span></label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="confirmPassword"
                    required
                  >
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Đăng ký
                </button>
              </form>

              <hr class="my-4">
              
              <p class="text-center mb-0">
                Đã có tài khoản? 
                <router-link to="/login" class="text-decoration-none">
                  Đăng nhập ngay
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading :show="loading" message="Đang xử lý đăng ký..." />
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

const form = ref({
  HoTenDem: '',
  Ten: '',
  NgaySinh: '',
  Phai: '',
  DiaChi: '',
  DienThoai: '',
  Email: '',
  Password: ''
})

const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const handleRegister = async () => {
  error.value = null
  success.value = null

  // Validate password confirmation
  if (form.value.Password !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  loading.value = true

  try {
    await authStore.registerDocGia(form.value)
    success.value = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border: none;
  border-radius: 15px;
}

.form-label {
  font-weight: 500;
}
</style>
