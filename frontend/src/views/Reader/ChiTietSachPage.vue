<template>
  <div class="container-fluid">
    <Toast ref="toastRef" />
    <button class="btn btn-outline-secondary mb-4" @click="$router.push('/reader/books')">
      <i class="bi bi-arrow-left"></i>
      Quay lại
    </button>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <SachDetail 
      v-else-if="sach" 
      :sach="sach" 
      :loading="loading"
      :statistics="statistics"
      :related-books="relatedBooks"
      @borrow="handleBorrow" 
      @back="$router.push('/reader/books')"
      @view-related="handleViewRelated"
    />

    <div v-else class="alert alert-warning">
      <i class="bi bi-exclamation-triangle"></i>
      Không tìm thấy thông tin sách
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSachStore } from '@/store/sachStore'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import SachDetail from '@/components/Reader/Sach/SachDetail.vue'
import Toast from '@/components/Common/Toast.vue'

const router = useRouter()
const route = useRoute()
const toastRef = ref(null)
const sachStore = useSachStore()
const theodoimuonsachStore = useTheoDoiMuonSachStore()

const sach = ref(null)
const loading = ref(false)
const statistics = ref(null)
const relatedBooks = ref([])

const fetchSachDetail = async () => {
  const sachId = route.params.id
  if (!sachId) return

  try {
    loading.value = true
    
    // Load book details with populate MaNXB
    const response = await sachStore.fetchSachById(sachId)
    sach.value = response.data
    
    if (sach.value) {
      // Load statistics if needed
      await loadStatistics(sachId)
      
      // Load related books (fetch all first for comparison)
      await loadRelatedBooks(sach.value)
    }
  } catch (error) {
    console.error('Error fetching book details:', error)
    toastRef.value?.showToast('Có lỗi khi tải thông tin sách', 'error')
  } finally {
    loading.value = false
  }
}

const loadStatistics = async (sachId) => {
  try {
    // Load borrow history for statistics
    await theodoimuonsachStore.fetchTheoDoiMuonSachs()
    const borrows = theodoimuonsachStore.theodoimuonsachs.filter(t => t.MaSach === sachId)
    
    statistics.value = {
      totalBorrows: borrows.length,
      borrowRate: borrows.length > 0 ? (borrows.length / 100 * 10) : 0
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
  }
}

const loadRelatedBooks = async (currentSach) => {
  try {
    // Fetch all books to find related ones
    await sachStore.fetchSachs({ limit: 100 })
    
    // Find books with same author or publisher
    const related = sachStore.sachs.filter(s => 
      s._id !== currentSach._id && (
        (s.NguonGoc_TacGia && s.NguonGoc_TacGia === currentSach.NguonGoc_TacGia) ||
        (s.MaNXB?._id && currentSach.MaNXB?._id && s.MaNXB?._id === currentSach.MaNXB?._id)
      )
    ).slice(0, 8) // Limit to 8 books
    
    relatedBooks.value = related
  } catch (error) {
    console.error('Error loading related books:', error)
  }
}

const handleBorrow = (sachData) => {
  router.push({
    name: 'ReaderBorrow',
    query: { sachId: sachData._id }
  })
}

const handleViewRelated = (relatedSach) => {
  router.push(`/reader/books/${relatedSach._id}`)
}

onMounted(fetchSachDetail)
</script>
