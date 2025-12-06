<template>
  <div class="nhan-vien-page">
    <h2 class="mb-4">
      <i class="bi bi-person-badge"></i>
      Quản lý Nhân Viên
    </h2>

    <Toast ref="toast" />
    <ConfirmModal ref="confirmModal" />

    <!-- List View -->
    <NhanVienList
      v-if="currentView === 'list'"
      :nhanviens="nhanvienStore.nhanviens"
      :loading="nhanvienStore.loading"
      :pagination="nhanvienStore.pagination"
      @add="handleAdd"
      @edit="handleEdit"
      @view="handleView"
      @delete="handleDelete"
      @search="handleSearch"
      @page-change="handlePageChange"
    />

    <!-- Form View -->
    <NhanVienForm
      v-else-if="currentView === 'form'"
      :nhanvien="selectedNhanVien"
      :is-edit="isEdit"
      :submitting="nhanvienStore.loading"
      :error="error"
      @submit="handleSubmit"
      @cancel="currentView = 'list'"
    />

    <!-- Detail View -->
    <NhanVienDetail
      v-else-if="currentView === 'detail'"
      :nhanvien="selectedNhanVien"
      :loading="nhanvienStore.loading"
      @close="currentView = 'list'"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNhanVienStore } from '@/store/nhanvienStore'
import NhanVienList from '@/components/Admin/NhanVien/NhanVienList.vue'
import NhanVienForm from '@/components/Admin/NhanVien/NhanVienForm.vue'
import NhanVienDetail from '@/components/Admin/NhanVien/NhanVienDetail.vue'
import Toast from '@/components/Common/Toast.vue'
import ConfirmModal from '@/components/Common/ConfirmModal.vue'

const nhanvienStore = useNhanVienStore()

const currentView = ref('list')
const selectedNhanVien = ref(null)
const isEdit = ref(false)
const error = ref(null)
const toast = ref(null)
const confirmModal = ref(null)

onMounted(async () => {
  await nhanvienStore.fetchNhanViens({ page: 1, limit: 10 })
})

const handleAdd = () => {
  selectedNhanVien.value = null
  isEdit.value = false
  currentView.value = 'form'
  error.value = null
}

const handleEdit = (nhanvien) => {
  selectedNhanVien.value = nhanvien
  isEdit.value = true
  currentView.value = 'form'
  error.value = null
}

const handleView = (nhanvien) => {
  selectedNhanVien.value = nhanvien
  currentView.value = 'detail'
}

const handleDelete = async (id) => {
  try {
    const confirmed = await confirmModal.value.show({
      title: 'Xóa nhân viên',
      message: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      type: 'danger',
      confirmText: 'Xóa'
    })

    if (confirmed) {
      await nhanvienStore.deleteNhanVien(id)
      toast.value.showToast('Xóa nhân viên thành công', 'success')
    }
  } catch (err) {
    if (err !== false) {
      toast.value.showToast('Không thể xóa nhân viên: ' + (err.response?.data?.message || err.message), 'error')
    }
  }
}

const handleSearch = async (keyword) => {
  if (keyword.trim()) {
    await nhanvienStore.searchNhanVien(keyword)
  } else {
    await nhanvienStore.fetchNhanViens({ page: 1, limit: 10 })
  }
}

const handlePageChange = async (page) => {
  await nhanvienStore.fetchNhanViens({ page, limit: 10 })
}

const handleSubmit = async (data) => {
  try {
    error.value = null
    if (isEdit.value) {
      await nhanvienStore.updateNhanVien(selectedNhanVien.value._id, data)
      toast.value.showToast('Cập nhật thông tin nhân viên thành công', 'success')
    } else {
      await nhanvienStore.createNhanVien(data)
      toast.value.showToast('Thêm nhân viên mới thành công', 'success')
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
