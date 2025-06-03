import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import NavBar from "../components/NavBar";
import ListItem from "../components/ListItem";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import DatesTab from "../components/DatesTab";
import { DateType } from "react-native-ui-datepicker";
import { clearAsyncStorage } from "../storage/storage";
import { useAuth } from "../contexts/AuthContext";
import { MedicineSchedule, MedicineScheduleIntake } from "../types/Medicine";
import { getUserID } from "../storage/storage";
import {
  fetchMedicineSchedule,
  toggleMedicineSchedule,
} from "../api/MedicineSchedule";
import MedicineItem from "../components/MedicineItem";
import { SwipeListView } from "react-native-swipe-list-view";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";
import AddPrescriptionModal from "../components/AddPrescriptionModal";

import "../../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PERIOD_CONFIG = {
  Sáng: {
    title: "Sáng: 6 - 12h",
    icon: "🌅",
    bgColor: "bg-yellow-50",
  },
  Trưa: {
    title: "Trưa: 12 - 18h",
    icon: "🌞",
    bgColor: "bg-blue-50",
  },
  Chiều: {
    title: "Chiều: 18 - 24h",
    icon: "🌇",
    bgColor: "bg-orange-50",
  },
  Tối: {
    title: "Tối: 22 - 24h",
    icon: "🌙",
    bgColor: "bg-indigo-100",
  },
} as const;

