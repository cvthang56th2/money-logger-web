import {
  setDoc,
  getDocs,
  doc,
  query,
  orderBy,
  where,
  limit,
  collection,
  onSnapshot,
  Timestamp,
  updateDoc,
  deleteDoc,
  startAfter
} from 'firebase/firestore'
import { db } from '../config'
import { uid } from 'uid'
import { snapshotToArray } from '../../utils/utils'
import { ORDER_STATUS } from '../../constants/constants'

const ORDER = 'orders'

class orderServices {
  async createOrder(data) {
    return new Promise(function(resolve, reject) {
      try {
        const id = data.id || uid(8)
        const today = new Date()
        const ref = doc(db, ORDER, id)
        data.id = id
        return resolve(setDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          createdAt: Timestamp.fromDate(today),
          ...data
        }))
      } catch (err) {
        console.error('error create order', err)
        reject(err)
      }
    });
  }

  async updateOrder(orderId, data) {
    return new Promise(function(resolve, reject) {
      try {
        const today = new Date()
        const ref = doc(db, ORDER, orderId)
        return resolve(updateDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          ...data
        }))
      } catch (err) {
        console.error('error update order', err)
        reject(err)
      }
    })
  }

  async deleteOrder(orderId) {
    return new Promise(function(resolve, reject) {
      try {
        const ref = doc(db, ORDER, orderId)
        return resolve(deleteDoc(ref))
      } catch (err) {
        console.error('error delete order', err)
        reject(err)
      }
    })
  }

  async getStatisticToday() {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      const q = query(collection(db, ORDER), where("status", "==", ORDER_STATUS.success), where("updatedAt", ">=", startTimestamp), where("updatedAt", "<=", endTimestamp))
      const querySnapshot = await getDocs(q);
      return snapshotToArray(querySnapshot).reduce((resultObj, orderObj) => {
        resultObj.total += orderObj.total
        return resultObj
      }, {
        total: 0
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async getAllOrders(options = {}) {
    try {
      const { isNextPage, lastVisible, pageSize = 20 } = options
      let q = query(collection(db, ORDER), orderBy("updatedAt", 'desc'), limit(pageSize))
      if (isNextPage) {
        q = query(q, startAfter(lastVisible));
      }
      const querySnapshot = await getDocs(q);
      return {
        data: snapshotToArray(querySnapshot),
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
        nextPageAvailable: querySnapshot.docs.length >= pageSize
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  getOrdersSnapshot(callback, { status }) {
    let q = query(collection(db, ORDER), orderBy("createdAt"))
    if (status) {
      q = query(q, where("status", "==", status))
    }
    if (typeof this.unsubscribeOrders === 'function') {
      this.unsubscribeOrders()
    }
    this.unsubscribeOrders = onSnapshot(q, querySnapshot => {
      if (typeof callback === 'function')  {
        callback(snapshotToArray(querySnapshot))
      }
    });
  }
}

export default new orderServices()
