<template>
  <div class="admin-layout">
    <!-- Fixed Navbar -->
    <Navbar />
    
    <div class="layout-container">
      <!-- Fixed Sidebar -->
      <Sidebar />
      
      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <router-view />
        </div>
        <Footer />
      </main>
    </div>
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
  background-color: #f0f2f5;
}

/* Fixed Navbar */
:deep(.navbar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.layout-container {
  display: flex;
  margin-top: 56px;
  flex: 1;
}

/* Fixed Sidebar */
:deep(.sidebar) {
  position: fixed;
  left: 0;
  top: 56px;
  width: 260px;
  height: calc(100vh - 56px);
  overflow-y: auto;
  z-index: 1020;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

:deep(.sidebar.collapsed) {
  width: 80px;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 56px);
}

:deep(.sidebar.collapsed) ~ .main-content {
  margin-left: 80px;
}

.content-wrapper {
  flex: 1;
  padding: 30px 40px;
}

/* Footer always at bottom */
:deep(.footer) {
  margin-top: auto;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
}

/* Scrollbar styling */
:deep(.sidebar)::-webkit-scrollbar {
  width: 6px;
}

:deep(.sidebar)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.sidebar)::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

:deep(.sidebar)::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 992px) {
  :deep(.sidebar) {
    width: 80px;
  }
  
  .main-content {
    margin-left: 80px;
  }
  
  .content-wrapper {
    padding: 20px 25px;
  }
}

@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }
  
  :deep(.sidebar) {
    position: relative;
    top: 0;
    width: 100%;
    height: auto;
    box-shadow: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: 15px 20px;
  }
}
</style>
