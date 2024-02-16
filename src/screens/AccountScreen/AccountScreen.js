import { View, Text, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton/CustomButton';
import { auth } from '../../../firebase';
import React, { useState, useEffect } from 'react';

const AccountScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            auth
              .signOut()
              .then(() => {
                console.log("Signed out successfully");
                navigation.replace("SignIn");
              })
              .catch(error => alert(error.message));
          }
        }
      ]
    );
  }
  
  return (
    <View>
      <Text>Email: {userEmail}</Text>
      <CustomButton 
        text="Sign Out" 
        onPress={handleSignOut}
      />
    </View>
  );
}

export default AccountScreen;
