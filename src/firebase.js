import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPbpbSo7XVRqXXdn6LChrJcrrQKqL5-PU",
  authDomain: "studentpunchapp.firebaseapp.com",
  projectId: "studentpunchapp",
  storageBucket: "studentpunchapp.appspot.com",
  messagingSenderId: "1097095993421",
  appId: "1:1097095993421:android:e9b9b4bf38330e5e5ee404"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
