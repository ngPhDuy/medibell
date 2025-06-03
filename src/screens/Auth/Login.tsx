import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import "../../../global.css";
import AntDesign from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "../../components/CustomTextInput";
import CustomModal from "../../components/CustomModal";
import { loginUser } from "../../api/Auth";
import { registerForPushNotificationsAsync } from "../../../utils/notification";
import { useAuth } from "../../contexts/AuthContext";
import { getUserID } from "../../storage/storage";
import { savePushToken } from "../../api/Notification";
const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const [modalProps, setModalProps] = useState({
    message: "Vui lòng nhập đầy đủ thông tin",
    icon: <Octicons name="shield-x" size={50} color="#ffffff" />,
    bgColorClassName: "bg-error",
    animationType: "fade" as "fade",
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = async () => {
    setLoading(true);
    if (username !== "" && password !== "") {
      console.log("Có thông tin");
      //Mẫu: 123, 456
      const result = await loginUser(username, password);
      setLoading(false);
      if (!result.success) {
        // Thông báo thông tin đăng nhập không đúng
        setIsModalVisible(true);
        setModalProps({
          ...modalProps,
          message: "Thông tin đăng nhập không đúng",
          icon: <Octicons name="shield-x" size={50} color="#ffffff" />,
          bgColorClassName: "bg-error",
        });
      } else {
        login();

        try {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            setExpoPushToken(token);

            const userID = await getUserID();
            await savePushToken(userID, token);

            console.log("Push token đã lưu thành công!");
          }
        } catch (error) {
          console.error("Lỗi khi lưu push token:", error);
        }
      }
    } else {
      console.log("Thiếu thông tin");
      setIsModalVisible(true);
      // Thiếu thông tin đăng nhập
      setModalProps({
        ...modalProps,
        message: "Vui lòng nhập đầy đủ thông tin",
        icon: <Octicons name="shield-x" size={50} color="#ffffff" />,
        bgColorClassName: "bg-error",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center p-4 bg-screen">
        {loading && (
          <ActivityIndicator
            size="large"
            color="#00BFFF"
            style={{ position: "absolute", zIndex: 1 }}
          />
        )}
        <View className="w-80 h-48 justify-center items-center relative">
          <Image
            source={require("../../../assets/imgs/medibell.png")}
            className="w-80 h-48"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
        <Text className="text-2xl text-black font-semibold mb-4 text-center">
          Mừng bạn trở lại!
        </Text>
        <Text className="text-md text-[#6B7280] mb-8 text-center">
          Mong rằng bạn vẫn ổn
        </Text>

        <View className="w-full justify-center items-center mb-4 gap-2">
          {/* Phone Number Input */}
          <CustomTextInput
            leftIcon={<AntDesign name="user" size={16} color="#000" />}
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={(text) => setUsername(text)}
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
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="mt-4 p-4 w-[24rem] bg-primary rounded-[20px] mb-4"
          onPress={handleLogin}
        >
          <Text className="text-center text-white text-xl font-semibold">
            Đăng nhập
          </Text>
        </TouchableOpacity>

        {/* Tạo hình: ----------------------- or ----------------------------- */}
        <View className="flex-row items-center justify-center mb-4">
          <View className="h-[1px] bg-gray-300 w-1/3" />
          <Text className="mx-2 text-gray-500">hoặc</Text>
          <View className="h-[1px] bg-gray-300 w-1/3" />
        </View>

        {/* Social Login Options */}
        <View className="w-[24rem] justify-center items-center gap-2 mb-6">
          <TouchableOpacity className="flex-row items-center justify-center p-3 border border-gray-300 rounded-lg w-[24rem] bg-white">
            <Image
              source={require("../../../assets/imgs/gg_logo.png")}
              className="w-4 h-4 mr-3"
            />
            <Text className="text-sm font-medium text-gray-700">
              Đăng nhập bằng Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-center p-3 border border-gray-300 rounded-lg w-[24rem] bg-white">
            <Image
              source={require("../../../assets/imgs/fb_logo.png")}
              className="w-4 h-4 mr-3"
            />
            <Text className="text-sm font-medium text-gray-700">
              Đăng nhập bằng Facebook
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text className="text-blue-500 text-sm text-center mb-4">
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text className="text-center text-sm">
            Bạn chưa có tài khoản?{" "}
            <Text className="text-blue-500">Hãy đăng ký</Text>
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

export default Login;
