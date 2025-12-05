<template>
  <div class="docgia-detail">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="docgia" class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-person-circle"></i>
          Thông tin độc giả
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="text-muted small">Mã độc giả</label>
            <p class="fw-bold">{{ docgia.MaDocGia || 'Chưa có' }}</p>
          </div>
          <div class="col-md-6 mb-3">
            <label class="text-muted small">Họ và tên</label>
            <p class="fw-bold">{{ docgia.HoTenDem }} {{ docgia.Ten }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="text-muted small">Ngày sinh</label>
            <p>{{ formatDate(docgia.NgaySinh) }}</p>
          </div>
          <div class="col-md-6 mb-3">
            <label class="text-muted small">Giới tính</label>
            <p>{{ docgia.Phai || 'Không xác định' }}</p>
          </div>
        </div>

        <div class="mb-3">
          <label class="text-muted small">Địa chỉ</label>
          <p>{{ docgia.DiaChi || 'Chưa cập nhật' }}</p>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="text-muted small">Số điện thoại</label>
            <p>
              <i class="bi bi-telephone"></i>
              {{ docgia.DienThoai }}
            </p>
          </div>
          <div class="col-md-6 mb-3">
            <label class="text-muted small">Email</label>
            <p>
              <i class="bi bi-envelope"></i>
              {{ docgia.Email || 'Chưa có' }}
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="text-muted small">Ngày đăng ký</label>
            <p>{{ formatDateTime(docgia.createdAt) }}</p>
          </div>
          <div class="col-md-6 mb-3">
            <label class="text-muted small">Cập nhật lần cuối</label>
            <p>{{ formatDateTime(docgia.updatedAt) }}</p>
          </div>
        </div>

        <!-- Statistics -->
        <div class="mt-4">
          <h6 class="mb-3">Thống kê mượn sách</h6>
          <div class="row">
            <div class="col-md-4 mb-3">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="text-primary mb-0">{{ statistics.total || 0 }}</h3>
                  <small class="text-muted">Tổng lượt mượn</small>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="text-warning mb-0">{{ statistics.borrowing || 0 }}</h3>
                  <small class="text-muted">Đang mượn</small>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="text-danger mb-0">{{ statistics.overdue || 0 }}</h3>
                  <small class="text-muted">Quá hạn</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-secondary" @click="$emit('close')">
            <i class="bi bi-x-circle"></i>
            Đóng
          </button>
          <button class="btn btn-primary" @click="$emit('edit', docgia)">
            <i class="bi bi-pencil"></i>
            Sửa thông tin
          </button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy thông tin độc giả
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  docgia: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  statistics: {
    type: Object,
    default: () => ({ total: 0, borrowing: 0, overdue: 0 })
  }
})

const emit = defineEmits(['close', 'edit'])

const formatDate = (date) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatDateTime = (date) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleString('vi-VN')
}
</script>

<style scoped>
label.small {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

p {
  margin-bottom: 0;
}
</style>
