import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type Option = { label: string; value: string };

interface CustomDropdownProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
}) => {
  const [visible, setVisible] = useState(false);

  const onSelect = (value: string) => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View className="mb-3">
      {/* Label */}
      <Text className="font-semibold mb-1.5">{label}</Text>

      {/* Dropdown Button */}
      <TouchableOpacity
        className="flex-row items-center justify-between h-[45px] border border-gray-300 rounded-xl px-3 bg-white relative"
        onPress={() => setVisible(true)}
      >
        <Text className={selectedValue ? "text-gray-700" : "text-gray-400"}>
          {selectedValue
            ? options.find((o) => o.value === selectedValue)?.label
            : "Ấn để chọn"}
        </Text>

        <AntDesign name={visible ? "up" : "down"} size={20} color="black" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/20 justify-center px-10" // Overlay for closing modal
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View className="bg-white rounded-xl py-3">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 px-4"
                  onPress={() => onSelect(item.value)}
                >
                  <Text className="text-base text-gray-700">{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-200" />
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomDropdown;
