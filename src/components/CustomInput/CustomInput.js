import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const CustomInput = ({value, setValue, placeholder, secureENT}) => {
  return (
    <View style={styles.container}>
      <TextInput 
      value={value} 
      onChangeText={setValue} 
      placeholder={placeholder} 
      style={styles.input}
      secureTextEntry={secureENT}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: 300,
        height: 40,

        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 10,

        paddingHorizontal: 10,
        marginVertical: 5,
    },
    input: {
        marginTop: 10,
    },
});

export default CustomInput
