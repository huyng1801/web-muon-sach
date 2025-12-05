<template>
  <div class="nxb-form">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-building"></i>
          {{ isEdit ? 'Cập nhật nhà xuất bản' : 'Thêm nhà xuất bản' }}
        </h5>
      </div>
      <div class="card-body">
        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Tên nhà xuất bản <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formData.TenNXB"
              required
              placeholder="VD: Nhà xuất bản Kim Đồng"
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
            <textarea 
              class="form-control"
              v-model="formData.DiaChi" 
              rows="3"
              required
              placeholder="VD: 55 Quang Trung, Hai Bà Trưng, Hà Nội"
            ></textarea>
          </div>

          <div class="text-end">
            <button 
              type="button" 
              class="btn btn-secondary me-2" 
              @click="$emit('cancel')"
            >
              <i class="bi bi-x-circle"></i>
              Hủy
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="submitting"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-circle"></i>
              {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  nxb: {
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
  TenNXB: '',
  DiaChi: ''
})

watch(() => props.nxb, (newNxb) => {
  if (newNxb) {
    formData.value = {
      TenNXB: newNxb.TenNXB || '',
      DiaChi: newNxb.DiaChi || ''
    }
  } else {
    formData.value = {
      TenNXB: '',
      DiaChi: ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>

<style scoped>
.nxb-form .card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-group .btn {
  margin-right: 8px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}
</style>