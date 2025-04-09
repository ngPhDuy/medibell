import React from "react";
import { View, Text } from "react-native";
import "../../global.css";

const DatesTab: React.FC = () => {
  // Lấy ngày hiện tại
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay(); // 0: Chủ Nhật, 1: Thứ Hai, ..., 6: Thứ Bảy
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
  const year = currentDate.getFullYear();

  // Tên các ngày trong tuần
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const datesOfWeek = ["9", "3", "4", "5", "6", "7", "8"]; // Các ngày trong tuần, có thể thay đổi

  return (
    <View className="px-4 py-4 bg-screen-secondary w-full">
      {/* Hiển thị các ngày trong tuần */}
      <View className="flex-row justify-between items-center">
        {daysOfWeek.map((dayName, index) => {
          const isActive = dayOfWeek === index; // Kiểm tra xem ngày hiện tại có phải là ngày này không
          return (
            <View
              key={index}
              className={`items-center ${
                isActive ? "bg-primary rounded-full" : ""
              } p-2`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-white" : "text-black"
                }`}
              >
                {dayName}
              </Text>
              <Text
                className={`text-xs font-semibold ${
                  isActive ? "text-white" : "text-black"
                }`}
              >
                {datesOfWeek[index]}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Hiển thị ngày hôm nay */}
      <Text className="text-center mt-2 text-primary font-semibold text-base">
        Hôm nay, {day} tháng {month} {year}
      </Text>
    </View>
  );
};

export default DatesTab;
