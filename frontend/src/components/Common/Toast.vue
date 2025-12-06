<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 11; top: 60px !important;">

    <transition-group name="toast-fade">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast show"
        role="alert"
        :class="`toast-${toast.type}`"
      >
        <div class="toast-body d-flex align-items-center">
          <i :class="`bi bi-${getIcon(toast.type)} me-2 fs-5`"></i>
          <span class="flex-grow-1">{{ toast.message }}</span>
          <button 
            type="button" 
            class="btn-close ms-2" 
            @click="removeToast(toast.id)"
          ></button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

const getIcon = (type) => {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  }
  return icons[type] || 'info-circle'
}

const getTitle = (type) => {
  const titles = {
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
    info: 'Thông tin'
  }
  return titles[type] || 'Thông báo'
}

const showToast = (message, type = 'info', duration = 3000) => {
  const id = nextId++
  const toast = { id, message, type }
  toasts.value.push(toast)

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

defineExpose({
  showToast,
  removeToast
})
</script>

<style scoped>
.toast {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin-bottom: 12px;
}

.toast-success {
  background-color: #d4edda;
  border-left: 4px solid #28a745;
}

.toast-success .toast-header {
  background-color: #c3e6cb;
  color: #155724;
  border-bottom: 1px solid #b1dfbb;
}

.toast-success .toast-body {
  color: #155724;
}

.toast-error {
  background-color: #f8d7da;
  border-left: 4px solid #dc3545;
}

.toast-error .toast-header {
  background-color: #f5c6cb;
  color: #721c24;
  border-bottom: 1px solid #f1b0b7;
}

.toast-error .toast-body {
  color: #721c24;
}

.toast-warning {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
}

.toast-warning .toast-header {
  background-color: #ffeeba;
  color: #856404;
  border-bottom: 1px solid #ffe69c;
}

.toast-warning .toast-body {
  color: #856404;
}

.toast-info {
  background-color: #d1ecf1;
  border-left: 4px solid #17a2b8;
}

.toast-info .toast-header {
  background-color: #bee5eb;
  color: #0c5460;
  border-bottom: 1px solid #abdde5;
}

.toast-info .toast-body {
  color: #0c5460;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.btn-close {
  filter: brightness(0) saturate(100%) invert(40%) sepia(8%) saturate(1159%) hue-rotate(210deg) brightness(95%) contrast(98%);
}
</style>
