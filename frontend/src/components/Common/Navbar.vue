<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <i class="bi bi-book"></i>
        Thư Viện Online
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- Admin/Staff Navigation -->
          <template v-if="authStore.isNhanVien">
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/dashboard">
                <i class="bi bi-speedometer2"></i>
                Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/muonsach">
                <i class="bi bi-journal-check"></i>
                Quản lý mượn sách
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/sach">
                <i class="bi bi-book"></i>
                Quản lý sách
              </router-link>
            </li>
            <li class="nav-item" v-if="authStore.isAdmin">
              <router-link class="nav-link" to="/admin/docgia">
                <i class="bi bi-people"></i>
                Độc giả
              </router-link>
            </li>
          </template>

          <!-- Reader Navigation -->
          <template v-if="authStore.isDocGia">
            <li class="nav-item">
              <router-link class="nav-link" to="/reader/books">
                <i class="bi bi-book"></i>
                Danh sách sách
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/reader/borrow">
                <i class="bi bi-journal-plus"></i>
                Đăng ký mượn
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/reader/history">
                <i class="bi bi-clock-history"></i>
                Lịch sử
              </router-link>
            </li>
          </template>

          <!-- User Menu -->
          <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="userDropdown" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle"></i>
              {{ authStore.user?.HoTenDem || authStore.user?.HoLot }} 
              {{ authStore.user?.Ten }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link 
                  class="dropdown-item" 
                  :to="authStore.isNhanVien ? '/admin/profile' : '/reader/profile'"
                >
                  <i class="bi bi-person"></i>
                  Thông tin cá nhân
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">
                  <i class="bi bi-box-arrow-right"></i>
                  Đăng xuất
                </a>
              </li>
            </ul>
          </li>

          <!-- Guest Links -->
          <template v-if="!authStore.isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="bi bi-box-arrow-in-right"></i>
                Đăng nhập
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">
                <i class="bi bi-person-plus"></i>
                Đăng ký
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link {
  transition: all 0.3s ease;
}

.nav-link:hover {
  transform: translateY(-2px);
}

.nav-link i {
  margin-right: 5px;
}
</style>
