// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { keys } from "../../secrets.mjs";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: keys.firebase,
  authDomain: "libraryapplication-b5ac0.firebaseapp.com",
  projectId: "libraryapplication-b5ac0",
  storageBucket: "libraryapplication-b5ac0.appspot.com",
  messagingSenderId: "325078680891",
  appId: "1:325078680891:web:c91c4cf4279e76f2a2631e",
  measurementId: "G-404P8HBEP0",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(firebaseApp);
}

export { firebaseApp, storage, analytics };
