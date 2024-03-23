import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import PageContainer from "../../../../components/global/pageContainer";
import { getEventInfoDB } from "../../../../../utils/firebaseOperations";

const ViewEvent = ({ route, navigation }) => {
  const { id } = route.params;
  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  //Call get event data function when id is available
  useEffect(() => {
    if (id) {
      getEventData();
    }
  }, [id]);

  //Get event data from database
  const getEventData = async () => {
    setIsLoading(true);
    await getEventInfoDB(id, setEventData).then(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    // console.log(eventData.date);
  }, [eventData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}`;

    return formattedDate;
  };

  return (
    <PageContainer navigation={navigation} title="View Event" keyboardScroll>
      {isLoading ? (
        <>
          <Text>Loading...</Text>
        </>
      ) : (
        <>
          <Text>Title: {eventData.title}</Text>
          <Text>Description: {eventData.description}</Text>
          <Text>Color: {eventData.color}</Text>
          <Text>Employees Assigned: {eventData.employeesAssigned}</Text>
          <Text>
            {/* From: {formatDate(eventData.date.from.toDate().toISOString())} */}
            {JSON.stringify(eventData.date)}
          </Text>
          <Text>
            {/* To: {formatDate(eventData.date.to.toDate().toISOString())} */}
          </Text>
        </>
      )}
    </PageContainer>
  );
};

export default ViewEvent;
