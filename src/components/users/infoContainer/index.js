import { View, Text } from "react-native";
import React from "react";

const InfoContainer = ({ title, value }) => {
  return (
    <View className="flex flex-row items-end w-full p-10 rounded-10 border-[1px] border-grayHighContranst mb-10">
      <Text className="flex-1 text-base font-semibold text-grayHighContranst">
        {title}
      </Text>
      <Text className="text-base text-grayHighContranst">{value}</Text>
    </View>
  );
};

export default InfoContainer;
