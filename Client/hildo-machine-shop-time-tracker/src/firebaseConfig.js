// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9xnEYNRxMvkvW5mx4bkAII0c5MqBPnvU",
  authDomain: "hildomachineshoptimetracker.firebaseapp.com",
  projectId: "hildomachineshoptimetracker",
  storageBucket: "hildomachineshoptimetracker.appspot.com",
  messagingSenderId: "496942324599",
  appId: "1:496942324599:web:6d2f416e04158b923adf72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };