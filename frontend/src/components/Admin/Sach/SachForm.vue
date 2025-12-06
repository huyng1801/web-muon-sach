<template>
  <div class="sach-form">
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">ISBN <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formData.ISBN"
            required
            :disabled="isEdit"
          >
          <small class="text-muted">Mã định danh duy nhất của sách</small>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên sách <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formData.TenSach"
            required
          >
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 mb-3">
          <label class="form-label">Nguồn gốc / Tác giả</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formData.NguonGoc_TacGia"
            placeholder="Nhập nguồn gốc hoặc tên tác giả"
          >
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Nhà xuất bản <span class="text-danger">*</span></label>
          <select class="form-select" v-model="formData.MaNXB" required>
            <option value="">Chọn nhà xuất bản</option>
            <option 
              v-for="nxb in nhaxuatbans" 
              :key="nxb._id" 
              :value="nxb._id"
            >
              {{ nxb.TenNXB }}
            </option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Năm xuất bản</label>
          <input 
            type="number" 
            class="form-control" 
            v-model.number="formData.NamXuatBan"
            min="1900"
            :max="new Date().getFullYear()"
            placeholder="YYYY"
          >
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Số quyển <span class="text-danger">*</span></label>
          <input 
            type="number" 
            class="form-control" 
            v-model.number="formData.SoQuyen"
            required
            min="0"
          >
          <small class="text-muted">Số lượng sách hiện có</small>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Đơn giá (VNĐ)</label>
          <input 
            type="number" 
            class="form-control" 
            v-model.number="formData.DonGia"
            min="0"
            step="1000"
          >
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
  sach: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  nhaxuatbans: {
    type: Array,
    default: () => []
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
  ISBN: '',
  TenSach: '',
  NguonGoc_TacGia: '',
  MaNXB: '',
  NamXuatBan: new Date().getFullYear(),
  SoQuyen: 1,
  DonGia: 0
})

// Generate a random ISBN-like code (13 digits starting with 978)
const generateISBN = () => {
  const prefix = '978'
  const randomPart = Math.random().toString().slice(2, 10).padEnd(8, '0')
  const checkDigit = Math.floor(Math.random() * 10)
  return prefix + randomPart + checkDigit
}

// Watch for sach prop changes (when editing)
watch(() => props.sach, (newVal) => {
  if (newVal) {
    // Editing - use existing data
    formData.value = {
      ...newVal,
      MaNXB: newVal.MaNXB?._id || newVal.MaNXB
    }
  } else if (!props.isEdit) {
    // Adding new - generate ISBN
    formData.value = {
      ISBN: generateISBN(),
      TenSach: '',
      NguonGoc_TacGia: '',
      MaNXB: '',
      NamXuatBan: new Date().getFullYear(),
      SoQuyen: 1,
      DonGia: 0
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>
