<script setup>
import { ref, inject } from "vue";
import TransactionServices from "../firebase/transaction/transaction.services";
import { defaultFormData } from '../constants/constants'
import TransactionForm from "../components/TransactionForm.vue";

const swal = inject("$swal");

const formData = ref(JSON.parse(JSON.stringify(defaultFormData)));

const submit = async () => {
  const { total, description } = formData.value;
  if (total <= 0 || description === "") {
    swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill all required fields",
    });
    return;
  }
  TransactionServices.createTransaction(formData.value)
    .then(() => {
      swal.fire({
        icon: "success",
        title: "Success",
        text: "Transaction created successfully",
      });
    })
    .catch(() => {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create transaction",
      });
    });

  formData.value = JSON.parse(JSON.stringify(defaultFormData));
};
</script>
<template>
  <div class="flex justify-center flex-col h-full">
    <div class="flex-1 overflow-y-auto p-2">
      <div class="max-w-[500px] mx-auto px-4">
        <div class="text-right my-4">
          <router-link
            to="/transactions"
            class="text-white bg-sky-500 rounded-md px-4 py-2"
            >Go to Transactions list</router-link
          >
        </div>
        <h2 class="font-bold text-center text-2xl">Create Transaction</h2>
        <form @submit.prevent="submit" class="flex flex-col mt-5">
          <TransactionForm v-model="formData" />
          <div class="flex justify-center mt-10">
            <button class="bg-blue-500 text-white px-4 py-2">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
