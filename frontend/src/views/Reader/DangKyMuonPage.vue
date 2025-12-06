<template>
  <div class="container-fluid">
    <Toast ref="toastRef" />
    <h2 class="mb-4">
      <i class="bi bi-journal-plus"></i>
      Đăng ký mượn sách
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="selectedSach">
      <DangKyMuonForm 
        :sach="selectedSach"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="$router.push('/reader/books')"
      />
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy sách cần mượn
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSachStore } from '@/store/sachStore'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import DangKyMuonForm from '@/components/Reader/MuonSach/DangKyMuonForm.vue'
import Toast from '@/components/Common/Toast.vue'

const router = useRouter()
const route = useRoute()
const sachStore = useSachStore()
const muonSachStore = useTheoDoiMuonSachStore()
const toastRef = ref(null)
const loading = ref(false)
const submitting = ref(false)
const selectedSach = ref(null)

onMounted(async () => {
  const sachId = route.query.sachId
  if (sachId) {
    loading.value = true
    try {
      // Load sách từ store
      if (!sachStore.sachs || sachStore.sachs.length === 0) {
        await sachStore.fetchSachs()
      }
      selectedSach.value = sachStore.sachs.find(s => s._id === sachId)
      if (!selectedSach.value) {
        toastRef.value?.showToast('Không tìm thấy sách', 'error')
        setTimeout(() => router.push('/reader/books'), 1500)
      }
    } catch (error) {
      console.error('Error loading book:', error)
      toastRef.value?.showToast('Có lỗi khi tải thông tin sách', 'error')
      setTimeout(() => router.push('/reader/books'), 1500)
    } finally {
      loading.value = false
    }
  } else {
    toastRef.value?.showToast('Vui lòng chọn sách cần mượn', 'warning')
    setTimeout(() => router.push('/reader/books'), 1500)
  }
})

const handleSubmit = async (data) => {
  submitting.value = true
  try {
    // Tạo yêu cầu mượn sách
    await muonSachStore.createMuonSach({
      MaSach: data.MaSach,
      NgayMuon: new Date().toISOString(),
      NgayHenTra: new Date(data.NgayHenTra).toISOString(),
      GhiChu: data.GhiChu || '',
      TrangThai: 'Chờ duyệt'
    })
    
    toastRef.value?.showToast('Đăng ký mượn sách thành công! Vui lòng chờ duyệt.', 'success')
    setTimeout(() => {
      router.push('/reader/history')
    }, 1500)
  } catch (error) {
    console.error('Error submitting borrow request:', error)
    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký mượn sách'
    toastRef.value?.showToast(errorMessage, 'error')
  } finally {
    submitting.value = false
  }
}
</script>
