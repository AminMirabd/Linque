import { View, Text } from "react-native";
import React, { useState } from "react";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import PageContainer from "../../../../components/global/pageContainer";
import { auth } from "../../../../../firebase";
import Input from "../../../../components/customElements/input";
import Button from "../../../../components/customElements/button";
import { addUserDB } from "../../../../../utils/firebaseOperations";

const AddUser = (props) => {
  const { navigation } = props;
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const createUserWithEmailAndPassword = () => {
    setLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userObj = {
          name,
          lastName,
          username,
          address,
          phoneNumber,
          email,
          password,
          uid: user.user.uid,
        };

        addUserDB(userObj).then((_value) => {
          setLoading(false);
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: `${name} added`,
            textBody: "The user has been created successfully.",
            button: "Close",
            autoClose: 400,
            onHide: () => navigation.goBack(),
          });
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log("error registerWithEmailAndPass", error);
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "The password is too weak.",
            button: "Try again",
            autoClose: false,
          });
        } else {
          alert(errorMessage);
        }
        console.log("error autentificando", error);
      });
  };

  return (
    <PageContainer
      navigation={navigation}
      title="Create new user"
      keyboardScroll
    >
      <View className="w-full mb-50">
        <View className="flex flex-row items-center justify-between w-full">
          <Input label="Name:" value={name} setValue={setName} halfSize />
          <Input
            label="Last name:"
            value={lastName}
            setValue={setLastName}
            halfSize
          />
        </View>
        <Input
          label="Username:"
          placeholder="Ex: Lastname.Name"
          value={username}
          setValue={setUsername}
        />
        <Input
          label="Address:"
          placeholder="Ex: King St 23"
          value={address}
          setValue={setAddress}
        />
        <Input
          label="Phone number:"
          placeholder="(123) 123-1234"
          value={phoneNumber}
          setValue={setPhoneNumber}
          keyboardType="number-pad"
        />
        <Input
          label="Email:"
          placeholder="Ex: user@waterloocathloic.ca"
          value={email}
          setValue={setEmail}
        />
        <Input
          label="Password:"
          placeholder="·············"
          value={password}
          setValue={setPassword}
        />
      </View>
      <AlertNotificationRoot>
        <Button onPress={createUserWithEmailAndPassword} loading={loading}>
          Create User
        </Button>
      </AlertNotificationRoot>
    </PageContainer>
  );
};

export default AddUser;
