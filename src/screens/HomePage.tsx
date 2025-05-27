import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import NavBar from "../components/NavBar";
import ListItem from "../components/ListItem";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import DatesTab from "../components/DatesTab";
import "../../global.css";

const HomePage = ({ navigation }: any) => {
  return (
    <View className="flex-1 bg-screen justify-center items-center py-4">
      <View className="w-full flex-row justify-between items-center px-4 pt-10 mb-4">
        <TouchableOpacity className="justify-center items-center">
          <FontAwesome5
            name="user"
            size={15}
            color="black"
            className="p-3 rounded-full bg-gray-200"
          />
        </TouchableOpacity>

        <View className="text-center justify-center items-center">
          <Text className="text-lg font-semibold">Xin chào bạn của tôi!</Text>
        </View>

        <TouchableOpacity className="justify-center items-center">
          <AntDesign
            name="plussquareo"
            size={20}
            color="black"
            className="p-3"
          />
        </TouchableOpacity>
      </View>

      <DatesTab />

      <ScrollView className="flex-1 mt-4 px-4 w-full">
        <View className="flex-col gap-2 mb-4">
          <Text className="text-black font-bold text-xl">08:00</Text>
          <View>
            <ListItem
              medicineName="Thuốc cảm cúm"
              description="Đơn thuốc bao gồm 3 loại thuốc"
              leftElement={<View className="w-7 h-7 rounded-full bg-unused" />}
            />
            <ListItem
              medicineName="Thuốc ho"
              description="Đơn thuốc bao gồm 2 loại thuốc"
              leftElement={<View className="w-7 h-7 rounded-full bg-unused" />}
            />
          </View>
        </View>
        <View className="flex-col gap-2 mb-4">
          <Text className="text-black font-bold text-xl">Đã uống</Text>
          <View>
            <ListItem
              medicineName="Thuốc cảm cúm 2"
              description="Đơn thuốc bao gồm 1 loại thuốc"
              leftElement={<View className="w-7 h-7 rounded-full bg-used" />}
            />
          </View>
        </View>
      </ScrollView>

      {/* NavBar */}
      <NavBar activeTab="home" iconSize={20} navigation={navigation} />
    </View>
  );
};

export default HomePage;
