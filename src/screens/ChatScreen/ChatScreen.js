import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect, useLayoutEffect  } from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { auth } from '../../../firebase'
import { addDoc, collection, serverTimestamp , doc, onSnapshot, query, orderBy, updateDoc} from 'firebase/firestore';
import { database } from '../../../firebase';
import Colors from '../../../utils/Colors';
import { Ionicons } from "@expo/vector-icons";

export default function Chat({navigation, route}) {
  const uid = route.params.id
  const [messages, setMessages] = useState([]);
  const currentUser = auth?.currentUser?.uid;
  const markMessagesAsSeen = async (messageDocs) => {
    const currentTime = new Date();
    messageDocs.forEach((doc) => {
      const messageData = doc.data();
      if (messageData.createdAt?.toDate() < currentTime && !messageData.seen && messageData.sentTo === currentUser) {
        // Update the message 'seen' status in Firestore
        const messageRef = doc.ref;
        updateDoc(messageRef, { seen: true }).catch((error) => console.error("Error updating message seen status:", error));
      }
    });
  };
  
  
  useEffect(() => {
    const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
    const docref = doc(database, 'chatrooms', chatId);
    const colRef = collection(docref, 'messages');
    const q = query(colRef, orderBy('createdAt',"desc"));
    const unsubcribe = onSnapshot(q, (onSnap) => {
      const allMsg = onSnap.docs.map(mes => {
        console.log(mes.data().createdAt)
        if(mes.data().createdAt != null){
          return{
            ...mes.data(),
            createdAt:mes.data().createdAt.toDate()
          }
        }
        else{
          return{
            ...mes.data(),
            createdAt:new Date()
          }
        }
      })
      markMessagesAsSeen(onSnap.docs); 
      setMessages(allMsg);

    })
  
    return () => {
      unsubcribe()
    }
  }, [])
  
  

  const onSend = useCallback((messagesArray) => {
    const msg = messagesArray[0];
    // console.log(myMsg)
    const myMsg = {
      ...msg,
      sentBy:currentUser,
      sentTo:uid,
      seen: false
//chatrooms/1233438485/messages/123/msg, createdat
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
    const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;


    const docref = doc(database, 'chatrooms', chatId);
    const colRef = collection(docref, 'messages');
    const chatSnap = addDoc(colRef, {
      ...myMsg,
      createdAt:serverTimestamp(),
    })
  }, [])
  const renderTicks = (message) => {
    if (message.user._id === auth.currentUser.uid) { // Check if the message was sent by the current user
      if (message.seen) {
        // Render a double checkmark if the message has been seen
        return <View className="mr-5"><Ionicons name="checkmark-done-sharp" size={14} color={"#fff"} /></View>
      } else {
        // Optionally, render a single checkmark or another icon to indicate the message was sent but not yet seen
        return <View className="mr-5"><Ionicons name="checkmark-sharp" size={14} color={"#fff"} /></View>
      }
    }
    return null;
  };

  // Custom renderBubble function to incorporate custom rendering of ticks
  const renderBubble = (props) => (
    <Bubble
      {...props}
      renderTicks={renderTicks} // Pass the custom renderTicks function
      wrapperStyle={{
        right: { backgroundColor: Colors.primary },
      }}
    />
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={text => onSend(text)}
      showUserAvatar={false}
      showAvatarForEveryMessage={false}
      messagesContainerStyle={{
        backgroundColor: '#fff', 
      }}
      user={{
        _id: currentUser,
      }}
      renderBubble={renderBubble}
    />
  )
}

const styles = StyleSheet.create({})