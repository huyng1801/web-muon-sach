<template>
  <div class="nxb-list">
    <!-- Search & Actions -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-8">
            <div class="search-box">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Tìm kiếm theo tên nhà xuất bản, địa chỉ..." 
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
              >
              <i class="bi bi-search"></i>
            </div>
          </div>
          <div class="col-md-4 text-end">
            <button class="btn btn-primary" @click="$emit('add')">
              <i class="bi bi-plus-circle"></i>
              Thêm nhà xuất bản
            </button>
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

        <div v-else-if="nhaxuatbans.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-2">Không có nhà xuất bản nào</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên nhà xuất bản</th>
                <th>Địa chỉ</th>
                <th>Ngày tạo</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(nxb, index) in nhaxuatbans" :key="nxb._id">
                <td>{{ (pagination.page - 1) * pagination.limit + index + 1 }}</td>
                <td class="fw-bold">{{ nxb.TenNXB }}</td>
                <td>
                  <i class="bi bi-geo-alt text-muted"></i>
                  {{ nxb.DiaChi || 'Chưa có địa chỉ' }}
                </td>
                <td>{{ formatDate(nxb.createdAt) }}</td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-info" 
                      @click="$emit('view', nxb)"
                      title="Xem chi tiết"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-warning" 
                      @click="$emit('edit', nxb)"
                      title="Chỉnh sửa"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger" 
                      @click="confirmDelete(nxb)"
                      title="Xóa"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
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
                v-for="page in getPageNumbers()" 
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
  nhaxuatbans: {
    type: Array,
    required: true
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

const emit = defineEmits(['add', 'edit', 'view', 'delete', 'search', 'page-change'])

const searchKeyword = ref('')

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handleDelete = (nxb) => {
  emit('delete', nxb._id)
}

const confirmDelete = (nxb) => {
  if (confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản "${nxb.TenNXB}"?`)) {
    handleDelete(nxb)
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

const getPageNumbers = () => {
  const pages = []
  const totalPages = props.pagination.totalPages
  const currentPage = props.pagination.page
  
  // Show max 5 page numbers
  let start = Math.max(1, currentPage - 2)
  let end = Math.min(totalPages, currentPage + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(totalPages, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
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
</style>
