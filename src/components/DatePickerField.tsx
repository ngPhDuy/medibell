import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import DateTimePicker, {
  DateType,
  useDefaultClassNames,
} from "react-native-ui-datepicker";

interface DatePickerFieldProps {
  date: DateType;
  onChange: (date: DateType) => void;
  placeholder?: string;
  label?: string;
  mode?: string;
  maxDate?: DateType;
  minDate?: DateType;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  date,
  onChange,
  placeholder = "DD/MM/YYYY",
  label,
  mode = "single",
  maxDate,
  minDate,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Kiểm tra xem date có hợp lệ không
  const isValidDate = date && dayjs(date).isValid();
  const defaultClassNames = useDefaultClassNames();

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-1 text-gray-700 font-bold text-lg">{label}</Text>
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center border border-gray-300 px-3 py-4 rounded-lg bg-white"
      >
        <FontAwesome name="calendar" size={22} color="#4B5563" />
        <Text className="flex-1 ml-4 text-base text-gray-700">
          {isValidDate ? dayjs(date).format("DD/MM/YYYY") : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="bg-white p-4 rounded-xl">
          <DateTimePicker
            mode="single"
            classNames={{
              ...defaultClassNames,
              today: "border-amber-500", // Add a border to today's date
              selected: "bg-amber-500 border-amber-500", // Highlight the selected day
              selected_label: "text-white", // Highlight the selected day label
              day: `${defaultClassNames.day} hover:bg-amber-100`, // Change background color on hover
              disabled: "opacity-50", // Make disabled dates appear more faded
            }}
            // Nếu date không hợp lệ, dùng ngày hiện tại làm mặc định trong picker
            date={isValidDate ? date : new Date()}
            onChange={({ date }) => {
              onChange(date);
              setModalVisible(false);
            }}
            minDate={minDate}
            maxDate={maxDate}
            locale="vi"
          />
        </View>
      </Modal>
    </View>
  );
};

export default DatePickerField;
