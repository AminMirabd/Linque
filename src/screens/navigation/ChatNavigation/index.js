import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Platform, StatusBar } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Calendar from "../../Schedule/Calendar";
import AddEvent from "../../Schedule/Events/AddEvent";
import ChatScreen from "../../ChatScreen";
import ListItem from "../../ChatScreen/ListItem";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../../utils/Colors";

const Stack = createNativeStackNavigator();

const ChatNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="m"
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen component={ListItem} name="ListItem" options={{title:"Chats", headerBackVisible: false,}}/>
      {/* <Stack.Screen
        component={ChatScreen}
        name="ChatScreen"
        initialParams={{ id: null }}
        options={({ navigation, route }) => ({
          title: "",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
              <Ionicons name="arrow-back" color={Colors.primary} size={30} />
            </TouchableOpacity>
          ),
          headerBackground: () => (
            <TouchableOpacity style={styles.headerTitle}>
              {route.params?.photo && (
                <Image
                  source={{ uri: route.params.photo }}
                  style={styles.profileImage}
                />
              )}
            <Text style={styles.headerTitleText}>{route.params?.name || 'Chat'} {route.params?.lastName}</Text>
            </TouchableOpacity>
          ),
        })}
      /> */}
    </Stack.Navigator>
  );
};
const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    height: Platform.select({ ios: 92, android: 80 }),
    borderBlockEndColor: '#bcbcbc',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40, 
    height: 40,
    borderRadius: 100, 
    marginRight: 8,
    marginTop: Platform.select({ ios: 50, android: 30 }),
    marginLeft: 70,
    marginBottom: 7
  },
  headerTitleText: {
    fontSize: 16,
    marginTop: Platform.select({ ios: 45, android: 25 }), 
    fontWeight: 'bold',
  },
});


export default ChatNavigation;