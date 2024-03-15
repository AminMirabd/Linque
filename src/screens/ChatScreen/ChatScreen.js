import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../../../firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import Colors from "../../../utils/Colors";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  // Function to fetch user profile picture by user ID
  const fetchUserProfilePicture = async (userId) => {
    try {
      const userDoc = await getDoc(doc(database, "users", userId)); // Assuming 'users' is your collection
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.photo; // Assuming 'photo' is the field for the user profile picture URL
      } else {
        console.log("No such user!");
        return ''; // Return a default or placeholder image URL if needed
      }
    } catch (error) {
      console.error("Error fetching user profile picture: ", error);
      return ''; // Return a default or placeholder image URL in case of error
    }
  };

  useLayoutEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const messagesWithAvatars = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const messageData = doc.data();
        const avatar = await fetchUserProfilePicture(messageData.user._id);
        return {
          _id: doc.id,
          createdAt: messageData.createdAt.toDate(),
          text: messageData.text,
          user: {
            ...messageData.user,
            avatar, // Assign the fetched avatar URL to the user object
          },
        };
      }));
      setMessages(messagesWithAvatars);
    });
    return unsubscribe;
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    const avatar = await fetchUserProfilePicture(user._id); // Fetch avatar for the sender

    addDoc(collection(database, 'chats'), {
      _id,
      createdAt,
      text,
      user: {
        ...user,
        avatar, 
      },
    });
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth?.currentUser?.uid, 
      }}
      showUserAvatar={true}
      messagesContainerStyle={{
        backgroundColor: '#fff', 
      }}
      renderBubble={(props) => {
        const backgroundColor = props.currentMessage.user._id === auth?.currentUser?.uid ? Colors.primary : '#gray';
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: backgroundColor }, // Your messages
              left: {}, // Messages from others can be customized here as well
            }}
          />
        );
      }}
    />
  );
}
