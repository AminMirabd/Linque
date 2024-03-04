import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Colors from "../../../../utils/Colors";

const Button = ({
  onPress,
  children,
  style = "",
  textClassName,
  type = "",
  loadingContent = <ActivityIndicator size="small" color={Colors.white} />,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-10 w-[70%] py-15 self-center ${style} ${
        type.toUpperCase() === "TERTIARY" ? "bg-transparent" : "bg-primary "
      }`}
    >
      {loading ? (
        loadingContent
      ) : (
        <Text
          className={`font-bold text-center ${textClassName} ${
            type.toUpperCase() === "TERTIARY" ? "text-primary" : "text-white "
          }`}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
