import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getEventInfoDB,
  getUserInfoDB,
  getUsersByIdsDB,
  requestToTakeShift,
} from "../../../../../utils/firebaseOperations";
import Colors from "../../../../../utils/Colors";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import InfoContainer from "../../../../components/users/infoContainer/index";
import Button from "../../../../components/customElements/button";
import PageContainer from "../../../../components/global/pageContainer";
import { useLogin } from "../../../../../context/LoginProvider";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../../../../firebase";
import Label from "../../../../components/global/label";

const ViewEvent = ({ route, navigation }) => {
  const { uid } = useLogin();
  const { id } = route.params;

  const [employeesAssigned, setEmployeesAssigned] = useState([]);
  const [requestedUserNames, setRequestedUserNames] = useState([]);
  const [hasRequested, setHasRequested] = useState(false);
  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userNames, setUserNames] = useState([]); // State to hold user names
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState(null);

  const handleSelectDocument = (file) => {
    navigation.navigate("ViewDocument", { documentUrl: file });
    console.log(file);
  };

  //
  useEffect(() => {
    const fetchRequestedUserNames = async () => {
      const eventRequestRef = doc(database, "shiftRequests", id);
      const docSnap = await getDoc(eventRequestRef);
      if (docSnap.exists()) {
        const employeesRequested = docSnap.data().employeesRequested;
        const namesPromises = employeesRequested.map(async (userId) => {
          const userData = await getUserInfoDB(userId);
          return userData ? `${userData.name} ${userData.lastName}` : "Unknown";
        });
        const names = await Promise.all(namesPromises);
        setRequestedUserNames(names);
      }
    };

    if (id) {
      fetchRequestedUserNames();
    }
  }, [id]);

  const checkUserRequestStatus = async (eventId, userId) => {
    const eventRequestRef = doc(database, "shiftRequests", eventId);
    const docSnap = await getDoc(eventRequestRef);
    //console.log(eventRequestRef);
    if (
      docSnap.exists() &&
      docSnap.data().employeesRequested.includes(userId)
    ) {
      setHasRequested(true);
    } else {
      setHasRequested(false);
    }
  };

  useEffect(() => {
    if (id && uid) {
      checkUserRequestStatus(id, uid);
    }
  }, [id, uid, eventData]); // Re-run when `id`, `uid`, or `eventData` changes

  //

  //Get event data
  useEffect(() => {
    if (id) {
      getEventData();
    }
  }, [id]);

  //Get user names
  useEffect(() => {
    if (eventData.employeesAssigned) {
      getUsersByIdsDB(eventData.employeesAssigned, setEmployeesAssigned).then(
        () => {
          setIsLoading(false);
        }
      );
    }
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

  const handleTakeRequest = async () => {
    setIsLoading(true);
    setHasRequested(true);

    await requestToTakeShift(id, uid)
      .then(async () => {
        alert("Request to take shift has been successfully submitted.");
        await getEventData();
      })
      .catch((error) => {
        console.error("Error requesting to take shift:", error);
        alert("Failed to submit request to take shift.");
        setHasRequested(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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

  return (
    <PageContainer navigation={navigation} title="View Event" keyboardScroll>
      <InfoContainer title={"Title:"} value={eventData.title} />
      <InfoContainer title={"Description:"} value={eventData.description} />
      <InfoContainer
        title={"Employees Assigned:"}
        value={employeesAssigned
          .map((employee) => employee.name + " " + employee.lastName)
          .join(", ")}
      />
      <Button
        style={`${hasRequested ? "bg-gray-400" : ""} mb-10`}
        onPress={() => handleTakeRequest()}
        loading={isLoading}
      >
        {hasRequested ? "Requested" : "Take Request"}
      </Button>
      <InfoContainer
        title={"From:"}
        value={
          eventData.date && eventData.date.from
            ? formatDateTime(eventData.date.from)
            : "N/A"
        }
      />
      <InfoContainer
        title={"To:"}
        value={
          eventData.date && eventData.date.to
            ? formatDateTime(eventData.date.to)
            : "N/A"
        }
      />
      {Platform.OS === "android" && (
        <InfoContainer title={"Address:"} value={eventData.location?.address} />
      )}

      <View className="flex-1 border-[1px] rounded-20 overflow-hidden border-grayLowContrast mb-15">
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          provider={PROVIDER_GOOGLE}
          ref={(map) => (this._map = map)}
          style={styles.map}
          initialRegion={eventData.locationn}
          region={eventData.location ? eventData.location : eventData.location}
        >
          {eventData.location && (
            <Marker coordinate={eventData.location} title="Selected Location" />
          )}
          {Platform.OS === "ios" ? (
            <InfoContainer
              title={"Address"}
              value={eventData.location?.address}
              whiteBg
            />
          ) : (
            ""
          )}
        </MapView>
      </View>

      {eventData.files && eventData.files.length > 0 && (
        <View className="mb-15">
          <Label style={"font-bold text-[20px]"}>Files attached:</Label>
          <View className="flex flex-row flex-wrap items-center">
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
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  map: {
    height: 350,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  search: {
    position: "relative",
    width: "100%",
    zIndex: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "transparent",
  },
});

export default ViewEvent;
