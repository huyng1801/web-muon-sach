<template>
  <div class="nhan-vien-form">
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">MSNV <span class="text-danger">*</span></label>
        <input 
          type="text" 
          class="form-control" 
          v-model="formData.MSNV"
          required
          :disabled="isEdit"
          placeholder="VD: NV001"
        >
        <small class="text-muted">Mã số nhân viên duy nhất</small>
      </div>

      <div class="mb-3">
        <label class="form-label">Họ tên <span class="text-danger">*</span></label>
        <input 
          type="text" 
          class="form-control" 
          v-model="formData.HoTenNV"
          required
          placeholder="VD: Nguyễn Văn A"
        >
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Chức vụ <span class="text-danger">*</span></label>
          <select class="form-select" v-model="formData.ChucVu" required>
            <option value="">Chọn chức vụ</option>
            <option value="Quản lý">Quản lý</option>
            <option value="Thủ thư">Thủ thư</option>
            <option value="Nhân viên">Nhân viên</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Số điện thoại</label>
          <input 
            type="tel" 
            class="form-control" 
            v-model="formData.SoDienThoai"
            placeholder="VD: 0123456789"
            pattern="[0-9]{10,11}"
          >
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input 
          type="email" 
          class="form-control" 
          v-model="formData.Email"
          placeholder="VD: nhanvien@library.com"
        >
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <textarea 
          class="form-control" 
          v-model="formData.DiaChi"
          rows="2"
          placeholder="Nhập địa chỉ..."
        ></textarea>
      </div>

      <div class="mb-3">
        <div class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            v-model="formData.isActive"
            id="isActive"
          >
          <label class="form-check-label" for="isActive">
            Đang hoạt động
          </label>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          <i class="bi bi-x-circle"></i>
          Hủy
        </button>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
          <i class="bi bi-save"></i>
          {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  nhanvien: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  submitting: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  MSNV: '',
  HoTenNV: '',
  ChucVu: '',
  SoDienThoai: '',
  Email: '',
  DiaChi: '',
  isActive: true
})

// Watch for nhanvien prop changes (when editing)
watch(() => props.nhanvien, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>
