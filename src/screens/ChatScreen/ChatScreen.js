import React, { useState, useCallback, useEffect } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { auth } from "../../../firebase";
import Colors from "../../../utils/Colors";
import { addMessageDB, getMessagesDB } from "../../../utils/firebaseOperations";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Chat({ route }) {
  const uid = route.params.id;
  const insets = useSafeAreaInsets();

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
      renderAvatar={null}
      bottomOffset={insets.bottom}
      showAvatarForEveryMessage={false}
      messagesContainerStyle={{
        backgroundColor: Colors.white,
        paddingBottom: 40,
      }}
      user={{
        _id: currentUser,
      }}
      minInputToolbarHeight={Keyboard.isVisible ? 0 : 40}
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
      renderSend={(props) => {
        return (
          <Send
            {...props}
            containerStyle={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="send-circle"
              size={40}
              color={"#06BCEE"}
            />
          </Send>
        );
      }}
      alwaysShowSend
    />
  );
}

const styles = StyleSheet.create({});
