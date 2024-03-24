import {
  setDoc,
  getDocs,
  doc,
  query,
  orderBy,
  where,
  collection,
  onSnapshot,
  Timestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../config'
import { uid } from 'uid'
import { snapshotToArray } from '../../utils/utils'

const PRODUCT = 'products'

class productServices {
  async createProduct(data) {
    return new Promise(function(resolve, reject) {
      try {
        const id = data.id || uid(8)
        const today = new Date()
        const ref = doc(db, PRODUCT, id)
        data.id = id
        return resolve(setDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          createdAt: Timestamp.fromDate(today),
          ...data
        }))
      } catch (err) {
        console.error('error create product', err)
        reject(err)
      }
    });
  }

  async updateProduct(productId, data) {
    return new Promise(function(resolve, reject) {
      try {
        const today = new Date()
        const ref = doc(db, PRODUCT, productId)
        return resolve(updateDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          ...data
        }))
      } catch (err) {
        console.error('error update product', err)
        reject(err)
      }
    })
  }

  async deleteProduct(productId) {
    return new Promise(function(resolve, reject) {
      try {
        const ref = doc(db, PRODUCT, productId)
        return resolve(deleteDoc(ref))
      } catch (err) {
        console.error('error delete product', err)
        reject(err)
      }
    })
  }

  async getAllProducts(options = {}) {
    try {
      const q = query(collection(db, PRODUCT), orderBy("pid"))
      const querySnapshot = await getDocs(q);
      return snapshotToArray(querySnapshot)
    } catch (error) {
      console.log('error', error)
    }
  }

  getProductsSnapshot(callback, { status }) {
    let q
    if (status) {
      q = query(collection(db, PRODUCT), orderBy("createdAt", 'desc'), where("status", "==", status))
    } else {
      q = query(collection(db, PRODUCT), orderBy("createdAt", 'desc'))
    }
    if (typeof this.unsubscribeProducts === 'function') {
      this.unsubscribeProducts()
    }
    this.unsubscribeProducts = onSnapshot(q, querySnapshot => {
      if (typeof callback === 'function')  {
        callback(snapshotToArray(querySnapshot))
      }
    });
  }
}

export default new productServices()
