import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../../ChatScreen";
import ListItem from "../../ChatScreen/ListItem";
const Stack = createNativeStackNavigator();

const ChatNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListItem"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen component={ListItem} name="ListItem" />
      <Stack.Screen
        component={ChatScreen}
        name="ChatScreen"
        initialParams={{ id: null }}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigation;
