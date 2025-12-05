<template>
  <div class="profile-page">
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
                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>

                <div v-if="success" class="alert alert-success">
                  {{ success }}
                </div>

                <!-- Nhân viên fields -->
                <template v-if="authStore.isNhanVien">
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

                  <div class="mb-3">
                    <label class="form-label">Chức vụ</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      :value="form.ChucVu"
                      disabled
                    >
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      v-model="form.SoDienThoai"
                      required
                    >
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Địa chỉ</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.DiaChi"
                    >
                  </div>
                </template>

                <!-- Độc giả fields -->
                <template v-if="authStore.isDocGia">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Họ tên đệm</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="form.HoTenDem"
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
                    Lưu thay đổi
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import Loading from '@/components/Common/Loading.vue'

const authStore = useAuthStore()

const form = ref({})
const loading = ref(false)
const error = ref(null)
const success = ref(null)

onMounted(() => {
  resetForm()
})

const resetForm = () => {
  form.value = { ...authStore.user }
  // Format date for input
  if (form.value.NgaySinh) {
    form.value.NgaySinh = new Date(form.value.NgaySinh).toISOString().split('T')[0]
  }
}

const handleUpdate = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    await authStore.updateProfile(form.value)
    success.value = 'Cập nhật thông tin thành công!'
  } catch (err) {
    error.value = err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.'
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
