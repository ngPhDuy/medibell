import React from "react";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface NavBarProps {
  activeTab: "home" | "report" | "library" | "";
  iconSize?: number;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, iconSize = 24 }) => {
  return (
    <View className="w-full flex-row justify-evenly items-center bg-screen pt-2 border-t-2 border-gray-200">
      {/* Home Button */}
      <TouchableOpacity
        className={`justify-center items-center ${
          activeTab === "home" ? "bg-primary rounded-full" : ""
        }`}
      >
        <FontAwesome5
          name="home"
          size={iconSize}
          color={`${activeTab === "home" ? "white" : "black"}`}
          className="p-5"
        />
      </TouchableOpacity>

      {/* Menu Button */}
      <TouchableOpacity
        className={`justify-center items-center ${
          activeTab === "report" ? "bg-primary rounded-full" : ""
        }`}
      >
        <FontAwesome5
          name="file-alt"
          size={iconSize}
          color={`${activeTab === "report" ? "white" : "black"}`}
          className="p-5"
        />
      </TouchableOpacity>

      {/* Medicines Button */}
      <TouchableOpacity
        className={`justify-center items-center ${
          activeTab === "library" ? "bg-primary rounded-full" : ""
        }`}
      >
        <FontAwesome5
          name="briefcase-medical"
          size={iconSize}
          color={`${activeTab === "library" ? "white" : "black"}`}
          className="p-5"
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;
