<template>
  <div class="nxb-detail">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="nxb" class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-building"></i>
          Chi tiết nhà xuất bản
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <div class="publisher-icon mb-3 text-center">
              <i class="bi bi-building fs-1 text-primary"></i>
            </div>
          </div>

          <div class="col-md-8">
            <h4 class="mb-3">{{ nxb.TenNXB }}</h4>

            <table class="table table-borderless">
              <tbody>
                <!-- <tr>
                  <th width="150">ID:</th>
                  <td><code>{{ nxb._id }}</code></td>
                </tr> -->
                <tr v-if="nxb.DiaChi">
                  <th>Địa chỉ:</th>
                  <td>
                    <i class="bi bi-geo-alt text-muted me-2"></i>
                    {{ nxb.DiaChi }}
                  </td>
                </tr>
                <tr v-if="nxb.createdAt">
                  <th>Ngày tạo:</th>
                  <td>{{ formatDate(nxb.createdAt) }}</td>
                </tr>
                <tr v-if="nxb.updatedAt">
                  <th>Cập nhật:</th>
                  <td>{{ formatDate(nxb.updatedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Thống kê -->
        <div class="row mt-4">
          <div class="col-md-3">
            <div class="stat-card text-center p-3 border rounded">
              <div class="stat-number display-6 text-primary">{{ statistics.totalBooks || 0 }}</div>
              <div class="stat-label text-muted">Tổng sách</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card text-center p-3 border rounded">
              <div class="stat-number display-6 text-success">{{ statistics.availableBooks || 0 }}</div>
              <div class="stat-label text-muted">Sách có sẵn</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card text-center p-3 border rounded">
              <div class="stat-number display-6 text-warning">{{ statistics.borrowedBooks || 0 }}</div>
              <div class="stat-label text-muted">Đang mượn</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card text-center p-3 border rounded">
              <div class="stat-number display-6 text-info">{{ statistics.totalBorrows || 0 }}</div>
              <div class="stat-label text-muted">Lượt mượn</div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="text-end mt-4">
          <button class="btn btn-secondary me-2" @click="$emit('close')">
            <i class="bi bi-arrow-left"></i>
            Quay lại
          </button>
          <button class="btn btn-warning" @click="$emit('edit', nxb)">
            <i class="bi bi-pencil"></i>
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy thông tin nhà xuất bản
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  nxb: {
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
      totalBooks: 0,
      availableBooks: 0,
      borrowedBooks: 0,
      totalBorrows: 0
    })
  },
  books: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'edit'])

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}
</script>

<style scoped>
.nxb-detail .card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.publisher-icon {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.stat-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.stat-number {
  font-weight: bold;
}

.table th {
  border: none;
  font-weight: 600;
  color: #6c757d;
}

.table td {
  border: none;
}
</style>