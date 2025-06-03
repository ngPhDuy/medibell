import React, { useRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export type ListMedicineProps = {
  id: string;
  name: string;
  description: string;
  image: any;
  onMenuPress: (id: string, ref: any) => void;
  onPress?: () => void;  // thêm prop onPress
};

const ListMedicine = ({
  id,
  name,
  description,
  image,
  onMenuPress,
  onPress,
}: ListMedicineProps) => {
  const menuButtonRef = useRef<any>(null);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2eedf",
        borderRadius: 15,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      }}
      onPress={onPress} // gọi onPress khi bấm item
    >
      {/* Image, Texts */}
      <View
        style={{
          width: 45,
          height: 45,
          borderRadius: 12,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={image}
          style={{ width: 32, height: 32, resizeMode: "contain" }}
        />
      </View>

      <View
        style={{
          width: 2,
          height: 48,
          backgroundColor: "#9ca3af",
          marginHorizontal: 12,
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#000",
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#6b7280",
            marginTop: 4,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
      </View>

      {/* Menu button ⋮ */}
      <TouchableOpacity
        ref={menuButtonRef}
        style={{ paddingHorizontal: 8, paddingVertical: 4 }}
        onPress={() => {
          if (menuButtonRef.current) {
            onMenuPress(id, menuButtonRef.current);
          }
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#6b7280",
            lineHeight: 20,
          }}
        >
          ⋮
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ListMedicine;
