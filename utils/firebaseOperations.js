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
  serverTimestamp,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { getStorage, ref, deleteObject, uploadBytes } from "firebase/storage";

//Add functions
//
// export const requestToTakeShift = async (eventId, employeeId) => {
//   const shiftRequestRef = collection(database, "shiftRequests");
//   try {
//     await addDoc(shiftRequestRef, {
//       eventId: eventId,
//       employeeId: employeeId,
//       requestedAt: serverTimestamp() // To record when the request was made
//     });
//     console.log("Shift request successfully made");
//   } catch (error) {
//     console.error("Error making shift request:", error);
//   }
// };
export const requestToTakeShift = async (eventId, employeeId) => {
  const eventRequestRef = doc(database, "shiftRequests", eventId);
  try {
    const docSnap = await getDoc(eventRequestRef);
    if (docSnap.exists()) {
      // If request exists, update the existing document
      await updateDoc(eventRequestRef, {
        employeesRequested: arrayUnion(employeeId),
        requestedAt: serverTimestamp(), // Optional: Update if you want the latest request timestamp
      });
    } else {
      // If no request exists, create a new document
      await setDoc(eventRequestRef, {
        eventId: eventId,
        employeesRequested: [employeeId],
        requestedAt: serverTimestamp(),
      });
    }
    console.log("Shift request successfully updated/created");
  } catch (error) {
    console.error("Error making/updating shift request:", error);
  }
};
//
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
export const addMessageDB = async (chatId, message) => {
  try {
    const messageDocRef = doc(database, "chatrooms", chatId);
    const messageCollectionRef = collection(messageDocRef, "messages");

    await addDoc(messageCollectionRef, {
      ...message, // Spread the message object to avoid nested structure
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding message: ", error);
  }
};

//Get functions

export const getUserInfoDB = async (uid, setUserData = null) => {
  try {
    const docRef = doc(database, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (setUserData) {
        setUserData(userData);
      }
      return userData; // Return the data for direct usage
    }
  } catch (e) {
    console.error("Error getting user", e);
    return null; // Ensure a null return on error for consistency
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
export const getUsersByIdsDB = async (ids, setUsers) => {
  const q = query(collection(database, "users"), where("UID", "in", ids));
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
      const eventFrom = eventData.date.from; // Convert Timestamp to ISO string
      const eventTo = eventData.date.to; // Convert Timestamp to ISO string

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
export const getLastMessagaDB = async (chatId, setLastMessage) => {
  const messagesRef = collection(database, "chatrooms", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
  onSnapshot(q, (querySnapshot) => {
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      const multiline = data.text.split("\n");

      if (data.text.length > 20) {
        data.text = data.text.slice(0, 19) + "...";
      }

      if (multiline.length > 1) {
        data.text = multiline[0] + "...";
      }

      setLastMessage(data.text);
    } else {
      setLastMessage("No messages yet");
    }
  });
};

export const getMessagesDB = (chatId, setMessages) => {
  const messagesRef = collection(database, "chatrooms", chatId, "messages");

  const q = query(messagesRef, orderBy("createdAt", "desc"));

  onSnapshot(q, (onSnap) => {
    const allMsg = onSnap.docs.map((mes) => {
      if (mes.data().createdAt) {
        return {
          ...mes.data(),
          createdAt: mes.data().createdAt.toDate(),
        };
      } else {
        return {
          ...mes.data(),
          createdAt: new Date(),
        };
      }
    });

    setMessages(allMsg);
  });
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
