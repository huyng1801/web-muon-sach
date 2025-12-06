<template>
  <div class="container-fluid">
    <Toast ref="toastRef" />
    <h2 class="mb-4">
      <i class="bi bi-search"></i>
      Tìm kiếm sách
    </h2>

    <!-- Advanced Search Form -->
    <div class="card mb-4">
      <div class="card-body">
        <form @submit.prevent="handleSearch">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Tên sách</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="searchForm.keyword"
                placeholder="Nhập tên sách, tác giả hoặc ISBN..."
              >
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Nhà xuất bản</label>
              <select class="form-select" v-model="searchForm.MaNXB">
                <option value="">Tất cả nhà xuất bản</option>
                <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
                  {{ nxb.TenNXB }}
                </option>
              </select>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-search"></i>
              Tìm kiếm
            </button>
            <button type="button" class="btn btn-secondary" @click="handleReset">
              <i class="bi bi-arrow-clockwise"></i>
              Đặt lại
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searching" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Đang tìm kiếm...</p>
    </div>

    <div v-else-if="searched && results.length === 0" class="text-center py-5">
      <i class="bi bi-inbox fs-1 text-muted"></i>
      <p class="text-muted mt-2">Không tìm thấy sách phù hợp</p>
    </div>

    <div v-else-if="results.length > 0">
      <h4 class="mb-3">Kết quả tìm kiếm ({{ results.length }} sách)</h4>
      
      <div class="row">
        <div class="col-md-3 mb-4" v-for="sach in results" :key="sach._id">
          <div class="card h-100 book-card">
            <div class="card-body">
              <div class="book-cover mb-3">
                <i class="bi bi-book fs-1 text-primary"></i>
              </div>
              <h5 class="card-title text-truncate" :title="sach.TenSach">
                {{ sach.TenSach }}
              </h5>
              <p class="card-text">
                <small class="text-muted">
                  <i class="bi bi-person"></i>
                  {{ sach.NguonGoc_TacGia || 'Không rõ tác giả' }}
                </small>
              </p>
              <p class="card-text">
                <small class="text-muted">
                  <i class="bi bi-buildings"></i>
                  {{ sach.MaNXB?.TenNXB || 'N/A' }}
                </small>
              </p>
              <p class="card-text">
                <small class="text-muted">
                  <i class="bi bi-cash"></i>
                  {{ formatCurrency(sach.DonGia) }}
                </small>
              </p>
              <p class="card-text">
                <span class="badge" :class="sach.SoQuyen > 0 ? 'bg-success' : 'bg-danger'">
                  {{ sach.SoQuyen > 0 ? `Còn ${sach.SoQuyen} quyển` : 'Hết sách' }}
                </span>
              </p>
              <div class="d-grid">
                <router-link 
                  :to="`/reader/books/${sach._id}`" 
                  class="btn btn-outline-primary btn-sm"
                >
                  <i class="bi bi-eye"></i>
                  Xem chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSachStore } from '@/store/sachStore'
import { sachService } from '@/services/sachService'
import Toast from '@/components/Common/Toast.vue'

const sachStore = useSachStore()
const toastRef = ref(null)
const publishers = ref([])

const searchForm = ref({
  keyword: '',
  MaNXB: ''
})

const results = ref([])
const searching = ref(false)
const searched = ref(false)

onMounted(async () => {
  try {
    // Load publishers for filter
    const response = await sachService.getPublishers()
    publishers.value = response.data || []
  } catch (error) {
    console.error('Error loading publishers:', error)
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0)
}

const handleSearch = async () => {
  // Build search params
  const params = {}
  if (searchForm.value.keyword) params.search = searchForm.value.keyword
  if (searchForm.value.MaNXB) params.MaNXB = searchForm.value.MaNXB

  if (Object.keys(params).length === 0) {
    toastRef.value?.showToast('Vui lòng nhập ít nhất một tiêu chí tìm kiếm', 'warning')
    return
  }

  searching.value = true
  searched.value = false
  
  try {
    const response = await sachService.getAll({ ...params, limit: 100 })
    results.value = response.data || []
    searched.value = true
  } catch (error) {
    console.error('Search error:', error)
    toastRef.value?.showToast('Có lỗi xảy ra khi tìm kiếm', 'error')
    results.value = []
  } finally {
    searching.value = false
  }
}

const handleReset = () => {
  searchForm.value = {
    keyword: '',
    MaNXB: ''
  }
  results.value = []
  searched.value = false
}
</script>

<style scoped>
.book-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.book-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}

.book-cover i {
  color: white;
}
</style>
