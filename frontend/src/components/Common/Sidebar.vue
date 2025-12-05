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
          <router-link to="/admin/muonsach" class="sidebar-link">
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
  min-height: 100vh;
  width: 250px;
  position: fixed;
  top: 56px;
  left: 0;
  padding: 20px 0;
  transition: width 0.3s ease;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
}

.sidebar-header button {
  padding: 5px;
  text-decoration: none;
}

.sidebar-menu {
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  list-style: none;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  border-left: 4px solid #fff;
}

.sidebar-link i {
  font-size: 1.2rem;
  min-width: 30px;
}

.sidebar-link span {
  margin-left: 10px;
}

.collapsed .sidebar-link span {
  display: none;
}
</style>
