import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth/RegisterPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/401',
    name: 'Unauthorized',
    component: () => import('@/views/Error/UnauthorizedPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Error/NotFoundPage.vue')
  },
  // Admin Routes
  {
    path: '/admin',
    component: () => import('@/views/Admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresNhanVien: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/Admin/DashboardPage.vue')
      },
      {
        path: 'docgia',
        name: 'AdminDocGia',
        component: () => import('@/views/Admin/DocGiaPage.vue')
      },
      {
        path: 'sach',
        name: 'AdminSach',
        component: () => import('@/views/Admin/SachPage.vue')
      },
      {
        path: 'nhaxuatban',
        name: 'AdminNhaXuatBan',
        component: () => import('@/views/Admin/NhaXuatBanPage.vue')
      },
      {
        path: 'muonsach',
        name: 'AdminMuonSach',
        component: () => import('@/views/Admin/MuonSachPage.vue')
      },
      {
        path: 'nhanvien',
        name: 'AdminNhanVien',
        component: () => import('@/views/Admin/NhanVienPage.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('@/views/Auth/ProfilePage.vue')
      }
    ]
  },
  // Reader Routes
  {
    path: '/reader',
    component: () => import('@/views/Reader/ReaderLayout.vue'),
    meta: { requiresAuth: true, requiresDocGia: true },
    children: [
      {
        path: '',
        redirect: '/reader/books'
      },
      {
        path: 'books',
        name: 'ReaderBooks',
        component: () => import('@/views/Reader/DanhSachSachPage.vue')
      },
      {
        path: 'books/:id',
        name: 'ReaderBookDetail',
        component: () => import('@/views/Reader/ChiTietSachPage.vue')
      },
      {
        path: 'search',
        name: 'ReaderSearch',
        component: () => import('@/views/Reader/TimKiemSachPage.vue')
      },
      {
        path: 'borrow',
        name: 'ReaderBorrow',
        component: () => import('@/views/Reader/DangKyMuonPage.vue')
      },
      {
        path: 'history',
        name: 'ReaderHistory',
        component: () => import('@/views/Reader/LichSuMuonPage.vue')
      },
      {
        path: 'profile',
        name: 'ReaderProfile',
        component: () => import('@/views/Auth/ProfilePage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Kiểm tra route yêu cầu đăng nhập
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // Kiểm tra route cho khách (đã đăng nhập không được vào)
  if (to.meta.guest && authStore.isAuthenticated) {
    if (authStore.isNhanVien) {
      return next('/admin/dashboard')
    } else {
      return next('/reader/books')
    }
  }

  // Kiểm tra quyền nhân viên
  if (to.meta.requiresNhanVien && !authStore.isNhanVien) {
    return next('/401')
  }

  // Kiểm tra quyền độc giả
  if (to.meta.requiresDocGia && !authStore.isDocGia) {
    return next('/401')
  }

  // Kiểm tra quyền Admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/401')
  }

  next()
})

export default router
