import React, { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding1 from "../screens/Onboarding1";
import Onboarding2 from "../screens/Onboarding2";
import Onboarding3 from "../screens/Onboarding3";
import Onboarding4 from "../screens/Onboarding4";
import HomePage from "../screens/HomePage";
import MedicineDetailScreen from "../screens/MedicineDetail";
import MedicineLibrary from "../screens/MedicineLibrary";
import MedicineDetailLibrary from "../screens/MedicineDetailLibrary";
import AddMedicine from "../screens/AddMedicine";
import AuthStack from "../screens/Auth/AuthStack";
import MedicineDetail from "../screens/MedicineDetail";
import EditMedicine from "../screens/EditMedicine";
import UserProfileStack from "../../userProfile/UserProfileStack";
import { useOnboarding } from "../contexts/OnboardingContext";
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;

  HomePage: undefined;
  MedicineDetailScreen: { scheduleId: number };
  MedicineLibrary: undefined;
  AddMedicine: undefined;
  Login: undefined;
  Register: undefined;
  AuthStack: undefined;
  MedicineDetail: undefined;
  MedicineDetailLibrary: undefined;
  EditMedicine: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { hasSeenOnboarding } = useOnboarding();
  const { loggedIn } = useAuth();

  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log("✅ AsyncStorage cleared");
      } catch (e) {
        console.error("❌ Failed to clear AsyncStorage", e);
      }
    };

    clearStorage();
  }, []);

  if (!hasSeenOnboarding) {
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (loggedIn === undefined) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthStack" component={AuthStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* {!hasSeenOnboarding && (
          <>
            <Stack.Screen name="Onboarding1" component={Onboarding1} />
            <Stack.Screen name="Onboarding2" component={Onboarding2} />
            <Stack.Screen name="Onboarding3" component={Onboarding3} />
            <Stack.Screen name="Onboarding4" component={Onboarding4} />
          </> 
        )} */}
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen
          name="MedicineDetailScreen"
          component={MedicineDetailScreen}
          initialParams={{ scheduleId: 0 }}
        />
        <Stack.Screen name="AddMedicine" component={AddMedicine} />
        <Stack.Screen name="MedicineLibrary" component={MedicineLibrary} />
        <Stack.Screen name="MedicineDetail" component={MedicineDetail} />
        <Stack.Screen
          name="MedicineDetailLibrary"
          component={MedicineDetailLibrary}
        />
        <Stack.Screen name="EditMedicine" component={EditMedicine} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
