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
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { useNavigation } from '@react-navigation/native'

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //const navigation = useNavigation

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("SignedInScreens");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(username, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Signed in with as " + user);
      })
      .catch((error) => alert(error.message));
  };

  const handleSignIn = () => {
    auth
      .signInWithEmailAndPassword(username, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Signed in with " + JSON.stringify(user));
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

  const { height } = useWindowDimensions();
  const onSignInPressed = () => {
    console.warn("Sign in");
  };
  const onForgotPasswordPressed = () => {
    console.warn("FP");
  };
  return (
    <AlertNotificationRoot>
      <KeyboardAwareScrollView className="bg-white">
        <View
          style={{ height: Dimensions.get("window").height }}
          className="items-center justify-center flex-1 p-screen"
        >
          <Image
            source={Logo}
            className="w-[300px] h-[150px] self-center mb-100"
            resizeMode="contain"
          />

          <Input
            placeholder="Username"
            value={username}
            setValue={setUsername}
            secureTextEntry={false}
          />
          <Input
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
          />

          <Button onPress={handleSignIn} style="mt-20">
            Sign In
          </Button>

          {/* TERTIARY */}
          <Button onPress={handleSignUp} style="mt-20" type="TERTIARY">
            Forgot password?
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </AlertNotificationRoot>
  );
};
//changed onForgotPasswordPressed to handleSignUp

const styles = StyleSheet.create({
  logo: {
    width: 200,
    maxWidth: 300,
    height: 100,
    marginTop: -260,
  },
});

export default SignInScreen;
