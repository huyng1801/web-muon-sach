<template>
  <div class="container-fluid">
    <ConfirmModal ref="confirmModalRef" />
    <RejectModal ref="rejectModalRef" />
    <Toast ref="toastRef" />
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-clock-history"></i> Quản lý mượn sách</h2>
    </div>

    <div class="alert alert-info mb-4">
      <i class="bi bi-info-circle"></i>
      <strong>Lưu ý:</strong> Độc giả sẽ tạo yêu cầu mượn sách. Bạn có thể xem chi tiết, duyệt yêu cầu và xử lý trả sách.
    </div>

    <LichSuMuon 
      :records="safeRecords"
      :docgias="docgiaStore.docgias || []"
      :loading="muonSachStore.loading"
      :pagination="muonSachStore.pagination"
      @filter="handleFilter"
      @approve-request="handleApproveRequest"
      @reject-request="handleRejectRequest"
      @return-book="handleReturnBook"
      @view-detail="handleViewDetail"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import { useDocGiaStore } from '@/store/docgiaStore'
import LichSuMuon from '@/components/Admin/TheoDoiMuonSach/LichSuMuon.vue'
import ConfirmModal from '@/components/Common/ConfirmModal.vue'
import RejectModal from '@/components/Common/RejectModal.vue'
import Toast from '@/components/Common/Toast.vue'

const router = useRouter()
const muonSachStore = useTheoDoiMuonSachStore()
const docgiaStore = useDocGiaStore()
const confirmModalRef = ref(null)
const rejectModalRef = ref(null)
const toastRef = ref(null)

const safeRecords = computed(() => {
  return Array.isArray(muonSachStore.muonsachs) ? muonSachStore.muonsachs : []
})

onMounted(async () => {
  try {
    await Promise.all([
      muonSachStore.fetchMuonSachs(),
      docgiaStore.fetchDocGias()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

const handleApproveRequest = async (record) => {
  await confirmModalRef.value.show({
    title: 'Duyệt yêu cầu mượn sách',
    message: `Duyệt yêu cầu mượn sách "${record.MaSach?.TenSach}" của ${record.MaDocGia?.HoLot} ${record.MaDocGia?.Ten}?`,
    type: 'warning',
    confirmText: 'Duyệt yêu cầu'
  })
    .then(async () => {
      try {
        await muonSachStore.approveMuonSach(record._id, {
          TrangThai: 'Đang mượn',
          NgayMuon: new Date().toISOString(),
          GhiChu: 'Đã duyệt bởi admin'
        })
        await muonSachStore.fetchMuonSachs()
        toastRef.value.showToast('Duyệt yêu cầu thành công', 'success')
      } catch (error) {
        console.error('Error approving request:', error)
        toastRef.value.showToast('Có lỗi xảy ra khi duyệt yêu cầu', 'error')
      }
    })
    .catch(() => {
      // Modal closed without action
    })
}

const handleRejectRequest = async (record) => {
  try {
    const reason = await rejectModalRef.value.show({
      record: record
    })
    
    await muonSachStore.rejectMuonSach(record._id, {
      GhiChu: reason
    })
    await muonSachStore.fetchMuonSachs()
    toastRef.value.showToast('Từ chối yêu cầu thành công', 'success')
  } catch (error) {
    console.error('Error rejecting request:', error)
    if (error && error.response?.data?.message) {
      toastRef.value.showToast(error.response.data.message, 'error')
    } else if (error !== 'cancelled') {
      toastRef.value.showToast('Có lỗi xảy ra khi từ chối yêu cầu', 'error')
    }
  }
}

const handleFilter = async (filterData) => {
  try {
    // Reset to page 1 when filtering
    const params = {
      page: 1
    }
    
    // Add status filter
    if (filterData.status) {
      params.TrangThai = filterData.status
    }
    
    // Add docgia filter
    if (filterData.docgia) {
      params.MaDocGia = filterData.docgia
    }
    
    await muonSachStore.fetchMuonSachs(params)
  } catch (error) {
    console.error('Error filtering records:', error)
    toastRef.value?.showToast('Có lỗi khi lọc dữ liệu', 'error')
  }
}

const handlePageChange = async (page) => {
  try {
    await muonSachStore.fetchMuonSachs({ page })
  } catch (error) {
    console.error('Error changing page:', error)
  }
}

const handleReturnBook = (record) => {
  router.push({
    name: 'AdminTraSach',
    query: { id: record._id }
  })
}

const handleViewDetail = (record) => {
  router.push(`/admin/muon-sach/${record._id}`)
}
</script>