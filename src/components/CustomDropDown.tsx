import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

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
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: selectedValue ? "#374151" : "#9ca3af" }}>
          {selectedValue
            ? options.find((o) => o.value === selectedValue)?.label
            : "Chọn dạng"}
        </Text>
        <Feather
          name={visible ? "chevron-up" : "chevron-down"}
          size={20}
          color="#374151"
          style={styles.dropdownIcon}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => onSelect(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: "#eee" }} />
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  dropdownButton: {
    height: 45,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    position: "relative",
  },
  dropdownIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 12,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
});

export default CustomDropdown;
