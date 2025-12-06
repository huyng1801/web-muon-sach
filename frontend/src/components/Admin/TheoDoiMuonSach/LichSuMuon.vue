<template>
  <div class="lich-su-muon">
    <!-- Filters -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-3">
            <select class="form-select" v-model="filter.status" @change="handleFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Đang mượn">Đang mượn</option>
              <option value="Đã trả">Đã trả</option>
              <option value="Quá hạn">Quá hạn</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filter.docgia" @change="handleFilter">
              <option value="">Tất cả độc giả</option>
              <option 
                v-for="docgia in docgias" 
                :key="docgia._id" 
                :value="docgia._id"
              >
                {{ docgia.HoLot }} {{ docgia.Ten }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <input 
              type="date" 
              class="form-control" 
              v-model="filter.fromDate"
              @change="handleFilter"
              placeholder="Từ ngày"
            >
          </div>
          <div class="col-md-3">
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

    <!-- Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="records.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-2">Không có lịch sử mượn sách</p>
        </div>

        <div v-else-if="filteredRecords.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-funnel fs-1"></i>
          <p class="mt-2">Không có kết quả phù hợp với điều kiện lọc</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Độc giả</th>
                <th>Sách</th>
                <th>Ngày mượn</th>
                <th>Ngày hẹn trả</th>
                <th>Ngày trả</th>
                <th>Nhân viên</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredRecords" :key="record._id" :class="getRowClass(record)">
                <td>
                  <code>{{ record.MaPhieu || (record._id ? record._id.slice(-6) : 'N/A') }}</code>
                </td>
                <td>
                  <div class="fw-bold">
                    {{ record.MaDocGia?.HoLot }} {{ record.MaDocGia?.Ten }}
                  </div>
                  <small class="text-muted">{{ record.MaDocGia?.MaDocGia }}</small>
                </td>
                <td>
                  <div class="fw-bold">{{ record.MaSach?.TenSach }}</div>
                  <small class="text-muted">{{ record.MaSach?.ISBN }}</small>
                </td>
                <td>{{ formatDate(record.NgayMuon) }}</td>
                <td>{{ formatDate(record.NgayHenTra) }}</td>
                <td>
                  <span v-if="record.NgayTra">{{ formatDate(record.NgayTra) }}</span>
                  <span v-else class="text-muted">Chưa trả</span>
                </td>
                <td>{{ record.MaNhanVien?.HoTenNV || 'N/A' }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(record)">
                    {{ getStatusText(record) }}
                  </span>
                  <span v-if="isOverdue(record)" class="badge bg-danger ms-1">
                    Quá {{ getDaysOverdue(record) }} ngày
                  </span>
                </td>
                <td>
                  <!-- Approve/Reject for pending requests -->
                  <div v-if="record.TrangThai === 'Chờ duyệt'" class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-sm btn-success" 
                      @click="$emit('approve-request', record)"
                      title="Duyệt yêu cầu"
                    >
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-danger" 
                      @click="$emit('reject-request', record)"
                      title="Từ chối"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                  
                  <!-- Return book for approved requests -->
                  <button 
                    v-else-if="record.TrangThai === 'Đang mượn' && !record.NgayTra"
                    class="btn btn-sm btn-success" 
                    @click="$emit('return-book', record)"
                    title="Trả sách"
                  >
                    <i class="bi bi-arrow-return-left"></i>
                  </button>
                  
                  <!-- View detail button -->
                  <button 
                    class="btn btn-sm btn-info" 
                    @click="$emit('view-detail', record)"
                    title="Xem chi tiết"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  },
  docgias: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['filter', 'approve-request', 'reject-request', 'return-book', 'view-detail', 'page-change'])

const filter = ref({
  status: '',
  docgia: '',
  fromDate: '',
  toDate: ''
})

// Filter records client-side for date range
const filteredRecords = computed(() => {
  return props.records.filter(record => {
    // Date range filtering
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
  // Use TrangThai from model first, then fallback to calculated status
  if (record.TrangThai) {
    return record.TrangThai
  }
  // Fallback for old records
  if (record.NgayTra) return 'Đã trả'
  if (isOverdue(record)) return 'Quá hạn'
  return 'Đang mượn'
}

const getStatusBadgeClass = (record) => {
  const status = record.TrangThai || getStatusText(record)
  switch (status) {
    case 'Chờ duyệt': return 'bg-warning'
    case 'Đang mượn': return 'bg-primary'
    case 'Đã trả': return 'bg-success'
    case 'Quá hạn': return 'bg-danger'
    case 'Từ chối': return 'bg-secondary'
    default: return 'bg-info'
  }
}

const getRowClass = (record) => {
  if (isOverdue(record)) return 'table-danger'
  return ''
}
</script>
