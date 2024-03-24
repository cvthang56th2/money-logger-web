<script setup>
import PopupOrder from "../components/PopupOrder.vue";
import PopupChangeTable from "../components/PopupChangeTable.vue";
import PopupPayment from "../components/PopupPayment.vue";
import NoCustomerImg from "../assets/images/icons8-restaurant-noCustomer.png";
import HaveCustomerImg from "../assets/images/icons8-restaurant-table.png";
import CheckedIcon from "../assets/images/success-green-check-mark-icon.png";
import { ref, computed, onMounted, inject } from "vue";
import { listTables as list } from "../assets/data";
import OrderServices from '../firebase/order/order'
import { ORDER_STATUS } from '../constants/constants'
import { useAppStore } from "../stores/app";

const swal = inject('$swal')
const orders = ref([])
const keyword = ref(null);
const listTables = ref(JSON.parse(JSON.stringify(list)));
const listTablesEmpty = computed(() => listTables.value.filter((e) => !e.bill));
const computedListTables = computed(() => {
  let result = JSON.parse(JSON.stringify(listTables.value));
  if (keyword.value) {
    const regex = new RegExp(keyword.value, "gi");
    result = result.filter(
      (e) =>
        (e.id && String(e.id).match(regex)) || (e.name && String(e.name).match(regex))
    );
  }
  return result;
});
const groupColors = {
  1: "text-blue-700",
  2: "text-green-700",
  3: "text-pink-700",
};
const groupedTables = computed(() => {
  const groupedTablesObject = computedListTables.value.reduce((resultObj, table) => {
    resultObj[table.group] = resultObj[table.group] || [];
    resultObj[table.group].push(table);
    return resultObj;
  }, {});
  return Object.keys(groupedTablesObject).map((groupId) => ({
    groupId,
    tables: groupedTablesObject[groupId],
  }));
});
const statisticCurrent = computed(() => {
  const totalEmpty = listTablesEmpty.value.length;
  const totalHaveCustomer = listTables.value.length - totalEmpty;
  return {
    totalHaveCustomer,
    totalEmpty,
  };
});
const isShowPopupOrder = ref(false);
const isShowPopupChangeTable = ref(false);
const isShowPopupPayment = ref(false);
const selectedTable = ref(null);
const appStore = useAppStore()

const openPopupOrder = (table) => {
  selectedTable.value = table;
  isShowPopupOrder.value = true;
};

const onCloseOrder = () => {
};

const onOrderSaved = (bill) => {
  selectedTable.value.bill = bill;
};

const onChangeTable = (toTableId) => {
  const tableIndex = listTables.value.findIndex((e) => e.id === toTableId);
  if (tableIndex !== -1) {
    const changeToTable = listTables.value[tableIndex]
    if (changeToTable.bill) {
      OrderServices.updateOrder(selectedTable.value.bill.id, {
        status: ORDER_STATUS.cancel,
        isChangeTable: true,
        changeToTable: toTableId
      })
      for (let item of selectedTable.value.bill.items) {
        const existItem = changeToTable.bill.items.find(e => e.id === item.id)
        if (existItem) {
          existItem.quantity += item.quantity
          existItem.decrease += item.decrease
        } else {
          changeToTable.bill.items.push(item)
        }
      }
      OrderServices.updateOrder(changeToTable.bill.id, {
        items: changeToTable.bill.items,
        total: changeToTable.bill.total + selectedTable.value.bill.total,
        decreaseBill: changeToTable.bill.decreaseBill + selectedTable.value.bill.decreaseBill,
        serviceFee: changeToTable.bill.serviceFee + selectedTable.value.bill.serviceFee,
        vat: changeToTable.bill.vat + selectedTable.value.bill.vat,
      })
    } else {
      changeToTable.bill = selectedTable.value.bill;
      OrderServices.updateOrder(selectedTable.value.bill.id, {
        tableId: toTableId
      })
    }
    delete selectedTable.value.bill;
    selectedTable.value = changeToTable;
  }
};

const onSavePayment = () => {
  delete selectedTable.value.bill
};

const cancelOrder = () => {
  if (selectedTable.value.bill?.id) {
    swal.fire({
      title: 'Bạn có chắc muốn hủy bill bàn này không?',
      showCancelButton: true,
      cancelButtonText: 'Không',
      confirmButtonText: 'Có',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
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
        OrderServices.updateOrder(selectedTable.value.bill.id, {
          status: ORDER_STATUS.cancel
        })
        Toast.fire({
          icon: 'success',
          title: 'Hủy bill thành công!'
        })
      }
    })
  }
}

