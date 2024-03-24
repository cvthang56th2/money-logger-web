<script setup>
const { modelValue } = defineProps(["modelValue"]);
const id = Math.random().toString(36).substr(2, 9);
</script>

<template>
  <div class="space-y-4">
    <div class="flex space-x-3 justify-between items-center">
      <div class="flex space-x-8">
        <div class="flex space-x-2">
          <input v-model="modelValue.inputType" type="radio" :id="`out-${id}`" name="out" value="out">
          <label :for="`out-${id}`">Out</label><br>
        </div>
        <div class="flex space-x-2">
          <input v-model="modelValue.inputType" type="radio" :id="`in-${id}`" name="in" value="in">
          <label :for="`in-${id}`">In</label><br>
        </div>
      </div>
      <div class="flex flex-col space-y-3">
        <select
          class="p-2 border-2 rounded-md"
          v-model="modelValue.moneyType"
          id="moneyType"
        >
          <option value="cash">Cash</option>
          <option value="momo">MOMO</option>
          <option value="bank">Bank</option>
        </select>
      </div>
    </div>
    <div class="flex flex-col space-y-3">
      <label for="total">Total <span class="text-red-500">(*)</span></label>
      <input
        v-model="modelValue.total"
        id="total"
        type="number"
        class="px-4 py-2 border-2 rounded-md"
      />
    </div>
    <div class="flex flex-col space-y-3">
      <label for="description">Description <span class="text-red-500">(*)</span> </label>
      <textarea
        v-model="modelValue.description"
        id="description"
        class="px-4 py-2 border-2 rounded-md"
      ></textarea>
    </div>
  </div>
</template>
