<template>
  <div class="nhan-vien-detail">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="nhanvien" class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-person-badge"></i>
          Chi tiết nhân viên
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <div class="nhanvien-avatar mb-3 text-center">
              <i class="bi bi-person-circle fs-1 text-primary"></i>
            </div>
          </div>

          <div class="col-md-8">
            <h4 class="mb-3">{{ nhanvien.HoTenNV }}</h4>

            <table class="table table-borderless">
              <tbody>
                <tr>
                  <th width="150">Chức vụ:</th>
                  <td>
                    <span class="badge bg-info">{{ nhanvien.Chucvu }}</span>
                  </td>
                </tr>
                <tr>
                  <th>Điện thoại:</th>
                  <td>{{ nhanvien.SoDienThoai || 'Không rõ' }}</td>
                </tr>
                <tr>
                  <th>Địa chỉ:</th>
                  <td>{{ nhanvien.DiaChi || 'Không rõ' }}</td>
                </tr>
                <tr>
                  <th>Ngày tham gia:</th>
                  <td>{{ formatDate(nhanvien.NgayThamGia) }}</td>
                </tr>
                <tr v-if="nhanvien.updatedAt">
                  <th>Cập nhật:</th>
                  <td>{{ formatDateTime(nhanvien.updatedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-secondary" @click="$emit('close')">
            <i class="bi bi-x-circle"></i>
            Đóng
          </button>
          <button class="btn btn-primary" @click="$emit('edit', nhanvien)">
            <i class="bi bi-pencil"></i>
            Sửa thông tin
          </button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy thông tin nhân viên
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  nhanvien: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
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
.nhanvien-avatar {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}
</style>
