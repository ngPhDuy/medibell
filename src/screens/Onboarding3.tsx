import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import "../../global.css";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import ProgressBar from "../components/ProgressBar";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding2"
>;

const Onboarding3 = () => {
  const navigation = useNavigation<NavigationProp>();

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
            source={require("../../assets/imgs/onboard3.png")}
            className="w-52 h-52"
          />

          <ProgressBar progress={2} />
        </View>

        <View className="items-center justify-start gap-4">
          {/* Title Section */}
          <Text className="text-3xl font-bold mt-2 text-center text-primary">
            Tạo lịch uống thuốc tự động, nhanh chóng!
          </Text>

          {/* Subtitle Section */}
          <Text className="mt-4 text-center text-lg text-[#333333] font-medium">
            Chỉ cần dùng camera, ứng dụng sẽ nhận diện thông tin và thiết lập
            lịch uống thuốc cho bạn trong vài giây!
          </Text>
        </View>

        {/* Button Section */}
        <TouchableOpacity
          className="mt-8 p-4 w-[24rem] bg-primary rounded-[20px]"
          onPress={() => navigation.navigate("Onboarding4")}
        >
          <Text className="text-center text-white text-xl font-semibold">
            Tiếp tục
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding3;
