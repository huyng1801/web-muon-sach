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
                placeholder="Tìm kiếm theo tên, SĐT, email..." 
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
                <th>MSNV</th>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th>Điện thoại</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nv in nhanviens" :key="nv._id">
                <td><code>{{ nv.MSNV }}</code></td>
                <td class="fw-bold">{{ nv.HoTenNV }}</td>
                <td>
                  <span class="badge bg-info">{{ nv.ChucVu }}</span>
                </td>
                <td>
                  <i class="bi bi-telephone text-muted"></i>
                  {{ nv.SoDienThoai || 'Chưa có' }}
                </td>
                <td>
                  <i class="bi bi-envelope text-muted"></i>
                  {{ nv.Email || 'Chưa có' }}
                </td>
                <td>{{ nv.DiaChi || 'Chưa có' }}</td>
                <td>
                  <span 
                    class="badge" 
                    :class="nv.isActive ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ nv.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
                  </span>
                </td>
                <td>
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

const emit = defineEmits(['add', 'edit', 'delete', 'search', 'page-change'])

const searchKeyword = ref('')

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handleDelete = (nv) => {
  if (confirm(`Bạn có chắc chắn muốn xóa nhân viên "${nv.HoTenNV}"?`)) {
    emit('delete', nv._id)
  }
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
