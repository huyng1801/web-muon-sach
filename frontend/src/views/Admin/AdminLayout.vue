<template>
  <div class="admin-layout">
    <Navbar />
    <div class="d-flex">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Common/Navbar.vue'
import Sidebar from '@/components/Common/Sidebar.vue'
import Footer from '@/components/Common/Footer.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  margin-top: 56px;
  padding: 30px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 56px);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 15px;
  }
}
</style>
