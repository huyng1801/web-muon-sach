<template>
  <div class="container-fluid">
    <Toast ref="toastRef" />
    
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2><i class="bi bi-receipt"></i> Chi tiết phiếu mượn</h2>
        <small class="text-muted">ID: {{ record?._id?.slice(-8) }}</small>
      </div>
      <button @click="goBack" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i> Quay lại
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!record" class="card border-0 shadow-sm">
      <div class="card-body text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted"></i>
        <p class="text-muted mt-3">Không tìm thấy thông tin phiếu mượn</p>
      </div>
    </div>

    <!-- Detail -->
    <div v-else class="row">
      <!-- Main Info -->
      <div class="col-lg-8">
        <!-- Status Card -->
        <div class="card border-0 shadow-sm mb-4" :class="getStatusCardClass(record)">
          <div class="card-body py-4">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-1">{{ getStatusText(record) }}</h5>
                <small class="text-muted">Trạng thái phiếu mượn</small>
              </div>
              <span class="badge" :class="getStatusBadgeClass(record)">
                <i :class="getStatusIcon(record)" class="me-1"></i>
                {{ getStatusText(record) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Book Info Card -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-primary text-white py-3">
            <h6 class="mb-0"><i class="bi bi-book"></i> Thông tin sách</h6>
          </div>
          <div class="card-body">
            <h5 class="mb-3">{{ record.MaSach?.TenSach }}</h5>
            <div class="mb-2">
              <strong>Tác giả:</strong> {{ record.MaSach?.NguonGoc_TacGia || 'Không rõ' }}
            </div>
            <div class="mb-2">
              <strong>Nhà xuất bản:</strong> {{ record.MaSach?.MaNXB?.TenNXB || 'Không rõ' }}
            </div>
            <div class="mb-2">
              <strong>Năm xuất bản:</strong> {{ record.MaSach?.NamXuatBan }}
            </div>
            <div class="mb-2">
              <strong>ISBN:</strong> {{ record.MaSach?.ISBN || 'Không rõ' }}
            </div>
            <div>
              <strong>Giá:</strong> <span class="text-primary fw-bold">{{ formatCurrency(record.MaSach?.DonGia) }}</span>
            </div>
          </div>
        </div>

        <!-- Dates Info Card -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-info text-white py-3">
            <h6 class="mb-0"><i class="bi bi-calendar3"></i> Thời gian mượn</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="text-muted small"><i class="bi bi-calendar-event"></i> Ngày mượn</label>
                <h6 class="fw-bold">{{ formatDate(record.NgayMuon) }}</h6>
              </div>
              <div class="col-md-6 mb-3">
                <label class="text-muted small"><i class="bi bi-calendar-check"></i> Hạn trả</label>
                <h6 class="fw-bold" :class="isOverdue(record) ? 'text-danger' : ''">
                  {{ formatDate(record.NgayHenTra) }}
                  <span v-if="isOverdue(record)" class="text-danger">(Quá hạn {{ getDaysOverdue(record) }} ngày)</span>
                </h6>
              </div>
              <div v-if="record.NgayTra" class="col-md-6">
                <label class="text-muted small"><i class="bi bi-calendar-x"></i> Ngày trả</label>
                <h6 class="fw-bold text-success">{{ formatDate(record.NgayTra) }}</h6>
              </div>
              <div v-else class="col-md-6">
                <label class="text-muted small"><i class="bi bi-hourglass-split"></i> Tình trạng</label>
                <h6 class="fw-bold text-warning">Đang mượn</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="col-lg-4">
        <!-- Condition Card -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-success text-white py-3">
            <h6 class="mb-0"><i class="bi bi-clipboard-check"></i> Tình trạng sách</h6>
          </div>
          <div class="card-body">
            <div class="condition-badge" :class="getConditionClass(record)">
              {{ getConditionText(record) }}
            </div>
          </div>
        </div>

        <!-- Fine Info Card -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-danger text-white py-3">
            <h6 class="mb-0"><i class="bi bi-exclamation-circle"></i> Thông tin phạt</h6>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <span>Tiền phạt:</span>
              <h5 class="text-danger fw-bold mb-0">{{ formatCurrency(record.TienPhat || 0) }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Section -->
    <div v-if="record?.GhiChu" class="row mt-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-warning text-dark py-3">
            <h6 class="mb-0"><i class="bi bi-chat-left"></i> Ghi chú</h6>
          </div>
          <div class="card-body">
            {{ record.GhiChu }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import Toast from '@/components/Common/Toast.vue'

const route = useRoute()
const router = useRouter()
const muonSachStore = useTheoDoiMuonSachStore()
const toastRef = ref(null)

const record = ref(null)
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    const id = route.params.id
    
    // Tìm record trong store hoặc fetch từ API
    let found = muonSachStore.myBorrows?.find(r => r._id === id)
    
    if (!found) {
      // Fetch từ API nếu không tìm thấy
      const response = await fetch(`/api/theodoimuonsach/${id}`)
      if (response.ok) {
        const data = await response.json()
        found = data.data || data
      }
    }
    
    record.value = found
    if (!found) {
      toastRef.value?.showToast('Không tìm thấy phiếu mượn', 'error')
    }
  } catch (error) {
    console.error('Error loading detail:', error)
    toastRef.value?.showToast('Có lỗi khi tải chi tiết phiếu mượn', 'error')
  } finally {
    loading.value = false
  }
})

const goBack = () => {
  router.back()
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

const isOverdue = (record) => {
  if (record.NgayTra) return false
  if (record.TrangThai === 'Đã trả' || record.TrangThai === 'Từ chối') return false
  const today = new Date()
  const dueDate = new Date(record.NgayHenTra)
  return today > dueDate
}

const getDaysOverdue = (record) => {
  const today = new Date()
  const dueDate = new Date(record.NgayHenTra)
  const diffTime = today - dueDate
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getStatusText = (record) => {
  return record.TrangThai || 'Chờ duyệt'
}

const getStatusIcon = (record) => {
  const status = record.TrangThai
  switch (status) {
    case 'Đã trả': return 'bi bi-check-circle'
    case 'Quá hạn': return 'bi bi-exclamation-triangle'
    case 'Từ chối': return 'bi bi-x-circle'
    case 'Chờ duyệt': return 'bi bi-hourglass-split'
    default: return 'bi bi-clock-history'
  }
}

const getStatusTextClass = (record) => {
  const status = record.TrangThai
  switch (status) {
    case 'Đã trả': return 'text-success'
    case 'Quá hạn': return 'text-danger'
    case 'Từ chối': return 'text-dark'
    case 'Chờ duyệt': return 'text-info'
    default: return 'text-warning'
  }
}

const getStatusBadgeClass = (record) => {
  const status = record.TrangThai
  switch (status) {
    case 'Đã trả': return 'bg-success text-white'
    case 'Quá hạn': return 'bg-danger text-white'
    case 'Từ chối': return 'bg-dark text-white'
    case 'Chờ duyệt': return 'bg-info text-dark'
    default: return 'bg-warning text-dark'
  }
}

const getStatusCardClass = (record) => {
  const status = record.TrangThai
  switch (status) {
    case 'Đã trả': return 'bg-success bg-opacity-10 border border-success'
    case 'Quá hạn': return 'bg-danger bg-opacity-10 border border-danger'
    case 'Từ chối': return 'bg-dark bg-opacity-10 border border-dark'
    case 'Chờ duyệt': return 'bg-info bg-opacity-10 border border-info'
    default: return 'bg-warning bg-opacity-10 border border-warning'
  }
}

const getConditionText = (record) => {
  const condition = record.TinhTrangSach
  switch (condition) {
    case 'good': return 'Tốt'
    case 'normal': return 'Bình thường'
    case 'damaged': return 'Hư hỏng'
    case 'lost': return 'Mất sách'
    default: return 'Chưa xác định'
  }
}

const getConditionClass = (record) => {
  const condition = record.TinhTrangSach
  const classes = 'px-3 py-2 rounded fw-bold text-white text-center'
  switch (condition) {
    case 'good': return classes + ' bg-success'
    case 'normal': return classes + ' bg-info'
    case 'damaged': return classes + ' bg-warning'
    case 'lost': return classes + ' bg-danger'
    default: return classes + ' bg-secondary'
  }
}
</script>

<style scoped>
.condition-badge {
  display: inline-block;
  width: 100%;
  padding: 0.75rem;
}

.card-header {
  border-bottom: none;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}
</style>
