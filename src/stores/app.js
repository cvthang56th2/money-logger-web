import { defineStore } from "pinia"
import { ref } from "vue"
import OrderServices from '../firebase/order/order'

export const useAppStore = defineStore('app', () => {
  const settings = ref({})
  const statisticToday = ref({})
  const setSettings = data => {
    settings.value = data || {}
  }
  const getStatisticToday = async () => {
    try {
      const data = await OrderServices.getStatisticToday()
      statisticToday.value = data ||{}
    } catch (error) {
    }
  }

  return { settings, setSettings, statisticToday, getStatisticToday }
})