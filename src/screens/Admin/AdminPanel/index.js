import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import PageContainer from "../../../components/global/pageContainer";
import PanelCard from "../../../components/global/panelCard";

const AdminPanel = (props) => {
  const { navigation } = props;

  return (
    <PageContainer>
      <PanelCard
        title="Add Users"
        description="Create a new user in the app"
        icon="🙋‍♂️"
        onPress={() => {
          navigation.navigate("AddUser");
        }}
      />
      <PanelCard
        title="Manage Users"
        description="Manage all the users in the app"
        icon="👨‍👦‍👦"
        onPress={() => {
          navigation.navigate("ManageUsers");
        }}
      />
      <PanelCard
        title="Create event"
        description="Create a new event in the calendar"
        icon="🗓️"
        onPress={() => {
          navigation.navigate("AddEvent");
        }}
      />
    </PageContainer>
  );
};

export default AdminPanel;
