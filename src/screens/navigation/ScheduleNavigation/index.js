import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Calendar from "../../Schedule/Calendar";
import AddEvent from "../../Schedule/Events/AddEvent";
const Stack = createNativeStackNavigator();

const ScheduleNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Schedule"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen component={Calendar} name="Calendar" />
      <Stack.Screen component={AddEvent} name="AddEvent" />
    </Stack.Navigator>
  );
};

export default ScheduleNavigation;
