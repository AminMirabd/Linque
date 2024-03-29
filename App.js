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
import { View, TouchableOpacity, Text, Image, StyleSheet, Platform } from 'react-native';
import ListItem from "./src/screens/ChatScreen/ListItem";
import { auth } from "./firebase";
import GroupChat from "./src/screens/ChatScreen/GroupChatScreen";



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SignedInScreens = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown:true,
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
          headerShown:false,
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
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" color={color} size={size} />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.primary,
        })}
      />
      <Tab.Screen
        name="Admin"
        component={AdminNavigation}
        options={{
          headerShown:false,
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
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
              <Ionicons name="arrow-back" color={Colors.primary} size={30} />
            </TouchableOpacity>
          ),
          headerBackground: () => (
            <TouchableOpacity style={styles.headerTitle}>
              {route.params?.id === auth.currentUser.uid ? (
                <View
                className="items-center justify-center mr-10 overflow-hidden rounded-full w-50 h-50 bg-blue-400"
                  style={styles.profileImage}
                >
                  <Ionicons size={25} color={Colors.primary} name="bookmark-outline" />
                </View>
              ) : route.params?.photo ? (
                <Image
                  source={{ uri: route.params.photo }}
                  style={styles.profileImage}
                  
                ></Image>
              ) : (
                <Image
                  style={styles.profileImage}
                  source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(route.params?.name)}+${encodeURIComponent(route.params?.lastName)}&background=random&color=fff` }}
                />
              )}
              {route.params?.id !== auth.currentUser.uid ? (
                <Text style={styles.headerTitleText}>
                {route.params?.name || 'Chat'} {route.params?.lastName}
              </Text>)
              :(
                <Text style={styles.headerTitleText}>Saved Messages</Text>
              )
              }
            </TouchableOpacity>
          ),
          
        })}
      />
      <Stack.Screen
        component={GroupChat} name="GroupChat"
        options={({ navigation }) => ({
          title:"Group Chat",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
              <Ionicons name="arrow-back" color={Colors.primary} size={30} />
            </TouchableOpacity>
          ),
        })}/>
        </Stack.Navigator>
      </NavigationContainer>
    </LoginProvider>
  );
}
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

