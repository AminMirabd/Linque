import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../../../firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import Colors from "../../../utils/Colors";

export default function GroupChat() {
  //const uid = route.params.uid
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const currentUser = auth?.currentUser?.uid;

  const fetchUserProfilePicture = async (userId) => {
    try {
      const userDoc = await getDoc(doc(database, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.photo) {
          return userData.photo;
        } else {
          return `https://ui-avatars.com/api/?name=${userData.name} ${userData.lastName}&background=random&color=fff`;
        }
      } else {
        console.log("No such user!");
        return '';
      }
    } catch (error) {
      console.error("Error fetching user profile picture: ", error);
      return '';
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
            avatar, 
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
        _id: currentUser, 
      }}
      showUserAvatar={true}
      messagesContainerStyle={{
        backgroundColor: '#fff', 
      }}
      renderBubble={(props) => {
        const backgroundColor = props.currentMessage.user._id === currentUser? Colors.primary : '#gray';
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: backgroundColor },
              left: {}, 
            }}
          />
        );
      }}
    />
  );
}