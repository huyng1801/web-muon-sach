<template>
  <div class="container-fluid">
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
      <MuonSachForm @created="handleCreated" />
    </div>

    <!-- Borrow History -->
    <div v-if="activeTab === 'history'">
      <LichSuMuon @return="handleShowReturn" />
    </div>

    <!-- Return Book Form -->
    <div v-if="activeTab === 'return'">
      <TraSachForm @returned="handleReturned" />
    </div>

    <Loading :show="muonSachStore.loading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheoDoiMuonSachStore } from '@/store/theodoimuonsachStore'
import MuonSachForm from '@/components/Admin/TheoDoiMuonSach/MuonSachForm.vue'
import LichSuMuon from '@/components/Admin/TheoDoiMuonSach/LichSuMuon.vue'
import TraSachForm from '@/components/Admin/TheoDoiMuonSach/TraSachForm.vue'
import Loading from '@/components/Common/Loading.vue'

const muonSachStore = useTheoDoiMuonSachStore()
const activeTab = ref('new')

onMounted(async () => {
  await muonSachStore.fetchMuonSachs()
})

const handleCreated = () => {
  activeTab.value = 'history'
  muonSachStore.fetchMuonSachs()
}

const handleShowReturn = (record) => {
  activeTab.value = 'return'
}

const handleReturned = () => {
  activeTab.value = 'history'
  muonSachStore.fetchMuonSachs()
}
</script>
