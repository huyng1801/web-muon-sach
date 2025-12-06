<template>
  <div class="profile-page">
    <Toast ref="toastRef" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow mt-4">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">
                <i class="bi bi-person-circle"></i>
                Thông tin cá nhân
              </h4>
            </div>
            <div class="card-body p-4">
              <form @submit.prevent="handleUpdate">

                <!-- Nhân viên fields -->
                <template v-if="authStore.isNhanVien">
                  <div class="mb-3">
                    <label class="form-label">Họ tên <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.HoTenNV"
                      required
                      placeholder="Nhập họ tên..."
                    >
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Chức vụ</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        :value="form.Chucvu"
                        disabled
                        placeholder="Chức vụ"
                      >
                      <small class="text-muted">Chức vụ không thể thay đổi, liên hệ Admin để thay đổi</small>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Số điện thoại</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        v-model="form.SoDienThoai"
                        placeholder="Nhập số điện thoại..."
                        pattern="[0-9]{10,11}"
                      >
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Địa chỉ</label>
                    <textarea 
                      class="form-control" 
                      v-model="form.DiaChi"
                      rows="2"
                      placeholder="Nhập địa chỉ..."
                    ></textarea>
                  </div>
                </template>

                <!-- Độc giả fields -->
                <template v-if="authStore.isDocGia">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Họ lót</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="form.HoLot"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Tên</label>
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
                      <label class="form-label">Điện thoại</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        v-model="form.DienThoai"
                        required
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
                </template>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-save"></i>
                    {{ authStore.isNhanVien ? 'Lưu thay đổi' : 'Cập nhật thông tin' }}
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
    <Loading :show="loading" message="Đang cập nhật..." />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { useAuthRole } from '@/middleware/auth'
import Loading from '@/components/Common/Loading.vue'
import Toast from '@/components/Common/Toast.vue'

const router = useRouter()
const authStore = useAuthStore()

// Check quyền truy cập
const { checkAccess } = useAuthRole()
const accessCheck = checkAccess()
if (!accessCheck.hasAccess) {
  router.push(accessCheck.redirect)
}

const form = ref({})
const loading = ref(false)
const toastRef = ref(null)

onMounted(async () => {
  console.log('ProfilePage mounted. Auth status:', {
    isAuthenticated: authStore.isAuthenticated,
    isNhanVien: authStore.isNhanVien,
    isDocGia: authStore.isDocGia,
    user: authStore.user
  })
  
  // Không cần load profile manual nữa, authStore sẽ auto-refresh
  // Chỉ cần reset form với data hiện tại
  resetForm()
  
  // Fetch user mới nhất 1 lần khi vào trang
  try {
    await authStore.fetchCurrentUser()
  } catch (error) {
    console.error('Error fetching current user:', error)
  }
})

// Watch user data changes để update form
watch(
  () => authStore.user,
  () => {
    resetForm()
  },
  { deep: true }
)

const resetForm = () => {
  if (authStore.isNhanVien && authStore.user) {
    form.value = {
      HoTenNV: authStore.user.HoTenNV || '',
      Chucvu: authStore.user.Chucvu || '',
      SoDienThoai: authStore.user.SoDienThoai || '',
      DiaChi: authStore.user.DiaChi || ''
    }
  } else if (authStore.isDocGia && authStore.user) {
    form.value = {
      HoLot: authStore.user.HoLot || '',
      Ten: authStore.user.Ten || '',
      NgaySinh: authStore.user.NgaySinh ? 
        new Date(authStore.user.NgaySinh).toISOString().split('T')[0] : '',
      Phai: authStore.user.Phai || 'Nam',
      DiaChi: authStore.user.DiaChi || '',
      DienThoai: authStore.user.DienThoai || '',
      Email: authStore.user.Email || ''
    }
  }
}

const handleUpdate = async () => {
  loading.value = true

  try {
    await authStore.updateProfile(form.value)
    toastRef.value?.showToast('Cập nhật thông tin thành công!', 'success')
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.'
    toastRef.value?.showToast(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-page {
  padding: 20px 0;
}
</style>
