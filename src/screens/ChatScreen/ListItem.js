import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import PageContainer from "../../components/global/pageContainer";
import Input from "../../components/customElements/input";
import {
  getAllUsersDB,
  getLastMessagaDB,
} from "../../../utils/firebaseOperations";
import { auth } from "../../../firebase";
import Chat from "./GroupChatScreen";
import { Ionicons } from "@expo/vector-icons";
//import { Colors } from "react-native/Libraries/NewAppScreen";
import Colors from "../../../utils/Colors";
import GroupChat from "./GroupChatScreen";

const ListItem = (props) => {
  const { navigation } = props;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    const unsubscribes = [];
    getAllUsersDB(async (fetchedUsers) => {
      const usersWithSubscriptions = fetchedUsers.map((user) => {
        const currentUserUID = auth.currentUser.uid;
        const chatId =
          user.UID > currentUserUID
            ? `${user.UID}-${currentUserUID}`
            : `${currentUserUID}-${user.UID}`;
        const messagesRef = collection(
          database,
          "chatrooms",
          chatId,
          "messages"
        );
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            user.lastMessage = data.text;
            user.lastMessageTimestamp = data.createdAt;
            setUsers((currentUsers) => {
              const index = currentUsers.findIndex((u) => u.UID === user.UID);
              const newUsers = [...currentUsers];
              if (index > -1) {
                newUsers[index] = { ...newUsers[index], ...user };
              } else {
                newUsers.push(user);
              }
              return newUsers.sort(
                (a, b) =>
                  b.lastMessageTimestamp?.seconds -
                  a.lastMessageTimestamp?.seconds
              );
            });
          }
        });
        unsubscribes.push(unsubscribe);
        return user;
      });

      setUsers(
        usersWithSubscriptions.sort(
          (a, b) =>
            b.lastMessageTimestamp?.seconds - a.lastMessageTimestamp?.seconds
        )
      );
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, []);

  useEffect(() => {
    getAllUsersDB(setUsers);
  }, []);

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  const filterUsers = (text) => {
    if (text) {
      const newDataUsers = users.filter((item) => {
        const itemText = text.toUpperCase();
        return (
          item.name.toUpperCase().includes(itemText) ||
          item.lastName.toUpperCase().includes(itemText)
        );
      });
      setFilteredUsers(newDataUsers);
      setSearchValue(text);
    } else {
      setFilteredUsers(users);
      setSearchValue("");
    }
  };

  const RenderUser = ({ user }) => {
    const [lastMessage, setLastMessage] = useState("");

    //Get last message
    useEffect(() => {
      const currentUserUID = auth.currentUser.uid;
      const chatId =
        user.UID > currentUserUID
          ? `${user.UID}-${currentUserUID}`
          : `${currentUserUID}-${user.UID}`;

      const messagesRef = collection(database, "chatrooms", chatId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          let multiLine = data.text.split("\n");
          if (data.text.length > 20) {
            data.text = data.text.slice(0, 19) + "...";
          }
          if (multiLine.length > 1) {
            data.text = multiLine[0];
          }
          setLastMessage(data.text);
        } else {
          setLastMessage("No messages yet");
        }
      });

      return () => unsubscribe();
    }, [user.UID]);

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ChatScreen", {
            lastName: user.lastName,
            name: user.name,
            id: user.UID,
            photo: user.photo,
          });
        }}
        className="w-full p-20 pl-0 rounded-0 border-b-[1px] border-grayLowContrast flex-row items-center justify-start mb-0"
      >
        <View
          className={`items-center justify-center mr-10 overflow-hidden rounded-full w-50 h-50 ${
            user.photo === "" && user.UID !== auth.currentUser.uid
              ? "bg-blue-400"
              : user.UID === auth.currentUser.uid
              ? "bg-blue-400"
              : ""
          }`}
        >
          {user.photo !== "" && user.UID !== auth.currentUser.uid ? (
            <Image
              className="object-cover w-full h-full"
              source={{ uri: user.photo }}
            />
          ) : user.UID === auth.currentUser.uid ? (
            <Ionicons
              size={30}
              color={Colors.primary}
              name="bookmark-outline"
            />
          ) : (
            <Image
              className="object-cover w-full h-full"
              source={{
                uri: `https://ui-avatars.com/api/?name=${user.name} ${user.lastName}&background=random&color=fff`,
              }}
            />
          )}
        </View>
        <View className="flex-1">
          {user.UID == auth.currentUser.uid ? (
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "black",
                marginBottom: 4,
              }}
            >
              Saved Messages
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "black",
                marginBottom: 4,
              }}
            >
              {user.name} {user.lastName}
            </Text>
          )}
          <Text
            style={{
              fontWeight: "500",
              color: "gray",
              fontSize: 14,
              marginBottom: 15,
            }}
          >
            {lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <PageContainer title="" keyboardScroll>
      <Input
        placeholder="Filter by name or last name"
        value={searchValue}
        setValue={filterUsers}
        className="mb-4"
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("GroupChat", {});
        }}
        className="w-full p-20 pl-0 rounded-0 border-b-[1px] border-grayLowContrast flex-row items-center justify-start mb-0"
      >
        <View
          className={
            "items-center justify-center mr-10 overflow-hidden rounded-full w-50 h-50 bg-blue-400"
          }
        >
          <Image
            className="object-cover w-full h-full"
            source={{
              uri: `https://ui-avatars.com/api/?name=GP&background=random&color=fff`,
            }}
          />
        </View>
        <View className="flex-1">
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "black",
              marginBottom: 4,
            }}
          >
            Group Chat
          </Text>
        </View>
      </TouchableOpacity>
      <View className="flex-1">
        {filteredUsers.map((user) => (
          <RenderUser user={user} key={user.UID} />
        ))}
      </View>
    </PageContainer>
  );
};

export default ListItem;
