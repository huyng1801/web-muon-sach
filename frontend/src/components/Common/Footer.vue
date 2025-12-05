<template>
  <footer class="footer bg-light mt-auto py-3">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h5>
            <i class="bi bi-book"></i>
            Hệ Thống Thư Viện
          </h5>
          <p class="text-muted">
            Quản lý mượn sách trực tuyến hiện đại và tiện lợi
          </p>
        </div>
        <div class="col-md-4">
          <h5>Liên kết</h5>
          <ul class="list-unstyled">
            <li>
              <router-link to="/reader/books" class="text-decoration-none">
                Danh sách sách
              </router-link>
            </li>
            <li>
              <router-link to="/reader/borrow" class="text-decoration-none">
                Đăng ký mượn sách
              </router-link>
            </li>
          </ul>
        </div>
        <div class="col-md-4">
          <h5>Liên hệ</h5>
          <p class="text-muted">
            <i class="bi bi-envelope"></i>
            library@example.com
          </p>
          <p class="text-muted">
            <i class="bi bi-telephone"></i>
            (84) 123-456-789
          </p>
        </div>
      </div>
      <hr>
      <div class="text-center text-muted">
        <p class="mb-0">
          &copy; {{ currentYear }} Hệ Thống Thư Viện Online. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
}

.footer h5 {
  color: #0d6efd;
  margin-bottom: 15px;
}

.footer ul li {
  margin-bottom: 8px;
}

.footer i {
  margin-right: 8px;
}
</style>
