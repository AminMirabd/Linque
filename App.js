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
import Label from "./src/components/global/label";
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import ListItem from "./src/screens/ChatScreen/ListItem";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const SignedInScreens = () => {
  return (
    <Tab.Navigator
    
    >
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
                console.log('Header Icon Pressed!');
              }}
              style={{ paddingRight: 20, paddingBottom: 5 }} 
            >
              <Ionicons name="add-circle-outline" size={30} color={Colors.primary} />
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
            options={{ headerShown: false , headerBlurEffect: true,}}
            name="SignIn"
            component={SignInScreen}
          />
          <Stack.Screen
            options={{ headerShown: false, headerBlurEffect: true,}}
            name="SignedInScreens"
            component={SignedInScreens}
          />
          <Stack.Screen          
            component={ChatScreen}
            name="ChatScreen"
            initialParams={{ id: null }}
            options={({ navigation, route }) => ({
              title: "",
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
                <Text style={styles.headerTitleText}>{route.params?.name || 'Chat'}</Text>
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginProvider>
  );
}
// Add some styles for your headerTitle and profile image
const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40, // Adjust the size as needed
    height: 40,
    borderRadius: 100, // Makes it circular
    marginRight: 8,
    marginTop: 50,
    marginLeft: 70,
  },
  headerTitleText: {
    fontSize: 16,
    marginTop: 55,
    fontWeight: 'bold',
    // Add more styling as needed
  },
});
