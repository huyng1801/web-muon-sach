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
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <i class="bi bi-x-circle me-2"></i>
            Từ chối yêu cầu mượn sách
          </h5>
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            @click="cancel"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="record" class="mb-3">
            <p class="mb-1"><strong>Sách:</strong> {{ record.MaSach?.TenSach }}</p>
            <p class="mb-3"><strong>Độc giả:</strong> {{ record.MaDocGia?.HoLot }} {{ record.MaDocGia?.Ten }}</p>
          </div>

          <div class="mb-3">
            <label class="form-label">Lý do từ chối <span class="text-danger">*</span></label>
            <textarea 
              class="form-control" 
              v-model="reason"
              rows="4" 
              placeholder="Nhập lý do từ chối yêu cầu mượn sách..."
              @keyup.enter="confirm"
            ></textarea>
          </div>

          <div v-if="error" class="alert alert-danger">
            <i class="bi bi-exclamation-circle"></i>
            {{ error }}
          </div>
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="cancel"
            :disabled="isLoading"
          >
            Hủy
          </button>
          <button 
            type="button" 
            class="btn btn-danger" 
            @click="confirm"
            :disabled="isLoading || !reason.trim()"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            Từ chối yêu cầu
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
const isLoading = ref(false)
const reason = ref('')
const error = ref('')
const record = ref(null)
let resolveCallback = null
let rejectCallback = null

const show = (options = {}) => {
  return new Promise((resolve, reject) => {
    record.value = options.record || null
    reason.value = ''
    error.value = ''
    isLoading.value = false
    
    resolveCallback = resolve
    rejectCallback = reject
    
    isVisible.value = true
    
    // Focus on textarea
    setTimeout(() => {
      const textarea = document.querySelector('.modal textarea')
      if (textarea) textarea.focus()
    }, 100)
  })
}

const confirm = async () => {
  if (!reason.value.trim()) {
    error.value = 'Vui lòng nhập lý do từ chối'
    return
  }
  
  isLoading.value = true
  if (resolveCallback) {
    resolveCallback(reason.value)
  }
  isVisible.value = false
}

const cancel = () => {
  isVisible.value = false
  reason.value = ''
  error.value = ''
  if (rejectCallback) {
    rejectCallback('cancelled')
  }
}

defineExpose({
  show,
  cancel
})
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
