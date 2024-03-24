<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="100svw"
    title="Quản lý sản phẩm"
    persistent
    :closeOnSave="false"
    confirmText="Lưu"
  >
    <template v-slot:buttons>
      <div></div>
    </template>
    <div class="p-4 text-sm md:text-base overflow-x-auto min-w-[750px]">
      <div class="mb-2 pb-1 border-b-2 flex justify-between items-center">
        <button class="px-4 py-2 bg-green-500 text-white hover:bg-green-700" @click="addProduct">Thêm mới</button>
        <input v-model="keyword" type="text" class="w-1/3 border-1px px-2 py-1" placeholder="Nhập mã hoặc tên...">
      </div>
      <div class="flex border-b-[1px] border-b-gray-500">
        <div class="w-1/12 px-2 py-1 font-semibold text-gray-600 text-center">ID</div>
        <div class="w-4/12 px-2 py-1 font-semibold text-gray-600 text-center">Tên</div>
        <div class="w-3/12 px-2 py-1 font-semibold text-gray-600 text-center">Đơn giá</div>
        <div class="w-2/12 px-2 py-1 font-semibold text-gray-600 text-center">Đơn vị</div>
        <div class="w-2/12 px-2 py-1 font-semibold text-gray-600 text-center">Hành động</div>
      </div>
      <template v-if="products.length">
        <div v-for="(product, pIndex) in computedProducts" :key="`product-${pIndex}`" class="flex border-b-[1px] border-b-gray-500">
          <div class="w-1/12 px-2 py-1 text-center">{{ product.pid }}</div>
          <div class="w-4/12 px-2 py-1 text-center">{{ product.name }}</div>
          <div class="w-3/12 px-2 py-1 text-center">{{ $numberWithCommas(product.price) }}</div>
          <div class="w-2/12 px-2 py-1 text-center">{{ product.unit }}</div>
          <div class="w-2/12 px-2 py-1 text-center flex items-center justify-center">
            <button class="text-green-500 font-bold hover:text-green-800 mr-2" @click="editProduct(product.originIndex)">Chỉnh sửa</button>
            <button class="text-red-500 font-bold hover:text-red-800" @click="deleteProduct(product.originIndex)">Xóa</button>
          </div>
        </div>
      </template>
      <div v-else class="px-2 py-1 text-center">
        Chưa có sản phẩm nào.
      </div>
    </div>
    <PopupProductDetail
      v-model="isShowPopupProductDetail"
      :product="selectedProduct"
      @saved="onSaveProduct"
    />
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import vSelect from "vue-select";
import InputMoney from "./InputMoney.vue";
import PopupProductDetail from "./PopupProductDetail.vue";
import { useProductStore } from "../stores/product";
import { toLowerCaseNonAccentVietnamese } from '../utils/utils'
import ProductServices from '../firebase/product/product'

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Popup,
    InputMoney,
    PopupProductDetail,
    vSelect
  },
  setup () {
    const productStore = useProductStore()
    return { productStore }
  },
  watch: {
    modelValue(v) {
      this.isShow = v
      if (v) {
        this.products = this.productStore.products
        this.selectedProductIndex = null
      }
    },
  },
  computed: {
    selectedProduct () {
      return JSON.parse(JSON.stringify(this.products[this.selectedProductIndex] || {}))
    },
    computedProducts () {
      let result = JSON.parse(JSON.stringify(this.products)).map((product, originIndex) => ({
        ...product,
        originIndex
      }));
      if (this.keyword) {
        const regex = new RegExp(toLowerCaseNonAccentVietnamese(this.keyword), "gi");
        result = result.filter(
          (e) =>
            (e.pid && String(e.pid).match(regex)) || (e.name && String(toLowerCaseNonAccentVietnamese(e.name)).match(regex))
        );
      }
      result = result.sort((a, b) => a.pid > b.pid ? -1 : 1)
      return result;
    }
  },
  data: () => ({
    keyword: null,
    selectedProductIndex: null,
    isShow: false,
    isShowPopupProductDetail: false,
    products: []
  }),
  methods: {
    hide () {
      this.$emit("update:modelValue", false);
    },
    addProduct () {
      this.selectedProductIndex = null
      this.isShowPopupProductDetail = true
    },
    editProduct (originIndex) {
      this.selectedProductIndex = originIndex
      this.isShowPopupProductDetail = true
    },
    deleteProduct (originIndex) {
      this.$swal.fire({
        title: 'Bạn có chắc muốn xóa sản phẩm này không?',
        showCancelButton: true,
        cancelButtonText: 'Không',
        confirmButtonText: 'Có',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
        const Toast = this.$swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', this.$swal.stopTimer)
            toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            toast.addEventListener('click', ()=> this.$swal.close())
          }
        })
          ProductServices.deleteProduct(this.products[originIndex].id)
          this.products.splice(originIndex, 1)
          this.productStore.setProducts(this.products)
          Toast.fire({
            icon: 'success',
            title: 'Xóa sản phẩm thành công!'
          })
        }
      })
    },
    onSaveProduct (data) {
      if (this.selectedProductIndex !== null) {
        this.products[this.selectedProductIndex] = data
      } else {       
        this.products.push(data)
      }
      this.productStore.setProducts(this.products)
      this.selectedProductIndex = null
    }
  },
};
</script>

