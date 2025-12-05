<template>
  <div class="dashboard-page">
    <h2 class="mb-4">
      <i class="bi bi-speedometer2"></i>
      Dashboard
    </h2>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card stats-card primary">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Tổng sách</h6>
                <h3 class="mb-0">{{ stats.totalBooks || 0 }}</h3>
              </div>
              <i class="bi bi-book fs-1 text-primary"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card stats-card success">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Độc giả</h6>
                <h3 class="mb-0">{{ stats.totalReaders || 0 }}</h3>
              </div>
              <i class="bi bi-people fs-1 text-success"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card stats-card warning">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Đang mượn</h6>
                <h3 class="mb-0">{{ stats.currentBorrows || 0 }}</h3>
              </div>
              <i class="bi bi-journal-check fs-1 text-warning"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card stats-card danger">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Quá hạn</h6>
                <h3 class="mb-0">{{ stats.overdueBooks || 0 }}</h3>
              </div>
              <i class="bi bi-exclamation-triangle fs-1 text-danger"></i>
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
                    <td>{{ request.MaDocGia?.HoTenDem }} {{ request.MaDocGia?.Ten }}</td>
                    <td>{{ request.MaSach?.TenSach }}</td>
                    <td>{{ formatDate(request.createdAt) }}</td>
                    <td>
                      <span class="badge bg-warning">Chờ duyệt</span>
                    </td>
                    <td>
                      <router-link 
                        to="/admin/muonsach" 
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
                      {{ item.MaDocGia?.HoTenDem }} {{ item.MaDocGia?.Ten }}
                    </small>
                  </div>
                  <span class="badge bg-danger">
                    {{ daysOverdue(item.NgayTra) }} ngày
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
    // Fetch statistics
    const statsData = await muonSachStore.fetchStatistics()
    stats.value = statsData

    // Fetch pending requests
    const pending = await muonSachStore.fetchPendingRequests({ limit: 5 })
    pendingRequests.value = pending.muonsachs || []

    // Fetch overdue books
    const overdue = await muonSachStore.fetchOverdueBooks({ limit: 5 })
    overdueList.value = overdue.muonsachs || []
  } catch (error) {
    console.error('Error loading dashboard data:', error)
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
  animation: fadeIn 0.5s;
}

.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
}

.list-group-item {
  border-left: none;
  border-right: none;
}
</style>
