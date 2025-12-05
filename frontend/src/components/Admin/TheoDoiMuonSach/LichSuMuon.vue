<template>
  <div class="lich-su-muon">
    <!-- Filters -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-3">
            <select class="form-select" v-model="filter.status" @change="handleFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="borrowing">Đang mượn</option>
              <option value="returned">Đã trả</option>
              <option value="overdue">Quá hạn</option>
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
              <tr v-for="record in records" :key="record._id" :class="getRowClass(record)">
                <td>
                  <code>{{ record.MaPhieu || record._id.slice(-6) }}</code>
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
                  <button 
                    v-if="!record.NgayTra"
                    class="btn btn-sm btn-success me-1" 
                    @click="$emit('return-book', record)"
                    title="Trả sách"
                  >
                    <i class="bi bi-check-circle"></i>
                  </button>
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
import { ref } from 'vue'

const props = defineProps({
  records: {
    type: Array,
    required: true
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

const emit = defineEmits(['filter', 'return-book', 'view-detail', 'page-change'])

const filter = ref({
  status: '',
  docgia: '',
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

const getRowClass = (record) => {
  if (isOverdue(record)) return 'table-danger'
  return ''
}
</script>
