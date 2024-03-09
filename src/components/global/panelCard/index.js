import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const PanelCard = ({ icon, title, description, onPress }) => {
  return (
    <TouchableOpacity
      className="w-full p-20 rounded-20 border-[1px] border-grayLowContrast flex flex-row justify-between items-center mb-20"
      onPress={onPress}
    >
      {/* Section icon */}
      <View className="items-center justify-center bg-blue-600 rounded-full w-80 h-80">
        <Text className="text-[35px] leading-none">{icon}</Text>
      </View>

      {/* Section title */}
      <View className="flex-1 ml-20">
        <Text className="font-bold text-[20px]">{title}</Text>

        {/* Section description */}
        <Text className="text-gray-400">{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PanelCard;
