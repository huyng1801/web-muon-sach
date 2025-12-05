<template>
  <div class="reader-lich-su-muon">
    <!-- Filters -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-4">
            <select class="form-select" v-model="filter.status" @change="handleFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="borrowing">Đang mượn</option>
              <option value="returned">Đã trả</option>
              <option value="overdue">Quá hạn</option>
            </select>
          </div>
          <div class="col-md-4">
            <input 
              type="date" 
              class="form-control" 
              v-model="filter.fromDate"
              @change="handleFilter"
              placeholder="Từ ngày"
            >
          </div>
          <div class="col-md-4">
            <input 
              type="date" 
              class="form-control" 
              v-model="filter.toDate"
              @change="handleFilter"
              placeholder="Đến ngày"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="summary" class="row mb-3">
      <div class="col-md-3 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body text-center">
            <h3 class="mb-0">{{ summary.total || 0 }}</h3>
            <small>Tổng lượt mượn</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card bg-warning text-white">
          <div class="card-body text-center">
            <h3 class="mb-0">{{ summary.borrowing || 0 }}</h3>
            <small>Đang mượn</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body text-center">
            <h3 class="mb-0">{{ summary.returned || 0 }}</h3>
            <small>Đã trả</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card bg-danger text-white">
          <div class="card-body text-center">
            <h3 class="mb-0">{{ summary.overdue || 0 }}</h3>
            <small>Quá hạn</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Records List -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="records.length === 0" class="card">
      <div class="card-body text-center py-5 text-muted">
        <i class="bi bi-inbox fs-1"></i>
        <p class="mt-2">Bạn chưa có lịch sử mượn sách</p>
      </div>
    </div>

    <div v-else class="row">
      <div v-for="record in records" :key="record._id" class="col-md-6 mb-3">
        <div class="card h-100" :class="getCardClass(record)">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h6 class="mb-0">{{ record.MaSach?.TenSach }}</h6>
              <span class="badge" :class="getStatusBadgeClass(record)">
                {{ getStatusText(record) }}
              </span>
            </div>

            <p class="text-muted small mb-2">
              <i class="bi bi-person"></i>
              {{ record.MaSach?.TacGia }}
            </p>
            <p class="text-muted small mb-2">
              <i class="bi bi-upc-scan"></i>
              {{ record.MaSach?.ISBN }}
            </p>

            <hr>

            <div class="row small">
              <div class="col-6 mb-2">
                <strong>Ngày mượn:</strong><br>
                {{ formatDate(record.NgayMuon) }}
              </div>
              <div class="col-6 mb-2">
                <strong>Ngày hẹn trả:</strong><br>
                {{ formatDate(record.NgayHenTra) }}
              </div>
              <div class="col-6 mb-2">
                <strong>Ngày trả:</strong><br>
                {{ record.NgayTra ? formatDate(record.NgayTra) : 'Chưa trả' }}
              </div>
              <div class="col-6 mb-2">
                <strong>Nhân viên:</strong><br>
                {{ record.MaNhanVien?.HoTenNV || 'N/A' }}
              </div>
            </div>

            <div v-if="isOverdue(record)" class="alert alert-danger small mt-3 mb-0">
              <i class="bi bi-exclamation-triangle"></i>
              Quá hạn {{ getDaysOverdue(record) }} ngày
            </div>

            <div v-if="record.GhiChu" class="mt-3">
              <small class="text-muted">
                <strong>Ghi chú:</strong> {{ record.GhiChu }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <nav v-if="pagination.totalPages > 1" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.page === 1 }">
          <button class="page-link" @click="$emit('page-change', pagination.page - 1)">
            Trước
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
            Sau
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

const emit = defineEmits(['filter', 'page-change'])

const filter = ref({
  status: '',
  fromDate: '',
  toDate: ''
})

const handleFilter = () => {
  emit('filter', filter.value)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
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
  if (record.NgayTra) return 'Đã trả'
  if (isOverdue(record)) return 'Quá hạn'
  return 'Đang mượn'
}

const getStatusBadgeClass = (record) => {
  if (record.NgayTra) return 'bg-success'
  if (isOverdue(record)) return 'bg-danger'
  return 'bg-warning'
}

const getCardClass = (record) => {
  if (isOverdue(record)) return 'border-danger'
  return ''
}
</script>
