<template>
  <div class="sach-page">
    <h2 class="mb-4">
      <i class="bi bi-book"></i>
      Quản lý Sách
    </h2>

    <!-- List View -->
    <SachList
      v-if="currentView === 'list'"
      :sachs="sachStore.sachs"
      :loading="sachStore.loading"
      :pagination="sachStore.pagination"
      @add="handleAdd"
      @edit="handleEdit"
      @view="handleView"
      @delete="handleDelete"
      @search="handleSearch"
      @filter="handleFilter"
      @page-change="handlePageChange"
    />

    <!-- Form View -->
    <SachForm
      v-else-if="currentView === 'form'"
      :sach="selectedSach"
      :is-edit="isEdit"
      :nhaxuatbans="nhaxuatbans"
      :submitting="sachStore.loading"
      :error="error"
      @submit="handleSubmit"
      @cancel="currentView = 'list'"
    />

    <!-- Detail View -->
    <SachDetail
      v-else-if="currentView === 'detail'"
      :sach="selectedSach"
      :loading="sachStore.loading"
      :statistics="statistics"
      @close="currentView = 'list'"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSachStore } from '@/store/sachStore'
import { useNhaXuatBanStore } from '@/store/nhaxuatbanStore'
import SachList from '@/components/Admin/Sach/SachList.vue'
import SachForm from '@/components/Admin/Sach/SachForm.vue'
import SachDetail from '@/components/Admin/Sach/SachDetail.vue'

const sachStore = useSachStore()
const nxbStore = useNhaXuatBanStore()

const currentView = ref('list')
const selectedSach = ref(null)
const isEdit = ref(false)
const error = ref(null)
const nhaxuatbans = ref([])

const statistics = computed(() => {
  if (!selectedSach.value) return {}
  return {
    totalBorrows: 25,
    currentBorrows: 5,
    borrowRate: 12.5
  }
})

onMounted(async () => {
  await sachStore.fetchSachs({ page: 1, limit: 10 })
  await nxbStore.fetchNhaXuatBans({ page: 1, limit: 100 })
  nhaxuatbans.value = nxbStore.nhaxuatbans
})

const handleAdd = () => {
  selectedSach.value = null
  isEdit.value = false
  currentView.value = 'form'
  error.value = null
}

const handleEdit = (sach) => {
  selectedSach.value = sach
  isEdit.value = true
  currentView.value = 'form'
  error.value = null
}

const handleView = (sach) => {
  selectedSach.value = sach
  currentView.value = 'detail'
}

const handleDelete = async (id) => {
  try {
    await sachStore.deleteSach(id)
  } catch (err) {
    alert('Không thể xóa sách: ' + err.message)
  }
}

const handleSearch = async (keyword) => {
  if (keyword.trim()) {
    await sachStore.searchSachs(keyword)
  } else {
    await sachStore.fetchSachs({ page: 1, limit: 10 })
  }
}

const handleFilter = async (category) => {
  // TODO: Implement filter by category
  await sachStore.fetchSachs({ page: 1, limit: 10, category })
}

const handlePageChange = async (page) => {
  await sachStore.fetchSachs({ page, limit: 10 })
}

const handleSubmit = async (data) => {
  try {
    error.value = null
    if (isEdit.value) {
      await sachStore.updateSach(selectedSach.value._id, data)
    } else {
      await sachStore.createSach(data)
    }
    currentView.value = 'list'
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra'
  }
}
</script>
