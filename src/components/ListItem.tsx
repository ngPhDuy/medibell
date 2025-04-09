import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ListItemProps {
  medicineName: string;
  description: string;
  leftElement: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({
  medicineName,
  description,
  leftElement,
}) => {
  return (
    <View className="flex-row items-center justify-between bg-screen-secondary p-4 mb-2 rounded-lg w-full">
      <View className={`mr-4 p-4 border-r-2 border-gray-400`}>
        {leftElement}
      </View>
      <View className="flex-col justify-center items-start gap-2">
        <Text className="text-lg font-semibold">{medicineName}</Text>
        <Text className="text-gray-500">{description}</Text>
      </View>
      <View className="justify-center items-center">
        <Feather name="more-vertical" size={24} color="black" />
      </View>
    </View>
  );
};

export default ListItem;
