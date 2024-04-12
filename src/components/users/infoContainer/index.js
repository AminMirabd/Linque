import { View, Text } from "react-native";
import React from "react";
import Colors from "../../../../utils/Colors";

const InfoContainer = ({ title, value, whiteBg = false }) => {
  return (
    <View
      className={`flex flex-row items-start justify-between w-full p-10 px-15 mb-10 border-[1px] border-grayLowContrast rounded-20 flex-wrap ${
        whiteBg && "bg-white"
      }`}
    >
      <Text className="text-base font-semibold text-black">{title}</Text>
      <Text className="text-base text-black">{value}</Text>
    </View>
  );
};

export default InfoContainer;
