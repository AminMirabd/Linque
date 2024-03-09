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

//Add functions

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
      photo: "",
    });
  } catch (error) {
    alert(`Error creating user fb ${error} `);
  }
};

export const addEventDB = async (event) => {
  const eventsRef = collection(database, "events");
  try {
    await setDoc(doc(eventsRef, event.id), event);

    for (const employeeUID of event.employeesAssigned) {
      await updateDoc(doc(database, "users", employeeUID), {
        events: arrayUnion(event.id),
      });
    }
  } catch (error) {
    alert(`Error creating event in firebase ${error} `);
  }
};

//Get functions

export const getUserInfoDB = async (uid, setUserData) => {
  try {
    const docRef = doc(database, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
  } catch (e) {
    console.error("Error getting user", e);
  }
};
export const getAllUsersDB = async (setUsers) => {
  const q = query(collection(database, "users"));
  onSnapshot(q, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    setUsers(users);
  });
};
export const getEventsDB = async (from, to) => {
  const events = [];
  const eventsRef = collection(database, "events");

  try {
    const querySnapshot = await getDocs(eventsRef);
    querySnapshot.forEach((doc) => {
      const eventData = doc.data();
      const eventFrom = eventData.date.from.toDate().toISOString(); // Convert Timestamp to ISO string
      const eventTo = eventData.date.to.toDate().toISOString(); // Convert Timestamp to ISO string

      if (eventFrom <= to && eventTo >= from) {
        const formattedEventData = {
          ...eventData,
          start: eventFrom,
          end: eventTo,
        };
        events.push(formattedEventData);
      }
    });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
export const getEventInfoDB = async (id, setEventData) => {
  try {
    const docRef = doc(database, "events", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setEventData(docSnap.data());
    }
  } catch (e) {
    console.error("Error getting event", e);
  }
};

//Update functions
export const updateUserProfilePicture = async (user, url) => {
  try {
    await setDoc(doc(database, "users", user.UID), {
      ...user,
      photo: url,
    });
  } catch (error) {
    console.log("Error updating user profile picture in firebase", error);
  }
};

export const updateUserInformation = async (user) => {
  const usersRef = collection(database, "users");
  try {
    await setDoc(doc(usersRef, user.UID), user);
  } catch (error) {
    alert(`Error updating user in firebase ${error} `);
  }
};
