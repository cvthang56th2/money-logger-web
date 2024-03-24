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
      <TransactionForm v-model="formData" />
    </div>
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import TransactionServices from '../firebase/transaction/transaction.services'
import TransactionForm from "./TransactionForm.vue";

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
    TransactionForm,
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

