import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreen";

import NotificationTestScreen from "../src/screens/notification/NotificationTestScreen";
const Stack = createStackNavigator();

const UserProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Hồ sơ", headerTitleAlign: "center" }}
      />

      {/* <Stack.Screen
        name="NotificationTest"
        component={NotificationTestScreen}
        options={{ title: "Thông báo" }}
      /> */}
      {/*
      <Stack.Screen name="TopUpPoints" component={TopUpPoints} />
   
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} /> */}
    </Stack.Navigator>
  );
};

export default UserProfileStack;
