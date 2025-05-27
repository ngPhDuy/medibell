import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import NavBar from "../components/NavBar";
import { FontAwesome5, AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import "../../global.css";
import ListMedicine from "../components/ListMedicine";

const MedicineLibrary = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");

  const data = [
    {
      id: "1",
      name: "Phosphalugel Sanofi",
      description:
        "Thuốc Phosphalugel là loại thuốc kháng acid (antacid) được dùng khá phổ biến để giúp...",
      image: require("../../assets/imgs/phosphalugel.png"),
    },
  ];

  return (
    <View className="flex-1 bg-white px-4 pt-10 relative">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity className="p-2 rounded-full bg-gray-200">
          <FontAwesome5 name="user" size={16} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Thư viện thuốc</Text>
        <TouchableOpacity className="p-2">
          <AntDesign name="plussquareo" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flex: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Feather
            name="search"
            size={18}
            color="black"
            style={{ marginRight: 6 }}
          />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: "#333" }}
            placeholder="Nhấn Enter để tìm kiếm"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        <Feather
          name="filter"
          size={18}
          color="black"
          style={{ marginLeft: 12, marginRight: 8 }}
        />
        <Ionicons name="swap-vertical" size={20} color="black" />
      </View>

      <Text className="mt-4 mb-2 text-base text-black font-semibold">
        1 kết quả
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((item) => (
          <ListMedicine
            key={item.id}
            name={item.name}
            description={item.description}
            image={item.image}
          />
        ))}
      </ScrollView>

      {/* Bottom NavBar */}
      <NavBar activeTab="library" iconSize={20} navigation={navigation} />
    </View>
  );
};

export default MedicineLibrary;
