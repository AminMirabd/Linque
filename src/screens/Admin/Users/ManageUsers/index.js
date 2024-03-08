import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import PageContainer from "../../../../components/global/pageContainer";
import { getAllUsersDB } from "../../../../../utils/firebaseOperations";
import Input from "../../../../components/customElements/input";
import Colors from "../../../../../utils/Colors";

const ManageUsers = (props) => {
  const { navigation } = props;
  const [users, setUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  //Fetch all users from the database
  useEffect(() => {
    getAllUsersDB(setUsers);
  }, []);

  //Make a copy of the users
  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  //Filter by name or last name
  const filterUsers = (text) => {
    if (text) {
      const newDataUsers = users.filter((item) => {
        const nameData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const lastNameData = item.lastName
          ? item.lastName.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return (
          nameData.indexOf(textData) > -1 || lastNameData.indexOf(textData) > -1
        );
      });

      setFilteredUsers(newDataUsers);
      setSearchValue(text);
    } else {
      setSearchValue(text);
      setFilteredUsers(users);
    }
  };

  //User item
  const RenderUser = ({ user }) => {
    return (
      <TouchableOpacity
        className="w-full p-20 rounded-20 border-[1px] border-grayLowContrast flex-row items-center justify-start mb-20"
        onPress={() => {
          navigation.navigate("EditUser", { id: user.UID });
        }}
      >
        <View
          className={`items-center justify-center mr-20 overflow-hidden rounded-full w-50 h-50 ${
            user.photo === "" && "bg-blue-400"
          }`}
        >
          {user.photo !== "" ? (
            <Image
              className="object-cover w-full h-full"
              source={user.photo !== "" && { uri: user.photo }}
              // onLoad={() => {
              //   setIsProfileImageLoading(false);
              // }}
            />
          ) : (
            <Text className="text-[20px] leading-none">🦸🏻</Text>
          )}
        </View>
        <Text className="flex-1 font-medium text-black">
          {user.name} {user.lastName}
        </Text>
        <View className="items-center justify-center">
          <Feather name="edit-2" size={14} color={Colors.primary} />
          <Text className="text-[12px] text-primary">Edit</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <PageContainer title="Manage Users" navigation={navigation} keyboardScroll>
      <Input
        placeholder="Filter by name or last name"
        value={searchValue}
        setValue={(text) => {
          filterUsers(text);
        }}
      />
      <View className="w-full mt-20 pb-100">
        {filteredUsers.map((item) => (
          <RenderUser user={item} key={item.UID} />
        ))}
      </View>
    </PageContainer>
  );
};

export default ManageUsers;
