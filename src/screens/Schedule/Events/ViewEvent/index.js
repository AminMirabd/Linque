import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import PageContainer from "../../../../components/global/pageContainer";
import { getEventInfoDB, getUserInfoDB } from "../../../../../utils/firebaseOperations";

const ViewEvent = ({ route, navigation }) => {
  const { id } = route.params;
  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userNames, setUserNames] = useState([]); // State to hold user names

  useEffect(() => {
    if (id) {
      getEventData();
    }
  }, [id]);

  useEffect(() => {

    const fetchUserNames = async () => {
      const names = await Promise.all(
        eventData.employeesAssigned?.map(async (userId) => {
          const userData = await getUserInfoDB(userId);
          return userData ? userData.name + " " +userData.lastName : "Unknown";
        }) || []
      );
      setUserNames(names);
    };

    if (eventData.employeesAssigned) {
      fetchUserNames();
    }
  }, [eventData]);

  useEffect(() => {
    if (id) {
      getEventData();
    }
  }, [id]);


  const getEventData = async () => {
    setIsLoading(true);
    await getEventInfoDB(id, setEventData).then(() => {
      setIsLoading(false);
    });
  };


  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);

    return `${month}-${day}-${year} ${hours}:${minutes}`;
  };

  return (
    <PageContainer navigation={navigation} title="View Event" keyboardScroll>
      <Text>Title: {eventData.title+"\n"}</Text>
      <Text>Description: {eventData.description+"\n"}</Text>
      <Text>Employees Assigned: {"\n"+userNames.join(',\n')+"\n"}</Text>
      <Text>From: {eventData.date && eventData.date.from ? formatDateTime(eventData.date.from) : 'N/A'}</Text>
      <Text>To: {eventData.date && eventData.date.to ? formatDateTime(eventData.date.to) : 'N/A'}</Text>
    </PageContainer>
  );
};

export default ViewEvent;
