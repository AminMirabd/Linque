import { database } from "../firebase";
import {
  getDoc,
  onSnapshot,
  collection,
  query,
  setDoc,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, deleteObject, uploadBytes } from "firebase/storage";

export const addUserDB = async (user) => {
  const usersRef = collection(database, "users");
  try {
    await setDoc(doc(usersRef, user.uid), {
      UID: user.uid,
      name: user.name,
      lastName: user.lastName,
      username: user.username,
      address: user.address,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
    });
  } catch (error) {
    alert(`Error creating user fb ${error} `);
  }
};
