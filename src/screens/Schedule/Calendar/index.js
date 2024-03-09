import { TimelineCalendar } from "@howljs/calendar-kit";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PageContainer from "../../../components/global/pageContainer";
import DynamicOptions from "../../../components/global/dynamicOptions";
import { getEvents, getEventsDB } from "../../../../utils/firebaseOperations";
import Colors from "../../../../utils/Colors";
import CalendarItem from "../CalendarItem";

const Calendar = (props) => {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState(0); // 0: day, 1: week

  const [events, setEvents] = useState([]);
  const [currentWeekEvents, setCurrentWeekEvents] = useState([]);

  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const numOfDays = 7;
    const fromDate = new Date();
    const toDate = new Date();
    toDate.setDate(new Date().getDate() + numOfDays);

    getEventsDB(fromDate.toISOString(), toDate.toISOString())
      .then((res) => {
        setEvents(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [viewMode]);

  const _onDateChanged = async (date) => {
    setIsLoading(true);
    const numOfDays = 7;
    const fromDate = new Date(date);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + numOfDays);
    getEventsDB(fromDate.toISOString(), toDate.toISOString())
      .then((res) => {
        setEvents((prevEvents) => {
          const newEvents = res.filter(
            (newEvent) =>
              !prevEvents.some(
                (existingEvent) => existingEvent.id === newEvent.id
              )
          );
          return [...prevEvents, ...newEvents];
        });
        setCurrentWeekEvents(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <PageContainer style={"relative"}>
      <DynamicOptions
        firstOption={"Day"}
        secondOption={"Week"}
        option={viewMode}
        setOption={(value) => {
          setViewMode(value);
        }}
        type="capsule"
        title="Choose view mode"
      />

      {/* Show whether there are or not events on the current week */}
      <Text
        className={`w-full mb-5 text-left ${
          currentWeekEvents.length <= 0 ? "text-red-400" : "text-primary"
        }`}
      >
        {currentWeekEvents.length <= 0
          ? "No events this week"
          : "There are events this week"}
      </Text>

      {/* Calendar */}
      <TimelineCalendar
        viewMode={viewMode === 0 ? "day" : "week"}
        events={events}
        onDateChanged={_onDateChanged}
        theme={{ loadingBarColor: Colors.primary }}
        isLoading={isLoading}
        onPressEvent={(event) => {
          navigation.navigate("ViewEvent", { id: event.id });
        }}
        renderEventContent={(event) => {
          if (viewMode === 1) {
            return <CalendarItem event={event} weekView />;
          } else {
            return <CalendarItem event={event} />;
          }
        }}
        initialTimeIntervalHeight={20}
        minTimeIntervalHeight={20}
        maxTimeIntervalHeight={70}
        allowPinchToZoom
        allowDragToCreate
      />

      {/* Add event button */}
      <TouchableOpacity
        className="absolute right-[20px] bottom-[20px] rounded-full w-70 h-70 bg-primary items-center justify-center"
        onPress={() => {
          navigation.navigate("AddEvent");
        }}
      >
        <FontAwesome5 name="plus" size={30} color="white" />
      </TouchableOpacity>
    </PageContainer>
  );
};

export default Calendar;
