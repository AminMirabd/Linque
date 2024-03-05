import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8qTPoFvsAtk3jGUdIW4zDZqG8jVg9ZqY",
  authDomain: "rnlinques.firebaseapp.com",
  projectId: "rnlinques",
  storageBucket: "rnlinques.appspot.com",
  messagingSenderId: "1001722919774",
  appId: "1:1001722919774:web:066475ea71cfcc3ccb6dcf",
  measurementId: "G-58DKGCNMPH",
};

let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const database = getFirestore();

export { auth, database, firebase };
