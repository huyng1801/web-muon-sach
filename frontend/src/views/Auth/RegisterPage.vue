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
                    <label class="form-label">Họ lót <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.HoLot"
                      required
                      placeholder="Ví dụ: Nguyễn Văn"
                    >
                    <small class="text-danger" v-if="errors.HoLot">{{ errors.HoLot }}</small>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Tên <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.Ten"
                      required
                      placeholder="Ví dụ: A"
                    >
                    <small class="text-danger" v-if="errors.Ten">{{ errors.Ten }}</small>
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
                  <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.DiaChi"
                    required
                    placeholder="Ví dụ: 123 Đường ABC, TP.HCM"
                  >
                  <small class="text-danger" v-if="errors.DiaChi">{{ errors.DiaChi }}</small>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email <span class="text-danger">*</span></label>
                    <input 
                      type="email" 
                      class="form-control" 
                      v-model="form.Email"
                      required
                      placeholder="Ví dụ: user@example.com"
                    >
                    <small class="text-danger" v-if="errors.Email">{{ errors.Email }}</small>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      v-model="form.DienThoai"
                      required
                      pattern="[0-9]{10,11}"
                      title="Số điện thoại phải có 10-11 chữ số"
                      placeholder="0123456789"
                    >
                    <small class="text-danger" v-if="errors.DienThoai">{{ errors.DienThoai }}</small>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Mật khẩu <span class="text-danger">*</span></label>
                    <input 
                      type="password" 
                      class="form-control" 
                      v-model="form.Password"
                      required
                      minlength="6"
                      placeholder="Ít nhất 6 ký tự"
                    >
                    <small class="text-danger" v-if="errors.Password">{{ errors.Password }}</small>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Xác nhận mật khẩu <span class="text-danger">*</span></label>
                    <input 
                      type="password" 
                      class="form-control" 
                      v-model="confirmPassword"
                      required
                      placeholder="Nhập lại mật khẩu"
                    >
                    <small class="text-danger" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</small>
                  </div>
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
  HoLot: '',
  Ten: '',
  Email: '',
  Password: '',
  DienThoai: '',
  DiaChi: '',
  NgaySinh: '',
  Phai: ''
})

const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const errors = ref({
  HoLot: '',
  Ten: '',
  Email: '',
  DienThoai: '',
  DiaChi: '',
  Password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  error.value = null
  success.value = null

  // Reset field errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = ''
  })

  // Validate required fields
  if (!form.value.HoLot || !form.value.HoLot.trim()) {
    errors.value.HoLot = 'Vui lòng nhập họ lót'
    error.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    return
  }

  if (!form.value.Ten || !form.value.Ten.trim()) {
    errors.value.Ten = 'Vui lòng nhập tên'
    error.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    return
  }

  if (!form.value.Email || !form.value.Email.trim()) {
    errors.value.Email = 'Vui lòng nhập email'
    error.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.Email)) {
    errors.value.Email = 'Email không hợp lệ'
    error.value = 'Email không hợp lệ'
    return
  }

  if (!form.value.DienThoai || !form.value.DienThoai.trim()) {
    errors.value.DienThoai = 'Vui lòng nhập số điện thoại'
    error.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    return
  }

  // Validate phone format
  if (!/^[0-9]{10,11}$/.test(form.value.DienThoai)) {
    errors.value.DienThoai = 'Số điện thoại phải có 10-11 chữ số'
    error.value = 'Số điện thoại không hợp lệ'
    return
  }

  if (!form.value.DiaChi || !form.value.DiaChi.trim()) {
    errors.value.DiaChi = 'Vui lòng nhập địa chỉ'
    error.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    return
  }

  if (!form.value.Password || !form.value.Password.trim()) {
    errors.value.Password = 'Vui lòng nhập mật khẩu'
    error.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    return
  }

  if (form.value.Password.length < 6) {
    errors.value.Password = 'Mật khẩu phải có ít nhất 6 ký tự'
    error.value = 'Mật khẩu không đủ mạnh'
    return
  }

  if (form.value.Password !== confirmPassword.value) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
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
