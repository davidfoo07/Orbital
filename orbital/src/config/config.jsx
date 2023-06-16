import { initializeApp } from "firebase/app"
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdc5N_T0WR1VFJAhuaBDsyh5RDxZ06Vy4",
  authDomain: "one2sell-a482a.firebaseapp.com",
  projectId: "one2sell-a482a",
  storageBucket: "one2sell-a482a.appspot.com",
  messagingSenderId: "601130820711",
  appId: "1:601130820711:web:bb7264fafc0ad2bf4120c2",
  measurementId: "G-PXPSX0CXWP"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
export default app