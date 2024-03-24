import {auth} from '../config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import UserServices from '../user/user.services';

class AuthServices {
  onAuthStateChanged(cb) {
    return onAuthStateChanged(auth, cb);
  }
  async register(email, password, options) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const {userName} = options;
    const {uid} = res.user;
    UserServices.create(uid, {
      email,
      uid,
      userName,
    });
    return res;
  }

  loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  loginWithAnonymous() {
    return signInAnonymously(auth);
  }

  resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async logout() {
    return signOut(auth);
  }
}

export default new AuthServices();
