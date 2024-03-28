import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { Easing } from "react-native-reanimated";
import ColorPicker, { Swatches } from "reanimated-color-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MotiView, MotiText } from "moti";
import PageContainer from "../../../../components/global/pageContainer";
import Input from "../../../../components/customElements/input";
import {
  addEventDB,
  getAllUsersDB,
} from "../../../../../utils/firebaseOperations";
import Label from "../../../../components/global/label";
import Button from "../../../../components/customElements/button";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
//import DocumentPicker from 'react-native-document-picker'


// const selectAndUploadFile = async () => {
//   try {
//     const result = await DocumentPicker.pick({
//       type: [DocumentPicker.types.allFiles],
//     });

//     // Once a file is picked, upload it to Firebase Storage
//     const uploadUrl = await uploadFileToFirebaseStorage(result.uri, result.name);
//     if (uploadUrl) {
//       // Here you could update the state to include this new URL
//       setDocumentURLs(prevUrls => [...prevUrls, uploadUrl]);
//     }
//   } catch (err) {
//     if (DocumentPicker.isCancel(err)) {
//       console.log('User cancelled the picker');
//     } else {
//       console.error('DocumentPicker error: ', err);
//     }
//   }
// };


// const uploadFileToFirebaseStorage = async (fileUri, fileName) => {
//   const fileBlob = await fetch(fileUri).then(r => r.blob());
//   const storageRef = ref(getStorage(), `uploads/${fileName}`);
  
//   try {
//     const snapshot = await uploadBytes(storageRef, fileBlob);
//     const downloadURL = await getDownloadURL(snapshot.ref);
//     console.log('File uploaded successfully:', downloadURL);
//     return downloadURL;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return null;
//   }
// };


let randomstring = require("randomstring");

