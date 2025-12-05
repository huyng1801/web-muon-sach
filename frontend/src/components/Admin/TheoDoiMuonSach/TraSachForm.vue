<template>
  <div class="tra-sach-form">
    <div v-if="record" class="card">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">
          <i class="bi bi-arrow-return-left"></i>
          Xác nhận trả sách
        </h5>
      </div>
      <div class="card-body">
        <!-- Borrow Record Info -->
        <div class="row mb-4">
          <div class="col-md-6">
            <h6>Thông tin mượn sách</h6>
            <table class="table table-borderless table-sm">
              <tbody>
                <tr>
                  <th width="120">Mã phiếu:</th>
                  <td><code>{{ record.MaPhieu || record._id?.slice(-6) }}</code></td>
                </tr>
                <tr>
                  <th>Độc giả:</th>
                  <td class="fw-bold">
                    {{ record.MaDocGia?.HoLot }} {{ record.MaDocGia?.Ten }}
                  </td>
                </tr>
                <tr>
                  <th>Sách:</th>
                  <td class="fw-bold">{{ record.MaSach?.TenSach }}</td>
                </tr>
                <tr>
                  <th>ISBN:</th>
                  <td><code>{{ record.MaSach?.ISBN }}</code></td>
                </tr>
                <tr>
                  <th>Ngày mượn:</th>
                  <td>{{ formatDate(record.NgayMuon) }}</td>
                </tr>
                <tr>
                  <th>Ngày hẹn trả:</th>
                  <td>{{ formatDate(record.NgayHenTra) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-md-6">
            <h6>Trạng thái</h6>
            <div v-if="isOverdue" class="alert alert-danger">
              <i class="bi bi-exclamation-triangle"></i>
              <strong>Quá hạn {{ daysOverdue }} ngày!</strong>
              <div class="mt-2">
                <small>Phạt: {{ formatCurrency(fineAmount) }}</small>
              </div>
            </div>
            <div v-else class="alert alert-success">
              <i class="bi bi-check-circle"></i>
              Trả đúng hạn
            </div>

            <div class="mt-3">
              <div class="d-flex justify-content-between mb-2">
                <span>Ngày mượn:</span>
                <strong>{{ formatDate(record.NgayMuon) }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Ngày hẹn trả:</span>
                <strong>{{ formatDate(record.NgayHenTra) }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Số ngày mượn:</span>
                <strong>{{ borrowDays }} ngày</strong>
              </div>
              <div v-if="isOverdue" class="d-flex justify-content-between mb-2 text-danger">
                <span>Số ngày quá hạn:</span>
                <strong>{{ daysOverdue }} ngày</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Return Form -->
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Ngày trả <span class="text-danger">*</span></label>
              <input 
                type="date" 
                class="form-control" 
                v-model="formData.NgayTra"
                required
                :min="record.NgayMuon"
                :max="today"
              >
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Tình trạng sách <span class="text-danger">*</span></label>
              <select class="form-select" v-model="formData.TinhTrangSach" required>
                <option value="">Chọn tình trạng</option>
                <option value="good">Tốt</option>
                <option value="normal">Bình thường</option>
                <option value="damaged">Hư hỏng</option>
                <option value="lost">Mất sách</option>
              </select>
            </div>
          </div>

          <div class="mb-3" v-if="isOverdue">
            <label class="form-label">Tiền phạt</label>
            <input 
              type="number" 
              class="form-control" 
              v-model.number="formData.TienPhat"
              min="0"
              step="1000"
            >
            <small class="text-muted">Phạt tự động: {{ formatCurrency(fineAmount) }}</small>
          </div>

          <div class="mb-3">
            <label class="form-label">Ghi chú</label>
            <textarea 
              class="form-control" 
              v-model="formData.GhiChu"
              rows="3"
              placeholder="Nhập ghi chú về tình trạng sách..."
            ></textarea>
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
              <i class="bi bi-x-circle"></i>
              Hủy
            </button>
            <button type="submit" class="btn btn-success" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-check-circle"></i>
              Xác nhận trả sách
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy thông tin phiếu mượn
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  record: {
    type: Object,
    default: null
  },
  submitting: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  finePerDay: {
    type: Number,
    default: 5000 // 5,000 VND per day
  }
})

const emit = defineEmits(['submit', 'cancel'])

const today = new Date().toISOString().split('T')[0]

const formData = ref({
  NgayTra: today,
  TinhTrangSach: '',
  TienPhat: 0,
  GhiChu: ''
})

const borrowDays = computed(() => {
  if (!props.record) return 0
  const start = new Date(props.record.NgayMuon)
  const end = new Date(props.record.NgayHenTra)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
})

const isOverdue = computed(() => {
  if (!props.record) return false
  const today = new Date(formData.value.NgayTra)
  const dueDate = new Date(props.record.NgayHenTra)
  return today > dueDate
})

const daysOverdue = computed(() => {
  if (!isOverdue.value) return 0
  const today = new Date(formData.value.NgayTra)
  const dueDate = new Date(props.record.NgayHenTra)
  return Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24))
})

const fineAmount = computed(() => {
  return daysOverdue.value * props.finePerDay
})

// Auto-calculate fine when overdue
watch([isOverdue, daysOverdue], () => {
  if (isOverdue.value) {
    formData.value.TienPhat = fineAmount.value
  } else {
    formData.value.TienPhat = 0
  }
})

const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
    recordId: props.record._id
  })
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0)
}
</script>
