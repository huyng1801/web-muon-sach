<template>
  <div class="reader-layout">
    <Navbar />
    <main class="main-content">
      <div class="container-fluid py-4">
        <router-view />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Common/Navbar.vue'
import Footer from '@/components/Common/Footer.vue'
</script>

<style scoped>
.reader-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 56px;
  background-color: #f8f9fa;
}
</style>
