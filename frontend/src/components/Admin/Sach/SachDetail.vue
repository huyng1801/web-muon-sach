<template>
  <div class="sach-detail">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="sach" class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-book"></i>
          Chi tiết sách
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Book Cover -->
          <div class="col-md-4">
            <div class="book-cover mb-3">
              <i class="bi bi-book fs-1"></i>
            </div>
            <div class="text-center">
              <span 
                class="badge" 
                :class="sach.SoQuyen > 0 ? 'bg-success' : 'bg-danger'"
              >
                {{ sach.SoQuyen > 0 ? `Còn ${sach.SoQuyen} quyển` : 'Hết sách' }}
              </span>
            </div>
          </div>

          <!-- Book Info -->
          <div class="col-md-8">
            <h4 class="mb-3">{{ sach.TenSach }}</h4>

            <table class="table table-borderless">
              <tbody>
                <tr>
                  <th width="150">ISBN</th>
                  <td>{{ sach.ISBN }}</td>
                </tr>
                <tr>
                  <th>Tác giả</th>
                  <td>{{ sach.TacGia || 'Không rõ' }}</td>
                </tr>
                <tr>
                  <th>Thể loại</th>
                  <td>
                    <span class="badge bg-info">{{ sach.TheLoai || 'Chưa phân loại' }}</span>
                  </td>
                </tr>
                <tr>
                  <th>Nhà xuất bản</th>
                  <td>{{ sach.MaNXB?.TenNXB || 'Không rõ' }}</td>
                </tr>
                <tr>
                  <th>Năm xuất bản</th>
                  <td>{{ sach.NamXuatBan || 'Không rõ' }}</td>
                </tr>
                <tr>
                  <th>Số trang</th>
                  <td>{{ sach.SoTrang || 'Không rõ' }}</td>
                </tr>
                <tr>
                  <th>Ngôn ngữ</th>
                  <td>{{ sach.NgonNgu || 'Không rõ' }}</td>
                </tr>
                <tr>
                  <th>Số lượng</th>
                  <td>{{ sach.SoQuyen }} quyển</td>
                </tr>
                <tr>
                  <th>Đơn giá</th>
                  <td class="fw-bold text-primary">{{ formatCurrency(sach.DonGia) }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="sach.MoTa" class="mt-3">
              <h6>Mô tả:</h6>
              <p class="text-muted">{{ sach.MoTa }}</p>
            </div>

            <div class="mt-3">
              <small class="text-muted">
                Cập nhật lần cuối: {{ formatDateTime(sach.updatedAt) }}
              </small>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="mt-4">
          <h6 class="mb-3">Thống kê mượn sách</h6>
          <div class="row">
            <div class="col-md-3 mb-3">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="text-primary mb-0">{{ statistics.totalBorrows || 0 }}</h3>
                  <small class="text-muted">Tổng lượt mượn</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="text-warning mb-0">{{ statistics.currentBorrows || 0 }}</h3>
                  <small class="text-muted">Đang mượn</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="text-success mb-0">{{ sach.SoQuyen }}</h3>
                  <small class="text-muted">Còn lại</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="text-info mb-0">{{ formatPercent(statistics.borrowRate) }}</h3>
                  <small class="text-muted">Tỷ lệ mượn</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-secondary" @click="$emit('close')">
            <i class="bi bi-x-circle"></i>
            Đóng
          </button>
          <button class="btn btn-primary" @click="$emit('edit', sach)">
            <i class="bi bi-pencil"></i>
            Sửa thông tin
          </button>
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
    default: () => ({ 
      totalBorrows: 0, 
      currentBorrows: 0, 
      borrowRate: 0 
    })
  }
})

const emit = defineEmits(['close', 'edit'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0)
}

const formatDateTime = (date) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleString('vi-VN')
}

const formatPercent = (value) => {
  return `${(value || 0).toFixed(1)}%`
}
</script>

<style scoped>
.book-cover {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}
</style>
