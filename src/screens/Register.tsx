import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import "../../global.css";
import AntDesign from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "../components/CustomTextInput";
import CustomModal from "../components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState({
    message: "Vui lòng nhập đầy đủ thông tin",
    icon: <Octicons name="shield-x" size={50} color="#ffffff" />,
    bgColorClassName: "bg-error",
    animationType: "fade" as "fade",
  });
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const handleRegister = () => {
    if (!phoneNumber || !password || !confirmPassword) {
      setModalProps({
        message: "Vui lòng nhập đầy đủ thông tin",
        icon: <Octicons name="shield-x" size={50} color="#ffffff" />,
        bgColorClassName: "bg-error",
        animationType: "fade",
      });
      setIsModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setModalProps({
        message: "Mật khẩu xác nhận không khớp",
        icon: <Octicons name="shield-x" size={50} color="#ffffff" />,
        bgColorClassName: "bg-error",
        animationType: "fade",
      });
      setIsModalVisible(true);
      return;
    }

    // TODO: Thêm gọi API tạo tài khoản ở đây
    // Ví dụ: nếu thành công thì chuyển sang Login hoặc HomePage

    Alert.alert("Thông báo", "Tạo tài khoản thành công!");
    navigation.navigate("Login");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center p-4 bg-[#FFF9E8] rounded-3xl">
        <View className="w-80 h-48 justify-center items-center relative">
          {loading && (
            <ActivityIndicator
              size="large"
              color="#00BFFF"
              style={{ position: "absolute", zIndex: 1 }}
            />
          )}
          <Image
            source={require("../../assets/imgs/medibell.png")}
            className="w-80 h-48"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>

        <Text className="text-3xl text-black font-bold mb-2">Tạo tài khoản</Text>
        <Text className="text-md text-[#6B7280] mb-8 text-center">
          Mong rằng chúng tôi sẽ giúp được bạn
        </Text>

        <View className="w-full justify-center items-center mb-4 gap-2">
          {/* Phone Number Input */}
          <CustomTextInput
            leftIcon={<AntDesign name="phone" size={16} color="#000" />}
            placeholder="Số điện thoại (Nhấn Enter)"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          {/* Password Input */}
          <CustomTextInput
            leftIcon={
              <Ionicons name="lock-closed-outline" size={16} color="#000" />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => setIsSecureEntry(!isSecureEntry)}
              >
                <AntDesign
                  name={isSecureEntry ? "eyeo" : "eye"}
                  size={16}
                  color="#000"
                />
              </TouchableOpacity>
            }
            placeholder="Mật khẩu"
            secureTextEntry={isSecureEntry}
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password Input */}
          <CustomTextInput
            leftIcon={
              <Ionicons name="lock-closed-outline" size={16} color="#000" />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => setIsSecureEntry(!isSecureEntry)}
              >
                <AntDesign
                  name={isSecureEntry ? "eyeo" : "eye"}
                  size={16}
                  color="#000"
                />
              </TouchableOpacity>
            }
            placeholder="Xác nhận mật khẩu"
            secureTextEntry={isSecureEntry}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className="mt-4 p-4 w-[24rem] bg-primary rounded-[20px] mb-4"
          onPress={handleRegister}
        >
          <Text className="text-center text-white text-xl font-semibold">
            Tạo tài khoản
          </Text>
        </TouchableOpacity>

        {/* Divider with or */}
        <View className="flex-row items-center justify-center mb-4 w-[24rem]">
          <View className="h-[1px] bg-gray-300 flex-1" />
          <Text className="mx-2 text-gray-500">or</Text>
          <View className="h-[1px] bg-gray-300 flex-1" />
        </View>

        {/* Social Register Options */}
        <View className="w-[24rem] justify-center items-center gap-2 mb-6">
          <TouchableOpacity className="flex-row items-center justify-center p-3 border border-gray-300 rounded-lg w-full bg-white">
            <Image
              source={require("../../assets/imgs/gg_logo.png")}
              className="w-4 h-4 mr-3"
            />
            <Text className="text-sm font-medium text-gray-700">
              Tạo tài khoản với Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-center p-3 border border-gray-300 rounded-lg w-full bg-white">
            <Image
              source={require("../../assets/imgs/fb_logo.png")}
              className="w-4 h-4 mr-3"
            />
            <Text className="text-sm font-medium text-gray-700">
              Tạo tài khoản với Facebook
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link to Login */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className="text-center text-sm">
            Bạn đã có tài khoản?{" "}
            <Text className="text-blue-500 underline">Đăng nhập ngay</Text>
          </Text>
        </TouchableOpacity>

        {/* Modal */}
        <CustomModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          {...modalProps}
        />
      </View>
    </ScrollView>
  );
};

export default Register;
