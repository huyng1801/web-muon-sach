<template>
  <div class="sach-list">
    <!-- Search & Actions -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="search-box">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..." 
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
              >
              <i class="bi bi-search"></i>
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterCategory" @change="handleFilter">
              <option value="">Tất cả thể loại</option>
              <option value="Văn học">Văn học</option>
              <option value="Khoa học">Khoa học</option>
              <option value="Công nghệ">Công nghệ</option>
              <option value="Lịch sử">Lịch sử</option>
              <option value="Kinh tế">Kinh tế</option>
              <option value="Nghệ thuật">Nghệ thuật</option>
            </select>
          </div>
          <div class="col-md-3 text-end">
            <button class="btn btn-primary" @click="$emit('add')">
              <i class="bi bi-plus-circle"></i>
              Thêm sách
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

        <div v-else-if="sachs.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-2">Không có sách nào</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Thể loại</th>
                <th>NXB</th>
                <th>Năm XB</th>
                <th>Số quyển</th>
                <th>Đơn giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sach in sachs" :key="sach._id">
                <td>{{ sach.ISBN }}</td>
                <td class="fw-bold">{{ sach.TenSach }}</td>
                <td>{{ sach.TacGia }}</td>
                <td>
                  <span class="badge bg-info">{{ sach.TheLoai }}</span>
                </td>
                <td>{{ sach.MaNXB?.TenNXB || 'N/A' }}</td>
                <td>{{ sach.NamXuatBan }}</td>
                <td>
                  <span 
                    class="badge" 
                    :class="sach.SoQuyen > 0 ? 'bg-success' : 'bg-danger'"
                  >
                    {{ sach.SoQuyen }}
                  </span>
                </td>
                <td>{{ formatCurrency(sach.DonGia) }}</td>
                <td>
                  <button 
                    class="btn btn-sm btn-info me-1" 
                    @click="$emit('view', sach)"
                    title="Xem chi tiết"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-warning me-1" 
                    @click="$emit('edit', sach)"
                    title="Sửa"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="handleDelete(sach)"
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
    default: () => ({ page: 1, limit: 10, total: 0, totalPages: 0 })
  }
})

const emit = defineEmits(['add', 'edit', 'view', 'delete', 'search', 'filter', 'page-change'])

const searchKeyword = ref('')
const filterCategory = ref('')

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handleFilter = () => {
  emit('filter', filterCategory.value)
}

const handleDelete = (sach) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sách "${sach.TenSach}"?`)) {
    emit('delete', sach._id)
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0)
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
