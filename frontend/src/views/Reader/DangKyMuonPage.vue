<template>
  <div class="container-fluid">
    <h2 class="mb-4">
      <i class="bi bi-journal-plus"></i>
      Đăng ký mượn sách
    </h2>

    <DangKyMuonForm @created="handleCreated" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DangKyMuonForm from '@/components/Reader/MuonSach/DangKyMuonForm.vue'

const router = useRouter()

const handleCreated = () => {
  router.push('/reader/history')
}
</script>
