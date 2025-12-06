<template>
  <div class="reader-sach-list">
    <!-- Search & Filters -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="search-box">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Tìm kiếm sách theo tên, tác giả, ISBN..." 
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
              >
              <i class="bi bi-search"></i>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <select class="form-select" v-model="filterPublisher" @change="handleFilter">
              <option value="">Tất cả nhà xuất bản</option>
              <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
                {{ nxb.TenNXB }}
              </option>
            </select>
          </div>
          
        </div>
      </div>
    </div>

    <!-- Book Grid -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="sachs.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-inbox fs-1"></i>
      <p class="mt-2">Không tìm thấy sách nào</p>
    </div>

    <div v-else>
      <div class="row">
        <div v-for="sach in sachs" :key="sach._id" class="col-md-3 mb-4">
          <div class="card book-card h-100" @click="$emit('view', sach)">
            <div class="book-cover">
              <i class="bi bi-book fs-1"></i>
            </div>
            <div class="card-body">
              <h6 class="card-title text-truncate" :title="sach.TenSach">
                {{ sach.TenSach }}
              </h6>
              <p class="card-text text-muted small mb-1">
                <i class="bi bi-person"></i>
                {{ sach.NguonGoc_TacGia || 'Không rõ tác giả' }}
              </p>
              <p class="card-text text-muted small mb-1">
                <i class="bi bi-buildings"></i>
                <span v-if="sach.MaNXB">{{ typeof sach.MaNXB === 'string' ? 'Không rõ' : (sach.MaNXB.TenNXB || 'Không rõ') }}</span>
                <span v-else>Không rõ</span>
              </p>
              <p class="card-text text-muted small mb-2">
                <i class="bi bi-calendar"></i>
                {{ sach.NamXuatBan || 'N/A' }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-warning text-dark">{{ formatCurrency(sach.DonGia) }}</span>
                <span 
                  class="badge" 
                  :class="sach.SoQuyen > 0 ? 'bg-success' : 'bg-danger'"
                >
                  {{ sach.SoQuyen > 0 ? `Còn ${sach.SoQuyen}` : 'Hết' }}
                </span>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <button 
                class="btn btn-sm btn-primary w-100" 
                @click.stop="$emit('borrow', sach)"
                :disabled="sach.SoQuyen <= 0"
              >
                <i class="bi bi-book"></i>
                {{ sach.SoQuyen > 0 ? 'Đăng ký mượn' : 'Hết sách' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="pagination.totalPages > 1" class="mt-4">
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
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  sachs: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({ page: 1, limit: 12, total: 0, totalPages: 0 })
  },
  publishers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view', 'borrow', 'search', 'filter', 'sort', 'page-change'])

const searchKeyword = ref('')
const filterPublisher = ref('')
const sortBy = ref('newest')

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0)
}

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handleFilter = () => {
  emit('filter', filterPublisher.value)
}

const handleSort = () => {
  emit('sort', sortBy.value)
}
</script>

<style scoped>
.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.book-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.book-cover {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
