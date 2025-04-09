import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Octicons } from "@expo/vector-icons";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  icon: React.ReactNode;
  animationType?: "fade" | "slide" | "none";
  bgColorClassName?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  message,
  icon,
  animationType = "fade",
  bgColorClassName,
}) => {
  return (
    <Modal
      animationType={animationType}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-white p-6 rounded-lg w-[80%] items-center justify-center">
              <View
                className={`items-center justify-center mb-4 rounded-full w-24 h-24 ${bgColorClassName}`}
              >
                {icon}
              </View>

              <Text className="text-center text-lg text-black font-semibold">
                {message}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;
