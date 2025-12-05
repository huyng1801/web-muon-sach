<template>
  <div class="muon-sach-form">
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Độc giả <span class="text-danger">*</span></label>
        <select 
          class="form-select" 
          v-model="formData.MaDocGia" 
          required
          @change="handleDocGiaChange"
        >
          <option value="">Chọn độc giả</option>
          <option 
            v-for="docgia in docgias" 
            :key="docgia._id" 
            :value="docgia._id"
          >
            {{ docgia.HoLot }} {{ docgia.Ten }} - {{ docgia.MaDocGia }}
          </option>
        </select>
        <small v-if="selectedDocGia" class="text-muted">
          Email: {{ selectedDocGia.Email }} | SĐT: {{ selectedDocGia.DienThoai }}
        </small>
      </div>

      <div class="mb-3">
        <label class="form-label">Sách <span class="text-danger">*</span></label>
        <select 
          class="form-select" 
          v-model="formData.MaSach" 
          required
          @change="handleSachChange"
        >
          <option value="">Chọn sách</option>
          <option 
            v-for="sach in availableSachs" 
            :key="sach._id" 
            :value="sach._id"
            :disabled="sach.SoQuyen <= 0"
          >
            {{ sach.TenSach }} - {{ sach.ISBN }} (Còn: {{ sach.SoQuyen }})
          </option>
        </select>
        <small v-if="selectedSach" class="text-muted">
          Tác giả: {{ selectedSach.TacGia }} | Thể loại: {{ selectedSach.TheLoai }}
        </small>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Ngày mượn <span class="text-danger">*</span></label>
          <input 
            type="date" 
            class="form-control" 
            v-model="formData.NgayMuon"
            required
            :max="today"
          >
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Ngày hẹn trả <span class="text-danger">*</span></label>
          <input 
            type="date" 
            class="form-control" 
            v-model="formData.NgayHenTra"
            required
            :min="formData.NgayMuon || today"
          >
          <small class="text-muted">Tối đa {{ maxBorrowDays }} ngày</small>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Nhân viên cho mượn <span class="text-danger">*</span></label>
        <select 
          class="form-select" 
          v-model="formData.MaNhanVien" 
          required
        >
          <option value="">Chọn nhân viên</option>
          <option 
            v-for="nhanvien in nhanviens" 
            :key="nhanvien._id" 
            :value="nhanvien._id"
          >
            {{ nhanvien.HoTenNV }} - {{ nhanvien.ChucVu }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Ghi chú</label>
        <textarea 
          class="form-control" 
          v-model="formData.GhiChu"
          rows="3"
          placeholder="Nhập ghi chú nếu có..."
        ></textarea>
      </div>

      <!-- Validation Warnings -->
      <div v-if="validationWarning" class="alert alert-warning">
        <i class="bi bi-exclamation-triangle"></i>
        {{ validationWarning }}
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          <i class="bi bi-x-circle"></i>
          Hủy
        </button>
        <button type="submit" class="btn btn-primary" :disabled="submitting || !!validationWarning">
          <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
          <i class="bi bi-check-circle"></i>
          Xác nhận mượn sách
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  docgias: {
    type: Array,
    default: () => []
  },
  sachs: {
    type: Array,
    default: () => []
  },
  nhanviens: {
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
  },
  maxBorrowDays: {
    type: Number,
    default: 30
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  MaDocGia: '',
  MaSach: '',
  NgayMuon: new Date().toISOString().split('T')[0],
  NgayHenTra: '',
  MaNhanVien: '',
  GhiChu: ''
})

const selectedDocGia = ref(null)
const selectedSach = ref(null)
const today = new Date().toISOString().split('T')[0]

const availableSachs = computed(() => {
  return props.sachs.filter(s => s.SoQuyen > 0)
})

const validationWarning = computed(() => {
  if (!formData.value.NgayMuon || !formData.value.NgayHenTra) return null
  
  const muon = new Date(formData.value.NgayMuon)
  const tra = new Date(formData.value.NgayHenTra)
  const diffDays = Math.ceil((tra - muon) / (1000 * 60 * 60 * 24))
  
  if (diffDays > props.maxBorrowDays) {
    return `Thời gian mượn vượt quá ${props.maxBorrowDays} ngày cho phép!`
  }
  
  if (diffDays < 1) {
    return 'Ngày hẹn trả phải sau ngày mượn!'
  }
  
  return null
})

const handleDocGiaChange = () => {
  selectedDocGia.value = props.docgias.find(d => d._id === formData.value.MaDocGia)
}

const handleSachChange = () => {
  selectedSach.value = props.sachs.find(s => s._id === formData.value.MaSach)
}

const handleSubmit = () => {
  if (validationWarning.value) return
  emit('submit', formData.value)
}

// Auto-calculate NgayHenTra when NgayMuon changes
watch(() => formData.value.NgayMuon, (newVal) => {
  if (newVal && !formData.value.NgayHenTra) {
    const muon = new Date(newVal)
    muon.setDate(muon.getDate() + 14) // Default 14 days
    formData.value.NgayHenTra = muon.toISOString().split('T')[0]
  }
})
</script>
