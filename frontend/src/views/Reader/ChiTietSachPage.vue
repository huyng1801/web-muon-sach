<template>
  <div class="container-fluid">
    <button class="btn btn-outline-secondary mb-4" @click="$router.push('/reader/books')">
      <i class="bi bi-arrow-left"></i>
      Quay lại
    </button>

    <SachDetail :sach-id="$route.params.id" />
  </div>
</template>

<script setup>
import SachDetail from '@/components/Reader/Sach/SachDetail.vue'
</script>
