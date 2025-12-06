<template>
  <div class="container-fluid">
    <Toast ref="toastRef" />
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-book"></i> Theo dõi mượn sách</h2>
    </div>

    <!-- Nav tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a 
          class="nav-link" 
          :class="{ active: activeTab === 'new' }"
          @click="activeTab = 'new'"
          style="cursor: pointer"
        >
          <i class="bi bi-plus-circle"></i> Tạo phiếu mượn
        </a>
      </li>
      <li class="nav-item">
        <a 
          class="nav-link" 
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
          style="cursor: pointer"
        >
          <i class="bi bi-clock-history"></i> Lịch sử
        </a>
      </li>
      <li class="nav-item">
        <a 
          class="nav-link" 
          :class="{ active: activeTab === 'return' }"
          @click="activeTab = 'return'"
          style="cursor: pointer"
        >
          <i class="bi bi-arrow-return-left"></i> Trả sách
        </a>
      </li>
    </ul>

    <!-- Create New Borrow Form -->
    <div v-if="activeTab === 'new'">
      <MuonSachForm 
        :docgias="docgiaStore.docgias"
        :sachs="sachStore.sachs"
        :nhanviens="nhanvienStore.nhanviens"
        :submitting="muonSachStore.loading"
        :error="muonSachStore.error"
        @submit="handleCreateMuonSach"
        @cancel="resetActiveTab"
      />
    </div>

    <!-- Borrow History -->
    <div v-if="activeTab === 'history'">
      <LichSuMuon 
        :records="muonSachStore.muonsachs"
        :docgias="docgiaStore.docgias"
        :loading="muonSachStore.loading"
        :pagination="muonSachStore.pagination"
        @filter="handleFilter"
        @return-book="handleShowReturn"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Return Book Form -->
    <div v-if="activeTab === 'return'">
      <TraSachForm 
        :record="selectedRecord"
        :submitting="muonSachStore.loading"
        :error="muonSachStore.error"
        @submit="handleReturnBook"
        @cancel="resetActiveTab"
      />
    </div>

    <Loading :show="muonSachStore.loading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import { useDocGiaStore } from '@/store/docgiaStore'
import { useSachStore } from '@/store/sachStore'
import { useNhanVienStore } from '@/store/nhanvienStore'
import MuonSachForm from '@/components/Admin/TheoDoiMuonSach/MuonSachForm.vue'
import LichSuMuon from '@/components/Admin/TheoDoiMuonSach/LichSuMuon.vue'
import TraSachForm from '@/components/Admin/TheoDoiMuonSach/TraSachForm.vue'
import Loading from '@/components/Common/Loading.vue'
import Toast from '@/components/Common/Toast.vue'

const muonSachStore = useTheoDoiMuonSachStore()
const docgiaStore = useDocGiaStore()
const sachStore = useSachStore()
const nhanvienStore = useNhanVienStore()
const toastRef = ref(null)
const activeTab = ref('new')
const selectedRecord = ref(null)

onMounted(async () => {
  await Promise.all([
    muonSachStore.fetchMuonSachs(),
    docgiaStore.fetchDocGias(),
    sachStore.fetchSachs(),
    nhanvienStore.fetchNhanViens()
  ])
})

const handleCreateMuonSach = async (data) => {
  try {
    await muonSachStore.createMuonSach(data)
    toastRef.value?.showToast('Tạo phiếu mượn thành công', 'success')
    activeTab.value = 'history'
    await muonSachStore.fetchMuonSachs()
  } catch (error) {
    console.error('Error creating borrow record:', error)
    toastRef.value?.showToast(
      error.response?.data?.message || 'Có lỗi xảy ra khi tạo phiếu mượn',
      'error'
    )
  }
}

const resetActiveTab = () => {
  activeTab.value = 'history'
}

const handleFilter = async (filterData) => {
  try {
    await muonSachStore.fetchMuonSachs(filterData)
  } catch (error) {
    console.error('Error filtering records:', error)
  }
}

const handlePageChange = async (page) => {
  try {
    await muonSachStore.fetchMuonSachs({ page })
  } catch (error) {
    console.error('Error changing page:', error)
  }
}

const handleShowReturn = (record) => {
  activeTab.value = 'return'
}

const handleReturned = () => {
  activeTab.value = 'history'
  muonSachStore.fetchMuonSachs()
}
</script>
