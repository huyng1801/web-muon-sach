<template>
  <div class="docgia-page">
    <h2 class="mb-4">
      <i class="bi bi-people"></i>
      Quản lý Độc Giả
    </h2>

    <!-- List View -->
    <DocGiaList
      v-if="currentView === 'list'"
      :docgias="docgiaStore.docgias"
      :loading="docgiaStore.loading"
      :pagination="pagination"
      @add="handleAdd"
      @edit="handleEdit"
      @view="handleView"
      @delete="handleDelete"
      @search="handleSearch"
      @page-change="handlePageChange"
    />

    <!-- Form View -->
    <DocGiaForm
      v-else-if="currentView === 'form'"
      :docgia="selectedDocGia"
      :is-edit="isEdit"
      :submitting="docgiaStore.loading"
      :error="error"
      @submit="handleSubmit"
      @cancel="currentView = 'list'"
    />

    <!-- Detail View -->
    <DocGiaDetail
      v-else-if="currentView === 'detail'"
      :docgia="selectedDocGia"
      :loading="docgiaStore.loading"
      :statistics="statistics"
      @close="currentView = 'list'"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDocGiaStore } from '@/store/docgiaStore'
import DocGiaList from '@/components/Admin/DocGia/DocGiaList.vue'
import DocGiaForm from '@/components/Admin/DocGia/DocGiaForm.vue'
import DocGiaDetail from '@/components/Admin/DocGia/DocGiaDetail.vue'

const docgiaStore = useDocGiaStore()
const currentView = ref('list') // 'list', 'form', 'detail'
const selectedDocGia = ref(null)
const isEdit = ref(false)
const error = ref(null)
const currentPage = ref(1)

const pagination = computed(() => docgiaStore.pagination)

const statistics = computed(() => {
  if (!selectedDocGia.value) return {}
  // TODO: Fetch real statistics from API
  return {
    totalBorrows: 15,
    currentBorrows: 2,
    returnedBorrows: 13,
    overdueBorrows: 0
  }
})

onMounted(async () => {
  await docgiaStore.fetchDocGias({ page: 1, limit: 10 })
})

const handleAdd = () => {
  selectedDocGia.value = null
  isEdit.value = false
  currentView.value = 'form'
  error.value = null
}

const handleEdit = (docgia) => {
  selectedDocGia.value = docgia
  isEdit.value = true
  currentView.value = 'form'
  error.value = null
}

const handleView = (docgia) => {
  selectedDocGia.value = docgia
  currentView.value = 'detail'
}

const handleDelete = async (id) => {
  try {
    await docgiaStore.deleteDocGia(id)
  } catch (err) {
    alert('Không thể xóa độc giả: ' + err.message)
  }
}

const handleSearch = async (keyword) => {
  if (keyword.trim()) {
    await docgiaStore.searchDocGias(keyword)
  } else {
    await docgiaStore.fetchDocGias({ page: 1, limit: 10 })
  }
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await docgiaStore.fetchDocGias({ page, limit: 10 })
}

const handleSubmit = async (data) => {
  try {
    error.value = null
    if (isEdit.value) {
      await docgiaStore.updateDocGia(selectedDocGia.value._id, data)
    } else {
      await docgiaStore.createDocGia(data)
    }
    currentView.value = 'list'
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra'
  }
}
</script>
