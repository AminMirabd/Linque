import { View, TextInput, Text, TouchableOpacity } from "react-native";
import React from "react";

const Input = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  label = "",
  halfSize = false,
  keyboardType = "default",
  disabled = false,
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      className={`${halfSize ? "w-[49%]" : "w-full"} mb-15`}
      activeOpacity={1}
      onPress={onPress}
    >
      {label !== "" && (
        <Text className="pl-5 font-semibold text-black">{label}</Text>
      )}
      <View className="bg-white w-full h-auto rounded-10 border-[1px] border-grayLowContrast px-10 py-15">
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          disabled={disabled}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Input;
