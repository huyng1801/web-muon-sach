<template>
  <div class="reader-lich-su-muon">
    <!-- Filters -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h6 class="mb-3"><i class="bi bi-funnel"></i> Lọc kết quả</h6>
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label small mb-2">Trạng thái</label>
            <select class="form-select form-select-sm" v-model="filter.status" @change="handleFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Đang mượn">Đang mượn</option>
              <option value="Đã trả">Đã trả</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small mb-2">Từ ngày</label>
            <input 
              type="date" 
              class="form-control form-control-sm" 
              v-model="filter.fromDate"
              @change="handleFilter"
            >
          </div>
          <div class="col-md-4">
            <label class="form-label small mb-2">Đến ngày</label>
            <input 
              type="date" 
              class="form-control form-control-sm" 
              v-model="filter.toDate"
              @change="handleFilter"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="summary" class="row mb-4">
      <div class="col-md-2 mb-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body text-center py-3">
            <h4 class="mb-1 text-primary fw-bold">{{ summary.total || 0 }}</h4>
            <small class="text-muted"><i class="bi bi-book"></i> Tổng</small>
          </div>
        </div>
      </div>
      <div class="col-md-2 mb-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body text-center py-3">
            <h4 class="mb-1 text-info fw-bold">{{ summary.pending || 0 }}</h4>
            <small class="text-muted"><i class="bi bi-hourglass-split"></i> Chờ duyệt</small>
          </div>
        </div>
      </div>
      <div class="col-md-2 mb-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body text-center py-3">
            <h4 class="mb-1 text-warning fw-bold">{{ summary.borrowing || 0 }}</h4>
            <small class="text-muted"><i class="bi bi-clock-history"></i> Đang mượn</small>
          </div>
        </div>
      </div>
      <div class="col-md-2 mb-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body text-center py-3">
            <h4 class="mb-1 text-success fw-bold">{{ summary.returned || 0 }}</h4>
            <small class="text-muted"><i class="bi bi-check-circle"></i> Đã trả</small>
          </div>
        </div>
      </div>
      <div class="col-md-2 mb-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body text-center py-3">
            <h4 class="mb-1 text-danger fw-bold">{{ summary.overdue || 0 }}</h4>
            <small class="text-muted"><i class="bi bi-exclamation-circle"></i> Quá hạn</small>
          </div>
        </div>
      </div>
      <div class="col-md-2 mb-3">
        <div class="card border-0 shadow-sm bg-light">
          <div class="card-body text-center py-3">
            <h4 class="mb-1 text-secondary fw-bold">{{ summary.rejected || 0 }}</h4>
            <small class="text-muted"><i class="bi bi-x-circle"></i> Từ chối</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Records List -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="filteredRecords.length === 0" class="card border-0 shadow-sm">
      <div class="card-body text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted"></i>
        <p class="text-muted mt-3">{{ records.length === 0 ? 'Bạn chưa có lịch sử mượn sách' : 'Không có kết quả phù hợp' }}</p>
      </div>
    </div>

    <div v-else class="row">
      <div v-for="record in filteredRecords" :key="record._id" class="col-md-6 mb-4">
        <div class="card h-100 shadow-sm border-0 overflow-hidden book-borrow-card" :class="{ 'border-danger': isOverdue(record) }">
          <!-- Card Header with Status -->
          <div class="card-header py-3" :class="getStatusBadgeClass(record)">
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-white" :class="getStatusTextClass(record)">
                {{ getStatusText(record) }}
              </span>
              <small class="text-white">ID: {{ record._id.slice(-8) }}</small>
            </div>
          </div>
          
          <!-- Card Body -->
          <div class="card-body">
            <!-- Book Title -->
            <h6 class="card-title mb-3 text-truncate" :title="record.MaSach?.TenSach">
              <i class="bi bi-book me-2 text-primary"></i>
              {{ record.MaSach?.TenSach || 'Không rõ' }}
            </h6>

            <!-- Book Info -->
            <div class="info-group mb-3">
              <small class="text-muted d-block mb-2">
                <i class="bi bi-person me-2"></i>
                <strong>Tác giả:</strong> {{ record.MaSach?.NguonGoc_TacGia || 'Không rõ' }}
              </small>
              <small class="text-muted d-block">
                <i class="bi bi-cash me-2"></i>
                <strong>Giá:</strong> {{ formatCurrency(record.MaSach?.DonGia) || 'N/A' }}
              </small>
            </div>

            <hr class="my-3">

            <!-- Dates -->
            <div class="dates-group">
              <div class="d-flex justify-content-between mb-2">
                <small class="text-muted">
                  <i class="bi bi-calendar-event me-1"></i>
                  <strong>Ngày mượn:</strong>
                </small>
                <small class="fw-bold">{{ formatDate(record.NgayMuon) }}</small>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <small class="text-muted">
                  <i class="bi bi-calendar-check me-1"></i>
                  <strong>Hạn trả:</strong>
                </small>
                <small class="fw-bold" :class="isOverdue(record) ? 'text-danger' : ''">
                  {{ formatDate(record.NgayHenTra) }}
                </small>
              </div>
              <div v-if="record.NgayTra" class="d-flex justify-content-between">
                <small class="text-muted">
                  <i class="bi bi-calendar-x me-1"></i>
                  <strong>Ngày trả:</strong>
                </small>
                <small class="fw-bold text-success">{{ formatDate(record.NgayTra) }}</small>
              </div>
              <div v-else-if="isOverdue(record)" class="d-flex justify-content-between text-danger">
                <small class="text-danger">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  <strong>Quá hạn:</strong>
                </small>
                <small class="fw-bold text-danger">{{ getDaysOverdue(record) }} ngày</small>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="record.GhiChu" class="mt-3 p-2 bg-light rounded">
              <small class="text-muted d-block mb-1"><i class="bi bi-chat-left"></i> <strong>Ghi chú:</strong></small>
              <small class="text-dark">{{ record.GhiChu }}</small>
            </div>
          </div>

          <!-- Card Footer with Actions -->
          <div class="card-footer bg-light border-top py-3">
            <button 
              @click="$emit('view-detail', record)"
              class="btn btn-sm btn-outline-primary w-100"
            >
              <i class="bi bi-eye"></i> Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <nav v-if="pagination.totalPages > 1 && filteredRecords.length > 0" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.page === 1 }">
          <button class="page-link" @click="$emit('page-change', pagination.page - 1)">
            <i class="bi bi-chevron-left"></i> Trước
          </button>
        </li>
        <li 
          v-for="page in pagination.totalPages" 
          :key="page"
          class="page-item" 
          :class="{ active: page === pagination.page }"
        >
          <button class="page-link" @click="$emit('page-change', page)">
            {{ page }}
          </button>
        </li>
        <li 
          class="page-item" 
          :class="{ disabled: pagination.page === pagination.totalPages }"
        >
          <button class="page-link" @click="$emit('page-change', pagination.page + 1)">
            Sau <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  records: {
    type: Array,
    required: true
  },
  summary: {
    type: Object,
    default: () => ({ total: 0, borrowing: 0, returned: 0, overdue: 0 })
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({ page: 1, limit: 10, total: 0, totalPages: 0 })
  }
})

