<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header mb-5">
      <h1>
        <i class="bi bi-speedometer2"></i>
        Dashboard
      </h1>
      <p class="text-muted">Tổng quan thống kê hệ thống quản lý thư viện</p>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-5">
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card stats-card">
          <div class="card-body">
            <div class="stat-icon primary">
              <i class="bi bi-book"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">Tổng sách</p>
              <h3 class="stat-value">{{ stats.totalBooks || 0 }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card stats-card">
          <div class="card-body">
            <div class="stat-icon success">
              <i class="bi bi-people"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">Độc giả</p>
              <h3 class="stat-value">{{ stats.totalReaders || 0 }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card stats-card">
          <div class="card-body">
            <div class="stat-icon warning">
              <i class="bi bi-journal-check"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">Đang mượn</p>
              <h3 class="stat-value">{{ stats.currentBorrows || 0 }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card stats-card">
          <div class="card-body">
            <div class="stat-icon danger">
              <i class="bi bi-exclamation-circle"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">Quá hạn</p>
              <h3 class="stat-value">{{ stats.overdueBooks || 0 }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts & Recent Activities -->
    <div class="row">
      <div class="col-md-8 mb-4">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Yêu cầu mượn sách gần đây</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else-if="pendingRequests.length === 0" class="text-center py-5 text-muted">
              <i class="bi bi-inbox fs-1"></i>
              <p class="mt-2">Không có yêu cầu mới</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Độc giả</th>
                    <th>Sách</th>
                    <th>Ngày yêu cầu</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="request in pendingRequests" :key="request._id">
                    <td>{{ request.MaDocGia?.HoLot }} {{ request.MaDocGia?.Ten }}</td>
                    <td>{{ request.MaSach?.TenSach }}</td>
                    <td>{{ formatDate(request.createdAt) }}</td>
                    <td>
                      <span class="badge bg-warning">Chờ duyệt</span>
                    </td>
                    <td>
                      <router-link 
                        to="/admin/lich-su-muon" 
                        class="btn btn-sm btn-primary"
                      >
                        Xem
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0">Sách quá hạn</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-danger"></div>
            </div>
            <div v-else-if="overdueList.length === 0" class="text-center py-5 text-muted">
              <i class="bi bi-check-circle fs-1"></i>
              <p class="mt-2">Không có sách quá hạn</p>
            </div>
            <ul v-else class="list-group list-group-flush">
              <li 
                v-for="item in overdueList" 
                :key="item._id" 
                class="list-group-item"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>{{ item.MaSach?.TenSach }}</strong>
                    <br>
                    <small class="text-muted">
                      {{ item.MaDocGia?.HoLot }} {{ item.MaDocGia?.Ten }}
                    </small>
                  </div>
                  <span class="badge bg-danger">
                    {{ daysOverdue(item.NgayHenTra) }} ngày
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <Loading :show="loading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import Loading from '@/components/Common/Loading.vue'

const muonSachStore = useTheoDoiMuonSachStore()

const stats = ref({
  totalBooks: 0,
  totalReaders: 0,
  currentBorrows: 0,
  overdueBooks: 0
})

const pendingRequests = ref([])
const overdueList = ref([])
const loading = ref(false)

onMounted(async () => {
  await loadDashboardData()
})

const loadDashboardData = async () => {
  loading.value = true
  try {
    // Fetch basic statistics from muonsachs data
    await muonSachStore.fetchMuonSachs({ limit: 100 })
    const allRecords = muonSachStore.muonsachs || []
    
    // Calculate stats manually
    stats.value = {
      totalBooks: allRecords.length,
      currentBorrows: allRecords.filter(r => !r.NgayTra).length,
      overdueBooks: allRecords.filter(r => {
        if (r.NgayTra) return false
        const today = new Date()
        const dueDate = new Date(r.NgayHenTra)
        return today > dueDate
      }).length,
      totalReaders: [...new Set(allRecords.map(r => r.MaDocGia?._id))].filter(Boolean).length
    }

    // Get pending requests (those without NgayTra)
    pendingRequests.value = allRecords.filter(r => !r.NgayTra).slice(0, 5)
    
    // Get overdue items
    overdueList.value = allRecords.filter(r => {
      if (r.NgayTra) return false
      const today = new Date()
      const dueDate = new Date(r.NgayHenTra)
      return today > dueDate
    }).slice(0, 10)

    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Set default values on error
    stats.value = {
      totalBooks: 0,
      totalReaders: 0,
      currentBorrows: 0,
      overdueBooks: 0
    }
    pendingRequests.value = []
    overdueList.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

const daysOverdue = (dueDate) => {
  if (!dueDate) return 0
  const today = new Date()
  const due = new Date(dueDate)
  const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}
</script>

<style scoped>
.dashboard-page {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 20px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 1rem;
  margin: 0;
}

.stats-card {
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stats-card .card-body {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.stat-icon.primary {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.05));
  color: #0d6efd;
}

.stat-icon.success {
  background: linear-gradient(135deg, rgba(25, 135, 84, 0.1), rgba(25, 135, 84, 0.05));
  color: #198754;
}

.stat-icon.warning {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
  color: #ffc107;
}

.stat-icon.danger {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05));
  color: #dc3545;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.list-group-item {
  border: none;
  border-bottom: 1px solid #e9ecef;
  padding: 15px 0;
}

.list-group-item:last-child {
  border-bottom: none;
}

.card {
  margin-bottom: 0;
}
</style>
