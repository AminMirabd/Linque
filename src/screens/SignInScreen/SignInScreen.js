import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Logo from "../../../assets/WaterlooCDSB-Logo.png";
import { auth } from "../../../firebase";
import Button from "../../components/customElements/button";
import Input from "../../components/customElements/input";
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
      .catch((error) => alert(error.message));
  };

  const { height } = useWindowDimensions();
  const onSignInPressed = () => {
    console.warn("Sign in");
  };
  const onForgotPasswordPressed = () => {
    console.warn("FP");
  };
  return (
    <KeyboardAvoidingView style={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, { height: height * 0.25 }]}
        resizeMode="contain"
      />
      <View className="w-[90%] self-center">
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
      </View>
      <Button onPress={handleSignIn} style="mt-20">
        Sign In
      </Button>
      {/* TERTIARY */}
      <Button onPress={handleSignUp} style="mt-20" type="TERTIARY">
        Forgot password?
      </Button>
    </KeyboardAvoidingView>
  );
};
//changed onForgotPasswordPressed to handleSignUp

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  logo: {
    width: 200,
    maxWidth: 300,
    height: 100,
    marginTop: -260,
  },
});

export default SignInScreen;
