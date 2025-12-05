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
        <div class="col-md-6 mb-3">
          <label class="form-label">Tác giả</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formData.TacGia"
            placeholder="Nhập tên tác giả"
          >
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Thể loại</label>
          <select class="form-select" v-model="formData.TheLoai">
            <option value="">Chọn thể loại</option>
            <option value="Văn học">Văn học</option>
            <option value="Khoa học">Khoa học</option>
            <option value="Công nghệ">Công nghệ</option>
            <option value="Lịch sử">Lịch sử</option>
            <option value="Kinh tế">Kinh tế</option>
            <option value="Nghệ thuật">Nghệ thuật</option>
            <option value="Triết học">Triết học</option>
            <option value="Tâm lý">Tâm lý</option>
            <option value="Khác">Khác</option>
          </select>
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

      <div class="mb-3">
        <label class="form-label">Mô tả</label>
        <textarea 
          class="form-control" 
          v-model="formData.MoTa"
          rows="4"
          placeholder="Nhập mô tả chi tiết về sách..."
        ></textarea>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Số trang</label>
          <input 
            type="number" 
            class="form-control" 
            v-model.number="formData.SoTrang"
            min="1"
          >
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Ngôn ngữ</label>
          <select class="form-select" v-model="formData.NgonNgu">
            <option value="">Chọn ngôn ngữ</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="Tiếng Anh">Tiếng Anh</option>
            <option value="Tiếng Pháp">Tiếng Pháp</option>
            <option value="Tiếng Trung">Tiếng Trung</option>
            <option value="Tiếng Nhật">Tiếng Nhật</option>
            <option value="Khác">Khác</option>
          </select>
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
  TacGia: '',
  TheLoai: '',
  MaNXB: '',
  NamXuatBan: new Date().getFullYear(),
  SoQuyen: 1,
  DonGia: 0,
  MoTa: '',
  SoTrang: null,
  NgonNgu: 'Tiếng Việt'
})

// Watch for sach prop changes (when editing)
watch(() => props.sach, (newVal) => {
  if (newVal) {
    formData.value = {
      ...newVal,
      MaNXB: newVal.MaNXB?._id || newVal.MaNXB
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>
