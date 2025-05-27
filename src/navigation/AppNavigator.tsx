import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding1 from "../screens/Onboarding1";
import Onboarding2 from "../screens/Onboarding2";
import Onboarding3 from "../screens/Onboarding3";
import Onboarding4 from "../screens/Onboarding4";
import Login from "../screens/Login";
import HomePage from "../screens/HomePage";
import MedicineLibrary from "../screens/MedicineLibrary";
import AddMedicine from "../screens/AddMedicine";
import Register from "../screens/Register";
import { useOnboarding } from "../contexts/OnboardingContext";

export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  Login: undefined;
  HomePage: undefined;
  MedicineLibrary: undefined;
  AddMedicine: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { hasSeenOnboarding } = useOnboarding();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenOnboarding && (
          <>
            <Stack.Screen name="Onboarding1" component={Onboarding1} />
            <Stack.Screen name="Onboarding2" component={Onboarding2} />
            <Stack.Screen name="Onboarding3" component={Onboarding3} />
            <Stack.Screen name="Onboarding4" component={Onboarding4} />
          </>
        )}
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="AddMedicine" component={AddMedicine} />
        <Stack.Screen name="MedicineLibrary" component={MedicineLibrary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
