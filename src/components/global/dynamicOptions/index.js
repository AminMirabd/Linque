import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

const DynamicOptions = ({
  setOption,
  option,
  firstOption,
  secondOption,
  onPressFirstOption = () => {},
  onPressSecondOption = () => {},
  type = "line",
  title = "",
}) => {
  return type !== "line" ? (
    <>
      {title && (
        <View className="mb-5">
          <Text className="text-grayHighContranst">Choose view mode</Text>
        </View>
      )}
      <View className="px-10 py-10 bg-grayLowContrast w-[50%] rounded-full self-center mb-20">
        <View className="relative flex flex-row w-full">
          <TouchableOpacity
            onPress={() => {
              onPressFirstOption();
              setOption(0);
            }}
            className="w-[50%] flex items-center p-[10px]"
          >
            <Text
              className={`text-center text-[16px] ${
                option === 0 ? "text-white" : "text-black"
              }`}
            >
              {firstOption}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onPressSecondOption();
              setOption(1);
            }}
            className="w-[50%] flex items-center p-[10px]"
          >
            <Text
              className={`text-center text-[16px] ${
                option === 1 ? "text-white" : "text-black"
              }`}
            >
              {secondOption}
            </Text>
          </TouchableOpacity>
          <MotiView
            className={`w-[50%] absolute h-full bg-primary bottom-0 transition-all rounded-full z-[-1]`}
            from={option != 0 ? { translateX: 0 } : { translateX: 82 }}
            animate={option != 0 ? { translateX: 82 } : { translateX: 0 }}
            transition={{
              type: "timing",
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            }}
          />
        </View>
      </View>
    </>
  ) : (
    <>
      {title && (
        <View className="mb-5">
          <Text className="text-grayHighContranst">Choose view mode</Text>
        </View>
      )}
      <View className="relative flex flex-row my-20">
        <TouchableOpacity
          onPress={() => {
            setOption(0);
            onPressFirstOption();
          }}
          className="w-[50%] flex items-center p-[10px]"
        >
          <Text className="text-black font-semibold text-center text-[16px]">
            {firstOption}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setOption(1);
            onPressSecondOption();
          }}
          className="w-[50%] flex items-center p-[10px]"
        >
          <Text className="text-black font-semibold text-center text-[16px]">
            {secondOption}
          </Text>
        </TouchableOpacity>
        <MotiView
          className={`w-[50%] absolute h-[2px] bg-main bottom-0 transition-all rounded-10`}
          from={option != 0 ? { translateX: 0 } : { translateX: 187 }}
          animate={option != 0 ? { translateX: 187 } : { translateX: 0 }}
          transition={{
            type: "timing",
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          }}
        />
      </View>
    </>
  );
};

export default DynamicOptions;
