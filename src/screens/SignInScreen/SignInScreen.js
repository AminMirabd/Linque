import { View, Text, Image, StyleSheet, useWindowDimensions, KeyboardAvoidingView } from 'react-native'
import React, {useEffect, useState} from 'react'
import Logo from '../../../assets/WaterlooCDSB-Logo.png'
import CustonInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton/CustomButton'
import { auth } from '../../../firebase';
// import { useNavigation } from '@react-navigation/native'


const SignInScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //const navigation = useNavigation
    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user){
          navigation.replace("SignedInScreens")
        }
      })
      return unsubscribe
    }, [])


    const handleSignUp = () =>{
      auth
      .createUserWithEmailAndPassword(username, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log("Signed in with as " + user.email);
        
      })
      .catch(error => alert(error.message));
    }


    const handleSignIn = () =>{
      auth
      .signInWithEmailAndPassword(username, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log("Signed in with " + user.email)
      })
      .catch(error => alert(error.message));
    }


    const {height} = useWindowDimensions();
    const onSignInPressed = () => {
        console.warn("Sign in");
    };
    const onForgotPasswordPressed = () => {
        console.warn("FP");
    };
  return (
    <KeyboardAvoidingView style={styles.root}>
      <Image source={Logo} style={[styles.logo, {height: height * 0.25}]} resizeMode= "contain" />
       
      <CustonInput 
      placeholder="Username" 
      value={username} 
      setValue={setUsername}
      secureENT={false}
      />

      <CustonInput 
      placeholder="Password" 
      value={password} 
      setValue={setPassword} 
      secureENT={true}/>

      <CustomButton 
      text="Sign In" 
      onPress={handleSignIn} />
    
      <CustomButton 
      text="Forgot password?" 
      onPress={handleSignUp}
      type= "TERTIARY"
      />

    </KeyboardAvoidingView>
  )
}
//changed onForgotPasswordPressed to handleSignUp

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        flex: 1,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    logo: { 
        width: 200,
        maxWidth: 300,
        height: 100,
        marginTop: -260,
    },
});


export default SignInScreen;
