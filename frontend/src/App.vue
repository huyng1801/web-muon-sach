<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()

onMounted(() => {
  // Khôi phục trạng thái đăng nhập từ cookie
  authStore.checkAuth()
})

onUnmounted(() => {
  // Cleanup auto-refresh khi app unmount
  authStore.stopAutoRefresh()
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
