import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NavBar from "../components/NavBar";
import CustomDropDown from '../components/CustomDropDown';

const AddMedicine = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [form, setForm] = useState<string>(""); // Dạng chọn
  const [pack, setPack] = useState(""); // Quy chế
  const [desc, setDesc] = useState("");
  const [descHeight, setDescHeight] = useState(40);
  const [usage, setUsage] = useState("");
  const [components, setComponents] = useState([{ id: 1, name: "", amount: "" }]);

  const packInputRef = useRef<TextInput>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Bạn cần cấp quyền truy cập ảnh để tiếp tục!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addComponent = () => {
    setComponents((prev) => [
      ...prev,
      { id: prev.length + 1, name: "", amount: "" },
    ]);
  };

  const removeComponent = (id: number) => {
    setComponents((prev) => prev.filter((item) => item.id !== id));
  };

  const updateComponent = (
    id: number,
    field: "name" | "amount",
    value: string
  ) => {
    setComponents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const isSaveEnabled = () => {
    if (!name.trim() || !form.trim()) return false;
    return true;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            // navigation.goBack()
          }}
        >
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Thêm thuốc mới</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {/* Ảnh và thông tin thuốc */}
        <View style={styles.imageAndInfoContainer}>
          {/* Ảnh */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {imageUri ? (
              <>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setImageUri(null);
                  }}
                  style={styles.imageRemoveButton}
                >
                  <AntDesign name="close" size={16} color="white" />
                </TouchableOpacity>
              </>
            ) : (
              <Feather name="upload" size={32} color="#374151" />
            )}
          </TouchableOpacity>

          {/* Thông tin tên thuốc, dạng (custom dropdown), quy chế */}
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Tên thuốc</Text>
            <TextInput
              placeholder="Nhấn Enter để nhập nội dung"
              value={name}
              onChangeText={setName}
              style={styles.textInput}
              returnKeyType="done"
            />

            <View style={{ flexDirection: "row" }}>
              {/* Dạng */}
              <View style={{ flex: 0.65, marginRight: 12, marginTop: 8 }}>
                <CustomDropDown
                  label="Dạng"
                  options={[
                    { label: "Viên", value: "Viên" },
                    { label: "Gói", value: "Gói" },
                  ]}
                  selectedValue={form}
                  onValueChange={setForm}
                />
              </View>

              {/* Quy chế */}
              <View style={{ flex: 0.8, marginTop: 8  }}>
                <Text style={styles.label}>Quy chế</Text>
                <TextInput
                  ref={packInputRef}
                  placeholder="Hộp 15 Vỉ x 12 Viên"
                  value={pack}
                  onChangeText={setPack}
                  style={[styles.textInput, {height:45, paddingLeft: 8}]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Mô tả ngắn */}
        <Text style={styles.label}>Mô tả ngắn</Text>
        <TextInput
          placeholder="Nhập mô tả về thuốc"
          value={desc}
          onChangeText={setDesc}
          multiline
          onContentSizeChange={(event) => {
            setDescHeight(event.nativeEvent.contentSize.height);
          }}
          style={[
            styles.textInput,
            {
              height: Math.max(40, descHeight),
              textAlignVertical: "top",
              marginBottom: 20,
            },
          ]}
        />

        {/* Thành phần */}
        <View style={styles.componentsHeader}>
          <Text style={{ fontWeight: "600", fontSize: 16, flex: 1 }}>
            Thành phần
          </Text>
          <TouchableOpacity onPress={addComponent}>
            <AntDesign name="pluscircleo" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Bảng thành phần */}
        <View style={styles.componentsTable}>
          {/* Header bảng */}
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ flex: 2, fontWeight: "600" }}>Tên thành phần</Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>Hàm lượng (mg)</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Dòng thành phần */}
          {components.map((comp) => (
            <View
              key={comp.id}
              style={{
                flexDirection: "row",
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <TextInput
                placeholder="Tên thành phần"
                value={comp.name}
                onChangeText={(text) => updateComponent(comp.id, "name", text)}
                style={styles.componentInputName}
              />
              <TextInput
                placeholder="Hàm lượng (mg)"
                value={comp.amount}
                onChangeText={(text) =>
                  updateComponent(comp.id, "amount", text)
                }
                keyboardType="numeric"
                style={styles.componentInputAmount}
              />
              {components.length > 1 && (
                <TouchableOpacity onPress={() => removeComponent(comp.id)}>
                  <AntDesign name="closecircleo" size={24} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Cách dùng */}
        <Text style={styles.label}>Cách dùng</Text>
        <TextInput
          placeholder="Cách dùng thuốc"
          value={usage}
          onChangeText={setUsage}
          style={[
            styles.textInput,
            {
              marginBottom: 40,
            },
          ]}
          multiline
          numberOfLines={3}
        />
      </KeyboardAwareScrollView>

      {/* Nút Lưu */}
      <TouchableOpacity
        disabled={!isSaveEnabled()}
        style={[
          styles.saveButton,
          { backgroundColor: isSaveEnabled() ? "#2563eb" : "#9ca3af" },
        ]}
        onPress={() => {
          alert("Lưu thành công");
        }}
      >
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>

      {/* NavBar */}
      <NavBar activeTab="library" iconSize={20} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  imageAndInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  imagePicker: {
    width: 80,
    height: 80,
    backgroundColor: "#f9f6ef",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: "relative",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  imageRemoveButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#374151",
  },
  componentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  componentsTable: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  componentInputName: {
    flex: 1.75,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    color: "#374151",
  },
  componentInputAmount: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    color: "#374151",
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    width: 100,
    alignSelf: "center",
    marginBottom: 16,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AddMedicine;
