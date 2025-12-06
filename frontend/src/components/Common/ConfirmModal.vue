<template>
  <div 
    class="modal fade" 
    :class="{ show: isVisible }" 
    :style="{ display: isVisible ? 'block' : 'none' }"
    tabindex="-1"
    role="dialog"
    @click.self="cancel"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i :class="`bi ${iconClass} me-2`"></i>
            {{ title }}
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="cancel"
          ></button>
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="cancel"
          >
            Hủy
          </button>
          <button 
            type="button" 
            class="btn"
            :class="`btn-${type}`"
            @click="confirm"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div 
    v-if="isVisible" 
    class="modal-backdrop fade show"
    @click="cancel"
  ></div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
const title = ref('Xác nhận')
const message = ref('')
const type = ref('danger')
const confirmText = ref('Xác nhận')
const isLoading = ref(false)
let resolveCallback = null
let rejectCallback = null

const iconClass = computed(() => {
  const icons = {
    danger: 'bi-exclamation-circle',
    warning: 'bi-exclamation-triangle',
    info: 'bi-info-circle',
    success: 'bi-check-circle'
  }
  return icons[type.value] || 'bi-question-circle'
})

import { computed } from 'vue'

const show = (options = {}) => {
  return new Promise((resolve, reject) => {
    title.value = options.title || 'Xác nhận'
    message.value = options.message || 'Bạn có chắc chắn?'
    type.value = options.type || 'danger'
    confirmText.value = options.confirmText || 'Xác nhận'
    isLoading.value = false
    
    resolveCallback = resolve
    rejectCallback = reject
    
    isVisible.value = true
  })
}

const confirm = async () => {
  isLoading.value = true
  if (resolveCallback) {
    resolveCallback(true)
  }
  isVisible.value = false
}

const cancel = () => {
  if (rejectCallback) {
    rejectCallback(false)
  }
  isVisible.value = false
}

const setLoading = (loading) => {
  isLoading.value = loading
}

defineExpose({
  show,
  confirm,
  cancel,
  setLoading
})
</script>

<style scoped>
.modal.show {
  padding-right: 17px;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
