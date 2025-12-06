<template>
  <div class="sidebar bg-dark text-white" :class="{ 'collapsed': collapsed }">
    <div class="sidebar-header">
      <button class="btn btn-link text-white" @click="toggleSidebar">
        <i class="bi" :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
      <span v-if="!collapsed" class="ms-2">Menu</span>
    </div>

    <ul class="sidebar-menu list-unstyled">
      <!-- Admin/Staff Menu -->
      <template v-if="authStore.isNhanVien">
        <li>
          <router-link to="/admin/dashboard" class="sidebar-link">
            <i class="bi bi-speedometer2"></i>
            <span v-if="!collapsed">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/lich-su-muon" class="sidebar-link">
            <i class="bi bi-journal-check"></i>
            <span v-if="!collapsed">Quản lý mượn sách</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/sach" class="sidebar-link">
            <i class="bi bi-book"></i>
            <span v-if="!collapsed">Quản lý sách</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/nhaxuatban" class="sidebar-link">
            <i class="bi bi-building"></i>
            <span v-if="!collapsed">Nhà xuất bản</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/docgia" class="sidebar-link">
            <i class="bi bi-people"></i>
            <span v-if="!collapsed">Độc giả</span>
          </router-link>
        </li>
        <li v-if="authStore.isAdmin">
          <router-link to="/admin/nhanvien" class="sidebar-link">
            <i class="bi bi-person-badge"></i>
            <span v-if="!collapsed">Nhân viên</span>
          </router-link>
        </li>
      </template>

      <!-- Reader Menu -->
      <template v-if="authStore.isDocGia">
        <li>
          <router-link to="/reader/books" class="sidebar-link">
            <i class="bi bi-book"></i>
            <span v-if="!collapsed">Danh sách sách</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reader/borrow" class="sidebar-link">
            <i class="bi bi-journal-plus"></i>
            <span v-if="!collapsed">Đăng ký mượn</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reader/history" class="sidebar-link">
            <i class="bi bi-clock-history"></i>
            <span v-if="!collapsed">Lịch sử mượn</span>
          </router-link>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const collapsed = ref(false)

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  overflow-y: auto;
  padding: 0;
  transition: width 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0;
}

.sidebar-header button {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  cursor: pointer;
}

.sidebar-header button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-header span {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  padding: 15px 0;
  margin: 0;
}

.sidebar-menu li {
  list-style: none;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  margin: 2px 0;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-left-color: rgba(255, 255, 255, 0.3);
}

.sidebar-link.router-link-active {
  background-color: rgba(52, 149, 219, 0.3);
  color: #3495db;
  border-left-color: #3495db;
  font-weight: 600;
}

.sidebar-link i {
  font-size: 1.1rem;
  min-width: 28px;
  text-align: center;
  transition: all 0.2s ease;
}

.sidebar-link span {
  margin-left: 12px;
  flex: 1;
}

.sidebar.collapsed .sidebar-link span {
  display: none;
}

.sidebar.collapsed .sidebar-link {
  justify-content: center;
  padding: 12px;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
