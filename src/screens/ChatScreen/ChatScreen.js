import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { auth } from '../../../firebase'
import { addDoc, collection, serverTimestamp , doc, onSnapshot, query, orderBy} from 'firebase/firestore';
import { database } from '../../../firebase';

export default function Chat({route}) {
  const uid = route.params.id
  
  const [messages, setMessages] = useState([]);
  const currentUser = auth?.currentUser?.uid;
  console.log(currentUser)
  useEffect(() => {
    const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
    const docref = doc(database, 'chatrooms', chatId);
    const colRef = collection(docref, 'messages');
    const q = query(colRef, orderBy('createdAt',"desc"));
    const unsubcribe = onSnapshot(q, (onSnap) => {
      const allMsg = onSnap.docs.map(mes => {
        if(mes.data().createdAt){
          return{
            ...mes.data(),
            createdAt:mes.data().createdAt.toDate()
          }
        }else{
          return{
            ...mes.data(),
            createdAt:new Date()
          }
        }
        

      })
      setMessages(allMsg)

    })

      return () => {
        unsubcribe()
      }
  },[])

  const onSend = useCallback((messagesArray) => {
    const msg = messagesArray[0];
    // console.log(myMsg)
    const myMsg = {
      ...msg,
      sentBy:currentUser,
      sentTo:uid
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
  return (
    <GiftedChat
      messages={messages}
      onSend={text => onSend(text)}
      showUserAvatar={false}
      messagesContainerStyle={{
        backgroundColor: '#fff', 
      }}
      user={{
        _id: currentUser,
      }}
    />
  )
}

const styles = StyleSheet.create({})