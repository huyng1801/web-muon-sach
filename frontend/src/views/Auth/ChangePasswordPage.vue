<template>
  <div class="change-password-page">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow mt-4">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">
                <i class="bi bi-lock"></i>
                Đổi mật khẩu
              </h4>
            </div>
            <div class="card-body p-4">
              <form @submit.prevent="handleChangePassword">
                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>

                <div v-if="success" class="alert alert-success">
                  {{ success }}
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu hiện tại <span class="text-danger">*</span></label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="passwordForm.currentPassword"
                    required
                    placeholder="Nhập mật khẩu hiện tại..."
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu mới <span class="text-danger">*</span></label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="passwordForm.newPassword"
                    required
                    placeholder="Nhập mật khẩu mới..."
                    minlength="6"
                  >
                  <small class="text-muted">Tối thiểu 6 ký tự</small>
                </div>

                <div class="mb-3">
                  <label class="form-label">Xác nhận mật khẩu <span class="text-danger">*</span></label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="passwordForm.confirmPassword"
                    required
                    placeholder="Xác nhận mật khẩu mới..."
                    minlength="6"
                  >
                </div>

                <div class="alert alert-info" role="alert">
                  <i class="bi bi-info-circle"></i>
                  <strong>Lưu ý:</strong> Mật khẩu phải có ít nhất 6 ký tự và hai mật khẩu mới phải trùng nhau.
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-check-circle"></i>
                    Đổi mật khẩu
                  </button>
                  <button type="button" class="btn btn-secondary" @click="resetForm">
                    <i class="bi bi-x-circle"></i>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading :show="loading" message="Đang đổi mật khẩu..." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import { useAuthRole } from '@/middleware/auth'
import Loading from '@/components/Common/Loading.vue'

const authStore = useAuthStore()
const router = useRouter()

// Check quyền truy cập
const { checkAccess, fetchCurrentUser } = useAuthRole()

onMounted(async () => {
  const accessCheck = checkAccess()
  if (!accessCheck.hasAccess) {
    router.push(accessCheck.redirect)
    return
  }
  
  // Fetch user info mới nhất
  try {
    await fetchCurrentUser()
  } catch (error) {
    console.error('Error fetching current user:', error)
  }
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const resetForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  error.value = null
}

const handleChangePassword = async () => {
  // Validation
  error.value = null

  if (!passwordForm.value.currentPassword) {
    error.value = 'Vui lòng nhập mật khẩu hiện tại'
    return
  }
  
  if (!passwordForm.value.newPassword) {
    error.value = 'Vui lòng nhập mật khẩu mới'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    error.value = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  loading.value = true

  try {
    await authStore.changePassword({
      oldPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    success.value = 'Đổi mật khẩu thành công! Quay lại trong 3 giây...'
    setTimeout(() => {
      // Redirect về profile tương ứng với role
      if (authStore.isNhanVien) {
        router.push('/admin/profile')
      } else {
        router.push('/reader/profile')
      }
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.change-password-page {
  padding: 20px 0;
  min-height: 80vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.card {
  border: none;
  border-radius: 10px;
}

.card-header {
  border-radius: 10px 10px 0 0;
}

.alert {
  border-radius: 6px;
  border: none;
}

.btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
