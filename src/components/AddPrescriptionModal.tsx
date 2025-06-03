import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
// Import các icon từ @expo/vector-icons
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AddDrugToPrescriptionModal from "./AddDrugToPrescriptionModal";
import DatePickerField from "../components/DatePickerField";
import { DateType } from "react-native-ui-datepicker";
import {
  DonChuaThuoc,
  CreateScheduleRequest,
  MedicineDetail,
} from "../types/Medicine";
import { getUserID } from "../storage/storage";
import { createMedicineSchedule } from "../api/MedicineSchedule";

interface AddPrescriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddPrescriptionModal: React.FC<AddPrescriptionModalProps> = ({
  visible,
  onClose,
}) => {
  const [prescriptionInput, setPrescriptionInput] = useState("");
  const [startDate, setStartDate] = useState<DateType>(new Date()); // Demo ngày
  const [endDate, setEndDate] = useState<DateType>(new Date()); // Demo ngày
  const [drugs, setDrugs] = useState<DonChuaThuoc[]>([]); // Danh sách thuốc đã thêm
  const [isAddDrugModalVisible, setIsAddDrugModalVisible] = useState(false);

  const handleAddDrugPress = () => {
    setIsAddDrugModalVisible(true);
  };

  const handleSaveDrug = (newDrug: DonChuaThuoc) => {
    setDrugs((prevDrugs) => [
      ...prevDrugs,
      { ...newDrug, id: Date.now().toString() },
    ]);
    setIsAddDrugModalVisible(false);
  };

  const handleDeleteDrug = (id: string) => {
    setDrugs((prevDrugs) => prevDrugs.filter((drug) => drug.id !== id));
  };

  const handleSavePrescription = async () => {
    if (prescriptionInput.trim() === "") {
      alert("Vui lòng nhập tên đơn thuốc.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Vui lòng chọn ngày bắt đầu và kết thúc.");
      return;
    }
    const uId = await getUserID();
    if (!uId) {
      alert("Không tìm thấy ID người dùng.");
      return;
    }
    const scheduleRequest: CreateScheduleRequest = {
      id_nguoi_dung: uId,
      ten_don_thuoc: prescriptionInput.trim(),
      ngay_bat_dau: new Date(startDate as Date).toISOString().split("T")[0],
      ngay_ket_thuc: new Date(endDate as Date).toISOString().split("T")[0],
      Don_chua_thuoc: drugs.map((item) => ({
        id: item.id,
        thuoc: item.thuoc,
        tong_so: Number(item.tong_so),
        buoi_uong: item.buoi_uong?.join(", ") || "",
        ghi_chu: item.ghi_chu,
      })),
    };
    console.log("Dữ liệu gửi lên server:", scheduleRequest);
    try {
      const response = await createMedicineSchedule(scheduleRequest);
      if (response) {
        alert("Đã lưu đơn thuốc thành công!");
      } else {
        alert("Lưu đơn thuốc thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu đơn thuốc:", error);
      alert("Đã xảy ra lỗi khi lưu đơn thuốc. Vui lòng thử lại sau.");
    }
    onClose();
  };

  const renderDrugItem = ({ item }: { item: DonChuaThuoc }) => (
    <View className="bg-gray-100 p-3 rounded-lg mb-2 border border-gray-200">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-blue-600 font-semibold text-base">
          {item.thuoc}
        </Text>
        <TouchableOpacity onPress={() => handleDeleteDrug(item.id)}>
          <AntDesign name="closecircle" size={20} color="#EF4444" />
          {/* Icon X đỏ */}
        </TouchableOpacity>
      </View>
      {item.ghi_chu ? (
        <Text className="text-gray-600 text-sm">Ghi chú: {item.ghi_chu}</Text>
      ) : null}
      <Text className="text-gray-600 text-sm">
        Số lượng: {item.tong_so} viên
      </Text>
      {/* Cập nhật phần hiển thị instruction */}
      {item.buoi_uong && item.buoi_uong.length > 0 && (
        <Text className="text-gray-600 text-sm">
          Uống vào buổi: {item.buoi_uong.join(", ")}
        </Text>
      )}
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              /* Ngăn chặn đóng modal khi chạm vào nội dung */
            }}
          >
            <View className="bg-white p-4 rounded-lg w-[90%] shadow-lg">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <AntDesign
                    name="camera"
                    size={24}
                    color="#333"
                    className="mr-2"
                  />
                  {/* Icon Camera */}
                  <Text className="text-xl font-semibold text-gray-800">
                    Thêm đơn thuốc
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <AntDesign name="close" size={24} color="#333" />
                  {/* Icon X */}
                </TouchableOpacity>
              </View>

              {/* Input: Thuốc cảm cúm 2 (Ví dụ đã có sẵn tên) */}
              <TextInput
                placeholder="Tên đơn thuốc (vd: Thuốc cảm cúm 2)"
                value={prescriptionInput}
                onChangeText={setPrescriptionInput}
                className="border border-gray-300 rounded-md p-3 mb-4 text-base"
              />

              {/* Date Pickers */}
              <View className="flex-row gap-3 justify-between mb-6">
                <View className="w-1/2">
                  <DatePickerField
                    date={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholder="Chọn ngày bắt đầu"
                    label="Ngày bắt đầu"
                    mode="single"
                    maxDate={new Date("2025-12-31")}
                    minDate={new Date("2025-01-01")}
                  />
                </View>

                <View className="w-1/2">
                  <DatePickerField
                    date={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholder="Chọn ngày kết thúc"
                    label="Ngày kết thúc"
                    mode="single"
                    maxDate={new Date("2025-12-31")}
                    minDate={startDate}
                  />
                </View>
              </View>

              {/* Button "Thêm thuốc" */}
              <TouchableOpacity
                onPress={handleAddDrugPress}
                className="bg-orange-500 py-3 rounded-md items-center mb-4 shadow-sm"
              >
                <Text className="text-white font-semibold text-base">
                  Thêm thuốc
                </Text>
              </TouchableOpacity>

              {/* Danh sách thuốc đã thêm */}
              {drugs.length > 0 && (
                <View className="mb-4">
                  <FlatList
                    data={drugs}
                    renderItem={renderDrugItem}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              )}

              {/* Button "Lưu" */}
              <TouchableOpacity
                onPress={handleSavePrescription}
                className={
                  `py-3 rounded-md items-center shadow-sm` +
                  (prescriptionInput.trim() === "" || drugs.length === 0
                    ? " bg-gray-400"
                    : " bg-blue-500")
                }
                disabled={prescriptionInput.trim() === "" || drugs.length === 0}
              >
                <Text className="text-white font-semibold text-base">Lưu</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal để thêm từng loại thuốc */}
      <AddDrugToPrescriptionModal
        visible={isAddDrugModalVisible}
        onClose={() => setIsAddDrugModalVisible(false)}
        onSaveDrug={handleSaveDrug}
      />
    </Modal>
  );
};

export default AddPrescriptionModal;
