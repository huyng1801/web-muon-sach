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


          <!-- Reader Navigation -->
          <template v-if="authStore.isDocGia">
            <li class="nav-item">
              <router-link class="nav-link" to="/reader/books">
                <i class="bi bi-book"></i>
                Danh sách sách
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
              {{ displayName }}
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
              <li v-if="authStore.isNhanVien">
                <router-link 
                  class="dropdown-item" 
                  to="/admin/change-password"
                >
                  <i class="bi bi-lock"></i>
                  Đổi mật khẩu
                </router-link>
              </li>
              <li v-if="authStore.isDocGia">
                <router-link 
                  class="dropdown-item" 
                  to="/reader/change-password"
                >
                  <i class="bi bi-lock"></i>
                  Đổi mật khẩu
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
import { watch, computed } from 'vue'

const authStore = useAuthStore()

// Computed properties for displaying user name
const displayName = computed(() => {
  if (!authStore.user) return ''
  
  if (authStore.isNhanVien) {
    return authStore.user?.HoTenNV || 'Nhân viên'
  } else {
    const fullName = (authStore.user?.HoLot || '') + ' ' + (authStore.user?.Ten || '')
    return fullName.trim() || 'Độc giả'
  }
})

// Debug reactive changes
watch(() => authStore.user, (newUser) => {
  console.log('Navbar: User changed:', newUser)
}, { deep: true })

watch(() => authStore.isAuthenticated, (newAuth) => {
  console.log('Navbar: Auth status changed:', newAuth)
})

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  border-bottom: 2px solid #0a58ca;
}

.navbar-brand {
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
  padding: 10px 20px;
}

.navbar-brand i {
  margin-right: 8px;
}

.nav-link {
  transition: all 0.3s ease;
  padding: 10px 15px !important;
  border-radius: 4px;
  margin: 0 3px;
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.nav-link i {
  margin-right: 6px;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
}

.dropdown-item {
  padding: 10px 20px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f0f2f5;
  color: #0d6efd;
}

.dropdown-item i {
  margin-right: 8px;
  width: 20px;
}

.navbar-toggler {
  border: none;
  padding: 5px 15px;
}

.navbar-toggler:focus {
  box-shadow: none;
}
</style>
