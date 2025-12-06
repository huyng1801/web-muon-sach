<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-info-circle"></i> Chi tiết phiếu mượn</h2>
      <router-link to="/admin/lich-su-muon" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i> Quay lại
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="record" class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="bi bi-journal-text"></i>
              Thông tin phiếu mượn
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <th width="150">Mã phiếu:</th>
                      <td><code>{{ record.MaPhieu || (record._id ? record._id.slice(-6) : 'N/A') }}</code></td>
                    </tr>
                    <tr>
                      <th>Ngày tạo:</th>
                      <td>{{ formatDateTime(record.createdAt) }}</td>
                    </tr>
                    <tr>
                      <th>Ngày mượn:</th>
                      <td>{{ formatDate(record.NgayMuon) }}</td>
                    </tr>
                    <tr>
                      <th>Ngày hẹn trả:</th>
                      <td>{{ formatDate(record.NgayHenTra) }}</td>
                    </tr>
                    <tr v-if="record.NgayTra">
                      <th>Ngày trả thực:</th>
                      <td>{{ formatDate(record.NgayTra) }}</td>
                    </tr>
                    <tr>
                      <th>Trạng thái:</th>
                      <td>
                        <span class="badge" :class="getStatusBadgeClass(record)">
                          {{ getStatusText(record) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="record.TinhTrangSach">
                      <th>Tình trạng sách:</th>
                      <td>
                        <span class="badge" :class="getConditionBadgeClass(record.TinhTrangSach)">
                          {{ getConditionText(record.TinhTrangSach) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="record.MaNhanVien">
                      <th>Nhân viên xử lý:</th>
                      <td>{{ record.MaNhanVien.HoTenNV || 'N/A' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-6">
                <div v-if="isOverdue" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle"></i>
                  <strong>Quá hạn {{ daysOverdue }} ngày!</strong>
                </div>
                <div v-else-if="!record.NgayTra" class="alert alert-success">
                  <i class="bi bi-check-circle"></i>
                  Còn {{ daysUntilDue }} ngày để trả
                </div>
                <div v-else class="alert alert-info">
                  <i class="bi bi-check-circle-fill"></i>
                  Đã hoàn thành
                </div>
                
                <div v-if="record.TienPhat > 0" class="alert alert-warning">
                  <strong>Tiền phạt: {{ formatCurrency(record.TienPhat) }}</strong>
                </div>
                
                <div v-if="record.GhiChu" class="mt-3">
                  <h6>Ghi chú:</h6>
                  <p class="text-muted">{{ record.GhiChu }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <!-- Thông tin độc giả -->
        <div class="card mb-3">
          <div class="card-header bg-primary text-white">
            <h6 class="mb-0">
              <i class="bi bi-person"></i>
              Thông tin độc giả
            </h6>
          </div>
          <div class="card-body">
            <div class="text-center mb-3">
              <i class="bi bi-person-circle fs-1 text-muted"></i>
            </div>
            <table class="table table-borderless table-sm">
              <tbody>
                <tr>
                  <th>Họ tên:</th>
                  <td>{{ record.MaDocGia?.HoLot }} {{ record.MaDocGia?.Ten }}</td>
                </tr>
               
                <tr>
                  <th>Email:</th>
                  <td>{{ record.MaDocGia?.Email }}</td>
                </tr>
                <tr>
                  <th>SĐT:</th>
                  <td>{{ record.MaDocGia?.DienThoai }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Thông tin sách -->
        <div class="card mb-3">
          <div class="card-header bg-success text-white">
            <h6 class="mb-0">
              <i class="bi bi-book"></i>
              Thông tin sách
            </h6>
          </div>
          <div class="card-body">
            <div class="text-center mb-3">
              <i class="bi bi-book fs-1 text-muted"></i>
            </div>
            <table class="table table-borderless table-sm">
              <tbody>
                <tr>
                  <th>Tên sách:</th>
                  <td>{{ record.MaSach?.TenSach }}</td>
                </tr>
                <tr>
                  <th>ISBN:</th>
                  <td><code>{{ record.MaSach?.ISBN }}</code></td>
                </tr>
                <tr>
                  <th>Tác giả:</th>
                  <td>{{ record.MaSach?.NguonGoc_TacGia }}</td>
                </tr>
                <tr>
                  <th>NXB:</th>
                  <td>{{ record.MaSach?.MaNXB?.TenNXB }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Actions -->
        <div class="card" v-if="!record.NgayTra">
          <div class="card-header">
            <h6 class="mb-0">Thao tác</h6>
          </div>
          <div class="card-body">
            <router-link 
              :to="{ name: 'AdminTraSach', query: { id: record._id } }" 
              class="btn btn-success w-100 mb-2"
            >
              <i class="bi bi-arrow-return-left"></i>
              Trả sách
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy thông tin phiếu mượn
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'

const route = useRoute()
const router = useRouter()
const muonSachStore = useTheoDoiMuonSachStore()

const record = ref(null)
const loading = ref(false)

onMounted(async () => {
  const id = route.params.id
  if (id) {
    loading.value = true
    try {
      record.value = await muonSachStore.fetchMuonSachById(id)
    } catch (error) {
      console.error('Error loading record:', error)
    } finally {
      loading.value = false
    }
  }
})

const isOverdue = computed(() => {
  if (!record.value || record.value.NgayTra) return false
  const today = new Date()
  const dueDate = new Date(record.value.NgayHenTra)
  return today > dueDate
})

const daysOverdue = computed(() => {
  if (!isOverdue.value) return 0
  const today = new Date()
  const dueDate = new Date(record.value.NgayHenTra)
  return Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24))
})

const daysUntilDue = computed(() => {
  if (!record.value || record.value.NgayTra) return 0
  const today = new Date()
  const dueDate = new Date(record.value.NgayHenTra)
  const days = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('vi-VN')
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0)
}

const getStatusText = (record) => {
  if (record.NgayTra) return 'Đã trả'
  if (isOverdue.value) return 'Quá hạn'
  return 'Đang mượn'
}

const getStatusBadgeClass = (record) => {
  if (record.NgayTra) return 'bg-success'
  if (isOverdue.value) return 'bg-danger'
  return 'bg-warning'
}

const getConditionText = (condition) => {
  const conditions = {
    'good': 'Tốt',
    'normal': 'Bình thường', 
    'damaged': 'Hư hỏng',
    'lost': 'Mất sách'
  }
  return conditions[condition] || condition
}

const getConditionBadgeClass = (condition) => {
  const classes = {
    'good': 'bg-success',
    'normal': 'bg-info',
    'damaged': 'bg-warning', 
    'lost': 'bg-danger'
  }
  return classes[condition] || 'bg-secondary'
}
</script>