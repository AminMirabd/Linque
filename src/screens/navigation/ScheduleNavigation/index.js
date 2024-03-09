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
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen component={Calendar} name="Calendar" />
      <Stack.Screen component={AddEvent} name="AddEvent" />
      <Stack.Screen
        component={ViewEvent}
        name="ViewEvent"
        initialParams={{ id: null }}
      />
    </Stack.Navigator>
  );
};

export default ScheduleNavigation;
