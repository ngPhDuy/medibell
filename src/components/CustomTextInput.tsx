import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import "../../global.css";

//icons use from @ant-design/icons-react-native
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

interface CustomTextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  value?: any;
  keyboardType?: any;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  leftIcon = null,
  rightIcon = null,
  placeholder = "",
  secureTextEntry = false,
  onChangeText = () => {},
  value,
  keyboardType = "default",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center bg-white w-[24rem] rounded-[10px] px-3 ${
        isFocused ? "border-2 border-black" : "border-2 border-gray-200"
      }`}
    >
      {leftIcon && (
        <TouchableOpacity className="mr-2">{leftIcon}</TouchableOpacity>
      )}
      <TextInput
        className="flex-1 p-4"
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={keyboardType}
      />
      {rightIcon && (
        <TouchableOpacity className="ml-2">{rightIcon}</TouchableOpacity>
      )}
    </View>
  );
};

export default CustomTextInput;
