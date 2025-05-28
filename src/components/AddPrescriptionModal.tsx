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

// Định nghĩa kiểu dữ liệu cho một loại thuốc
interface DrugItem {
  id: string; // Dùng để làm key cho FlatList
  name: string;
  quantity: string;
  unit: string;
  note: string;
  instruction: string[]; // Cập nhật: Thay đổi thành mảng string
}

interface AddPrescriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddPrescriptionModal: React.FC<AddPrescriptionModalProps> = ({
  visible,
  onClose,
}) => {
  const [prescriptionInput, setPrescriptionInput] = useState("");
  const [startDate, setStartDate] = useState("09/03/2025"); // Demo ngày
  const [endDate, setEndDate] = useState("12/03/2025"); // Demo ngày
  const [drugs, setDrugs] = useState<DrugItem[]>([]); // Danh sách thuốc đã thêm
  const [isAddDrugModalVisible, setIsAddDrugModalVisible] = useState(false);

  const handleAddDrugPress = () => {
    setIsAddDrugModalVisible(true);
  };

  const handleSaveDrug = (newDrug: DrugItem) => {
    setDrugs((prevDrugs) => [
      ...prevDrugs,
      { ...newDrug, id: Date.now().toString() },
    ]);
    setIsAddDrugModalVisible(false);
  };

  const handleDeleteDrug = (id: string) => {
    setDrugs((prevDrugs) => prevDrugs.filter((drug) => drug.id !== id));
  };

  const handleSavePrescription = () => {
    if (prescriptionInput.trim() === "") {
      alert("Vui lòng nhập tên đơn thuốc.");
      return;
    }
    onClose(); // Đóng modal chính sau khi lưu
  };

  const renderDrugItem = ({ item }: { item: DrugItem }) => (
    <View className="bg-gray-100 p-3 rounded-lg mb-2 border border-gray-200">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-blue-600 font-semibold text-base">
          {item.name}
        </Text>
        <TouchableOpacity onPress={() => handleDeleteDrug(item.id)}>
          <AntDesign name="closecircle" size={20} color="#EF4444" />
          {/* Icon X đỏ */}
        </TouchableOpacity>
      </View>
      {item.note ? (
        <Text className="text-gray-600 text-sm">Ghi chú: {item.note}</Text>
      ) : null}
      <Text className="text-gray-600 text-sm">
        Số lượng: {item.quantity} {item.unit}
      </Text>
      {/* Cập nhật phần hiển thị instruction */}
      {item.instruction && item.instruction.length > 0 && (
        <Text className="text-gray-600 text-sm">
          Uống vào buổi: {item.instruction.join(", ")}
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
              <View className="flex-row justify-between mb-6">
                <TouchableOpacity
                  // onPress={handlePressCalendarFrom} // Kết nối với DatePicker
                  className="flex-row items-center flex-1 border border-gray-300 rounded-md p-3 mr-2"
                >
                  <Text className="text-base text-gray-500 flex-1">
                    {startDate}
                  </Text>
                  <FontAwesome name="calendar" size={20} color="#9CA3AF" />
                  {/* Icon Lịch */}
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={handlePressCalendarTo} // Kết nối với DatePicker
                  className="flex-row items-center flex-1 border border-gray-300 rounded-md p-3 ml-2"
                >
                  <Text className="text-base text-gray-500 flex-1">
                    {endDate}
                  </Text>
                  <FontAwesome name="calendar" size={20} color="#9CA3AF" />
                  {/* Icon Lịch */}
                </TouchableOpacity>
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
                className="bg-blue-500 py-3 rounded-md items-center shadow-sm"
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
