<script setup>
import { ref, inject } from "vue";
import TransactionServices from "../firebase/transaction/transaction.services";

const swal = inject("$swal");

const defaultFormData = {
  total: 0,
  inputType: "out",
  moneyType: "cash",
  description: "",
  spentAt: new Date(),
};

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
  TransactionServices.createTransaction(formData)
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
          <div class="flex justify-center mt-10">
            <button class="bg-blue-500 text-white px-4 py-2">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
