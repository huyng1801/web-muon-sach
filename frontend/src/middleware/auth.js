import { useAuthStore } from '@/store/authStore'

// Middleware cho việc kiểm tra quyền truy cập
export function checkAuthRole(requiredRole = null) {
  return {
    mounted() {
      const authStore = useAuthStore()
      
      if (!authStore.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      if (requiredRole === 'nhanvien' && !authStore.isNhanVien) {
        this.$router.push('/401')
        return
      }

      if (requiredRole === 'docgia' && !authStore.isDocGia) {
        this.$router.push('/401')
        return
      }

      if (requiredRole === 'admin' && !authStore.isAdmin) {
        this.$router.push('/401')
        return
      }

      // Fetch user info mới nhất khi vào trang sensitive
      authStore.fetchCurrentUser().catch(console.error)
    }
  }
}

// Composable để sử dụng trong setup
export function useAuthRole(requiredRole = null) {
  const authStore = useAuthStore()
  
  const checkAccess = () => {
    if (!authStore.isAuthenticated) {
      return { hasAccess: false, redirect: '/login' }
    }

    if (requiredRole === 'nhanvien' && !authStore.isNhanVien) {
      return { hasAccess: false, redirect: '/401' }
    }

    if (requiredRole === 'docgia' && !authStore.isDocGia) {
      return { hasAccess: false, redirect: '/401' }
    }

    if (requiredRole === 'admin' && !authStore.isAdmin) {
      return { hasAccess: false, redirect: '/401' }
    }

    return { hasAccess: true }
  }

  return {
    authStore,
    checkAccess,
    fetchCurrentUser: () => authStore.fetchCurrentUser()
  }
}