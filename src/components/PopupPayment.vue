<template>
  <Popup v-model="isShow" @hide="hide" width="700px" title="Thanh toán" :persistent="persistent">
    <template v-slot:top-body>
      <div class="flex flex-wrap mb-4 py-2 flex-0 border-b-2">
        <div class="w-full lg:w-1/2 items-center flex px-2 mb-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
            Phí D.Vụ
          </div>
          <div>
            <InputMoney
              v-model="formData.serviceFee"
              @input="hasChange = true"
              class="bg-white rounded-sm border-1px w-full px-1"
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 items-center flex px-2 mb-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
            Giảm bill
          </div>
          <div class="flex items-center">
            <InputMoney
              v-model="formData.decreaseBill"
              @input="hasChange = true"
              :max="formData.decreaseBillUnit === '%' ? 100 : summaryBill"
              class="bg-white rounded-sm border-1px w-full px-1"
            />
            <v-select
              v-model="formData.decreaseBillUnit"
              @update:modelValue="onChangeDescreaseBillUnit"
              :options="['VND', '%']"
              :clearable="false"
              appendToBody
              class="custom-select bg-white rounded-sm w-full ml-1"
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 items-center flex px-2 mb-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
            Thuế
          </div>
          <div>
            <InputMoney
              v-model="formData.vat"
              @input="hasChange = true"
              class="bg-white rounded-sm border-1px w-full px-1"
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 items-center flex px-2 mb-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
            Tổng tiền
          </div>
          <div>
            <input
              :value="$numberWithCommas(totalBill)"
              class="bg-gray-300 rounded-sm border-1px w-full px-1"
              disabled
            />
          </div>
        </div>
        <!-- <div class="w-full lg:w-1/2 items-center flex px-2 mb-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
            Khách đưa
          </div>
          <div class="flex items-center">
            <InputMoney
              id="clientMoney"
              v-model="formData.clientMoney"
              @input="hasChange = true"
              class="bg-white rounded-sm border-1px w-full px-1"
            />
            <CheckedIcon class="w-7 h-7 ml-2 cursor-pointer" @click="formData.clientMoney = totalBill" />
          </div>
        </div> -->
        <!-- <div class="w-full lg:w-1/2 items-center flex px-2">
          <div class="flex-[0_0_100px] text-right pr-2 font-semibold">
            Trả lại
          </div>
          <div>
            <input
              :value="$numberWithCommas(refundMoney)"
              class="bg-gray-300 rounded-sm border-1px w-full px-1"
              disabled
            />
          </div>
        </div> -->
      </div>
    </template>
    <div class="max-h-[calc(100svh_-_350px)] lg:max-h-[calc(100svh_-_300px)] p-4">
      <div id="bill-html">
        <div class="text-center font-bold text-2xl mb-2">Ngâu Coffee</div>
        <div class="text-center italic">20 Đồng Khởi, Diên Khánh</div>
        <div class="text-center italic">Điện thoại: 0385.200.948</div>
        <div class="text-center font-bold text-xl mt-2">PHIẾU THANH TOÁN</div>
        <div class="flex mt-4">
          <div class="w-1-2 mr-2 uppercase">HĐ: {{ currentTable.bill.id }}</div>
          <!-- <div class="w-1-2 ml-2">N.viên: admin</div> -->
        </div>
        <div class="flex">
          <div class="w-1-2 mr-2">Giờ vào: {{ $formatDate(currentTable.bill.createdAt, 'HH:mm') }}</div>
          <div class="w-1-2 ml-2">Giờ ra: {{ $formatDate(new Date(), 'HH:mm') }}</div>
        </div>
        <div class="flex font-bold">
          <div class="w-1-2 mr-2">Khu vực: {{ currentTable.group }}</div>
          <div class="w-1-2 ml-2">Bàn: {{ currentTable.name }}</div>
        </div>
        <div class="flex mt-2 border-b-2px table-text">
          <div class="w-5-12 px-2 py-1 text-center font-bold">Món</div>
          <div class="w-2-12 px-2 py-1 text-center font-bold">S.L</div>
          <div class="w-2-12 px-2 py-1 text-center font-bold">
            Đ.Giá
          </div>
          <div class="w-1-12 px-2 py-1 text-center font-bold">CK</div>
          <div class="w-2-12 px-2 py-1 text-center font-bold">
            T.Tiền
          </div>
        </div>
        <div
          v-for="(item, iIndex) in currentTable.bill.items"
          class="flex border-b-2px table-text"
          :key="`bill-order-item-${iIndex}`"
        >
          <div class="w-5-12 px-2 py-1">{{ item.name }}</div>
          <div class="w-2-12 px-2 py-1 text-center">
            {{ item.quantity }}
          </div>
          <div class="w-2-12 px-2 py-1 text-center">
            {{ $numberWithCommas(item.price) }}
          </div>
          <div class="w-1-12 px-2 py-1 text-center">
            {{ $numberWithCommas(item.decrease) }}
          </div>
          <div class="w-2-12 px-2 py-1 text-center">
            {{ $numberWithCommas(getItemTotal(item)) }}
          </div>
        </div>
        <div>
          <div class="flex mt-4">
            <div class="w-1-2 mr-2">Phí dịch vụ: {{ $numberWithCommas(formData.serviceFee) }}</div>
            <div class="w-1-2 ml-2">
              VAT: {{ $numberWithCommas(formData.vat) }}
            </div>
          </div>
          <div class="flex mt-2">
            <div>Giảm giá:
              <template v-if="formData.decreaseBill">
                - {{ $numberWithCommas(decreaseBillValue) }} <template v-if="formData.decreaseBillUnit !== 'VND'">({{ formData.decreaseBill }} {{ formData.decreaseBillUnit }})</template>
              </template>
              <span v-else>0</span>
            </div>
          </div>
          <div class="flex pt-2">
            <div class="font-bold">
              Thành tiền: <span class="total">{{ $numberWithCommas(totalBill) }}</span> <span class="italic">VNĐ</span>
            </div>
          </div>
          <!-- <div class="flex mt-2">
            <div class="w-1-2 mr-2">Khách đưa: {{ $numberWithCommas(formData.clientMoney) }}</div>
            <div class="w-1-2 ml-2">
              Trả lại: {{ $numberWithCommas(refundMoney) }}
            </div>
          </div> -->
        </div>
        <div class="flex justify-center mt-4">
          <div class="w-5-6 border-1px border-black"></div>
        </div>
        <div class="pt-1 text-center italic">Cảm ơn quý khách, hẹn gặp lại!</div>
      </div>
    </div>
    <template v-slot:buttons>
      <div class="flex justify-end p-3">
        <button
          class="bg-red-500 w-1/2 text-white hover:bg-red-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm mr-2"
          type="button"
          @click="cancelOrder"
        >
          Hủy bill
        </button>
        <button
          class="bg-blue-500 text-white hover:bg-blue-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm mr-2 w-1/3"
          type="button"
          @click="isShowPopupOrder = true"
        >
          Chọn món
        </button>
        <button
          class="bg-green-500 text-white w-1/2 hover:bg-green-700 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 rounded-sm ml-2"
          type="button"
          @click="savePayment"
        >
          Xác nhận
        </button>
      </div>
    </template>
    <PopupOrder
      v-model="isShowPopupOrder"
      :currentTable="(currentTable || {})"
      open-from-popup-payment
      @saved="onOrderSaved"
    />
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import PopupOrder from "./PopupOrder.vue";
import OrderServices from '../firebase/order/order'
import { ORDER_STATUS } from '../constants/constants'
import InputMoney from "./InputMoney.vue";
import vSelect from "vue-select";
import { useAppStore } from '../stores/app'
import CheckedIcon from "./icons/Checked.vue";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    currentTable: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Popup,
    InputMoney,
    CheckedIcon,
    vSelect,
    PopupOrder
  },
  setup () {
    const appStore = useAppStore()
    return { appStore }
  },
  watch: {
    modelValue(v) {
      this.isShow = v;
      if (v) {
        this.hasChange = false
        this.attachFormData()
      }
    },
    'currentTable': 'attachFormData'
  },
  computed: {
    totalItems () {
      return this.currentTable.bill.items.reduce((result, item) => {
        result += this.getItemTotal(item);
        return result;
      }, 0);
    },
    summaryBill () {
      const { serviceFee = 0, vat = 0 } = this.formData;
      return this.totalItems + serviceFee + vat
    },
    decreaseBillValue () {
      const { decreaseBill = 0, decreaseBillUnit = 'VND' } = this.formData;
      return decreaseBillUnit === '%' ? (this.summaryBill * decreaseBill / 100) : decreaseBill
    },
    totalBill() {
      return this.summaryBill - this.decreaseBillValue;
    },
    refundMoney () {
      if (this.formData.clientMoney >= this.totalBill) {
        return this.formData.clientMoney - this.totalBill
      }
      return 0
    }
  },
  data: () => ({
    hasChange: false,
    isShow: false,
    isShowPopupOrder: false,
    formData: {}
  }),
  methods: {
    attachFormData() {
      let { serviceFee = 0, vat = 0, decreaseBill, decreaseBillUnit, clientMoney = 0 } = this.currentTable.bill || {};
      if (decreaseBill === undefined) {
        decreaseBill = this.appStore.settings?.decreaseBill || 0
      }
      if (decreaseBillUnit === undefined) {
        decreaseBillUnit = this.appStore.settings?.decreaseBillUnit || 'VND'
      }
      this.formData = { serviceFee, vat, decreaseBill, decreaseBillUnit, clientMoney }
    },
    onChangeDescreaseBillUnit () {
      this.hasChange = true
      this.formData.decreaseBill = 0
    },
    hide() {
      this.$emit("update:modelValue", false);
    },
    printBill() {
      this.$htmlToPaper("bill-html");
    },
    getItemTotal(item) {
      return (item.price || 0) * item.quantity - (item.decrease || 0);
    },
    playSound () {
      var data = { soundurl : '/bill-sound.mp3'} 
      var audio = new Audio(data.soundurl);
      audio.play();
    },
    savePayment () {
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
      let updateData = {
        status: ORDER_STATUS.success,
        ...this.formData
      }
      OrderServices.updateOrder(this.currentTable.bill.id, updateData)
      Toast.fire({
        icon: 'success',
        title: 'Thanh toán thành công!'
      })
      this.appStore.getStatisticToday()
      // call api
      this.$emit('saved', {
        ...this.currentTable.bill,
        ...updateData
      })
      this.hide()
      this.printBill()
    },
    cancelOrder() {
      if (this.currentTable.bill?.id) {
        this.$swal.fire({
          title: 'Bạn có chắc muốn hủy bill này không?',
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
            OrderServices.updateOrder(this.currentTable.bill.id, {
              status: ORDER_STATUS.cancel
            })
            if (this.isEditMode) {
              this.$emit('saved', {
                ...this.currentTable.bill,
                status: ORDER_STATUS.cancel
              })
            }
            Toast.fire({
              icon: 'success',
              title: 'Hủy bill thành công!'
            })
            this.hide()
          }
        })
      }
    },
    onOrderSaved (bill) {
      this.$emit('orderSaved', bill)
    }
  },
};
</script>
<style scoped>
@import url('../assets/print.css');
</style>
