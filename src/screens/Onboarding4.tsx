import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import "../../global.css";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import ProgressBar from "../components/ProgressBar";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnboarding } from "../contexts/OnboardingContext";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding4"
>;

const Onboarding4 = () => {
  const navigation = useNavigation<NavigationProp>();
  const id: number = 1;
  const { setHasSeenOnboarding } = useOnboarding();
  const { setHasSeenOnboarding } = useOnboarding();

  const handlePress = async () => {
    console.log("Đã nhấn nút Trải nghiệm ngay");
    await setHasSeenOnboarding(true); // Context sẽ cập nhật => AppNavigator tự thay đổi cây navigator
  };

  return (
    <View className="flex-1 justify-center items-center bg-screen">
      {/* Nút Back ở góc trái */}
      <TouchableOpacity
        className="absolute top-10 left-4 p-2"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>

      <View className="flex-1 justify-evenly items-center p-6">
        {/* Icon Section */}
        <View className="pt-6 items-center justify-center gap-6">
          <Image
            source={require("../../assets/imgs/onboard4.png")}
            className="w-52 h-52"
          />

          <ProgressBar progress={3} />
        </View>

        <View className="items-center justify-start gap-4">
          {/* Title Section */}
          <Text className="text-3xl font-bold mt-2 text-center text-primary">
            Theo dõi thói quen, chăm sóc tốt hơn!
          </Text>

          {/* Subtitle Section */}
          <Text className="mt-4 text-center text-lg text-[#333333] font-medium">
            Xem báo cáo chi tiết về thói quen để điều chỉnh và duy trì sức khỏe
            tốt hơn!
          </Text>
        </View>

        {/* Button Section */}
        <TouchableOpacity
          className="mt-8 p-4 w-[24rem] bg-primary rounded-[20px]"
          onPress={handlePress}
        >
          <Text className="text-center text-white text-xl font-semibold">
            Trải nghiệm ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding4;
