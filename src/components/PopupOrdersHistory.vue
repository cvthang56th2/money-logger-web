<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="100svw"
    title="Lịch sử Order"
    persistent
    :closeOnSave="false"
    confirmText="Lưu"
  >
    <template v-slot:buttons>
      <div></div>
    </template>
    <div class="p-4 text-sm md:text-base overflow-x-auto min-w-[670px]">
      <div class="mb-2 pb-1 border-b-2 flex items-center">
        <input v-model="keyword" type="text" class="w-1/3 border-1px px-2 py-1" placeholder="Nhập mã, thời gian tạo hay cập nhật cuối...">
      </div>
      <div class="flex border-b-[1px] border-b-gray-500">
        <div class="w-1/12 px-2 py-1 font-semibold text-gray-600 text-center">ID</div>
        <div class="w-3/12 px-2 py-1 font-semibold text-gray-600 text-center">Thời gian tạo</div>
        <div class="w-3/12 px-2 py-1 font-semibold text-gray-600 text-center">Cập nhật cuối</div>
        <div class="w-2/12 px-2 py-1 font-semibold text-gray-600 text-center">Trạng thái</div>
        <div class="w-2/12 px-2 py-1 font-semibold text-gray-600 text-center">Tổng bill</div>
        <div class="w-1/12 px-2 py-1 font-semibold text-gray-600 text-center truncate">Hành động</div>
      </div>
      <template v-if="orders.length">
        <div v-for="(order, oIndex) in computedOrders" :key="`order-his-${oIndex}`" class="flex border-b-[1px] border-b-gray-500">
          <div class="w-1/12 px-2 py-1 text-center uppercase">{{ order.id }}</div>
          <div class="w-3/12 px-2 py-1 text-center">{{ $formatDate(order.createdAt) }}</div>
          <div class="w-3/12 px-2 py-1 text-center">{{ $formatDate(order.updatedAt) }}</div>
          <div class="w-2/12 px-2 py-1 text-center" :class="MAP_ORDER_STATUS_COLOR[order.status]">{{ MAP_ORDER_STATUS[order.status] || '' }}</div>
          <div class="w-2/12 px-2 py-1 text-center">{{ $numberWithCommas(order.total) }}</div>
          <div class="w-1/12 px-2 py-1 text-center truncate">
            <button class="text-green-500 font-bold hover:text-green-800" @click="editOrder(order.originIndex)">Chỉnh sửa</button>
          </div>
        </div>
      </template>
      <div v-else class="px-2 py-1 text-center">
        Chưa có order nào.
      </div>
      <div v-if="nextPageAvailable" class="text-center mt-3">
        <button class="px-4 py-2 bg-cyan-700 hover:bg-cyan-400 ease-linear transition-all duration-150 text-white" @click="getOrders(true)">Tài thêm</button>
      </div>
    </div>
    <PopupPayment
      v-model="isShowPopupPayment"
      :currentTable="currentTable"
      persistent
      isEditMode
      @saved="onSavePayment"
      @orderSaved="onOrderSaved"
    />
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import vSelect from "vue-select";
import OrderServices from '../firebase/order/order'
import InputMoney from "./InputMoney.vue";
import { useAppStore } from '../stores/app'
import { MAP_ORDER_STATUS, MAP_ORDER_STATUS_COLOR } from '../constants/constants'
import { listTables } from '../assets/data'
import PopupPayment from "./PopupPayment.vue";
import { toLowerCaseNonAccentVietnamese } from '../utils/utils'

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
    PopupPayment,
    vSelect
  },
  setup () {
    const appStore = useAppStore()
    return { appStore }
  },
  watch: {
    modelValue(v) {
      this.isShow = v
      if (v) {
        this.selectedOrderIndex = null
        this.getOrders()
      }
    },
  },
  computed: {
    selectedOrder () {
      return JSON.parse(JSON.stringify(this.orders[this.selectedOrderIndex] || {}))
    },
    currentTable () {
      if (this.selectedOrderIndex === null) {
        return { bill: {} }
      }
      let result = { bill: this.selectedOrder }
      const table = listTables.find(e => e.id === this.selectedOrder.tableId)
      result = {
        ...(JSON.parse(JSON.stringify(table || {}))),
        bill: this.selectedOrder
      }
      return result
    },
    computedOrders () {
      let result = JSON.parse(JSON.stringify(this.orders)).map((order, originIndex) => ({
        ...order,
        originIndex
      }));
      if (this.keyword) {
        const regex = new RegExp(toLowerCaseNonAccentVietnamese(this.keyword), "gi");
        result = result.filter(
          (e) =>
            (e.id && String(e.id).match(regex)) ||
            (e.createdAt && String(toLowerCaseNonAccentVietnamese(this.$formatDate(e.createdAt))).match(regex)) ||
            (e.updatedAt && String(toLowerCaseNonAccentVietnamese(this.$formatDate(e.updatedAt))).match(regex))
        );
      }
      return result;
    }
  },
  data: () => ({
    keyword: null,
    selectedOrderIndex: null,
    isShow: false,
    isShowPopupPayment: false,
    MAP_ORDER_STATUS,
    MAP_ORDER_STATUS_COLOR,
    orders: [],
    lastVisible: null,
    nextPageAvailable: false
  }),
  methods: {
    hide () {
      this.$emit("update:modelValue", false);
    },
    async getOrders (isNextPage = false) {
      const { data, lastVisible, nextPageAvailable } = await OrderServices.getAllOrders({
        isNextPage,
        lastVisible: this.lastVisible,
        nextPageAvailable: this.nextPageAvailable,
      })
      this.lastVisible = lastVisible
      this.nextPageAvailable = nextPageAvailable
      if (isNextPage) {
        this.orders = [...this.orders, ...(data || [])]
      } else {
        this.orders = data || []
      }
    },
    editOrder (oIndex) {
      this.selectedOrderIndex = oIndex
      this.isShowPopupPayment = true
    },
    onSavePayment (data) {
      this.orders[this.selectedOrderIndex] = data
      this.selectedOrderIndex = null
    },
    onOrderSaved (bill = {}) {
      this.orders[this.selectedOrderIndex] = {
        ...this.orders[this.selectedOrderIndex],
        ...bill
      }
    }
  },
};
</script>

