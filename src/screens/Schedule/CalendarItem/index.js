import { View, Text } from "react-native";
import React from "react";

const CalendarItem = ({ event }) => {
  const getTimeFromDate = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedTime = `${formattedHours}:${formattedMinutes}`;

    return formattedTime;
  };

  const InformationItem = ({ title, value, inLine = false }) => {
    return (
      <View
        className={`flex text-[12px]  ${
          inLine ? "flex-row mr-10" : "flex-col w-1/2 mb-5"
        }`}
      >
        <Text className="font-semibold text-white">{title}</Text>
        <Text className="overflow-hidden font-normal text-white">{value}</Text>
      </View>
    );
  };
  return (
    <View className="flex flex-row flex-wrap w-full p-5 overflow-hidden">
      <InformationItem title={"Title:"} value={event.title} />
      <InformationItem
        title={"Description:"}
        value={event.description.slice(0, 50)}
      />
      <InformationItem
        title={"From:"}
        value={getTimeFromDate(event.start)}
        inLine
      />
      <InformationItem
        title={"To:"}
        value={getTimeFromDate(event.end)}
        inLine
      />
    </View>
  );
};

export default CalendarItem;
