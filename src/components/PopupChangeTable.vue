<template>
  <Popup
    v-model="isShow"
    @hide="hide"
    width="500px"
    title="Chuyển bàn"
    :save="changeTable"
    :closeOnSave="false"
  >
    <div class="p-4 text-lg">
      <div class="flex mb-3 items-center">
        <div class="pr-4 w-1/3 text-right font-medium">Từ bàn:</div>
        <div class="w-2/3 font-bold px-2">khu {{ currentTable.group }} - {{ currentTable.name }}</div>
      </div>
      <div class="flex items-center">
        <div class="pr-4 w-1/3 text-right font-medium">Tới bàn:</div>
        <div class="w-2/3">
          <v-select class="font-bold" v-model="changeToTable" :options="computedListTables" :reduce="country => country.id" label="formattedName" appendToBody placeholder="Chọn bàn..." :clearable="false"></v-select>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from "./Popup.vue";
import vSelect from "vue-select";
import OrderServices from '../firebase/order/order'

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    currentTable: {
      type: Object,
      default: () => ({}),
    },
    listTables: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    Popup,
    vSelect
  },
  watch: {
    modelValue(v) {
      this.isShow = v
      this.changeToTable = null
    },
  },
  computed: {
    computedListTables () {
      return this.listTables.reduce((resultArr, e) => {
        if (e.id !== this.currentTable.id) {
          resultArr.push({
            ...e,
            formattedName: `khu ${ e.group } - bàn ${ e.name }`
          })
        }
        return resultArr
      }, [])
    }
  },
  data: () => ({
    isShow: false,
    changeToTable: null
  }),
  methods: {
    hide () {
      this.$emit("update:modelValue", false);
    },
    changeTable () {
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
      
      const selectedChangeToTable = this.listTables.find(e => e.id === this.changeToTable)
      if (!selectedChangeToTable) {
        Toast.fire({
          icon: 'warning',
          title: 'Chưa chọn bàn muốn chuyển tới'
        })
        return
      }
      const handleOk = () => {
        this.$emit('saved', this.changeToTable)
        Toast.fire({
          icon: 'success',
          title: 'Chuyển bàn thành công!'
        })
        this.hide();
      }
      if (selectedChangeToTable.bill) {
        this.$swal
          .fire({
            title: `Bàn ${ selectedChangeToTable.name } khu ${selectedChangeToTable.group} đang có khách, bạn có chắc muốn đổi tới bàn này không?`,
            showCancelButton: true,
            cancelButtonText: "Không",
            confirmButtonText: "Có",
          })
          .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              handleOk()
            }
          });
      } else {
        handleOk()
      }

    }
  },
};
</script>

