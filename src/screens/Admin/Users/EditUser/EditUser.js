import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import UserTemplate from "../../../../components/users/userTemplate";
import PageContainer from "../../../../components/global/pageContainer";

const EditUser = ({ route, navigation }) => {
  const { id } = route.params;
  const [procedureLoading, setProcedureLoading] = useState(false);
  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <PageContainer
      pointerEvents={procedureLoading && "none"}
      navigation={navigation}
      keyboardScroll
    >
      <UserTemplate
        userUID={id}
        procedureLoading={procedureLoading}
        setProcedureLoading={setProcedureLoading}
      />
    </PageContainer>
  );
};

export default EditUser;
