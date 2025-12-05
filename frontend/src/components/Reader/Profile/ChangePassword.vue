<template>
  <div class="change-password">
    <div class="card">
      <div class="card-header bg-warning text-dark">
        <h5 class="mb-0">
          <i class="bi bi-key"></i>
          Đổi mật khẩu
        </h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Mật khẩu hiện tại <span class="text-danger">*</span></label>
            <div class="input-group">
              <input 
                :type="showCurrentPassword ? 'text' : 'password'" 
                class="form-control" 
                v-model="formData.currentPassword"
                required
                placeholder="Nhập mật khẩu hiện tại"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Mật khẩu mới <span class="text-danger">*</span></label>
            <div class="input-group">
              <input 
                :type="showNewPassword ? 'text' : 'password'" 
                class="form-control" 
                v-model="formData.newPassword"
                required
                minlength="6"
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="showNewPassword = !showNewPassword"
              >
                <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div class="mt-2">
              <small :class="passwordStrengthClass">
                <i class="bi" :class="passwordStrengthIcon"></i>
                {{ passwordStrengthText }}
              </small>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Xác nhận mật khẩu mới <span class="text-danger">*</span></label>
            <div class="input-group">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                class="form-control" 
                v-model="formData.confirmPassword"
                required
                placeholder="Nhập lại mật khẩu mới"
                :class="{ 'is-invalid': formData.confirmPassword && !passwordsMatch }"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
              <div v-if="formData.confirmPassword && !passwordsMatch" class="invalid-feedback">
                Mật khẩu xác nhận không khớp
              </div>
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="alert alert-info">
            <h6 class="alert-heading">Yêu cầu mật khẩu:</h6>
            <ul class="mb-0 small">
              <li :class="{ 'text-success': formData.newPassword.length >= 6 }">
                Tối thiểu 6 ký tự
              </li>
              <li :class="{ 'text-success': hasUpperCase }">
                Có ít nhất 1 chữ hoa
              </li>
              <li :class="{ 'text-success': hasLowerCase }">
                Có ít nhất 1 chữ thường
              </li>
              <li :class="{ 'text-success': hasNumber }">
                Có ít nhất 1 số
              </li>
            </ul>
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div v-if="success" class="alert alert-success">
            {{ success }}
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
              <i class="bi bi-x-circle"></i>
              Hủy
            </button>
            <button 
              type="submit" 
              class="btn btn-warning" 
              :disabled="submitting || !passwordsMatch || !isPasswordStrong"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-check-circle"></i>
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  submitting: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  success: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordsMatch = computed(() => {
  return formData.value.newPassword === formData.value.confirmPassword
})

const hasUpperCase = computed(() => {
  return /[A-Z]/.test(formData.value.newPassword)
})

const hasLowerCase = computed(() => {
  return /[a-z]/.test(formData.value.newPassword)
})

const hasNumber = computed(() => {
  return /[0-9]/.test(formData.value.newPassword)
})

const isPasswordStrong = computed(() => {
  return formData.value.newPassword.length >= 6 && 
         hasUpperCase.value && 
         hasLowerCase.value && 
         hasNumber.value
})

const passwordStrength = computed(() => {
  let strength = 0
  if (formData.value.newPassword.length >= 6) strength++
  if (hasUpperCase.value) strength++
  if (hasLowerCase.value) strength++
  if (hasNumber.value) strength++
  if (formData.value.newPassword.length >= 10) strength++
  return strength
})

const passwordStrengthText = computed(() => {
  if (!formData.value.newPassword) return 'Chưa nhập mật khẩu'
  if (passwordStrength.value <= 1) return 'Mật khẩu yếu'
  if (passwordStrength.value <= 3) return 'Mật khẩu trung bình'
  return 'Mật khẩu mạnh'
})

const passwordStrengthClass = computed(() => {
  if (!formData.value.newPassword) return 'text-muted'
  if (passwordStrength.value <= 1) return 'text-danger'
  if (passwordStrength.value <= 3) return 'text-warning'
  return 'text-success'
})

const passwordStrengthIcon = computed(() => {
  if (!formData.value.newPassword) return 'bi-info-circle'
  if (passwordStrength.value <= 1) return 'bi-x-circle'
  if (passwordStrength.value <= 3) return 'bi-exclamation-circle'
  return 'bi-check-circle'
})

const handleSubmit = () => {
  if (!passwordsMatch.value || !isPasswordStrong.value) return
  emit('submit', {
    currentPassword: formData.value.currentPassword,
    newPassword: formData.value.newPassword
  })
}
</script>
