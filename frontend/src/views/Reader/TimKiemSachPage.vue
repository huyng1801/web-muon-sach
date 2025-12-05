<template>
  <div class="container-fluid">
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
                v-model="searchForm.TenSach"
                placeholder="Nhập tên sách..."
              >
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Tác giả</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="searchForm.TacGia"
                placeholder="Nhập tên tác giả..."
              >
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">ISBN</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="searchForm.ISBN"
                placeholder="Nhập ISBN..."
              >
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Thể loại</label>
              <select class="form-select" v-model="searchForm.TheLoai">
                <option value="">Tất cả</option>
                <option value="Văn học">Văn học</option>
                <option value="Khoa học">Khoa học</option>
                <option value="Công nghệ">Công nghệ</option>
                <option value="Lịch sử">Lịch sử</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Nghệ thuật">Nghệ thuật</option>
                <option value="Tâm lý">Tâm lý</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Năm xuất bản</label>
              <input 
                type="number" 
                class="form-control" 
                v-model="searchForm.NamXuatBan"
                placeholder="Nhập năm..."
                min="1900"
                :max="new Date().getFullYear()"
              >
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
                  {{ sach.TacGia || 'Không rõ tác giả' }}
                </small>
              </p>
              <p class="card-text">
                <small class="text-muted">
                  <i class="bi bi-tag"></i>
                  {{ sach.TheLoai || 'Chưa phân loại' }}
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
import { ref } from 'vue'
import { useSachStore } from '@/store/sachStore'

const sachStore = useSachStore()

const searchForm = ref({
  TenSach: '',
  TacGia: '',
  ISBN: '',
  TheLoai: '',
  NamXuatBan: ''
})

const results = ref([])
const searching = ref(false)
const searched = ref(false)

const handleSearch = async () => {
  // Build search params from non-empty fields
  const params = {}
  if (searchForm.value.TenSach) params.TenSach = searchForm.value.TenSach
  if (searchForm.value.TacGia) params.TacGia = searchForm.value.TacGia
  if (searchForm.value.ISBN) params.ISBN = searchForm.value.ISBN
  if (searchForm.value.TheLoai) params.TheLoai = searchForm.value.TheLoai
  if (searchForm.value.NamXuatBan) params.NamXuatBan = searchForm.value.NamXuatBan

  if (Object.keys(params).length === 0) {
    alert('Vui lòng nhập ít nhất một tiêu chí tìm kiếm')
    return
  }

  searching.value = true
  searched.value = false
  
  try {
    const response = await sachStore.fetchSachs({ ...params, limit: 100 })
    results.value = response.sachs || response || []
    searched.value = true
  } catch (error) {
    alert('Có lỗi xảy ra khi tìm kiếm')
    results.value = []
  } finally {
    searching.value = false
  }
}

const handleReset = () => {
  searchForm.value = {
    TenSach: '',
    TacGia: '',
    ISBN: '',
    TheLoai: '',
    NamXuatBan: ''
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
