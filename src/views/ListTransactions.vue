<script setup>
import { inject, ref } from "vue";
import TransactionServices from "../firebase/transaction/transaction.services";
import { formatDate } from "../utils/utils";
import PopupTransaction from "../components/PopupTransaction.vue";

const swal = inject("$swal");
const transactions = ref([]);
const isShowPopup = ref(false);
const editingTransaction = ref(null);

const editTransaction = (transaction) => {
  editingTransaction.value = transaction;
  isShowPopup.value = true;
};

const deleteTransaction = (id) => {
  swal.fire({
    title: "Are you sure? Once deleted this transaction, you will not be able to recover it!",
    showDenyButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      TransactionServices.deleteTransaction(id);
      swal.fire("Saved!", "", "success");
    }
  });
};

TransactionServices.getTransactionsSnapshot((data) => {
  transactions.value = data;
});
</script>
<template>
  <div class="flex justify-center flex-col h-full">
    <div class="flex-1 overflow-y-auto p-2">
      <div class="h-full flex flex-col max-w-[500px] mx-auto px-4 overflow-x-auto">
        <div class="text-right my-4">
          <router-link to="/" class="text-white bg-sky-500 rounded-md px-4 py-2"
            >Go Home</router-link
          >
        </div>
        <h2 class="font-bold text-center text-2xl">List Transactions</h2>
        <div class="flex-1 overflow-y-auto overflow-x-auto mt-5 text-[12px]">
          <div class="flex">
            <div class="w-[40px] flex-[0_0_40px] border-b-2 border-blue-500 p-1 text-center font-bold">In / Out?</div>
            <div class="w-[50px] flex-[0_0_50px] border-b-2 border-blue-500 p-1 text-center font-bold">Money Type</div>
            <div class="w-[70px] flex-[0_0_70px] border-b-2 border-blue-500 p-1 font-bold">Total</div>
            <div class="w-[100px] flex-[0_0_100px] border-b-2 border-blue-500 p-1 font-bold">Description</div>
            <div class="w-[70px] flex-[0_0_70px] border-b-2 border-blue-500 p-1 font-bold">Created At</div>
            <div class="w-[120px] flex-[0_0_120px] border-b-2 border-blue-500 p-1 text-center font-bold">Actions</div>
          </div>
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="flex"
          >
            <div class="w-[40px] flex-[0_0_40px] border-b-2 border-blue-500 p-1 text-center">{{ transaction.inputType }}</div>
            <div class="w-[50px] flex-[0_0_50px] border-b-2 border-blue-500 p-1 text-center">{{ transaction.moneyType }}</div>
            <div class="w-[70px] flex-[0_0_70px] border-b-2 border-blue-500 p-1">{{ $numberWithCommas(transaction.total || 0) }}</div>
            <div class="w-[100px] flex-[0_0_100px] border-b-2 border-blue-500 p-1">{{ transaction.description }}</div>
            <div class="w-[70px] flex-[0_0_70px] border-b-2 border-blue-500 p-1">{{ formatDate(transaction.createdAt) }}</div>
            <div class="w-[120px] flex-[0_0_120px] border-b-2 border-blue-500 p-1 flex items-center justify-center">
              <button class="bg-green-500 text-white px-1 m-1" @click="editTransaction(transaction)">Edit</button>
              <button class="bg-red-500 text-white px-1 m-1" @click="deleteTransaction(transaction.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PopupTransaction v-model="isShowPopup" :transaction="editingTransaction || {}" />
  </div>
</template>
