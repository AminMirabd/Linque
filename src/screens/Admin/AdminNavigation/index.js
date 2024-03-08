import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminPanel from "../AdminPanel";
import AddUser from "../Users/AddUser";
import ManageUsers from "../Users/ManageUsers";
import EditUser from "../Users/EditUser/EditUser";
const Stack = createNativeStackNavigator();

const AdminNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminPanel"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen component={AdminPanel} name="AdminPanel" />
      <Stack.Screen component={AddUser} name="AddUser" />
      <Stack.Screen component={ManageUsers} name="ManageUsers" />
      <Stack.Screen
        component={EditUser}
        name="EditUser"
        initialParams={{ id: null }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigation;
