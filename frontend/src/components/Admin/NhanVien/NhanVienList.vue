<template>
  <div class="nhan-vien-list">
    <!-- Search & Actions -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-8">
            <div class="search-box">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Tìm kiếm theo tên, số điện thoại..." 
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
              >
              <i class="bi bi-search"></i>
            </div>
          </div>
          <div class="col-md-4 text-end">
            <button class="btn btn-primary" @click="$emit('add')">
              <i class="bi bi-plus-circle"></i>
              Thêm nhân viên
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

        <div v-else-if="nhanviens.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-2">Không có nhân viên nào</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th>Điện thoại</th>
                <th>Địa chỉ</th>
                <th>Ngày tham gia</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nv in nhanviens" :key="nv._id">
                <td class="fw-bold">{{ nv.HoTenNV }}</td>
                <td>
                  <span class="badge bg-info">{{ nv.Chucvu }}</span>
                </td>
                <td>
                  <i class="bi bi-telephone text-muted"></i>
                  {{ nv.SoDienThoai || 'Chưa có' }}
                </td>
                <td>{{ nv.DiaChi || 'Chưa có' }}</td>
                <td>
                  <small class="text-muted">{{ formatDateTime(nv.createdAt) }}</small>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-info me-1" 
                    @click="$emit('view', nv)"
                    title="Xem chi tiết"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-warning me-1" 
                    @click="$emit('edit', nv)"
                    title="Sửa"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="handleDelete(nv)"
                    title="Xóa"
                  >
                    <i class="bi bi-trash"></i>
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
  nhanviens: {
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

const formatDateTime = (date) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleDateString('vi-VN')
}

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handleDelete = (nv) => {
  emit('delete', nv._id)
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
