import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import Register from "./Register";
import { isUserLoggedIn } from "../../storage/storage";
import { ActivityIndicator, View } from "react-native";

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isUserLoggedIn();
      setInitialRoute(loggedIn ? "UserProfile" : "Login");
    };
    checkLogin();
  }, []);

  // Loading khi chưa xác định route ban đầu
  if (!initialRoute) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
