import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Calendar from "../../Schedule/Calendar";
import AddEvent from "../../Schedule/Events/AddEvent";
import ChatScreen from "../../ChatScreen";
import ListItem from "../../ChatScreen/ListItem";
const Stack = createNativeStackNavigator();

const ChatNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="m"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen component={ListItem} name="ListItem"/>
      {/* <Stack.Screen
        component={ChatScreen}
        name="ChatScreen"
        initialParams={{ id: null }}
      /> */}
    </Stack.Navigator>
  );
};

export default ChatNavigation;