import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAOAB2CE4ihF4dfeA1PBO-PFe1jhoCSyK4",
  authDomain: "mealdb-77d8c.firebaseapp.com",
  projectId: "mealdb-77d8c",
  storageBucket: "mealdb-77d8c.firebasestorage.app",
  messagingSenderId: "297493844965",
  appId: "1:297493844965:web:52a42eb7f0634d8291150c",
  measurementId: "G-MR8PW557T6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);