const HomePage = ({ navigation }: any) => {
  const { logout } = useAuth();
  const [medicineScheduleIntakes, setMedicineScheduleIntakes] = useState<
    MedicineScheduleIntake[]
  >([]);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineScheduleIntake | null>(null);
  const [medicineScheduleIntakes, setMedicineScheduleIntakes] = useState<
    MedicineScheduleIntake[]
  >([]);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineScheduleIntake | null>(null);
  const [schedules, setSchedules] = useState<MedicineSchedule[]>([]);
  let today = new Date();
  const [selectedDay, setSelectedDay] = useState<DateType>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] =
    useState(false);
  const [selectedDay, setSelectedDay] = useState<DateType>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] =
    useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSchedules = async () => {
    setLoading(true);
    const patientId = await getUserID();
    if (!patientId) {
      console.error("Không tìm thấy ID bệnh nhân trong storage.");
      return;
    }
    const dayStr = dayjs(selectedDay).format("YYYY-MM-DD");
    const data = await fetchMedicineSchedule(patientId, dayStr, dayStr);
    setSchedules(data);
    const allIntakes = data.flatMap((schedule) =>
      schedule.intakes.map((intake) => ({
        ...intake,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        status: schedule.status,
        prescriptionName: schedule.prescriptionName,
        patientId: schedule.patientId,
      }))
    );
    setMedicineScheduleIntakes(allIntakes);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadSchedules();
    }, [selectedDay])
  );
  useFocusEffect(
    useCallback(() => {
      loadSchedules();
    }, [selectedDay])
  );

  const handleExpand = (medicine: MedicineScheduleIntake) => {
    setActionModalVisible(true);
    setSelectedMedicine(medicine);
  };

  const markAsTaken = async (medicineId?: number) => {
    try {
      if (!selectedMedicine) return;
      const scheduleId = medicineId || selectedMedicine.id;
      await toggleMedicineSchedule(scheduleId);
      loadSchedules();
    } catch (err) {}
    setActionModalVisible(false);
  };

  const handleSignOut = async () => {
    try {
      // Lưu lại giá trị hasSeenOnboarding (nếu có)
      const onboardingValue = await AsyncStorage.getItem("hasSeenOnboarding");

      // Xóa toàn bộ AsyncStorage
      await AsyncStorage.clear();

      // Đặt lại hasSeenOnboarding nếu trước đó đã xem
      if (onboardingValue !== null) {
        await AsyncStorage.setItem("hasSeenOnboarding", onboardingValue);
      }

      // Gọi hàm logout của bạn (ví dụ như cập nhật context hoặc chuyển trang)
      logout();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <View className="flex-1 bg-screen justify-center items-center py-4">
      <View className="w-full flex-row justify-between items-center px-4 pt-10 mb-4">
        <TouchableOpacity
          className="justify-center items-center"
          onPress={handleSignOut}
        >
          <FontAwesome5
            name="user"
            size={15}
            color="black"
            className="p-3 rounded-full bg-gray-200"
          />
        <TouchableOpacity
          className="justify-center items-center"
          onPress={handleSignOut}
        >
          <FontAwesome5
            name="user"
            size={15}
            color="black"
            className="p-3 rounded-full bg-gray-200"
          />
        </TouchableOpacity>
        <View className="text-center justify-center items-center">
          <Text className="text-lg font-semibold">Xin chào bạn của tôi!</Text>
        </View>
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => setShowAddPrescriptionModal(true)}
        >
          <AntDesign
            name="plussquareo"
            size={20}
            color="black"
            className="p-3"
          />
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => setShowAddPrescriptionModal(true)}
        >
          <AntDesign
            name="plussquareo"
            size={20}
            color="black"
            className="p-3"
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between items-center mt-2">
        <DatesTab onDateSelect={setSelectedDay} />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-gray-500">
            Đang tải lịch uống thuốc...
          </Text>
          <Text className="mt-2 text-gray-500">
            Đang tải lịch uống thuốc...
          </Text>
        </View>
      ) : medicineScheduleIntakes.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">
            Không có lịch uống thuốc nào trong ngày này.
          </Text>
          <Text className="text-gray-500">
            Không có lịch uống thuốc nào trong ngày này.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 w-full">
          {["Chưa uống", "Đã uống"].map((label) => {
            const filter =
              label === "Chưa uống"
                ? (item: MedicineScheduleIntake) => item.takenAt === null
                : (item: MedicineScheduleIntake) => item.takenAt !== null;
            const filter =
              label === "Chưa uống"
                ? (item: MedicineScheduleIntake) => item.takenAt === null
                : (item: MedicineScheduleIntake) => item.takenAt !== null;
            const medicines = medicineScheduleIntakes.filter(filter);
            if (medicines.length === 0) return null;

            return (
              <View key={label} className="mb-5 px-2 rounded-lg">
                <View className="flex-row items-center mb-2 ml-2">
                  <Text className="text-lg font-bold">{label}</Text>
                </View>

                {["Sáng", "Trưa", "Chiều", "Tối"].map((period) => {
                  const medicinesByPeriod = medicines.filter(
                    (item) => item.period === period
                  );
                  const medicinesByPeriod = medicines.filter(
                    (item) => item.period === period
                  );
                  if (medicinesByPeriod.length === 0) return null;
                  const { title, icon } = PERIOD_CONFIG[period] || {};

                  return (
                    <View key={period} className="mb-4">
                      <View className="flex-row items-center mb-1 ml-1">
                        <Text className="text-xl mr-2">{icon}</Text>
                        <Text className="text-base font-semibold">{title}</Text>
                      </View>
                      <View className="px-4 py-2 rounded-2xl">
                        <SwipeListView
                          data={medicinesByPeriod}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={({ item, index }) => (
                            <MedicineItem
                              medicine={item}
                              onPress={() =>
                                navigation.navigate("MedicineDetailScreen", {
                                  scheduleId: item.id,
                                })
                              }
                              onPress={() =>
                                navigation.navigate("MedicineDetailScreen", {
                                  scheduleId: item.id,
                                })
                              }
                              onExpand={handleExpand}
                              showDivider={
                                index !== medicinesByPeriod.length - 1
                              }
                              showDivider={
                                index !== medicinesByPeriod.length - 1
                              }
                            />
                          )}
                          renderHiddenItem={({ item }) => (
                            <View className="flex-1 justify-center items-end pr-4">
                              <View
                                className={`py-2 px-4 rounded-xl ${
                                  item.takenAt ? "bg-gray-400" : "bg-green-500"
                                }`}
                              >
                              <View
                                className={`py-2 px-4 rounded-xl ${
                                  item.takenAt ? "bg-gray-400" : "bg-green-500"
                                }`}
                              >
                                <Text className="text-white font-bold">
                                  {item.takenAt
                                    ? "Chưa uống"
                                    : "Đánh dấu đã uống"}
                                  {item.takenAt
                                    ? "Chưa uống"
                                    : "Đánh dấu đã uống"}
                                </Text>
                              </View>
                            </View>
                          )}
                          rightOpenValue={-220}
                          friction={20}
                          disableRightSwipe
                          onRowOpen={async (rowKey, rowMap) => {
                            const medicine = medicinesByPeriod.find(
                              (m) => m.id.toString() === rowKey
                            );
                            const medicine = medicinesByPeriod.find(
                              (m) => m.id.toString() === rowKey
                            );
                            if (!medicine) return;
                            setSelectedMedicine(medicine);
                            await markAsTaken(medicine.id);
                            rowMap[rowKey]?.closeRow();
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      )}

      <AddPrescriptionModal
        visible={showAddPrescriptionModal}
        onClose={() => setShowAddPrescriptionModal(false)}
      />
    </View>
  );
};

export default HomePage;
