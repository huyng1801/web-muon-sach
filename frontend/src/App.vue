<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()

onMounted(() => {
  // Khôi phục trạng thái đăng nhập từ localStorage
  authStore.checkAuth()
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