onMounted(() => {
  OrderServices.getOrdersSnapshot(data => {
    orders.value = data || []
    listTables.value = listTables.value.map(e => ({
      ...e,
      bill: orders.value.find(order => order.status === ORDER_STATUS.pending && order.tableId === e.id)
    }))
    if (selectedTable.value) {
      selectedTable.value = listTables.value.find(e => e.id === selectedTable.value.id)
    }
  }, { status: ORDER_STATUS.pending })

  appStore.getStatisticToday()

  for (const el of document.querySelectorAll('.scroll-to-button')) {
    if (el.getAttribute('target-el')) {
      const target = document.querySelector(el.getAttribute('target-el'))
      if (target) {
        el.addEventListener('click', () => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
      }
    }
  }
})
</script>
<template>
  <div class="flex justify-center flex-col h-full">
    <div class="flex flex-wrap items-center justify-between pb-2 border-b-2 flex-0 px-4">
      <div
        class="w-full xl:w-2/3 mb-2 xl:mb-0 lg:flex justify-center xl:justify-start items-center"
      >
        <div class="mb-2 lg:mb-0 mr-10 text-xl md:text-3xl">
          Bàn đang chọn:
          bàn
          <span class="font-bold">{{
            (selectedTable && selectedTable.name) || "-"
          }}</span>
          khu
          <span class="font-bold">{{
            (selectedTable && selectedTable.group) || "-"
          }}</span>
        </div>
        <div class="flex overflow-x-auto">
          <button
            :disabled="!selectedTable"
            :class="!selectedTable ? 'opacity-30' : ''"
            class="md:w-[70px] md:h-[70px] px-2 py-1 mb-1 whitespace-nowrap md:whitespace-normal text-sm md:text-md ease-linear transition-all duration-150 flex items-center justify-center text-white bg-green-500 hover:bg-green-700 font-bold rounded-md mr-4"
            @click="openPopupOrder(selectedTable)"
          >
            Chọn món
          </button>
          <button
            :disabled="!selectedTable || (selectedTable && !selectedTable.bill)"
            :class="
              !selectedTable || (selectedTable && !selectedTable.bill) ? 'opacity-30' : ''
            "
            class="md:w-[70px] md:h-[70px] px-2 py-1 mb-1 whitespace-nowrap md:whitespace-normal text-sm md:text-md ease-linear transition-all duration-150 flex items-center justify-center text-white bg-purple-500 hover:bg-purple-700 font-bold rounded-md mr-4"
            @click="isShowPopupChangeTable = true"
          >
            Chuyển bàn
          </button>
          <button
            :disabled="!selectedTable || (selectedTable && !selectedTable.bill)"
            :class="
              !selectedTable || (selectedTable && !selectedTable.bill) ? 'opacity-30' : ''
            "
            class="md:w-[70px] md:h-[70px] px-2 py-1 mb-1 whitespace-nowrap md:whitespace-normal text-sm md:text-md ease-linear transition-all duration-150 flex items-center justify-center text-white bg-pink-500 hover:bg-pink-700 font-bold rounded-md mr-4"
            @click="isShowPopupPayment = true"
          >
            Thanh toán
          </button>
          <button
            :disabled="!selectedTable || (selectedTable && !selectedTable.bill)"
            :class="
              !selectedTable || (selectedTable && !selectedTable.bill) ? 'opacity-30' : ''
            "
            class="md:w-[70px] md:h-[70px] px-2 py-1 mb-1 whitespace-nowrap md:whitespace-normal text-sm md:text-md ease-linear transition-all duration-150 flex items-center justify-center text-white bg-red-500 hover:bg-red-700 font-bold rounded-md mr-4"
            @click="cancelOrder"
          >
            Hủy <br class="hidden md:block">bill
          </button>
        </div>
      </div>
      <div class="flex flex-wrap w-full xl:w-1/3">
        <input
          v-model="keyword"
          type="text"
          placeholder="Nhập mã hoặc tên bàn..."
          class="flex-1 border-1px border-blue-400 rounded-sm p-1 md:p-2 mr-2"
        />
        <div class="flex flex-0 py-1 justify-center">
          <button target-el="#group-1" class="px-4 py-1 font-bold rounded-sm text-sm bg-blue-500 text-white mr-2 scroll-to-button">
            Khu 1
          </button>
          <button target-el="#group-2" class="px-4 py-1 font-bold rounded-sm text-sm bg-green-500 text-white mr-2 scroll-to-button">
            Khu 2
          </button>
          <button target-el="#group-3" class="px-4 py-1 font-bold rounded-sm text-sm bg-pink-500 text-white mr-2 scroll-to-button">
            Khu 3
          </button>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-2 bg-gray-200">
      <div
        v-for="(group, gIndex) in groupedTables"
        class="p-2 border-[1px] border-b-[4px] border-r-[4px] border-gray-700 mb-4 rounded-xl bg-white"
        :key="`group-${gIndex}`"
        :id="`group-${group.groupId}`"
      >
        <div
          class="text-lg md:text-2xl font-bold mb-1 md:mb-2 text-blue-500 bg-white px-2 py-1 text-center underline"
          :class="groupColors[group.groupId]"
        >
          Khu vực {{ group.groupId }}
        </div>
        <div class="flex flex-wrap -mx-1">
          <div
            v-for="(table, tIndex) in group.tables"
            class="w-1/2 md:w-1/4 lg:w-[calc(100%/8)] px-1 mb-1"
            :key="`table-${tIndex}`"
          >
            <div
              class="border-[3px] rounded-md"
              :class="
                selectedTable && selectedTable.id === table.id
                  ? 'border-green-400'
                  : 'border-white'
              "
            >
              <div
                class="border-1px rounded-md bg-white cursor-pointer hover:shadow-md hover:bg-cyan-50 relative select-none"
                @click="selectedTable = table"
                @dblclick="openPopupOrder(table)"
                :class="
                  selectedTable && selectedTable.id === table.id
                    ? 'border-green-400'
                    : 'border-purple-300'
                "
              >
                <img
                  v-if="selectedTable && selectedTable.id === table.id"
                  :src="CheckedIcon"
                  alt=""
                  class="absolute -top-1 -left-1 bg-white rounded-full"
                  width="20"
                />
                <div
                  :class="table.bill ? 'bg-blue-400' : 'bg-gray-300'"
                  class="min-h-[20px] md:min-h-[30px] text-white text-xs md:text-sm flex items-center justify-end px-1"
                >
                  {{ table.bill ? $formatDate(table.bill.createdAt) : "" }}
                </div>
                <div class="px-2 py-1">
                  <div class="text-md md:text-xl font-semibold" :class="groupColors[group.groupId]">
                    {{ table.name }}
                  </div>
                  <div class="flex items-end justify-between">
                    <div class="text-red-500 font-semibold text-sm md:text-md">
                      {{ table.bill ? $numberWithCommas(table.bill.total || 0) : "" }}
                    </div>
                    <img
                      :src="table.bill ? HaveCustomerImg : NoCustomerImg"
                      alt=""
                      class="w-[25px] md:w-[36px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lg:flex justify-around py-2 border-t-2 flex-0 px-4 border-yellow-500">
      <div class="flex justify-center lg:justify-start">
        <div class="flex items-center mr-4">
          <div class="h-[24px] w-[40px] bg-blue-400 mr-2"></div>
          Bàn có khách:<span class="font-bold">{{
            statisticCurrent.totalHaveCustomer
          }}</span>
        </div>
        <div class="flex items-center">
          <div class="h-[24px] w-[40px] bg-gray-300 mr-2"></div>
          Bàn trống: <span class="font-bold">{{ statisticCurrent.totalEmpty }}</span>
        </div>
      </div>
      <div class="mt-2 lg:mt-0 mx-2 italic flex items-center justify-center">
        Doanh thu hôm nay: {{ $numberWithCommas(appStore.statisticToday.total) }} VNĐ
      </div>
      <div class="hidden lg:block text-right italic">*Nhấp đôi chuột để chọn món</div>
    </div>
    <PopupOrder
      v-model="isShowPopupOrder"
      :currentTable="(selectedTable || {})"
      @saved="onOrderSaved"
      @closed="onCloseOrder"
      @openPayment="isShowPopupPayment = true"
    />
    <PopupChangeTable
      v-model="isShowPopupChangeTable"
      :currentTable="selectedTable || {}"
      :listTables="listTables"
      @saved="onChangeTable"
    />
    <PopupPayment
      v-model="isShowPopupPayment"
      :currentTable="(selectedTable || {})"
      @saved="onSavePayment"
      @orderSaved="onOrderSaved"
    />
  </div>
</template>
