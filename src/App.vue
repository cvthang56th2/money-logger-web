<script setup>
import Favicon from './assets/images/favicon.png'
import { ref, inject, onMounted } from 'vue'
import AuthServices from './firebase/auth/auth'
import UserServices from './firebase/user/user'
import OptionServices from './firebase/option/option'
import PopupSettings from './components/PopupSettings.vue'
import PopupProductManagement from './components/PopupProductManagement.vue'
import PopupOrdersHistory from './components/PopupOrdersHistory.vue'
import { useAppStore } from './stores/app'
import { useProductStore } from './stores/product'

const swal = inject('$swal')
const appStore = useAppStore()
const productStore = useProductStore()
const isOpenMenu = ref(false)
const isShowPopupSettings = ref(false)
const isShowPopupProductManagement = ref(false)
const isShowPopupOrdersHistory = ref(false)
const isLogin = ref(false)
const formData = ref({
  email: 'admin@coffee.com'
})
const login = async () => {
  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer)
      toast.addEventListener('mouseleave', swal.resumeTimer)
      toast.addEventListener('click', ()=> swal.close())
    }
  })
  
  try {
    const { email, password } = formData.value
    if (!email || !password) {
      Toast.fire({
        icon: 'error',
        title: 'Chưa nhập mật khẩu'
      })
      return
    }
    await AuthServices.loginWithEmail(email, password)
    isLogin.value = true
    Toast.fire({
      icon: 'success',
      title: 'Đăng nhập thành công!'
    })
  } catch (error) {
    Toast.fire({
      icon: 'error',
      title: 'Sai mật khẩu'
    })
  }
}
const logout = () => {
  swal.fire({
    title: 'Bạn có chắc muốn khóa máy?',
    showCancelButton: true,
    cancelButtonText: 'Không',
    confirmButtonText: 'Có',
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      AuthServices.logout()
      isLogin.value = false
    }
  })
}
const getSettings = async () => {
  const settings = await OptionServices.getOptionById('settings')
  appStore.setSettings(settings)
}
const isMounted = ref(false)
onMounted(() => {
  document.addEventListener('click', () => {
    isOpenMenu.value = false
  })
  AuthServices.onAuthStateChanged(async (res) => {
    const { uid } = res || {}
    if (uid) {
      const userInfo = await UserServices.getUserById(uid)
      if (userInfo) {
        isLogin.value = true
        getSettings()
        productStore.getProducts()
      }
    }
    isMounted.value = true
  })
})
</script>

<template>
  <div v-if="isMounted" class="h-[100svh] flex flex-col">
    <template v-if="isLogin">
      <header class="border-b-2 mb-2 flex-0 relative px-4">
        <div class="flex lg:justify-center text-xl md:text-2xl lg:text-3xl py-2 font-bold text-amber-600">
          <img :src="Favicon" alt="icon" class="w-[30px] lg:w-[40px] mr-2">
          Ngâu Coffee
        </div>
        <button class="bg-cyan-400 hover:bg-cyan-600 ease-linear transition-all duration-150 px-2 py-1 lg:px-4 lg:py-2 absolute top-2 right-4 group text-white font-semibold" @click.stop="isOpenMenu = true">
          Cài đặt
        </button>
        <div v-if="isOpenMenu" class="absolute bg-white border-[1px] w-[150px] right-3 z-10 top-full -mt-1">
          <ul>
            <li class="px-3 py-1 text-black ease-linear transition-all duration-150 hover:bg-green-400 hover:text-white block cursor-pointer text-center" @click="isShowPopupOrdersHistory = true">Order</li>
            <li class="px-3 py-1 text-black ease-linear transition-all duration-150 hover:bg-green-400 hover:text-white block cursor-pointer text-center" @click="isShowPopupProductManagement = true">Sản phẩm</li>
            <li class="px-3 py-1 text-black ease-linear transition-all duration-150 hover:bg-green-400 hover:text-white block cursor-pointer text-center" @click="isShowPopupSettings = true">Hệ thống</li>
            <li class="px-3 py-1 text-black ease-linear transition-all duration-150 hover:bg-green-400 hover:text-white block cursor-pointer text-center" @click="logout">Khóa máy</li>
          </ul>
        </div>
      </header>
      <main class="p-1 flex-1 overflow-y-auto">
        <router-view></router-view>
      </main>
      <PopupSettings v-model="isShowPopupSettings" />
      <PopupOrdersHistory v-model="isShowPopupOrdersHistory" />
      <PopupProductManagement v-model="isShowPopupProductManagement" />
    </template>
    
    <div v-else class="px-6 h-full text-gray-800">
      <div
        class="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
      >
        <div
          class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0 relative"
        >
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="w-full"
            alt="Sample image"
          />
        </div>
        <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
          <h1 class="text-3xl mb-5 text-center">Đăng nhập vào trang Quản lý</h1>
          <form @submit.stop="login">
            <!-- email input -->
            <div class="mb-6">
              <input
                v-model="formData.email"
                disabled
                type="text"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-gray-100 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email"
              />
            </div>

            <!-- Password input -->
            <div class="mb-6">
              <input
                v-model="formData.password"
                type="password"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Nhập mật khẩu..."
              />
            </div>

            <div class="text-center">
              <button
                type="submit"
                class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                @click.prevent="login"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="h-[100svh] w-[100svw] flex items-center justify-center">
    <div class="load-3 flex">
      <div class="flex justify-center">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<style>
.border-1px {
  border-width: 1px;
}

.custom-select .vs__selected {
  margin: 0;
  padding: 0;
}
.custom-select .vs__dropdown-toggle {
  padding-bottom: 0;
}
.custom-select .vs__search {
  margin-top: 0;
}
.custom-select,
.custom-select .vs__selected-options,
.custom-select > .vs__dropdown {
  height: 26px;
}
.custom-select .vs__actions {
  display: none;
}
.flex-0 {
  flex-shrink: 0;
  flex-grow: 0;
}
.line {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  margin: 5px;
}

.load-3 .line:nth-last-child(1) {
  background-color: rgb(213, 85, 85);
  animation: loadingC 0.8s 0.1s linear infinite;
}

.load-3 .line:nth-last-child(2) {
  background-color: rgb(22, 97, 22);
  animation: loadingC 0.8s 0.2s linear infinite;
}

.load-3 .line:nth-last-child(3) {
  background-color: rgb(54, 184, 240);
  animation: loadingC 0.8s 0.3s linear infinite;
}
@keyframes loadingC {
  0 {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 15px);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>