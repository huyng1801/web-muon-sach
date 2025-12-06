<template>
  <div class="container-fluid">
    <Toast ref="toastRef" />
    <h2 class="mb-4">
      <i class="bi bi-book"></i>
      Danh sách sách
    </h2>

    <SachList 
      :sachs="sachStore.sachs || []"
      :loading="sachStore.loading"
      :pagination="sachStore.pagination"
      :publishers="publishers"
      @view="handleViewBook"
      @borrow="handleBorrowBook"
      @search="handleSearch"
      @filter="handleFilter"
      @sort="handleSort"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSachStore } from '@/store/sachStore'
import SachList from '@/components/Reader/Sach/SachList.vue'
import Toast from '@/components/Common/Toast.vue'
import { sachService } from '@/services/sachService'

const router = useRouter()
const sachStore = useSachStore()
const toastRef = ref(null)
const publishers = ref([])

onMounted(async () => {
  try {
    // Load books
    await sachStore.fetchSachs()
    
    // Load publishers for filter
    await loadPublishers()
  } catch (error) {
    console.error('Error loading books:', error)
    toastRef.value?.showToast('Có lỗi khi tải danh sách sách', 'error')
  }
})

const loadPublishers = async () => {
  try {
    const response = await sachService.getPublishers()
    publishers.value = response.data.data || []
  } catch (error) {
    console.error('Error loading publishers:', error)
    publishers.value = []
  }
}

const handleViewBook = (book) => {
  router.push(`/reader/books/${book._id}`)
}

const handleBorrowBook = (book) => {
  if (book.SoQuyen <= 0) {
    toastRef.value?.showToast('Sách này hiện tại đã hết', 'warning')
    return
  }
  router.push({
    name: 'ReaderBorrow',
    query: { sachId: book._id }
  })
}

const handleSearch = async (keyword) => {
  try {
    await sachStore.fetchSachs({ search: keyword })
  } catch (error) {
    console.error('Error searching books:', error)
    toastRef.value?.showToast('Có lỗi khi tìm kiếm', 'error')
  }
}

const handleFilter = async (publisherId) => {
  try {
    await sachStore.fetchSachs({ MaNXB: publisherId })
  } catch (error) {
    console.error('Error filtering books:', error)
    toastRef.value?.showToast('Có lỗi khi lọc sách', 'error')
  }
}

const handleSort = async (sortBy) => {
  try {
    const sortParams = {}
    if (sortBy === 'newest') {
      sortParams.sortBy = '-NgayThem'
    } else if (sortBy === 'oldest') {
      sortParams.sortBy = 'NgayThem'
    } else if (sortBy === 'name') {
      sortParams.sortBy = 'TenSach'
    }
    await sachStore.fetchSachs(sortParams)
  } catch (error) {
    console.error('Error sorting books:', error)
    toastRef.value?.showToast('Có lỗi khi sắp xếp', 'error')
  }
}

const handlePageChange = async (page) => {
  try {
    await sachStore.fetchSachs({ page })
  } catch (error) {
    console.error('Error changing page:', error)
    toastRef.value?.showToast('Có lỗi khi chuyển trang', 'error')
  }
}
</script>
