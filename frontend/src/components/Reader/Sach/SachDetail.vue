<template>
  <div class="reader-sach-detail">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="sach" class="row">
      <!-- Book Cover -->
      <div class="col-md-4">
        <div class="card sticky-top" style="top: 20px;">
          <div class="book-cover-large">
            <i class="bi bi-book fs-1"></i>
          </div>
          <div class="card-body">
            <div class="text-center mb-3">
              <span 
                class="badge fs-6" 
                :class="sach.SoQuyen > 0 ? 'bg-success' : 'bg-danger'"
              >
                {{ sach.SoQuyen > 0 ? `Còn ${sach.SoQuyen} quyển` : 'Hết sách' }}
              </span>
            </div>
            <button 
              class="btn btn-primary w-100 mb-2" 
              @click="$emit('borrow', sach)"
              :disabled="sach.SoQuyen <= 0"
            >
              <i class="bi bi-book"></i>
              {{ sach.SoQuyen > 0 ? 'Đăng ký mượn sách' : 'Hết sách' }}
            </button>
            <button class="btn btn-outline-secondary w-100" @click="$emit('back')">
              <i class="bi bi-arrow-left"></i>
              Quay lại
            </button>
          </div>
        </div>
      </div>

      <!-- Book Info -->
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h2 class="mb-3">{{ sach.TenSach }}</h2>

            <div class="row mb-4">
              <div class="col-md-6">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <th width="150">
                        <i class="bi bi-upc-scan"></i> ISBN
                      </th>
                      <td><code>{{ sach.ISBN }}</code></td>
                    </tr>
                    <tr>
                      <th>
                        <i class="bi bi-person"></i> Tác giả
                      </th>
                      <td>{{ sach.TacGia || 'Không rõ' }}</td>
                    </tr>
                    <tr>
                      <th>
                        <i class="bi bi-tag"></i> Thể loại
                      </th>
                      <td>
                        <span class="badge bg-info">{{ sach.TheLoai || 'Chưa phân loại' }}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <i class="bi bi-building"></i> NXB
                      </th>
                      <td>{{ sach.MaNXB?.TenNXB || 'Không rõ' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-6">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <th width="150">
                        <i class="bi bi-calendar"></i> Năm XB
                      </th>
                      <td>{{ sach.NamXuatBan || 'Không rõ' }}</td>
                    </tr>
                    <tr>
                      <th>
                        <i class="bi bi-file-text"></i> Số trang
                      </th>
                      <td>{{ sach.SoTrang || 'Không rõ' }}</td>
                    </tr>
                    <tr>
                      <th>
                        <i class="bi bi-globe"></i> Ngôn ngữ
                      </th>
                      <td>{{ sach.NgonNgu || 'Không rõ' }}</td>
                    </tr>
                    <tr>
                      <th>
                        <i class="bi bi-cash"></i> Đơn giá
                      </th>
                      <td class="fw-bold text-primary">{{ formatCurrency(sach.DonGia) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="sach.MoTa" class="mb-4">
              <h5>Mô tả</h5>
              <p class="text-muted">{{ sach.MoTa }}</p>
            </div>

            <!-- Statistics -->
            <div v-if="statistics">
              <h5 class="mb-3">Thông tin mượn sách</h5>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <div class="card bg-light">
                    <div class="card-body text-center">
                      <h4 class="text-primary mb-0">{{ statistics.totalBorrows || 0 }}</h4>
                      <small class="text-muted">Lượt mượn</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="card bg-light">
                    <div class="card-body text-center">
                      <h4 class="text-success mb-0">{{ sach.SoQuyen }}</h4>
                      <small class="text-muted">Còn lại</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="card bg-light">
                    <div class="card-body text-center">
                      <h4 class="text-info mb-0">{{ formatPercent(statistics.borrowRate) }}</h4>
                      <small class="text-muted">Phổ biến</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Related Books -->
            <div v-if="relatedBooks && relatedBooks.length > 0" class="mt-4">
              <h5 class="mb-3">Sách liên quan</h5>
              <div class="row">
                <div 
                  v-for="book in relatedBooks" 
                  :key="book._id" 
                  class="col-md-3 mb-3"
                >
                  <div class="card book-card-small" @click="$emit('view-related', book)">
                    <div class="book-cover-small">
                      <i class="bi bi-book"></i>
                    </div>
                    <div class="card-body p-2">
                      <small class="text-truncate d-block" :title="book.TenSach">
                        {{ book.TenSach }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy thông tin sách
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sach: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  statistics: {
    type: Object,
    default: null
  },
  relatedBooks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['borrow', 'back', 'view-related'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0)
}

const formatPercent = (value) => {
  return `${(value || 0).toFixed(1)}%`
}
</script>

<style scoped>
.book-cover-large {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.book-card-small {
  cursor: pointer;
  transition: transform 0.2s;
}

.book-card-small:hover {
  transform: scale(1.05);
}

.book-cover-small {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 2rem;
}
</style>
