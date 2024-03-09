import { View, Text } from "react-native";
import React from "react";

const Label = ({ children }) => {
  return <Text className="pl-5 font-semibold text-black">{children}</Text>;
};

export default Label;
