import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { auth, firebase } from "../../../firebase";
import Button from "../../components/customElements/button";
import { useLogin } from "../../../context/LoginProvider";
import PageContainer from "../../components/global/pageContainer";
import {
  getUserInfoDB,
  updateUserInformation,
  updateUserProfilePicture,
} from "../../../utils/firebaseOperations";
import InfoContainer from "../../components/users/infoContainer";
import Input from "../../components/customElements/input";
import Colors from "../../../utils/Colors";
import UserTemplate from "../../components/users/userTemplate";

const AccountScreen = (props) => {
  const { navigation } = props;
  const [procedureLoading, setProcedureLoading] = useState(false);

  const { uid } = useLogin();

  return (
    <PageContainer pointerEvents={procedureLoading && "none"} keyboardScroll>
      <UserTemplate
        userUID={uid}
        isOwnProfile
        procedureLoading={procedureLoading}
        setProcedureLoading={setProcedureLoading}
        navigation={navigation}
      />
    </PageContainer>
  );
};

export default AccountScreen;
