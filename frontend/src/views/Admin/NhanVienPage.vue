<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-person-badge"></i> Quản lý nhân viên</h2>
      <button 
        v-if="currentView === 'list'" 
        class="btn btn-primary" 
        @click="handleAdd"
      >
        <i class="bi bi-plus-circle"></i> Thêm nhân viên
      </button>
      <button 
        v-else 
        class="btn btn-secondary" 
        @click="currentView = 'list'"
      >
        <i class="bi bi-arrow-left"></i> Quay lại
      </button>
    </div>

    <!-- List View -->
    <NhanVienList 
      v-if="currentView === 'list'"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Form View -->
    <NhanVienForm 
      v-else-if="currentView === 'form'"
      :nhanvien="selectedNhanVien"
      @created="handleCreated"
      @updated="handleUpdated"
      @cancel="currentView = 'list'"
    />

    <Loading :show="loading" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NhanVienList from '@/components/Admin/NhanVien/NhanVienList.vue'
import NhanVienForm from '@/components/Admin/NhanVien/NhanVienForm.vue'
import Loading from '@/components/Common/Loading.vue'

const currentView = ref('list')
const selectedNhanVien = ref(null)
const loading = ref(false)

const handleAdd = () => {
  selectedNhanVien.value = null
  currentView.value = 'form'
}

const handleEdit = (nhanvien) => {
  selectedNhanVien.value = nhanvien
  currentView.value = 'form'
}

const handleDelete = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    // TODO: Implement delete with nhanvien store
    alert('Chức năng xóa nhân viên')
  }
}

const handleCreated = () => {
  currentView.value = 'list'
}

const handleUpdated = () => {
  currentView.value = 'list'
}
</script>
