<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="600px"
    title="Cài đặt"
    :save="saveSettings"
    persistent
    :closeOnSave="false"
    confirmText="Lưu"
  >
    <div class="p-4">
      <div class="flex mb-3">
        <div class="pr-4 w-1/3 font-semibold">Giảm giá:</div>
        <div class="w-2/3 px-2 flex items-center">
          <InputMoney
            v-model="formData.decreaseBill"
            @input="hasChange = true"
            :max="formData.decreaseBillUnit === '%' ? 100 : null"
            class="bg-white rounded-md border-1px w-full outline-none px-1 py-[1px]"
          />
          <v-select
            v-model="formData.decreaseBillUnit"
            @update:modelValue="onChangeDescreaseBillUnit"
            :options="['VND', '%']"
            :clearable="false"
            appendToBody
            class="custom-select bg-white rounded-sm w-full outline-none ml-1"
          />
        </div>
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import vSelect from "vue-select";
import OptionServices from '../firebase/option/option'
import InputMoney from "./InputMoney.vue";
import { useAppStore } from '../stores/app'

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
        this.formData = JSON.parse(JSON.stringify(this.appStore.settings))
      }
    },
  },
  computed: {
  },
  data: () => ({
    isShow: false,
    formData: {}
  }),
  methods: {
    onChangeDescreaseBillUnit () {
      this.formData.decreaseBill = 0
    },
    hide () {
      this.$emit("update:modelValue", false);
    },
    saveSettings () {
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
      OptionServices.updateOption('settings', this.formData)
      this.appStore.setSettings(this.formData)

      Toast.fire({
        icon: 'success',
        title: 'Lưu cài đặt thành công!'
      })
      this.hide();
    }
  },
};
</script>

