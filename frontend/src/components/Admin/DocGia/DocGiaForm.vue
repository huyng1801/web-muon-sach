<template>
  <div class="docgia-form">
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Họ và tên đệm <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formData.HoTenDem"
            required
          >
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formData.Ten"
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
            v-model="formData.NgaySinh"
          >
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Giới tính</label>
          <select class="form-select" v-model="formData.Phai">
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
          v-model="formData.DiaChi"
        >
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
          <input 
            type="tel" 
            class="form-control" 
            v-model="formData.DienThoai"
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
            v-model="formData.Email"
          >
        </div>
      </div>

      <div class="mb-3" v-if="!isEdit">
        <label class="form-label">Mật khẩu <span class="text-danger">*</span></label>
        <input 
          type="password" 
          class="form-control" 
          v-model="formData.Password"
          :required="!isEdit"
          minlength="6"
        >
        <small class="text-muted">Mật khẩu phải có ít nhất 6 ký tự</small>
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
  docgia: {
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
  HoTenDem: '',
  Ten: '',
  NgaySinh: '',
  Phai: '',
  DiaChi: '',
  DienThoai: '',
  Email: '',
  Password: ''
})

// Watch for docgia prop changes (when editing)
watch(() => props.docgia, (newVal) => {
  if (newVal) {
    formData.value = {
      ...newVal,
      NgaySinh: newVal.NgaySinh ? new Date(newVal.NgaySinh).toISOString().split('T')[0] : '',
      Password: '' // Don't populate password when editing
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>
