import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "../../../../utils/Colors";

const PageContainer = ({
  children,
  style,
  navigation = null,
  keyboardScroll = false,
  title = "",
  onPress = () => {
    navigation.goBack();
  },
}) => {
  return keyboardScroll ? (
    <KeyboardAwareScrollView
      className={`flex-1 w-full h-full bg-white p-screen ${style}`}
      showsVerticalScrollIndicator={false}
    >
      {navigation !== null && (
        <TouchableOpacity className="w-[20%] self-start" onPress={onPress}>
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}
      {title !== "" && (
        <View className="w-full pb-5 border-b-[0.5px] border-darkGray mb-30 mt-20">
          <Text className="text-black text-[30px] font-bold">{title}</Text>
        </View>
      )}
      {children}
    </KeyboardAwareScrollView>
  ) : (
    <View
      className={`items-center justify-start flex-1 w-full h-full bg-white p-screen ${style}`}
    >
      {navigation !== null && (
        <TouchableOpacity className="w-[20%] self-start" onPress={onPress}>
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}
      {title !== "" && (
        <View className="w-full pb-5 border-b-[0.5px] border-darkGray mb-30 mt-20">
          <Text className="text-black text-[30px] font-bold">{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
};

export default PageContainer;
