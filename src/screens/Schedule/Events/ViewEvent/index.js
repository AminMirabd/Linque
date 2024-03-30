import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Linking } from "react-native";
import PageContainer from "../../../../components/global/pageContainer";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getEventInfoDB,
  getUserInfoDB,
  getUsersByIdsDB,
} from "../../../../../utils/firebaseOperations";
import Label from "../../../../components/global/label";
import Colors from "../../../../../utils/Colors";

const ViewEvent = ({ route, navigation }) => {
  const { id } = route.params;
  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [employeesAssigned, setEmployeesAssigned] = useState([]);

  useEffect(() => {
    if (id) {
      getEventData();
    }
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    if (eventData.employeesAssigned) {
      console.log(eventData.employeesAssigned);

      getUsersByIdsDB(eventData.employeesAssigned, setEmployeesAssigned).then(
        () => {
          setIsLoading(false);
        }
      );
    }
  }, [eventData]);

  useEffect(() => {
    console.log(eventData);
  }, [eventData]);

  const getEventData = async () => {
    setIsLoading(true);
    await getEventInfoDB(id, setEventData).then(() => {});
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

  const InfoContainer = ({ title, value }) => (
    <View className="flex-row items-center justify-start border-b-[1px] border-grayLowContrast pb-10 mb-10 flex-wrap">
      <Text className="font-bold text-[20px]">{title}: </Text>
      <Text>{value}</Text>
    </View>
  );

  const extractFileName = (url) => {
    const decodedUrl = decodeURIComponent(url); // Decode the URL
    const segments = decodedUrl.split("/"); // Split the URL by '/'
    const lastSegment = segments.pop(); // Get the last part (file name with parameters)
    const fileName = lastSegment.split("?")[0]; // Split by '?' and take the file name
    return fileName;
  };

  const handlePress = (url) => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  };

  const itemSeparator = () => {
    return <View className="h-[1px] bg-grayLowContrast w-full" />;
  };

  const renderItemUser = (item) => {
    return (
      <TouchableOpacity
        className="flex justify-between w-full flex-row py-[10px] items-center"
        activeOpacity={0.7}
      >
        <FontAwesome name="user" size={24} color={Colors.primary} />
        <Text className="text-[16px] flex-1 text-black ml-10">
          {`${item.item.name} ${item.item.lastName}`}{" "}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <PageContainer navigation={navigation} title="View Event" keyboardScroll>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <InfoContainer title="Title" value={eventData.title} />
          <InfoContainer title="Description" value={eventData.description} />
          <View className="mb-15">
            <Label style={"font-bold text-[20px]"}>Assign Employees:</Label>
            <View className="w-full p-20 rounded-10 border-[1px] border-grayLowContrast my-5">
              <FlatList
                className=""
                data={employeesAssigned}
                renderItem={renderItemUser}
                ItemSeparatorComponent={itemSeparator}
                keyExtractor={(item) => {
                  item.UID;
                }}
              />
            </View>
          </View>
          <InfoContainer
            title="From"
            value={
              eventData.date && eventData.date.from
                ? formatDateTime(eventData.date.from)
                : "N/A"
            }
          />
          <InfoContainer
            title="To"
            value={
              eventData.date && eventData.date.to
                ? formatDateTime(eventData.date.to)
                : "N/A"
            }
          />
          {eventData.files && eventData.files.length > 0 && (
            <View className="mb-15">
              <Label style={"font-bold text-[20px]"}>Files attached:</Label>
              <View className="flex flex-row flex-wrap items-center mt-10">
                {eventData.files.map((file, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(file)}
                    className="flex-row items-center justify-start p-10 mb-10 mr-10 rounded-10 bg-grayLowContrast max-w-fit"
                  >
                    <MaterialCommunityIcons
                      name="file-link"
                      size={24}
                      color={Colors.grayHighContranst}
                    />
                    <Text className="ml-5 font-medium text-grayHighContranst">
                      {extractFileName(file)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default ViewEvent;
