import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { auth, firebase } from "../../../../firebase";
import InfoContainer from "../infoContainer";
import Button from "../../customElements/button";
import Input from "../../customElements/input";
import {
  getUserInfoDB,
  updateUserInformation,
  updateUserProfilePicture,
} from "../../../../utils/firebaseOperations";
import PageContainer from "../../global/pageContainer";
import Colors from "../../../../utils/Colors";
import { useLogin } from "../../../../context/LoginProvider";
const keyObjectSaved = "currentSession";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//Handle notifications
async function sendPushNotification() {
  const message = {
    to: ["ExponentPushToken[BldaCyFzGQtkhz-mWv-RPE]"],
    sound: "default",
    title: "Push de prubea",
    body: "Aca va el cuerpo que queiran 😎😎🥸🤓😏",
    subtitle: "subtitulo solo ios ???",
    data: { someData: "que onda por aca?" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((res) => res.json())
    .then((resJson) => {
      console.log("push enviada en un primer inciio", resJson);
    });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.projectId,
    });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token.data;
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Welcome to Linque 📕",
      body: "Enjoy your experience with us! 🚀🚀🚀",
      data: { data: "goes here" },
      sound: Platform.OS === "android" ? null : "default",
    },
    trigger: null,
  });
}

const UserTemplate = ({
  userUID,
  isOwnProfile = false,
  procedureLoading,
  setProcedureLoading,
  navigation,
}) => {
  const {
    uid,
    setLoggedInSessionEdited,
    loggedInSessionEdited,
    setIsLoggedIn,
  } = useLogin();

  const [userData, setUserData] = useState({});
  const [userEdit, setUserEdit] = useState({});
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [image, setImage] = useState(null);

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  //Set copy of user data
  useEffect(() => {
    if (userData) {
      setUserEdit(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (userData.name && isOwnProfile) {
      registerForPushNotificationsAsync().then(async (token) => {
        console.log(token);
        console.log(userData.expoPushToken);

        if (
          userData.expoPushToken !== token ||
          userData.expoPushToken === false
        ) {
          await updateUserInformation({
            ...userData,
            expoPushToken: token,
          });
        }
      });
    }
  }, [userData, isOwnProfile]);

  //Call get user data function when uid is available
  useEffect(() => {
    if (userUID) {
      getUserData();
    }
  }, [userUID]);

  useFocusEffect(
    useCallback(() => {
      if (isOwnProfile && loggedInSessionEdited) {
        getUserData();
      }
    }, [loggedInSessionEdited])
  );

  //Get user data from database
  const getUserData = async () => {
    setUserInfoLoading(true);
    await getUserInfoDB(userUID, setUserData).then(() => {
      setUserInfoLoading(false);
      if (isOwnProfile) {
        setLoggedInSessionEdited(false);
      }
    });
  };

  //Open gallery
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      if (result.assets[0].height >= 4500 || result.assets[0].width >= 4500) {
        alert("The image is too big");
        return;
      } else {
        setImage(result.assets[0].uri);
        setProcedureLoading(true);
        updateImage(result.assets[0].uri).then(() => {
          setProcedureLoading(false);
        });
      }
    }
    if (result.canceled) {
      setProcedureLoading(false);
    }
  };

  //Update image in firebase
  const updateImage = async (image) => {
    try {
      const storageName = `userProfilePicture/${
        userData.name.split("")[0] + userData.lastName
      }.jpg`;

      let url = "";
      if (image) {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", image, true);
          xhr.send(null);
        });
        const storageRef = firebase.storage().ref().child(storageName);
        await storageRef.put(blob);
        url = await getDownloadURL(storageRef);

        if (url) {
          await updateUserProfilePicture(userData, url);

          const updatedUserData = await getUserInfoDB(
            userUID,
            setUserData
          ).then((value) => {
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Photo Updated",
              textBody: "Profile photo has been updated successfully",
              button: "Close",
              autoClose: 400,
              // onHide: () => resetForm(),
            });
            setEditMode(false);
            if (userUID === uid) {
              setLoggedInSessionEdited(true);
            }
          });
        }
      } else {
        return;
      }
    } catch (error) {
      console.log("Error uploading image to firebase", error);
    }
  };

  const handleUpdateUserInformation = () => {
    setProcedureLoading(true);

    updateUserInformation(userEdit)
      .then(async (value) => {
        const updatedUserData = await getUserInfoDB(userUID, setUserData).then(
          (value) => {
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: "User Updated",
              textBody: "User information has been updated successfully",
              button: "Close",
              autoClose: 400,
            });
            setProcedureLoading(false);
            setEditMode(false);
            if (userUID === uid) {
              setLoggedInSessionEdited(true);
            }
          }
        );
      })
      .catch((error) => {
        // setUserInfoLoading(false);
        alert(`Error trying to update user information ${error}  `);
      });
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logOut();
        },
      },
    ]);
  };

  const logOut = async () => {
    try {
      await auth.signOut();
      await SecureStore.deleteItemAsync(keyObjectSaved).then((res) => {
        navigation.replace("SignIn");
        setIsLoggedIn(false);
      });
    } catch (error) {
      console.log("error logoUT", error);
    }
  };

  return userInfoLoading ? (
    <>
      <Text>Loading...</Text>
    </>
  ) : (
    <View className="flex flex-col items-center justify-start w-full h-full">
      {/* Edit button */}
      <TouchableOpacity
        className={`px-20 py-5 rounded-20 max-w-fit mb-10 self-end bg-grayBlue ${
          editMode ? "opacity-50" : "opacity-100"
        }`}
        onPress={() => {
          setEditMode(!editMode);
        }}
        style={{ backgroundColor: Colors.primary }}
      >
        <Text className="font-semibold text-center text-white">
          {editMode ? "Cancel" : "Edit"}
        </Text>
      </TouchableOpacity>

      {/* User image */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: 20,
          backgroundColor: Colors.primary,
          borderRadius: 20,
          marginBottom: 50,
        }}
        onPress={editMode ? pickImage : () => {}}
      >
        <View className="w-[200px] h-[200px] rounded-full bg-grayLowContrast items-center justify-center overflow-hidden">
          {procedureLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <>
              {userData.photo !== "" ? (
                <>
                  <Image
                    className="object-cover w-full h-full"
                    source={userData.photo !== "" && { uri: userData.photo }}
                  />
                </>
              ) : (
                <>
                  <Text className="text-[70px] text-grayHighContranst font-bold text-center">
                    {userData.name && userData.name.split("")[0]}
                    {userData.lastName && userData.lastName.split("")[0]}
                  </Text>
                </>
              )}
            </>
          )}
        </View>
        {editMode && (
          <View className="items-center justify-center ml-10">
            <View className="items-center justify-center rounded-full w-50 h-50 bg-grayLowContrast">
              <Text className="text-white font-bold text-[20px]">➕</Text>
            </View>
            <Text style={{ color: "#fff", paddingTop: 10 }}>
              {userData.photo !== "" ? "Edit" : "Add"} photo
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View className="flex flex-col w-full">
        {editMode ? (
          <>
            <Input
              label={"Name"}
              value={userEdit.name}
              setValue={(value) => {
                setUserEdit({ ...userEdit, name: value });
              }}
            />
            <Input
              label={"Last Name"}
              value={userEdit.lastName}
              setValue={(value) => {
                setUserEdit({ ...userEdit, lastName: value });
              }}
            />
            <Input
              label={"Username"}
              value={userEdit.username}
              setValue={(value) => {
                setUserEdit({ ...userEdit, username: value });
              }}
            />
            <Input
              label={"Email"}
              value={userEdit.email}
              setValue={(value) => {
                setUserEdit({ ...userEdit, email: value });
              }}
              keyboardType="email-address"
            />
            <Input
              label={"Phone Number"}
              value={userEdit.phoneNumber}
              setValue={(value) => {
                setUserEdit({ ...userEdit, phoneNumber: value });
              }}
              keyboardType="phone-pad"
            />
          </>
        ) : (
          <>
            <InfoContainer title={"Name:"} value={userData.name} />
            <InfoContainer title={"Last Name:"} value={userData.lastName} />
            <InfoContainer title={"Username:"} value={userData.username} />
            <InfoContainer title={"Email:"} value={userData.email} />
            <InfoContainer
              title={"Phone Number:"}
              value={userData.phoneNumber}
            />
          </>
        )}
      </View>

      <View className="w-full mt-20">
        {!isOwnProfile ? (
          editMode && (
            <Button
              onPress={handleUpdateUserInformation}
              loading={procedureLoading}
            >
              Confirm Edit
            </Button>
          )
        ) : editMode ? (
          <Button
            onPress={handleUpdateUserInformation}
            loading={procedureLoading}
          >
            Confirm Edit
          </Button>
        ) : (
          <Button onPress={handleSignOut}>Sign Out</Button>
        )}
      </View>
    </View>
  );
};

export default UserTemplate;
