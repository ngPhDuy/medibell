import React from "react";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import "../../global.css";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding1"
>;

const Onboarding1 = () => {
  const navigation = useNavigation<NavigationProp>();
  const [hasSeenBefore, setHasSeenBefore] = useState<boolean | null>(null);

  // const resetOnboarding = async () => {
  //   await AsyncStorage.clear(); // Xóa dữ liệu AsyncStorage để kiểm tra lại
  // };

  // resetOnboarding(); // Gọi hàm này để xóa dữ liệu AsyncStorage (chỉ dùng cho mục đích kiểm tra)

  useEffect(() => {
    const checkIfSeen = async () => {
      const value = await AsyncStorage.getItem("hasSeenOnboarding");
      if (!value || value === "false") {
        setHasSeenBefore(false);
      } else if (value === "true") {
        setHasSeenBefore(true);
      }
    };
    checkIfSeen();
  }, []);

  if (hasSeenBefore === null) {
    // Có thể render loading, hoặc để trống khi chưa biết trạng thái
    return null;
  }

  const handlePress = () => {
    if (hasSeenBefore) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("Onboarding2");
    }
  };

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
          onPress={handlePress}
        >
          <Text className="text-center text-white text-xl font-semibold">
            {hasSeenBefore ? "Đăng nhập" : "Bắt đầu nào!"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding1;
