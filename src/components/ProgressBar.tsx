import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number; // Tiến trình từ 1 đến 3
}
//Progress bar dạng dải ngang có 3 vạch: vạch thứ progress có độ dài gấp 3 lần 2 vạch còn lại
const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View className="w-full h-2 rounded-full flex-row gap-1">
      {progress === 1 ? (
        <View className="bg-[#606060] h-2 rounded-full w-7" />
      ) : (
        <View className="bg-[#606060] h-2 rounded-full w-2" />
      )}
      {progress === 2 ? (
        <View className="bg-[#606060] h-2 rounded-full w-7" />
      ) : (
        <View className="bg-[#606060] h-2 rounded-full w-2" />
      )}
      {progress === 3 ? (
        <View className="bg-[#606060] h-2 rounded-full w-7" />
      ) : (
        <View className="bg-[#606060] h-2 rounded-full w-2" />
      )}
    </View>
  );
};

export default ProgressBar;
