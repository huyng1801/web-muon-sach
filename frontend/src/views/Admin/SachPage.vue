<template>
  <div class="sach-page">
    <h2 class="mb-4">
      <i class="bi bi-book"></i>
      Quản lý Sách
    </h2>

    <Toast ref="toast" />
    <ConfirmModal ref="confirmModal" />

    <!-- List View -->
    <SachList
      v-if="currentView === 'list'"
      :sachs="sachStore.sachs"
      :loading="sachStore.loading"
      :pagination="sachStore.pagination"
      :nhaxuatbans="nhaxuatbans"
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
import Toast from '@/components/Common/Toast.vue'
import ConfirmModal from '@/components/Common/ConfirmModal.vue'

const sachStore = useSachStore()
const nxbStore = useNhaXuatBanStore()

const currentView = ref('list')
const selectedSach = ref(null)
const isEdit = ref(false)
const error = ref(null)
const nhaxuatbans = ref([])
const toast = ref(null)
const confirmModal = ref(null)

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
    const confirmed = await confirmModal.value.show({
      title: 'Xóa sách',
      message: 'Bạn có chắc chắn muốn xóa sách này?',
      type: 'danger',
      confirmText: 'Xóa'
    })

    if (confirmed) {
      await sachStore.deleteSach(id)
      toast.value.showToast('Xóa sách thành công', 'success')
    }
  } catch (err) {
    if (err !== false) {
      toast.value.showToast('Không thể xóa sách: ' + (err.response?.data?.message || err.message), 'error')
    }
  }
}

const handleSearch = async (keyword) => {
  if (keyword.trim()) {
    await sachStore.searchSachs(keyword)
  } else {
    await sachStore.fetchSachs({ page: 1, limit: 10 })
  }
}

const handleFilter = async (nxbName) => {
  // Filter by NXB - fetch all NXBs first to find the ID
  if (nxbName.trim()) {
    const matchedNxb = nhaxuatbans.value.find(nxb => nxb.TenNXB === nxbName)
    if (matchedNxb) {
      await sachStore.fetchSachs({ page: 1, limit: 10, MaNXB: matchedNxb._id })
    }
  } else {
    await sachStore.fetchSachs({ page: 1, limit: 10 })
  }
}

const handlePageChange = async (page) => {
  await sachStore.fetchSachs({ page, limit: 10 })
}

const handleSubmit = async (data) => {
  try {
    error.value = null
    if (isEdit.value) {
      await sachStore.updateSach(selectedSach.value._id, data)
      toast.value.showToast('Cập nhật thông tin sách thành công', 'success')
    } else {
      await sachStore.createSach(data)
      toast.value.showToast('Thêm sách mới thành công', 'success')
    }
    
    // Wait a bit then go back to list
    setTimeout(() => {
      currentView.value = 'list'
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra'
    toast.value.showToast(error.value, 'error')
  }
}
</script>
