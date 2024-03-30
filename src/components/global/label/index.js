import { View, Text } from "react-native";
import React from "react";

const Label = ({ children, style }) => {
  return (
    <Text className={`pl-5 font-semibold text-black ${style}`}>{children}</Text>
  );
};

export default Label;
