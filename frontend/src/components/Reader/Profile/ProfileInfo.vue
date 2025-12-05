<template>
  <div class="profile-info">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-person-circle"></i>
          Thông tin cá nhân
        </h5>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="docgia">
          <div class="row">
            <!-- Avatar Section -->
            <div class="col-md-4 text-center mb-4">
              <div class="avatar-large mb-3">
                <i class="bi bi-person-circle fs-1"></i>
              </div>
              <h5>{{ docgia.HoLot }} {{ docgia.Ten }}</h5>
              <p class="text-muted">
                <code>{{ docgia.MaDocGia }}</code>
              </p>
              <span 
                class="badge" 
                :class="docgia.isActive ? 'bg-success' : 'bg-danger'"
              >
                {{ docgia.isActive ? 'Tài khoản đang hoạt động' : 'Tài khoản bị khóa' }}
              </span>
            </div>

            <!-- Info Section -->
            <div class="col-md-8">
              <h6 class="mb-3">Thông tin chi tiết</h6>
              <table class="table table-borderless">
                <tbody>
                  <tr>
                    <th width="150">
                      <i class="bi bi-person"></i> Họ và tên
                    </th>
                    <td>{{ docgia.HoLot }} {{ docgia.Ten }}</td>
                  </tr>
                  <tr>
                    <th>
                      <i class="bi bi-calendar"></i> Ngày sinh
                    </th>
                    <td>{{ formatDate(docgia.NgaySinh) }}</td>
                  </tr>
                  <tr>
                    <th>
                      <i class="bi bi-gender-ambiguous"></i> Giới tính
                    </th>
                    <td>{{ docgia.Phai === 'Nam' ? 'Nam' : 'Nữ' }}</td>
                  </tr>
                  <tr>
                    <th>
                      <i class="bi bi-telephone"></i> Điện thoại
                    </th>
                    <td>{{ docgia.DienThoai || 'Chưa có' }}</td>
                  </tr>
                  <tr>
                    <th>
                      <i class="bi bi-envelope"></i> Email
                    </th>
                    <td>{{ docgia.Email }}</td>
                  </tr>
                  <tr>
                    <th>
                      <i class="bi bi-geo-alt"></i> Địa chỉ
                    </th>
                    <td>{{ docgia.DiaChi || 'Chưa có' }}</td>
                  </tr>
                  <tr>
                    <th>
                      <i class="bi bi-calendar-check"></i> Ngày lập thẻ
                    </th>
                    <td>{{ formatDate(docgia.NgayLapThe) }}</td>
                  </tr>
                  <tr v-if="docgia.NgayHetHan">
                    <th>
                      <i class="bi bi-calendar-x"></i> Ngày hết hạn
                    </th>
                    <td>
                      {{ formatDate(docgia.NgayHetHan) }}
                      <span v-if="isExpired" class="badge bg-danger ms-2">Đã hết hạn</span>
                      <span v-else-if="isNearExpiry" class="badge bg-warning ms-2">Sắp hết hạn</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="mt-4">
                <button class="btn btn-primary me-2" @click="$emit('edit')">
                  <i class="bi bi-pencil"></i>
                  Cập nhật thông tin
                </button>
                <button class="btn btn-outline-secondary" @click="$emit('change-password')">
                  <i class="bi bi-key"></i>
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div v-if="statistics" class="mt-4">
            <h6 class="mb-3">Thống kê hoạt động</h6>
            <div class="row">
              <div class="col-md-3 mb-3">
                <div class="card bg-light">
                  <div class="card-body text-center">
                    <h3 class="text-primary mb-0">{{ statistics.totalBorrows || 0 }}</h3>
                    <small class="text-muted">Tổng lượt mượn</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card bg-light">
                  <div class="card-body text-center">
                    <h3 class="text-warning mb-0">{{ statistics.currentBorrows || 0 }}</h3>
                    <small class="text-muted">Đang mượn</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card bg-light">
                  <div class="card-body text-center">
                    <h3 class="text-success mb-0">{{ statistics.returnedBorrows || 0 }}</h3>
                    <small class="text-muted">Đã trả</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="card bg-light">
                  <div class="card-body text-center">
                    <h3 class="text-danger mb-0">{{ statistics.overdueBorrows || 0 }}</h3>
                    <small class="text-muted">Quá hạn</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="alert alert-warning">
          Không tìm thấy thông tin độc giả
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
    default: () => ({ 
      totalBorrows: 0, 
      currentBorrows: 0, 
      returnedBorrows: 0,
      overdueBorrows: 0
    })
  }
})

const emit = defineEmits(['edit', 'change-password'])

const isExpired = computed(() => {
  if (!props.docgia?.NgayHetHan) return false
  return new Date(props.docgia.NgayHetHan) < new Date()
})

const isNearExpiry = computed(() => {
  if (!props.docgia?.NgayHetHan || isExpired.value) return false
  const daysUntilExpiry = Math.ceil((new Date(props.docgia.NgayHetHan) - new Date()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry <= 30
})

const formatDate = (date) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleDateString('vi-VN')
}
</script>

<style scoped>
.avatar-large {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: white;
}
</style>
