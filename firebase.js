// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"

//the below breaks the code
// import { getAnalytics } from "firebase/analytics"

import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY_7zhG7C6BTVIAS-BFD-ABWY0csKSeC4",
  authDomain: "inventory-management-ef26c.firebaseapp.com",
  projectId: "inventory-management-ef26c",
  storageBucket: "inventory-management-ef26c.appspot.com",
  messagingSenderId: "836365265110",
  appId: "1:836365265110:web:42b5e26b29783a720e4177",
  measurementId: "G-SSMGR20VSQ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

//be able to access firestore files:
export {firestore}
