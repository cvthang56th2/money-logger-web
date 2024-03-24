<script setup>
import { nextTick, ref, watch, onMounted } from 'vue';
import { numberWithCommas, parseToNumber } from '../utils/utils'

const props = defineProps({
  modelValue: {
    type: [Number, String, null]
  },
  max: {
    type: [Number, null],
  },
  min: {
    type: [Number, null],
  },
})
const emit = defineEmits(['update:modelValue'])
const inputData = ref(null)
watch(() => props.modelValue, (v) => {
  inputData.value = numberWithCommas(v)
})
watch(inputData, (v) => {
  nextTick(() => {
    if (props.max && parseToNumber(v) > props.max) {
      v = props.max
    }
    if (v && props.min && parseToNumber(v) < props.min) {
      v = props.min
    }
    inputData.value = numberWithCommas(v)
    emit('update:modelValue', parseToNumber(inputData.value))
  })
})
onMounted(() => {
  inputData.value = numberWithCommas(props.modelValue)
})
</script>
<template>
  <input
    v-model="inputData"
    type="text"
  />
</template>