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

const ListItem = (props) => {
  const { navigation } = props;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

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

      getLastMessagaDB(chatId, setLastMessage);
    }, [user.UID]);

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ChatScreen", { id: user.UID });
        }}
        className="w-full p-20 rounded-20 border-[1px] border-grayLowContrast flex-row items-center justify-start mb-10"
      >
        <View
          className={`items-center justify-center mr-10 overflow-hidden rounded-full w-50 h-50 ${
            user.photo === "" ? "bg-blue-400" : ""
          }`}
        >
          {user.photo !== "" ? (
            <Image
              className="object-cover w-full h-full"
              source={{ uri: user.photo }}
            />
          ) : (
            <Text className="text-[20px] leading-none">🦸🏻</Text>
          )}
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
            {user.name} {user.lastName}
          </Text>
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
      <Chat />
      <View className="flex-1">
        {filteredUsers.map((user) => (
          <RenderUser user={user} key={user.UID} />
        ))}
      </View>
    </PageContainer>
  );
};

export default ListItem;
