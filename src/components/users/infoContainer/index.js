import { View, Text } from "react-native";
import React from "react";
import Colors from "../../../../utils/Colors";

const InfoContainer = ({ title, value }) => {
  return (
    <View style={{backgroundColor: Colors.grayLowContras }} className="flex flex-row items-end w-full p-10 rounded-10 mb-10">
      <Text className="flex-1 text-base font-semibold text-black">
        {title}
      </Text>
      <Text className="text-base text-black">{value}</Text>
    </View>
  );
};

export default InfoContainer;
