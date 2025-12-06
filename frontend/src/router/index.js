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
        redirect: '/admin/lich-su-muon'
      },
      {
        path: 'lich-su-muon',
        name: 'AdminLichSuMuon',
        component: () => import('@/views/Admin/LichSuMuonPage.vue')
      },
      {
        path: 'tra-sach',
        name: 'AdminTraSach',
        component: () => import('@/views/Admin/TraSachPage.vue')
      },
      {
        path: 'muon-sach/:id',
        name: 'AdminChiTietMuonSach',
        component: () => import('@/views/Admin/ChiTietMuonSachPage.vue')
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
      },
      {
        path: 'change-password',
        name: 'AdminChangePassword',
        component: () => import('@/views/Auth/ChangePasswordPage.vue')
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
        path: 'borrow-detail/:id',
        name: 'ReaderBorrowDetail',
        component: () => import('@/views/Reader/BorrowDetailPage.vue')
      },
      {
        path: 'profile',
        name: 'ReaderProfile',
        component: () => import('@/views/Auth/ProfilePage.vue')
      },
      {
        path: 'change-password',
        name: 'ReaderChangePassword',
        component: () => import('@/views/Auth/ChangePasswordPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Đảm bảo checkAuth được gọi trước khi check routes
  if (!authStore.isAuthenticated) {
    const restored = await authStore.checkAuth()
    console.log('Router: Auth check result:', restored, {
      token: authStore.token,
      user: authStore.user,
      role: authStore.userRole
    })
  }

  // Kiểm tra route yêu cầu đăng nhập
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Router: Redirecting to login - not authenticated')
    return next('/login')
  }

  // Kiểm tra route cho khách (đã đăng nhập không được vào)
  if (to.meta.guest && authStore.isAuthenticated) {
    if (authStore.isNhanVien) {
      console.log('Router: Redirecting NhanVien to admin dashboard')
      return next('/admin/dashboard')
    } else {
      console.log('Router: Redirecting DocGia to reader books')
      return next('/reader/books')
    }
  }

  // Kiểm tra quyền nhân viên
  if (to.meta.requiresNhanVien && !authStore.isNhanVien) {
    console.log('Router: Access denied - not NhanVien')
    return next('/401')
  }

  // Kiểm tra quyền độc giả
  if (to.meta.requiresDocGia && !authStore.isDocGia) {
    console.log('Router: Access denied - not DocGia')
    return next('/401')
  }

  // Kiểm tra quyền Admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.log('Router: Access denied - not Admin')
    return next('/401')
  }

  next()
})

export default router
