import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  fetchMedicineScheduleById,
  toggleMedicineSchedule,
} from "../api/MedicineSchedule";
import { MedicineIntakeDetail } from "../types/Medicine";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import NavBar from "../components/NavBar";

const MedicineDetailScreen = ({ route, navigation }: any) => {
  const [medicineDetail, setMedicineDetail] =
    useState<MedicineIntakeDetail | null>(null);
  const { scheduleId } = route.params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMedicineSchedule = async () => {
      try {
        const data = await fetchMedicineScheduleById(scheduleId);
        setMedicineDetail(data);
      } catch (error) {
        console.error("Lỗi khi load lịch trình thuốc chi tiết:", error);
      }
    };

    if (scheduleId) {
      loadMedicineSchedule();
    }
  }, [scheduleId]);

  const markAsTaken = async () => {
    try {
      setLoading(true);
      await toggleMedicineSchedule(scheduleId);
      const updatedData = await fetchMedicineScheduleById(scheduleId);
      setMedicineDetail(updatedData);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Làm tốt lắm!",
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Thất bại",
        text2: "Chưa tới thời gian uống thuốc.",
      });
    }
  };

  if (!medicineDetail) {
    return (
      <View className="flex-1 p-4 bg-white justify-center items-center">
        <Text className="text-gray-600">Đang tải thông tin thuốc...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 p-4 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const {
    gio,
    ngay,
    Don_thuoc,
    Thuoc_trong_mot_lan_uong,
    thoi_diem_da_uong,
    buoi_uong,
  } = medicineDetail;

  const isTaken = !!thoi_diem_da_uong;
  const takenAtFormatted = isTaken
    ? dayjs(thoi_diem_da_uong).locale("vi").format("HH:mm")
    : null;
  const intakeTimeFormatted = `${buoi_uong} lúc ${gio.slice(0, 5)}`;
  const intakeDateFormatted = dayjs(ngay)
    .locale("vi")
    .format("DD [tháng] MM, YYYY");

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <View className="w-full flex-row justify-between items-center px-4 pt-10 mb-4">
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={32} color="black" />
        </TouchableOpacity>

        <View className="text-center justify-center items-center">
          <Text className="text-lg font-semibold">Xin chào bạn của tôi!</Text>
        </View>

        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => markAsTaken()}
        >
          <FontAwesome name="pencil" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Đơn thuốc */}
      <View className="rounded-xl bg-yellow-100 p-4 mb-6 shadow-sm">
        <Text className="text-xl font-semibold text-yellow-800 mb-1">
          {Don_thuoc.ten_don_thuoc}
        </Text>
      </View>

      {/* Thời gian uống */}
      <View className="mb-6">
        <Text className="text-base font-semibold mb-1 text-gray-800">
          Thời gian uống:
        </Text>
        <Text className="text-base text-black">{intakeTimeFormatted}</Text>
        <Text className="text-base text-gray-500">
          Ngày {intakeDateFormatted}
        </Text>
      </View>

      {/* Danh sách thuốc */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-2 text-gray-800">
          Thuốc cần uống:
        </Text>
        {Thuoc_trong_mot_lan_uong.map((thuoc) => (
          <View
            key={thuoc.id}
            className="mb-3 border border-gray-200 rounded-xl p-3 bg-gray-50"
          >
            <Text className="text-base font-medium">Thuốc: {thuoc.thuoc}</Text>
            <Text className="text-gray-600">Số lượng: {thuoc.so_luong}</Text>
          </View>
        ))}
      </View>

      {/* Trạng thái uống */}
      <TouchableOpacity
        disabled={isTaken}
        onPress={markAsTaken}
        className={`rounded-lg py-4 items-center ${
          isTaken ? "bg-green-500" : "bg-blue-500"
        }`}
      >
        <Text className="text-white font-bold text-base">
          {isTaken ? `Đã uống lúc ${takenAtFormatted}` : "Đánh dấu đã uống"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MedicineDetailScreen;
