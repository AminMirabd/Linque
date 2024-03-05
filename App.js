import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import SignInScreen from "./src/screens/SignInScreen";
import HomeScreen from "./src/screens/HomePage/HomeScreen";
import AccountScreen from "./src/screens/AccountScreen/AccountScreen";
import ChatScreen from "./src/screens/ChatScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AdminNavigation from "./src/screens/Admin/AdminNavigation";
import LoginProvider from "./context/LoginProvider";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SignedInScreens = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="egg" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <LoginProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="SignIn"
            component={SignInScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="SignedInScreens"
            component={SignedInScreens}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginProvider>
  );
}
