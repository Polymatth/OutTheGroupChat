// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtwL42ufB-9fDpIu3LXBYlCdUzGct8pzQ", //Hide this later
  authDomain: "outthegroupchat1.firebaseapp.com",
  projectId: "outthegroupchat1",
  storageBucket: "outthegroupchat1.firebasestorage.app",
  messagingSenderId: "641642838861",
  appId: "1:641642838861:web:f8b59eb6f991168a1e5504",
  measurementId: "G-KQ9JLMZ7MQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);