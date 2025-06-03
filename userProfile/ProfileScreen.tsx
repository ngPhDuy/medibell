import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { getUserById } from "../src/api/Patient";
import { clearAsyncStorage } from "../src/storage/storage";
import { useAuth } from "../src/contexts/AuthContext";

import MenuItem from "../src/components/MenuItem";
import { getUserID } from "../src/storage/storage";

export default function ProfileScreen({ navigation }: any) {
  const { logout } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);

  const [loading, setLoading] = useState(false);
  const HealthMetricsMenu = [
    {
      icon: "barbell", // hoặc icon phù hợp
      title: "Chỉ số BMI",
      screen: "BMIScreen",
      color: "#34D399",
    },
    {
      icon: "heart",
      title: "Huyết áp",
      screen: "BloodPressureScreen",
      color: "#F87171",
    },
    {
      icon: "pulse",
      title: "Nhịp tim",
      screen: "HeartRateScreen",
      color: "#60A5FA",
    },
    {
      icon: "walk",
      title: "Hoạt động",
      screen: "ActivityScreen",
      color: "#FBBF24",
    },
  ];

  // Load avatar từ AsyncStorage mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const userId = await getUserID();
          if (!userId) {
            return;
          }
          const user = await getUserById(Number(userId));
          console.log("✅ User info:", user);
        } catch (e) {
          console.error("❌ Failed to fetch user");
        }
      };

      fetchUser();
    }, [])
  );

  const handleSignOut = async () => {
    // Xóa thông tin người dùng khỏi AsyncStorage
    await clearAsyncStorage();
    logout();
  };

  return (
    <View className="flex-1 bg-white p-5">
      <>
        {/* Avatar và tên */}
        <View className="items-center mb-6">
          <TouchableOpacity className="relative">
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require("../../assets/avatar-placeholder.png")
              }
              className="w-48 h-48 rounded-full"
            />
          </TouchableOpacity>
          <Text className="mt-4 text-xl font-semibold">{fullName}</Text>
        </View>

        {/* Các mục */}
        <View className="mt-8">
          <MenuItem
            icon="person"
            title="Thông tin cá nhân"
            onPress={() => navigation.navigate("PersonalInfo")}
            color="#3B82F6" // xanh lá nhạt
          />

          <MenuItem
            icon="help-circle"
            title="Hỗ trợ"
            onPress={() =>
              Linking.openURL("https://www.facebook.com/tan.tai.vo.399892")
            }
            color="#FBBF24" // vàng nhạt
          />
          {/* <MenuItem
              icon="document-text"
              title="Điều khoản sử dụng"
              onPress={() => navigation.navigate("TermsOfUse")}
              color="#FBBF24" // hồng nhạt
            /> */}
          <MenuItem
            icon="log-out"
            title="Đăng xuất"
            onPress={handleSignOut}
            color="#F87171" // đỏ nhẹ
          />
        </View>
      </>
    </View>
  );
}
