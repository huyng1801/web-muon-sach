<template>
  <div class="nhan-vien-form">
    <form @submit.prevent="handleSubmit">
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
          <select class="form-select" v-model="formData.Chucvu" required>
            <option value="">Chọn chức vụ</option>
            <option value="Admin">Admin</option>
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
        <label class="form-label">Địa chỉ</label>
        <textarea 
          class="form-control" 
          v-model="formData.DiaChi"
          rows="2"
          placeholder="Nhập địa chỉ..."
        ></textarea>
      </div>

      <div class="mb-3" v-if="!isEdit">
        <label class="form-label">Mật khẩu <span class="text-danger">*</span></label>
        <input 
          type="password" 
          class="form-control" 
          v-model="formData.Password"
          required
          placeholder="Nhập mật khẩu ít nhất 6 ký tự"
          minlength="6"
        >
      </div>

      <div class="mb-3" v-if="isEdit">
        <label class="form-label">Mật khẩu mới (để trống nếu không đổi)</label>
        <input 
          type="password" 
          class="form-control" 
          v-model="formData.Password"
          placeholder="Nhập mật khẩu ít nhất 6 ký tự"
          minlength="6"
        >
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
  HoTenNV: '',
  Chucvu: '',
  SoDienThoai: '',
  DiaChi: '',
  Password: ''
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
