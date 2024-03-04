import { View, TextInput, Text } from "react-native";
import React from "react";

const Input = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  label = "",
  halfSize = false,
  keyboardType = "default",
}) => {
  return (
    <View className={`${halfSize ? "w-[49%]" : "w-full"}`}>
      {label !== "" && (
        <Text className="pl-5 font-semibold text-black">{label}</Text>
      )}
      <View className="bg-white w-full h-auto rounded-10 border-[1px] border-grayLowContrast px-10 py-15 my-5">
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

export default Input;
