import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { Easing } from "react-native-reanimated";
import ColorPicker, { Swatches } from "reanimated-color-picker";
import { MotiView, MotiText } from "moti";
import PageContainer from "../../../../components/global/pageContainer";
import Input from "../../../../components/customElements/input";
import {
  addEventDB,
  getAllUsersDB,
} from "../../../../../utils/firebaseOperations";
import Label from "../../../../components/global/label";
import Button from "../../../../components/customElements/button";

let randomstring = require("randomstring");

const AddEvent = (props) => {
  const { navigation } = props;
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [employees, setEmployees] = useState([]);
  const [listEmployeesAssigned, setListEmployeesAssigneed] = useState([]);

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

  //Fetch all users from the database
  useEffect(() => {
    getAllUsersDB(setEmployees);
  }, []);

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

  const handleCreateEvent = () => {
    setLoading(true);

    const fromDate = generateRandomDate();
    const toDate = new Date(fromDate.getTime() + 60 * 60 * 1000);

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
            keyExtractor={(item, index) => {
              index.toString();
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
