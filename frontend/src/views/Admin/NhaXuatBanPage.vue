<template>
  <div class="nxb-page">
    <h2 class="mb-4">
      <i class="bi bi-building"></i>
      Quản lý Nhà Xuất Bản
    </h2>

    <Toast ref="toast" />
    <ConfirmModal ref="confirmModal" />

    <!-- List View -->
    <NhaXuatBanList
      v-if="currentView === 'list'"
      :nhaxuatbans="nxbStore.nhaxuatbans"
      :loading="nxbStore.loading"
      :pagination="pagination"
      @add="handleAdd"
      @edit="handleEdit"
      @view="handleView"
      @delete="handleDelete"
      @search="handleSearch"
      @page-change="handlePageChange"
    />

    <!-- Form View -->
    <NhaXuatBanForm
      v-else-if="currentView === 'form'"
      :nxb="selectedNXB"
      :is-edit="isEdit"
      :submitting="nxbStore.loading"
      :error="error"
      @submit="handleSubmit"
      @cancel="currentView = 'list'"
    />

    <!-- Detail View -->
    <NhaXuatBanDetail
      v-else-if="currentView === 'detail'"
      :nxb="selectedNXB"
      :loading="nxbStore.loading"
      :statistics="statistics"
      :books="books"
      @close="currentView = 'list'"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNhaXuatBanStore } from '@/store/nhaxuatbanStore'
import NhaXuatBanList from '@/components/Admin/NhaXuatBan/NhaXuatBanList.vue'
import NhaXuatBanForm from '@/components/Admin/NhaXuatBan/NhaXuatBanForm.vue'
import NhaXuatBanDetail from '@/components/Admin/NhaXuatBan/NhaXuatBanDetail.vue'
import Toast from '@/components/Common/Toast.vue'
import ConfirmModal from '@/components/Common/ConfirmModal.vue'

const nxbStore = useNhaXuatBanStore()

const currentView = ref('list')
const selectedNXB = ref(null)
const isEdit = ref(false)
const error = ref(null)
const currentPage = ref(1)
const books = ref([])
const toast = ref(null)
const confirmModal = ref(null)

const pagination = computed(() => nxbStore.pagination)

const statistics = computed(() => {
  if (!selectedNXB.value) return {}
  return {
    totalBooks: books.value.length,
    availableBooks: books.value.filter(b => b.SoQuyen > 0).length,
    borrowedBooks: 0,
    totalBorrows: 0
  }
})

onMounted(async () => {
  await nxbStore.fetchNhaXuatBans({ page: 1, limit: 10 })
})

const handleAdd = () => {
  selectedNXB.value = null
  isEdit.value = false
  currentView.value = 'form'
  error.value = null
}

const handleEdit = (nxb) => {
  selectedNXB.value = nxb
  isEdit.value = true
  currentView.value = 'form'
  error.value = null
}

const handleView = async (nxb) => {
  selectedNXB.value = nxb
  currentView.value = 'detail'
  // TODO: Fetch books by NXB
  books.value = []
}

const handleDelete = async (id) => {
  try {
    const confirmed = await confirmModal.value.show({
      title: 'Xóa nhà xuất bản',
      message: 'Bạn có chắc chắn muốn xóa nhà xuất bản này?',
      type: 'danger',
      confirmText: 'Xóa'
    })

    if (confirmed) {
      await nxbStore.deleteNXB(id)
      toast.value.showToast('Xóa nhà xuất bản thành công', 'success')
    }
  } catch (err) {
    if (err !== false) {
      toast.value.showToast('Không thể xóa nhà xuất bản: ' + (err.response?.data?.message || err.message), 'error')
    }
  }
}

const handleSearch = async (keyword) => {
  if (keyword.trim()) {
    await nxbStore.fetchNhaXuatBans({ search: keyword, page: 1, limit: 10 })
  } else {
    await nxbStore.fetchNhaXuatBans({ page: 1, limit: 10 })
  }
  currentPage.value = 1
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await nxbStore.fetchNhaXuatBans({ page, limit: 10 })
}

const handleSubmit = async (data) => {
  try {
    error.value = null
    if (isEdit.value) {
      await nxbStore.updateNXB(selectedNXB.value._id, data)
      toast.value.showToast('Cập nhật nhà xuất bản thành công', 'success')
    } else {
      await nxbStore.createNXB(data)
      toast.value.showToast('Thêm nhà xuất bản mới thành công', 'success')
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
