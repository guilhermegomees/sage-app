import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAouIj3GOq5jHO7iz-aT7YtnaRyQX4_LPA",
    authDomain: "sage-42ee5.firebaseapp.com",
    projectId: "sage-42ee5",
    storageBucket: "sage-42ee5.appspot.com",
    messagingSenderId: "858475999260",
    appId: "1:858475999260:web:82b1ef05e918cbed52afd9"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 