const AddEvent = (props) => {
  const { navigation } = props;
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  // const [startingDate, setStartingDate] = useState(null);
  // const [endingDate, setEndingDate] = useState(null);


  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [employees, setEmployees] = useState([]);
  const [listEmployeesAssigned, setListEmployeesAssigneed] = useState([]);

  const uploadFileToFirebaseStorage = async (fileUri) => {
    const fileName = `documents/${new Date().toISOString()}-${fileUri.substring(fileUri.lastIndexOf('/') + 1)}`;
    const storageRef = ref(getStorage(), fileName);
    const response = await fetch(fileUri);
    const blob = await response.blob();
  
    try {
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File uploaded!', downloadURL);
      return downloadURL; // Return the URL for further use
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  //Fetch all users from the database
  useEffect(() => {
    getAllUsersDB(setEmployees);
  }, []);

  const generateRandomDate = () => {
    const year = 2024;
    const month = 2; // March is 2 in JavaScript (0-indexed)
    const day = Math.floor(Math.random() * 31) + 1; // Random day between 1 and 31
    const hours = Math.floor(Math.random() * 24); // Random hour between 0 and 23
    const minutes = Math.floor(Math.random() * 60); // Random minute between 0 and 59
    const seconds = Math.floor(Math.random() * 60); // Random second between 0 and 59
    const milliseconds = Math.floor(Math.random() * 1000); // Random millisecond between 0 and 999

    // Create a new Date object with the generated values
    return new Date(year, month, day, hours, minutes, seconds, milliseconds);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setEndTime(currentTime);
  };

  const combineDateAndTime = (date, time) => {
    let combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(time.getSeconds());
    combined.setMilliseconds(time.getMilliseconds());
    return combined;
  };

  const getISODateTime = () => {
    const startDateTime = combineDateAndTime(date, startTime);
    const endDateTime = combineDateAndTime(date, endTime);

    const isoStartDateTime = startDateTime.toISOString();
    const isoEndDateTime = endDateTime.toISOString();

    return { isoStartDateTime, isoEndDateTime };
  };

  const onSelectColor = ({ hex }) => {
    setColor(hex);
  };

  //Validate if an employee is already assigned
  const validateEmployeeAssigned = (listEmployees, employee) => {
    if (listEmployees.find((value) => value === employee)) {
      return true;
    } else {
      return false;
    }
  };

  //Add or remove an employee from the list
  const assignOrUnassignEmployee = (employeeList = [], employee) => {
    let auxList = employeeList;
    if (auxList.find((value) => value === employee)) {
      auxList = auxList.filter((value) => value != employee);
    } else {
      auxList = [...auxList, employee];
    }
    setListEmployeesAssigneed(auxList);
  };

  const handleCreateEvent = () => {
    setLoading(true);
    const date = getISODateTime();
    const fromDate = date.isoStartDateTime;
    const toDate = date.isoEndDateTime;

    const eventObj = {
      id: randomstring.generate(10),
      title: title,
      description: description,
      color: color,
      employeesAssigned: listEmployeesAssigned,
      date: {
        from: fromDate,
        to: toDate,
      },
    };

    addEventDB(eventObj).then(() => {
      setLoading(false);
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: `${title} event added`,
        textBody: "The event has been created successfully.",
        button: "Close",
        autoClose: 400,
        onHide: () => navigation.navigate("Calendar"),
      });
    });
  };

  const itemSeparator = () => {
    return <View className="h-[1px] bg-grayLowContrast w-full" />;
  };

  const renderItemUser = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          assignOrUnassignEmployee(listEmployeesAssigned, item.item.UID);
        }}
        className="flex justify-between w-full flex-row py-[10px] items-center"
        activeOpacity={0.7}
      >
        <Text className="text-[16px] flex-1 text-black">
          {`${item.item.name} ${item.item.lastName}`}{" "}
        </Text>

        <MotiView
          className="w-[27px] h-[27px] border-[2px] flex items-center justify-center rounded-full"
          from={
            validateEmployeeAssigned(listEmployeesAssigned, item.item.UID) ===
            true
              ? { borderColor: "#CDF2BC" }
              : { borderColor: "#4DDF09" }
          }
          animate={
            validateEmployeeAssigned(listEmployeesAssigned, item.item.UID) ===
            true
              ? { borderColor: "#4DDF09" }
              : { borderColor: "#CDF2BC" }
          }
          transition={{
            type: "timing",
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          }}
          onTouchEndCapture={() => {
            assignOrUnassignEmployee(listEmployeesAssigned, item.item.UID);
          }}
        >
          <MotiText
            className="text-[#CDF2BC] font-semibold"
            from={
              validateEmployeeAssigned(listEmployeesAssigned, item.item.UID) ===
              true
                ? { color: "#CDF2BC" }
                : { color: "#4DDF09" }
            }
            animate={
              validateEmployeeAssigned(listEmployeesAssigned, item.item.UID) ===
              true
                ? { color: "#4DDF09" }
                : { color: "#CDF2BC" }
            }
            transition={{
              type: "timing",
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            }}
          >
            +
          </MotiText>
        </MotiView>
      </TouchableOpacity>
    );
  };

  return (
    <PageContainer
      title="Add Event"
      navigation={navigation}
      pointerEvents={loading ? "none" : "auto"}
      keyboardScroll
    >
      <Input
        placeholder={"Title"}
        label="Title:"
        value={title}
        setValue={setTitle}
      />
      <Input
        placeholder={"Description"}
        label="Description:"
        value={description}
        setValue={setDescription}
      />

      {/* Date */}
      <View className="flex items-start justify-start w-fill">
        <Label>Date:</Label>
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={onChangeDate}
        />
      </View>

      {/* Time range */}
      <View className="flex items-start justify-start w-fill">
        <Label>Time range:</Label>
        <View className="flex flex-row mt-5">
          {/* Start time */}
          <View className="flex flex-row items-center justify-center">
            <Text className="pl-5 text-grayHighContranst">From:</Text>
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={onChangeStartTime}
            />
          </View>

          {/* End time */}
          <View className="flex flex-row items-center justify-center">
            <Text className="ml-10 text-grayHighContranst">To:</Text>
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={onChangeEndTime}
            />
          </View>
        </View>
      </View>

      {/* Color Picker */}
      <View className="flex flex-col mb-15">
        <Label>Color:</Label>
        <View className="rounded-10 border-[1px] border-grayLowContrast overflow-hidden">
          {/* Color picker */}
          <View className="relative px-10 py-15">
            <ColorPicker
              className="w-full"
              value="red"
              onComplete={onSelectColor}
            >
              <Swatches />
            </ColorPicker>
          </View>

          {/* Background color preview */}
          <View
            className="absolute top-0 left-0 w-full h-full rounded-10 z-[-1] opacity-20"
            style={{
              backgroundColor: color,
            }}
          ></View>
        </View>
      </View>

      {/* Assign Employees */}
      <View className="mb-15">
        <Label>Assign Employees:</Label>
        <View className="w-full p-20 rounded-10 border-[1px] border-grayLowContrast my-5">
          <FlatList
            className=""
            data={employees}
            renderItem={renderItemUser}
            ItemSeparatorComponent={itemSeparator}
            keyExtractor={(item) => {
              item.UID;
            }}
          />
        </View>
      </View>

      <Button onPress={handleCreateEvent} loading={loading}>
        Create Event
      </Button>
    </PageContainer>
  );
};

export default AddEvent;