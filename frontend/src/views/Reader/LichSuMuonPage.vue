<template>
  <div class="container-fluid">
    <Toast ref="toastRef" />
    <h2 class="mb-4">
      <i class="bi bi-clock-history"></i>
      Lịch sử mượn sách
    </h2>

    <LichSuMuon 
      :records="muonSachStore.myBorrows || []"
      :loading="muonSachStore.loading"
      :pagination="muonSachStore.pagination"
      :summary="summary"
      @filter="handleFilter"
      @page-change="handlePageChange"
      @view-detail="handleViewDetail"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import LichSuMuon from '@/components/Reader/MuonSach/LichSuMuon.vue'
import Toast from '@/components/Common/Toast.vue'

const router = useRouter()
const muonSachStore = useTheoDoiMuonSachStore()
const toastRef = ref(null)

const summary = computed(() => {
  const records = Array.isArray(muonSachStore.myBorrows) ? muonSachStore.myBorrows : []
  return {
    total: records.length,
    borrowing: records.filter(r => r.TrangThai === 'Đang mượn').length,
    returned: records.filter(r => r.TrangThai === 'Đã trả').length,
    pending: records.filter(r => r.TrangThai === 'Chờ duyệt').length,
    rejected: records.filter(r => r.TrangThai === 'Từ chối').length,
    overdue: records.filter(r => {
      if (r.TrangThai !== 'Đang mượn') return false
      return new Date() > new Date(r.NgayHenTra)
    }).length
  }
})

onMounted(async () => {
  try {
    await muonSachStore.fetchMyHistory()
  } catch (error) {
    console.error('Error loading history:', error)
    toastRef.value?.showToast('Có lỗi khi tải lịch sử mượn sách', 'error')
  }
})

const handleFilter = async (filterData) => {
  try {
    await muonSachStore.fetchMyHistory(filterData)
  } catch (error) {
    console.error('Error filtering history:', error)
    toastRef.value?.showToast('Có lỗi khi lọc dữ liệu', 'error')
  }
}

const handlePageChange = async (page) => {
  try {
    await muonSachStore.fetchMyHistory({ page })
  } catch (error) {
    console.error('Error changing page:', error)
    toastRef.value?.showToast('Có lỗi khi chuyển trang', 'error')
  }
}

const handleViewDetail = (record) => {
  // Navigate to detail view or show modal
  router.push(`/reader/borrow-detail/${record._id}`)
}
</script>
