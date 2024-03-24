import { defineStore } from "pinia"
import { ref } from "vue"
import ProductServices from '../firebase/product/product'

export const useProductStore = defineStore('product', () => {
  const products = ref({})
  const setProducts = data => {
    products.value = data || {}
  }
  const getProducts = async () => {
    const data = await ProductServices.getAllProducts()
    products.value = data || {}
  }

  return { products, setProducts, getProducts }
})