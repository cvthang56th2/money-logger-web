import {
  setDoc,
  getDoc,
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

const OPTION = 'options'

class optionServices {
  async createOption(data) {
    return new Promise(function(resolve, reject) {
      try {
        const id = data.id || uid(8)
        const today = new Date()
        const ref = doc(db, OPTION, id)
        data.id = id
        return resolve(setDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          createdAt: Timestamp.fromDate(today),
          ...data
        }))
      } catch (err) {
        console.error('error create option', err)
        reject(err)
      }
    });
  }

  async updateOption(optionId, data) {
    return new Promise(function(resolve, reject) {
      try {
        const today = new Date()
        const ref = doc(db, OPTION, optionId)
        return resolve(updateDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          ...data
        }))
      } catch (err) {
        console.error('error update option', err)
        reject(err)
      }
    })
  }

  async deleteOption(optionId) {
    return new Promise(function(resolve, reject) {
      try {
        const ref = doc(db, OPTION, optionId)
        return resolve(deleteDoc(ref))
      } catch (err) {
        console.error('error delete option', err)
        reject(err)
      }
    })
  }

  async getOptionById(id) {
    try {
      const optionRef = doc(db, OPTION, id)
      const docSnap = await getDoc(optionRef)
      if (docSnap.exists()) {
        return docSnap.data()
      }
      return null
    } catch (error) {
      console.log('error', error)
    }
  }

  getOptions(callback) {
    const q = query(collection(db, OPTION), orderBy("createdAt"))
    if (typeof this.unsubscribeOptions === 'function') {
      this.unsubscribeOptions()
    }
    this.unsubscribeOptions = onSnapshot(q, querySnapshot => {
      if (typeof callback === 'function')  {
        callback(snapshotToArray(querySnapshot))
      }
    });
  }
}

export default new optionServices()
