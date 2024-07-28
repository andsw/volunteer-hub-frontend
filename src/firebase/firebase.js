import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, push, set, update, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBmTHuwjzOuZtHTqS83lGn5guQDUSi7vG4",
  authDomain: "volunteer-hub-a54d8.firebaseapp.com",
  projectId: "volunteer-hub-a54d8",
  storageBucket: "volunteer-hub-a54d8.appspot.com",
  messagingSenderId: "196824170322",
  appId: "1:196824170322:web:b72faab4567abd9acd448b",
  measurementId: "G-VZQY10BSGH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getDatabase(app);


export { app, auth, db, ref, onValue, push, set, update, get};
