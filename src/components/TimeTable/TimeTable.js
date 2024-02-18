import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';

const events_data = [
  {
    title: "Math",
    startTime: genTimeBlock("WED", 9),
    endTime: genTimeBlock("WED", 10, 50),
    location: "Class 403",
    extra_descriptions: ["Kim", "Lee"],
  },
  {
    title: "Physics",
    startTime: genTimeBlock("MON", 11),
    endTime: genTimeBlock("MON", 11, 60),
    location: "Lab 404",
    extra_descriptions: ["Einstein"],
  },
  {
    title: "Physics",
    startTime: genTimeBlock("WED", 11),
    endTime: genTimeBlock("WED", 11, 60),
    location: "Lab 404",
    extra_descriptions: ["Einstein"],
  },
  {
    title: "Coding",
    startTime: genTimeBlock("TUE", 9),
    endTime: genTimeBlock("TUE", 10, 60),
    location: "Language Center",
    extra_descriptions: ["Mir"],
  },
  {
    title: "Spansih",
    startTime: genTimeBlock("FRI", 9),
    endTime: genTimeBlock("FRI", 10, 60),
    location: "Language Center",
    extra_descriptions: ["Nakamura"],
  },
  {
    title: "Lalala",
    startTime: genTimeBlock("THU", 9),
    endTime: genTimeBlock("THU", 10, 60),
    location: "Activity Place",
  },
  {
    title: "Club Activity",
    startTime: genTimeBlock("FRI", 13, 30),
    endTime: genTimeBlock("FRI", 14, 50),
    location: "Activity Center",
  },
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.numOfDays = 7;
    this.pivotDate = genTimeBlock('mon');
  }

  scrollViewRef = (ref) => {
    this.timetableRef = ref;
  };

  onEventPress = (evt) => {
    Alert.alert("onEventPress", JSON.stringify(evt));
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <TimeTableView
            scrollViewRef={this.scrollViewRef}
            events={events_data}
            pivotTime={7}
            pivotEndTime={31}
            pivotDate={this.pivotDate}
            nDays={this.numOfDays}
            onEventPress={this.onEventPress}
            headerStyle={styles.headerStyle}
            formatDateHeader="ddd"
            locale="en"
          />
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#132E35'
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});