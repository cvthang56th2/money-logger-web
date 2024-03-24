<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="600px"
    :title="product.id ? `Chỉnh sửa sản phẩm: ${product.name}` : 'Thêm mới sản phẩm'"
    :save="saveProduct"
    persistent
    :closeOnSave="false"
    confirmText="Lưu"
  >
    <div class="p-4">
      <div class="flex mb-1">
        <div class="pr-4 w-1/3 font-semibold">Tên sản phẩm:</div>
        <div class="w-2/3 px-2 flex items-center">
          <input
            v-model="formData.name"
            class="bg-white rounded-md border-1px w-full outline-none px-1 py-[1px]"
          />
        </div>
      </div>
      <div class="flex mb-1">
        <div class="pr-4 w-1/3 font-semibold">Giá:</div>
        <div class="w-2/3 px-2 flex items-center">
          <InputMoney
            v-model="formData.price"
            class="bg-white rounded-md border-1px w-full outline-none px-1 py-[1px]"
          />
        </div>
      </div>
      <div class="flex mb-1">
        <div class="pr-4 w-1/3 font-semibold">Đơn vị:</div>
        <div class="w-2/3 px-2 flex items-center">
          <input
            v-model="formData.unit"
            class="bg-white rounded-md border-1px w-full outline-none px-1 py-[1px]"
          />
        </div>
      </div>
      <div class="flex mb-1">
        <div class="pr-4 w-1/3 font-semibold">Hình ảnh:</div>
        <div class="w-2/3 px-2 flex items-center">
          <input
            v-model="formData.image"
            class="bg-white rounded-md border-1px w-full outline-none px-1 py-[1px]"
          />
        </div>
      </div>
      <div class="flex mb-1">
        <div class="pr-4 w-1/3 font-semibold"></div>
        <div class="w-2/3 px-2 flex items-center">
          <div class="w-[75px] h-[150px] bg-center bg-cover bg-no-repeat border-2" :style="`background-image: url(${formData.image})`">
          </div>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import vSelect from "vue-select";
import ProductServices from '../firebase/product/product'
import InputMoney from "./InputMoney.vue";
import { useProductStore } from "../stores/product";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Popup,
    InputMoney,
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
        this.formData = JSON.parse(JSON.stringify(this.product))
      }
    },
  },
  computed: {
  },
  data: () => ({
    isShow: false,
    formData: {},
  }),
  methods: {
    hide () {
      this.$emit("update:modelValue", false);
    },
    saveProduct () {
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
      let productData = JSON.parse(JSON.stringify(this.formData))
      if (this.formData.id) {
        ProductServices.updateProduct(this.formData.id, productData)
      } else {
        const maxPid = Math.max(...this.productStore.products.map(({ pid }) => pid))
        const id = maxPid + 1;
        productData = {
          ...productData,
          id: `product-${id}`,
          pid: id
        }
        ProductServices.createProduct(productData)
      }
      this.$emit('saved', productData)

      Toast.fire({
        icon: 'success',
        title: 'Lưu sản phẩm thành công!'
      })
      this.hide();
    }
  },
};
</script>

