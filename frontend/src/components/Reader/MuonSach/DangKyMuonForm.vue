<template>
  <div class="dang-ky-muon-form">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-book"></i>
          Đăng ký mượn sách
        </h5>
      </div>
      <div class="card-body">
        <!-- Book Info -->
        <div v-if="sach" class="alert alert-info">
          <div class="row align-items-center">
            <div class="col-md-2">
              <div class="book-icon">
                <i class="bi bi-book fs-1"></i>
              </div>
            </div>
            <div class="col-md-10">
              <h6 class="mb-1">{{ sach.TenSach }}</h6>
              <p class="mb-0 small">
                <span class="me-3">
                  <i class="bi bi-person"></i> {{ sach.TacGia }}
                </span>
                <span class="me-3">
                  <i class="bi bi-tag"></i> {{ sach.TheLoai }}
                </span>
                <span>
                  <i class="bi bi-upc-scan"></i> {{ sach.ISBN }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Ngày mượn</label>
              <input 
                type="text" 
                class="form-control" 
                :value="today"
                disabled
              >
              <small class="text-muted">Mượn từ hôm nay</small>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Ngày hẹn trả <span class="text-danger">*</span></label>
              <input 
                type="date" 
                class="form-control" 
                v-model="formData.NgayHenTra"
                required
                :min="minReturnDate"
                :max="maxReturnDate"
              >
              <small class="text-muted">Tối đa {{ maxBorrowDays }} ngày</small>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Ghi chú</label>
            <textarea 
              class="form-control" 
              v-model="formData.GhiChu"
              rows="3"
              placeholder="Ghi chú thêm về yêu cầu mượn sách..."
            ></textarea>
          </div>

          <!-- Terms -->
          <div class="mb-3">
            <div class="card bg-light">
              <div class="card-body">
                <h6>Quy định mượn sách</h6>
                <ul class="mb-0 small">
                  <li>Mỗi độc giả được mượn tối đa {{ maxBooksPerReader }} quyển cùng lúc</li>
                  <li>Thời gian mượn tối đa {{ maxBorrowDays }} ngày</li>
                  <li>Phạt {{ formatCurrency(finePerDay) }}/ngày nếu trả trễ</li>
                  <li>Giữ gìn sách cẩn thận, bồi thường nếu làm hỏng hoặc mất</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                v-model="formData.acceptTerms"
                id="acceptTerms"
                required
              >
              <label class="form-check-label" for="acceptTerms">
                Tôi đã đọc và đồng ý với các quy định mượn sách
              </label>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div v-if="warning" class="alert alert-warning">
            {{ warning }}
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
              <i class="bi bi-x-circle"></i>
              Hủy
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="submitting || !formData.acceptTerms"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-check-circle"></i>
              Đăng ký mượn
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  sach: {
    type: Object,
    required: true
  },
  submitting: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  warning: {
    type: String,
    default: null
  },
  maxBorrowDays: {
    type: Number,
    default: 30
  },
  maxBooksPerReader: {
    type: Number,
    default: 5
  },
  finePerDay: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['submit', 'cancel'])

const today = new Date().toLocaleDateString('vi-VN')

const formData = ref({
  NgayHenTra: getDefaultReturnDate(),
  GhiChu: '',
  acceptTerms: false
})

const minReturnDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const maxReturnDate = computed(() => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + props.maxBorrowDays)
  return maxDate.toISOString().split('T')[0]
})

function getDefaultReturnDate() {
  const date = new Date()
  date.setDate(date.getDate() + 14) // Default 14 days
  return date.toISOString().split('T')[0]
}

const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
    MaSach: props.sach._id
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0)
}
</script>

<style scoped>
.book-icon {
  width: 80px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}
</style>
