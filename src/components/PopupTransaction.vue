<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="600px"
    :title="transaction.id ? `Edit Transaction` : 'Create Transaction'"
    :save="saveTransaction"
    persistent
    :closeOnSave="false"
    confirmText="Lưu"
  >
    <div class="p-4">
      <div class="space-y-4">
        <div class="flex space-x-3 justify-between items-center">
          <div class="flex flex-col space-y-3">
            <select class="p-2 border-2 rounded-md" v-model="formData.inputType" id="inputType">
              <option value="in">In</option>
              <option value="out">Out</option>
            </select>
          </div>
          <div class="flex flex-col space-y-3">
            <select class="p-2 border-2 rounded-md" v-model="formData.moneyType" id="moneyType">
              <option value="cash">Cash</option>
              <option value="momo">MOMO</option>
              <option value="bank">Bank</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col space-y-3">
          <label for="total">Total <span class="text-red-500">(*)</span></label>
          <input
            v-model="formData.total"
            id="total"
            type="number"
            class="px-4 py-2 border-2 rounded-md"
          />
        </div>
        <div class="flex flex-col space-y-3">
          <label for="description"
            >Description <span class="text-red-500">(*)</span>
          </label>
          <textarea
            v-model="formData.description"
            id="description"
            class="px-4 py-2 border-2 rounded-md"
          ></textarea>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import TransactionServices from '../firebase/transaction/transaction.services'

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Popup,
  },
  watch: {
    modelValue(v) {
      this.isShow = v
      if (v) {
        this.formData = JSON.parse(JSON.stringify(this.transaction))
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
    saveTransaction () {
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
      let transactionData = JSON.parse(JSON.stringify(this.formData))
      TransactionServices.updateTransaction(this.formData.id, transactionData)
      this.$emit('saved', transactionData)

      Toast.fire({
        icon: 'success',
        title: 'Transaction saved successfully'
      })
      this.hide();
    }
  },
};
</script>

