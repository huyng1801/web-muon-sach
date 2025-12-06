<template>
  <div class="container-fluid">
    <Toast ref="toastRef" />
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-arrow-return-left"></i> Trả sách</h2>
      <router-link to="/admin/lich-su-muon" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i> Quay lại
      </router-link>
    </div>

    <div class="row">
      <div class="col-md-8 offset-md-2">
        <TraSachForm 
          :record="selectedRecord"
          :submitting="muonSachStore.loading"
          :error="muonSachStore.error"
          @submit="handleReturnBook"
          @cancel="handleCancel"
        />
      </div>
    </div>

    <Loading :show="loading" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import TraSachForm from '@/components/Admin/TheoDoiMuonSach/TraSachForm.vue'
import Loading from '@/components/Common/Loading.vue'
import Toast from '@/components/Common/Toast.vue'

const route = useRoute()
const router = useRouter()
const muonSachStore = useTheoDoiMuonSachStore()
const toastRef = ref(null)

const selectedRecord = ref(null)

const loading = computed(() => muonSachStore.loading)

onMounted(async () => {
  if (route.query.id) {
    try {
      const record = await muonSachStore.fetchMuonSachById(route.query.id)
      selectedRecord.value = record
      console.log('Loaded record:', record) // Debug log
    } catch (error) {
      console.error('Error loading record:', error)
      toastRef.value.showToast(
        error.response?.data?.message || 'Không thể tải thông tin phiếu mượn',
        'error'
      )
    }
  } else {
    toastRef.value.showToast('Không tìm thấy mã phiếu mượn trong URL', 'error')
  }
})

const handleReturnBook = async (data) => {
  if (!data.recordId) {
    toastRef.value.showToast('Không tìm thấy mã phiếu mượn', 'error')
    return
  }
  
  try {
    await muonSachStore.returnBook(data.recordId, data)
    toastRef.value.showToast('Trả sách thành công', 'success')
    router.push('/admin/lich-su-muon')
  } catch (error) {
    console.error('Error returning book:', error)
    toastRef.value.showToast(
      error.response?.data?.message || 'Có lỗi xảy ra khi trả sách', 
      'error'
    )
  }
}

const handleCancel = () => {
  router.push('/admin/lich-su-muon')
}
</script>