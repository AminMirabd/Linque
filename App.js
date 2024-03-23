import SignInScreen from "./src/screens/SignInScreen";
import AccountScreen from "./src/screens/AccountScreen/AccountScreen";
import ChatScreen from "./src/screens/ChatScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AdminNavigation from "./src/screens/navigation/AdminNavigation";
import LoginProvider from "./context/LoginProvider";
import ScheduleNavigation from "./src/screens/navigation/ScheduleNavigation";
import ChatNavigation from "./src/screens/navigation/ChatNavigation";
import Colors from "./utils/Colors";
import { View, TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SignedInScreens = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigation}
        options={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigation}
        options={({ navigation }) => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" color={color} size={size} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log("Header Icon Pressed!");
              }}
              style={{ paddingRight: 20, paddingBottom: 5 }}
            >
              <Ionicons
                name="add-circle-outline"
                size={30}
                color={Colors.primary}
              />
            </TouchableOpacity>
          ),
          headerShown: true,
        })}
      />
      <Tab.Screen
        name="Admin"
        component={AdminNavigation}
        options={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.primary,
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
