import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Calendar from "../../Schedule/Calendar";
import AddEvent from "../../Schedule/Events/AddEvent";
import ViewEvent from "../../Schedule/Events/ViewEvent";
const Stack = createNativeStackNavigator();

const ScheduleNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Schedule"
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen component={Calendar} name="Calendar" options={{title:"Calendar", headerBackVisible: false,}} />
      <Stack.Screen component={AddEvent} name="AddEvent" options={{title:"Calendar", headerBackVisible: false,}} />
      <Stack.Screen
        component={ViewEvent}
        name="ViewEvent"
        initialParams={{ id: null }}
      />
    </Stack.Navigator>
  );
};

export default ScheduleNavigation;
