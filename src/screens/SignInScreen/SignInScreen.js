import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Logo from "../../../assets/WaterlooCDSB-Logo.png";
import { auth } from "../../../firebase";
import Button from "../../components/customElements/button";
import Input from "../../components/customElements/input";
import * as SecureStore from "expo-secure-store";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLogin } from "../../../context/LoginProvider";
import { updateUserInformation } from "../../../utils/firebaseOperations";
const keyObjectSaved = "currentSession";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn, setUid } = useLogin();

  useEffect(() => {
    getEncryptedSession(keyObjectSaved);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("SignedInScreens");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignIn = (values, actions = false, isLoggedIn = false) => {
    auth
      .signInWithEmailAndPassword(values.email, values.password)
      .then((userCredentials) => {
        setUid(userCredentials.user.uid);
        if (!isLoggedIn) {
          encryptSession(
            keyObjectSaved,
            JSON.stringify({ email: values.email, password: values.password }),
            actions
          );
        } else {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.log("Error signing in: ", error.code);
        switch (error.code) {
          case "auth/user-not-found":
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: "Ops!",
              textBody: "Incorrect Email and/or Password!",
              button: "Try Again",
              autoClose: false,
              onHide: () => setShowModal(false),
            });
            break;
          case "auth/wrong-password":
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: "Ops!",
              textBody: "Incorrect Email and/or Password!",
              button: "Try Again",
              autoClose: false,
              onHide: () => {},
            });
            break;
          case "auth/invalid-credential":
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: "Ops!",
              textBody: "Invalid credentials",
              button: "Try Again",
              autoClose: false,
              onHide: () => {},
            });
            break;
        }
      });
  };

  async function encryptSession(key, value, actions) {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
    setIsLoggedIn(true);
  }

  async function getEncryptedSession(key) {
    let resultAux = await SecureStore.getItemAsync(key);
    if (resultAux) {
      let resulObj = JSON.parse(resultAux);
      handleSignIn(
        { email: resulObj.email, password: resulObj.password },
        false,
        true
      );
    } else {
      console.log("No values stored under that key.");
    }
  }

  return (
    <AlertNotificationRoot>
      <KeyboardAwareScrollView className="bg-white">
        <View
          style={{ height: Dimensions.get("window").height }}
          className="items-center justify-center flex-1 p-screen"
        >
          <Image
            source={Logo}
            className="w-[300px] h-[200px] self-center mb-100"
            resizeMode="contain"
          />

          <Input
            placeholder="Email"
            value={email}
            setValue={setEmail}
            secureTextEntry={false}
          />
          <Input
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
          />

          <Button
            onPress={() => {
              handleSignIn({ email, password });
            }}
            style="mt-20"
          >
            Sign In
          </Button>

          {/* TERTIARY */}
          <Button style="mt-20" type="TERTIARY">
            Forgot password?
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </AlertNotificationRoot>
  );
};

export default SignInScreen;
