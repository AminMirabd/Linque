import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { Easing } from "react-native-reanimated";
import ColorPicker, { Swatches } from "reanimated-color-picker";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
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
import Colors from "../../../../../utils/Colors";
// import FileViewer from "react-native-file-viewer";

let randomstring = require("randomstring");

const AddEvent = (props) => {
  const { navigation } = props;
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const id = randomstring.generate(10);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [employees, setEmployees] = useState([]);
  const [listEmployeesAssigned, setListEmployeesAssigneed] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesUrl, setSelectedFilesUrl] = useState([]);

  //Fetch all users from the database
  useEffect(() => {
    getAllUsersDB(setEmployees);
  }, []);

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

  const pickDocument = async () => {
    if (selectedFiles.length >= 3) {
      alert("You can only add up to 3 files.");
      return;
    }

    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets) {
      const newFiles = result.assets.map((file) => {
        return { name: file.name, uri: file.uri, type: file.mimeType };
      });

      // Add the new selectedFiles to the existing array, ensuring the total count doesn't exceed 3
      setSelectedFiles((currentFiles) =>
        [...currentFiles, ...newFiles].slice(0, 3)
      );
    }
  };

  const uploadFile = async () => {
    const storage = getStorage();

    const uploadPromises = selectedFiles.map(async (file) => {
      const storageRef = ref(storage, `eventsDocuments/${id}/${file.name}`);
      const response = await fetch(file.uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Get the download URL
      return getDownloadURL(storageRef);
    });

    try {
      const urls = await Promise.all(uploadPromises);
      console.log("All files uploaded successfully. URLs:", urls);
      return urls; // Return the URLs instead of setting state
    } catch (error) {
      console.error("Error uploading files:", error);
      return []; // Return an empty array in case of error
    }
  };

  const handleCreateEvent = async () => {
    setLoading(true);

    const uploadedFileUrls = await uploadFile(); // Await the URLs here

    if (selectedFiles.length > 0 && uploadedFileUrls.length > 0) {
      console.log(uploadedFileUrls, "url????");
      const date = getISODateTime();
      const fromDate = date.isoStartDateTime;
      const toDate = date.isoEndDateTime;

      const eventObj = {
        id: id,
        title: title,
        description: description,
        color: color,
        employeesAssigned: listEmployeesAssigned,
        date: {
          from: fromDate,
          to: toDate,
        },
        files: uploadedFileUrls,
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
    }
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

      <View className="flex flex-col mb-10">
        <Label>Attach files:</Label>
        <TouchableOpacity
          className="p-20 rounded-20 border-grayLowContrast border-[1px] flex flex-row items-center justify-start bg-grayLowContrast"
          onPress={() => {
            pickDocument();
          }}
        >
          <AntDesign
            name="addfile"
            size={24}
            color={Colors.grayHighContranst}
          />
          <Text className="ml-10 font-medium text-grayHighContranst">
            Add up to three files *
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row flex-wrap items-center mb-50">
        {selectedFiles.map((file, index) => (
          <>
            <TouchableOpacity
              key={index}
              className="border-b-[1px] border-grayLowContrast max-w-fit mr-10 flex-row items-center justify-start mb-5"
            >
              <Text className="mr-5 font-medium text-grayHighContranst">
                {file.name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedFiles(
                    selectedFiles.filter((item, i) => i !== index)
                  );
                }}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={16}
                  color={Colors.grayHighContranst}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </>
        ))}
      </View>

      <Button onPress={handleCreateEvent} loading={loading}>
        Create Event
      </Button>
    </PageContainer>
  );
};

export default AddEvent;
