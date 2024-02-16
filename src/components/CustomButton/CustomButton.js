import { View, Text,  StyleSheet, Pressable } from 'react-native'
import React from 'react'

const CustomButton = ({ onPress, text, type }) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#132E35',
        width: 300,

        borderRadius: 10,

        padding: 15,
        marginVertical: 10,
        alignItems: 'center',
    },

    container_PRIMARY:{
        backgroundColor: '#5A636A',
    },
    container_TERTIARY:{backgroundColor: 'transparent',},

    text: {
        fontWeight: 'bold',
        color: '#fff',
    },
    text_TERTIARY: {
        color: 'grey',
    },
});

export default CustomButton