const emit = defineEmits(['filter', 'page-change', 'view-detail'])

const filter = ref({
  status: '',
  fromDate: '',
  toDate: ''
})

// Filter records based on filter criteria
const filteredRecords = computed(() => {
  return props.records.filter(record => {
    // Filter by status - use TrangThai from backend
    if (filter.value.status) {
      if (record.TrangThai !== filter.value.status) return false
    }

    // Filter by date range
    if (filter.value.fromDate) {
      const fromDate = new Date(filter.value.fromDate)
      const recordDate = new Date(record.NgayMuon)
      if (recordDate < fromDate) return false
    }

    if (filter.value.toDate) {
      const toDate = new Date(filter.value.toDate)
      const recordDate = new Date(record.NgayMuon)
      if (recordDate > toDate) return false
    }

    return true
  })
})

const handleFilter = () => {
  emit('filter', filter.value)
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
    case 'Từ chối': return 'bi bi-x-circle'
    case 'Chờ duyệt': return 'bi bi-hourglass-split'
    case 'Quá hạn': return 'bi bi-exclamation-triangle'
    default: return 'bi bi-clock-history'
  }
}

const getStatusTextClass = (record) => {
  const status = record.TrangThai
  switch (status) {
    case 'Đã trả': return 'text-success'
    case 'Từ chối': return 'text-dark'
    case 'Chờ duyệt': return 'text-info'
    case 'Quá hạn': return 'text-danger'
    default: return 'text-warning'
  }
}

const getStatusBadgeClass = (record) => {
  const status = record.TrangThai
  switch (status) {
    case 'Đã trả': return 'bg-success text-white'
    case 'Từ chối': return 'bg-dark text-white'
    case 'Chờ duyệt': return 'bg-info text-dark'
    case 'Quá hạn': return 'bg-danger text-white'
    default: return 'bg-warning text-dark'
  }
}
</script>

<style scoped>
.book-borrow-card {
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.book-borrow-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header.bg-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
}

.card-header.bg-warning {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%) !important;
}

.card-header.bg-danger {
  background: linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%) !important;
}

.info-group small {
  line-height: 1.6;
}

.dates-group small {
  line-height: 1.8;
}

.badge {
  font-weight: 500;
  padding: 0.5rem 0.75rem;
}
</style>
