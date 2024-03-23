import { StyleSheet, Text, View } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { auth } from "../../../firebase";
import Colors from "../../../utils/Colors";
import { addMessageDB, getMessagesDB } from "../../../utils/firebaseOperations";

export default function Chat({ route }) {
  const uid = route.params.id;

  const [messages, setMessages] = useState([]);
  const currentUser = auth?.currentUser?.uid;

  useEffect(() => {
    const chatId =
      uid > currentUser
        ? `${uid + "-" + currentUser}`
        : `${currentUser + "-" + uid}`;

    getMessagesDB(chatId, setMessages);
  }, []);

  const onSend = useCallback(
    (messagesArray) => {
      const msg = messagesArray[0];

      const myMsg = {
        ...msg,
        sentBy: currentUser,
        sentTo: uid,
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );

      const chatId =
        uid > currentUser ? `${uid}-${currentUser}` : `${currentUser}-${uid}`;

      addMessageDB(chatId, myMsg);
    },
    [currentUser, uid, setMessages]
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(text) => onSend(text)}
      showUserAvatar={false}
      showAvatarForEveryMessage={false}
      messagesContainerStyle={{
        backgroundColor: Colors.white,
      }}
      user={{
        _id: currentUser,
      }}
      renderBubble={(props) => {
        const backgroundColor =
          props.currentMessage.user._id === currentUser
            ? Colors.primary
            : Colors.grayLowContrast;
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: backgroundColor,
                borderBottomRightRadius: 0,
              },
              left: {
                backgroundColor: backgroundColor,
                borderBottomLeftRadius: 0,
              },
            }}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({});
