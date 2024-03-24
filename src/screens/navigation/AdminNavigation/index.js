import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminPanel from "../../Admin/AdminPanel";
import AddUser from "../../Admin/Users/AddUser";
import ManageUsers from "../../Admin/Users/ManageUsers";
import EditUser from "../../Admin/Users/EditUser/EditUser";
import AddEvent from "../../Schedule/Events/AddEvent";
const Stack = createNativeStackNavigator();

const AdminNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminPanel"
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen component={AdminPanel} name="AdminPanel" options={{title:"Admin", headerBackVisible: false,}} />
      <Stack.Screen component={AddUser} name="AddUser" options={{title:"Admin", headerBackVisible: false,}} />
      <Stack.Screen component={ManageUsers} name="ManageUsers" options={{title:"Admin", headerBackVisible: false,}} />
      <Stack.Screen component={AddEvent} name="AddEvent" options={{title:"Admin", headerBackVisible: false,}} />
      <Stack.Screen
      options={{title:"Admin", headerBackVisible: false,}}
        component={EditUser}
        name="EditUser"
        initialParams={{ id: null }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigation;
