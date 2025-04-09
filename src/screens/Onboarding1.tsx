import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import "../../global.css";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding1"
>;

const Onboarding1 = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex-1 justify-center items-center bg-screen">
      <View className="flex-1 justify-evenly items-center p-6">
        {/* Icon Section */}
        <View className="pt-6">
          <Image
            source={require("../../assets/imgs/onboard1.png")}
            className="w-52 h-52"
          />
        </View>

        <View className="items-center justify-start gap-4">
          <View className="flex text-center items-center justify-center gap-2">
            <Text className="text-3xl font-bold text-secondary">
              Mừng đến với
            </Text>
            <Text className="text-6xl font-bold mt-2 text-primary">
              MediBell
            </Text>
          </View>

          <Text className="mt-4 text-center text-lg text-[#333333] font-medium">
            Đừng để 5 phút nữa thành... ngày mai!
          </Text>
        </View>

        <TouchableOpacity
          className="mt-8 p-4 w-[24rem] bg-primary rounded-[20px]"
          onPress={() => navigation.navigate("Onboarding2")}
        >
          <Text className="text-center text-white text-xl font-semibold">
            Bắt đầu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding1;
