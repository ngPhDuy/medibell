import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  // Thêm StyleSheet nếu bạn muốn định nghĩa styles cục bộ thay vì hoàn toàn NativeWind
  StyleSheet,
} from "react-native";
// Import các icon từ @expo/vector-icons
import { AntDesign, Feather } from "@expo/vector-icons";

// Cập nhật DrugItem để bao gồm buổi uống (instruction)
interface DrugItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  note: string;
  instruction: string[]; // Thay đổi thành mảng string để lưu nhiều buổi uống
}

interface AddDrugToPrescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveDrug: (drug: Omit<DrugItem, "id">) => void;
}

const AddDrugToPrescriptionModal: React.FC<AddDrugToPrescriptionModalProps> = ({
  visible,
  onClose,
  onSaveDrug,
}) => {
  const [drugName, setDrugName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Viên"); // Mặc định là Viên
  const [note, setNote] = useState("");
  // State mới để lưu các buổi uống đã chọn
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>(
    []
  );
  const [isFormValid, setIsFormValid] = useState(false);

  // useEffect để kiểm tra tính hợp lệ của form
  useEffect(() => {
    // Form hợp lệ nếu drugName, quantity không rỗng, unit không rỗng và ít nhất một buổi uống được chọn
    setIsFormValid(
      drugName.trim() !== "" &&
        quantity.trim() !== "" &&
        unit.trim() !== "" &&
        selectedInstructions.length > 0 // Thêm điều kiện này
    );
  }, [drugName, quantity, unit, selectedInstructions]); // Thêm selectedInstructions vào dependencies

  const handleToggleInstruction = (instruction: string) => {
    setSelectedInstructions(
      (prev) =>
        prev.includes(instruction)
          ? prev.filter((item) => item !== instruction) // Bỏ chọn nếu đã chọn
          : [...prev, instruction] // Thêm vào nếu chưa chọn
    );
  };

  const handleSave = () => {
    if (isFormValid) {
      onSaveDrug({
        name: drugName,
        quantity: quantity,
        unit: unit,
        note: note,
        instruction: selectedInstructions, // Lưu các buổi uống đã chọn
      });
      // Reset form sau khi lưu và đóng modal
      setDrugName("");
      setQuantity("");
      setUnit("Viên");
      setNote("");
      setSelectedInstructions([]); // Reset buổi uống đã chọn
      onClose(); // Đóng modal sau khi lưu thành công
    } else {
      console.warn("Vui lòng điền đủ thông tin thuốc bắt buộc.");
      // Bạn có thể hiển thị một thông báo cho người dùng ở đây
    }
  };

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
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-white p-4 rounded-lg w-[85%] shadow-lg">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-semibold text-gray-800">
                  Thuốc
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {/* Input: Tên thuốc */}
              <TextInput
                placeholder="Tên thuốc"
                value={drugName}
                onChangeText={setDrugName}
                className="border border-gray-300 rounded-md p-3 mb-4 text-base"
              />

              {/* Số lượng và Đơn vị */}
              <View className="flex-row justify-between mb-4">
                <TextInput
                  placeholder="Số lượng"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  className="flex-1 border border-gray-300 rounded-md p-3 mr-2 text-base"
                />
                <TouchableOpacity
                  // Logic mở dropdown chọn đơn vị (Viên, Gói, Lọ, v.v.)
                  className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-md p-3 ml-2"
                >
                  <Text className="text-base text-gray-700">{unit}</Text>
                  <Feather name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Ghi chú thêm */}
              <TextInput
                placeholder="Ghi chú thêm..."
                value={note}
                onChangeText={setNote}
                className="border border-gray-300 rounded-md p-3 mb-6 text-base h-20" // Giảm mb để gần buổi uống hơn
                multiline={true}
                numberOfLines={4}
              />

              {/* Nút chọn buổi uống */}
              <View className="flex-row justify-around mb-8">
                {["Sáng", "Trưa", "Chiều"].map((buoi) => (
                  <TouchableOpacity
                    key={buoi}
                    onPress={() => handleToggleInstruction(buoi)}
                    className={`flex-1 mx-1 py-3 rounded-md items-center border ${
                      selectedInstructions.includes(buoi)
                        ? "bg-blue-500 border-blue-500" // Màu xanh khi được chọn
                        : "bg-gray-100 border-gray-300" // Màu xám nhạt khi không được chọn
                    }`}
                  >
                    <Text
                      className={`font-semibold text-base ${
                        selectedInstructions.includes(buoi)
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {buoi}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Button "Thêm thuốc" */}
              <TouchableOpacity
                onPress={handleSave}
                disabled={!isFormValid}
                className={`py-3 rounded-md items-center shadow-sm ${
                  isFormValid ? "bg-blue-500" : "bg-gray-400"
                }`}
              >
                <Text className="text-white font-semibold text-base">
                  Thêm thuốc
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddDrugToPrescriptionModal;
