import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
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
import { useFocusEffect } from "@react-navigation/native";
import { useLogin } from "../../../../context/LoginProvider";

const UserTemplate = ({
  userUID,
  isOwnProfile = false,
  procedureLoading,
  setProcedureLoading,
}) => {
  const { uid, setLoggedInSessionEdited, loggedInSessionEdited } = useLogin();

  const [userData, setUserData] = useState({});
  const [userEdit, setUserEdit] = useState({});
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [image, setImage] = useState(null);

  //Set copy of user data
  useEffect(() => {
    if (userData) {
      setUserEdit(userData);
    }
  }, [userData]);

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
          auth
            .signOut()
            .then(() => {
              navigation.replace("SignIn");
            })
            .catch((error) => alert(error.message));
        },
      },
    ]);
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
      >
        <Text className="font-semibold text-center text-white">
          {editMode ? "Cancel" : "Edit"}
        </Text>
      </TouchableOpacity>

      {/* User image */}
      <TouchableOpacity
        className="relative flex-row items-center justify-center w-full p-20 bg-grayBlue rounded-20 mb-50"
        activeOpacity={editMode ? 0.2 : 1}
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
            <Text>{userData.photo !== "" ? "Edit" : "Add"} photo</Text>
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
