import { Keyboard, StyleSheet, Text, View, Platform } from "react-native";
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { auth } from "../../../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { database } from "../../../firebase";
import Colors from "../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

export default function Chat({ navigation, route }) {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const uid = route.params.id;
  const [messages, setMessages] = useState([]);
  const currentUser = auth?.currentUser?.uid;
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [paddingBottom, setPaddingBottom] = useState(20);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
        setPaddingBottom(0);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
        setPaddingBottom(23);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const chatId =
        uid > currentUser
          ? `${uid + "-" + currentUser}`
          : `${currentUser + "-" + uid}`;
      const docRef = doc(database, "chatrooms", chatId);
      const colRef = collection(docRef, "messages");
      const q = query(colRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const incomingMessages = snapshot.docs.map((docSnapshot) => {
          const messageData = docSnapshot.data();
          const createdAtDate = messageData.createdAt?.toDate
            ? messageData.createdAt.toDate()
            : new Date();

          return {
            _id: docSnapshot.id,
            ...messageData,
            createdAt: createdAtDate,
          };
        });

        snapshot.docs.forEach((docSnapshot) => {
          const messageData = docSnapshot.data();
          if (!messageData.seen && messageData.sentTo === currentUser) {
            const messageRef = docSnapshot.ref;
            updateDoc(messageRef, { seen: true }).catch(console.error);
          }
        });
        setMessages(incomingMessages);
        if (Platform.OS == "android") {
          setMessages(incomingMessages);
        }
      });

      return () => unsubscribe();
    }, [uid, currentUser])
  );

  const onSend = useCallback((messagesArray) => {
    const msg = messagesArray[0];
    // console.log(myMsg)
    const myMsg = {
      ...msg,
      sentBy: currentUser,
      sentTo: uid,
      seen: false,
      //chatrooms/1233438485/messages/123/msg, createdat
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, myMsg)
    );
    const chatId =
      uid > currentUser
        ? `${uid + "-" + currentUser}`
        : `${currentUser + "-" + uid}`;

    const docref = doc(database, "chatrooms", chatId);
    const colRef = collection(docref, "messages");
    const chatSnap = addDoc(colRef, {
      ...myMsg,
      createdAt: serverTimestamp(),
    });
  }, []);
  const renderTicks = (message) => {
    if (message.user._id === auth.currentUser.uid) {
      if (message.seen) {
        return (
          <View className="mr-5">
            <Ionicons name="checkmark-done-sharp" size={14} color={"#fff"} />
          </View>
        );
      } else {
        return (
          <View className="mr-5">
            <Ionicons name="checkmark-sharp" size={14} color={"#fff"} />
          </View>
        );
      }
    }
    return null;
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      renderTicks={renderTicks}
      wrapperStyle={{
        right: { backgroundColor: Colors.primary, marginRight: 5 },
        left: { paddingLeft: 5, marginLeft: 12 },
      }}
    />
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(text) => onSend(text)}
      showUserAvatar={false}
      showAvatarForEveryMessage={false}
      user={{
        _id: currentUser,
      }}
      renderBubble={renderBubble}
      renderAvatar={null}
      messagesContainerStyle={{
        paddingBottom:
          (keyboardOpen && Platform.OS === "ios" ? paddingBottom : 28) ||
          (Platform.OS === "android" ? paddingBottom - 100 : 0),
        backgroundColor: Colors.white,
      }}
      bottomOffset={Platform.OS === "ios" ? -20 : -20}
      textInputProps={{
        placeholderTextColor: "#888", // Light grey color for the placeholder text
        multiline: true, // Allow multiple lines
        autoGrow: true, // Text input grows as the user types more lines
        style: {
          backgroundColor: "#f2f2f2", // Light grey background for the text input
          color: "#000",
          paddingRight: 190,
          paddingLeft: 20,
          paddingTop: Platform.OS === "ios" ? 10 : 5,
          paddingVertical: Platform.OS === "ios" ? 10 : 5,
          borderRadius: 20, // Rounded corners for the text input
          marginBottom: Platform.OS === "ios" ? 25 : 10,
          marginLeft: 8,
          marginTop: 10,
        },
      }}
    />
  );
}

const styles = StyleSheet.create({});
