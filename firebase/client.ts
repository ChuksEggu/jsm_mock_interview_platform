// Import the functions you need from the SDKs you need
import { initializeApp , getApps, getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB2fvPb31xJsCWPBmsrKCUVgv9B1R1BH0Y",
    authDomain: "prepwise-161aa.firebaseapp.com",
    projectId: "prepwise-161aa",
    storageBucket: "prepwise-161aa.firebasestorage.app",
    messagingSenderId: "976067143983",
    appId: "1:976067143983:web:e72c91909d7c83538cd9da",
    measurementId: "G-WXKQLGLJXC"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig):getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
