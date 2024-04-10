import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking  } from "react-native";
import PageContainer from "../../../../components/global/pageContainer";
import { getEventInfoDB, getUserInfoDB, requestToTakeShift } from "../../../../../utils/firebaseOperations";
import Colors from "../../../../../utils/Colors";
import MapView, { PROVIDER_GOOGLE , Marker } from 'react-native-maps';
import InfoContainer from "../../../../components/users/infoContainer/index";
import Button from "../../../../components/customElements/button";
import { useLogin } from "../../../../../context/LoginProvider";
import { getFirestore, doc, getDoc, updateDoc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { database } from "../../../../../firebase";
import { WebView } from "react-native-webview";
import { useNavigation } from '@react-navigation/native';


const ViewEvent = ({ route, navigation }) => {
  const { uid } = useLogin();
  const { id } = route.params;

  const [requestedUserNames, setRequestedUserNames] = useState([]);
  const [hasRequested, setHasRequested] = useState(false);
  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userNames, setUserNames] = useState([]); // State to hold user names
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState(null);



  const handleSelectDocument = (file) => {
    navigation.navigate('ViewDocument', { documentUrl: file });
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
  }, [id]); // Dependency on `id` to refetch when it changes
  
  //
  //
  const checkUserRequestStatus = async (eventId, userId) => {
    const eventRequestRef = doc(database, "shiftRequests", eventId);
    const docSnap = await getDoc(eventRequestRef);
    //console.log(eventRequestRef);
    if (docSnap.exists() && docSnap.data().employeesRequested.includes(userId)) {
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
          console.log(eventData.location);
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
  //
  // const handleTakeRequest = async () => {
  //   setIsLoading(true);
  //   await requestToTakeShift(id, uid)
  //     .then(() => {
  //       alert('Request to take shift has been successfully submitted.');
  //     })
  //     .catch((error) => {
  //       console.error("Error requesting to take shift:", error);
  //       alert('Failed to submit request to take shift.');
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };
  const handleTakeRequest = async () => {
    setIsLoading(true);
    setHasRequested(true); 
  
    await requestToTakeShift(id, uid)
      .then(async () => {
        alert('Request to take shift has been successfully submitted.');
        await getEventData();
      })
      .catch((error) => {
        console.error("Error requesting to take shift:", error);
        alert('Failed to submit request to take shift.');
        setHasRequested(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  
  //

  return (
    <PageContainer navigation={navigation} title="View Event" keyboardScroll>
      {/* <Text>Title: {eventData.title+"\n"}</Text>
      <Text>Description: {eventData.description+"\n"}</Text>
      <Text>Employees Assigned: {"\n"+userNames.join(',\n')+"\n"}</Text> */}
      <InfoContainer title={"Title:"} value={eventData.title} />
      <View style={{backgroundColor: Colors.grayLowContras, padding: 9, borderWidth: 1, borderColor: Colors.grayLowContras, borderRadius: 18 }} className="flex items-start w-full rounded-30 mb-10">
        <Text className="flex-2 text-base font-semibold text-black">
          Description:
        </Text>
        <Text className="text-base text-black">{eventData.description}</Text>
      </View>
      <View style={{backgroundColor: Colors.grayLowContras, padding: 9, borderWidth: 1, borderColor: Colors.grayLowContras, borderRadius: 18 }} className="flex items-start w-full rounded-30 mb-10">
        <Text className="flex-2 text-base font-semibold text-black">
          Employees Assigned:
        </Text>
        <Text className="text-base text-black">{userNames.join(', ')}</Text>
      </View>
      {/* <View style={{backgroundColor: Colors.white, padding: 9, borderWidth: 1, borderColor: Colors.grayLowContras, borderRadius: 18 }} className="flex items-start w-full rounded-30 mb-10">
        <Text className="flex-2 text-base font-semibold text-black">
          Employees Requested:
        </Text>
      <Text className="text-base text-black">{requestedUserNames.join(', ')}
      </Text>
      <TouchableOpacity
        className={`px-20 py-5 rounded-20 max-w-fit mb-10 self-end bg-grayBlue opacity-100`}
        style={{backgroundColor: Colors.primary}}
      >
        <Text className="font-semibold text-center text-white">
          {"Edit"}
        </Text>
      </TouchableOpacity>
      </View> */}
      {/* <InfoContainer title={"Employees Assigned:"} value={userNames.join(',\n')} /> */}
      <Button style={hasRequested ? 'bg-gray-400' : ''} onPress={() => handleTakeRequest()} loading={isLoading}>
        {hasRequested ? 'Requested' : 'Take Request'}
      </Button>
      <Text>{''}</Text>
      <InfoContainer title={"From:"} value={eventData.date && eventData.date.from ? formatDateTime(eventData.date.from) : 'N/A'} />
      <InfoContainer title={"To:"} value={eventData.date && eventData.date.to ? formatDateTime(eventData.date.to) : 'N/A'} />
      {   Platform.OS === 'android' ? ( <View style={{backgroundColor: Colors.grayLowContras, padding: 9, borderWidth: 1, borderColor: Colors.grayLowContras, borderRadius: 18 }} className="flex items-start w-full rounded-30 mb-10">
              <Text className="flex-2 text-base font-semibold text-black">
                Address:
              </Text>
              <Text className="text-base text-black">{eventData.location?.address}</Text>
            </View>):""}
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          provider={PROVIDER_GOOGLE}
          ref={map => this._map = map}
          style={styles.map}
          initialRegion={eventData.locationn}
          region={eventData.location ? eventData.location : eventData.location}
          >
            {eventData.location && (
              <Marker
                coordinate={eventData.location}
                title="Selected Location"
              />
            )}
            { Platform.OS === 'ios' ? ( <View style={{backgroundColor: Colors.grayLowContras, padding: 9, borderWidth: 1, borderColor: Colors.grayLowContras, borderRadius: 18 }} className="flex items-start w-full rounded-30 mb-10">
              <Text className="flex-2 text-base font-semibold text-black">
                Address:
              </Text>
              <Text className="text-base text-black">{eventData.location?.address}</Text>
            </View>):""}
        </MapView>
      </View>
      <View>
        <Text>Uploaded Documents:</Text>
        {eventData.files && eventData.files.map((file, index) => (
          <TouchableOpacity key={index} onPress={() => handleSelectDocument(file)}>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}>{file.name || `Document ${index + 1}`}</Text>
          </TouchableOpacity>
        ))}
            {selectedDocumentUrl && (
      <WebView source={{ uri: selectedDocumentUrl }} style={{ flex: 1, height: 300 }} />
    )}
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayLowContras,
    borderRadius: 20, 
    overflow: 'hidden',
  },
  map: {
    height: 350,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  search: {
    position: 'relative', 
    width: '100%',
    zIndex: 5, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, 
    backgroundColor: 'transparent', 
  }
});

export default ViewEvent;
