import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { DonChuaThuoc, MedicineDetail } from "../types/Medicine";
import { fetchMedicinesByUser } from "../api/Medicines";
import { getUserID } from "../storage/storage";
import CustomDropdown from "./CustomDropDown";

interface AddDrugToPrescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveDrug: (drug: DonChuaThuoc) => void;
}

const AddDrugToPrescriptionModal: React.FC<AddDrugToPrescriptionModalProps> = ({
  visible,
  onClose,
  onSaveDrug,
}) => {
  const [medicines, setMedicines] = useState<MedicineDetail[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>("");

  const [drugName, setDrugName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>(
    []
  );
  const [isFormValid, setIsFormValid] = useState(false);

  const medicineOptions = medicines.map((med) => ({
    label: med.ten_thuoc,
    value: med.id.toString(),
  }));

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const uId = await getUserID();
        if (!uId) {
          console.error("User ID not found");
          return;
        }
        const data = await fetchMedicinesByUser(Number(uId));
        setMedicines(data);
        console.log("Medicines loaded:", data);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    loadMedicines();
  }, []);
  useEffect(() => {
    setIsFormValid(
      selectedMedicineId !== "" &&
        quantity.trim() !== "" &&
        !isNaN(Number(quantity)) &&
        selectedInstructions.length > 0
    );
  }, [selectedMedicineId, quantity, selectedInstructions]);
  const handleToggleInstruction = (instruction: string) => {
    setSelectedInstructions((prev) =>
      prev.includes(instruction)
        ? prev.filter((item) => item !== instruction)
        : [...prev, instruction]
    );
  };

  const handleSave = () => {
    const selectedMedicine = medicines.find(
      (m) => m.id.toString() === selectedMedicineId
    );
    if (isFormValid) {
      const newDrug: DonChuaThuoc = {
        id: Date.now().toString(), // Tạo ID tạm thời
        thuoc: selectedMedicine?.ten_thuoc ?? "Không rõ", // dùng tên thuốc
        tong_so: Number(quantity),
        buoi_uong: selectedInstructions,
        ghi_chu: note.trim() !== "" ? note : undefined,
      };

      onSaveDrug(newDrug);

      // Reset form
      setDrugName("");
      setQuantity("");
      setNote("");
      setSelectedInstructions([]);
      onClose();
    } else {
      console.warn("Vui lòng điền đầy đủ thông tin.");
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
          <TouchableWithoutFeedback>
            <View className="bg-white p-4 rounded-lg w-[85%] shadow-lg">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-semibold text-gray-800">
                  Thêm thuốc
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <CustomDropdown
                label="Thuốc"
                options={medicineOptions}
                selectedValue={selectedMedicineId}
                onValueChange={setSelectedMedicineId}
              />

              {/* Số lượng */}
              <TextInput
                placeholder="Tổng số"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                className="border border-gray-300 rounded-md p-3 mb-4 text-base"
              />

              {/* Ghi chú */}
              <TextInput
                placeholder="Ghi chú (tuỳ chọn)"
                value={note}
                onChangeText={setNote}
                className="border border-gray-300 rounded-md p-3 mb-6 text-base h-20"
                multiline={true}
                numberOfLines={4}
              />

              {/* Buổi uống */}
              <View className="flex-row justify-around mb-8">
                {["Sáng", "Trưa", "Chiều"].map((buoi) => (
                  <TouchableOpacity
                    key={buoi}
                    onPress={() => handleToggleInstruction(buoi)}
                    className={`flex-1 mx-1 py-3 rounded-md items-center border ${
                      selectedInstructions.includes(buoi)
                        ? "bg-blue-500 border-blue-500"
                        : "bg-gray-100 border-gray-300"
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

              {/* Button Lưu */}
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
