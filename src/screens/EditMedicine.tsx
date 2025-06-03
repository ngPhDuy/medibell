import React, { useState, useEffect, useRef } from "react";
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
import CustomDropDown from "../components/CustomDropDown";
const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
interface ComponentItem {
  id: number;
  name: string;
  amount: string;
}

interface MedicinePayload {
  ten_thuoc: string;
  mo_ta: string;
  don_vi: string;
  quy_che: string;
  cach_dung: string;
  url: string;
  id_nguoi_dung?: number;
  Thanh_phan: { ten_thanh_phan: string; ham_luong: string }[];
}

const EditMedicine = ({ navigation, route }: any) => {
  const { id } = route.params;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [form, setForm] = useState<string>(""); // Dạng chọn
  const [pack, setPack] = useState(""); // Quy chế
  const [desc, setDesc] = useState("");
  const [descHeight, setDescHeight] = useState(40);
  const [usage, setUsage] = useState("");
  const [components, setComponents] = useState<ComponentItem[]>([
    { id: 1, name: "", amount: "" },
  ]);

  const packInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/medicines/${id}`);
        if (!response.ok) throw new Error("Lấy dữ liệu thất bại");
        const data = await response.json();

        setName(data.ten_thuoc || "");
        setForm(data.don_vi || "");
        setPack(data.quy_che || "");
        setDesc(data.mo_ta || "");
        setUsage(data.cach_dung || "");
        setImageUri(data.url || null);
        if (data.Thanh_phan && Array.isArray(data.Thanh_phan)) {
          setComponents(
            data.Thanh_phan.map((c: any, idx: number) => ({
              id: idx + 1,
              name: c.ten_thanh_phan || "",
              amount: c.ham_luong || "",
            }))
          );
        }
      } catch (error: any) {
        Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu thuốc");
      }
    };
    fetchMedicine();
  }, [id]);

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
    if (
      !name.trim() ||
      !form.trim() ||
      !pack.trim() ||
      !desc.trim() ||
      !usage.trim()
    )
      return false;

    if (
      components.length === 0 ||
      components.some((c) => !c.name.trim() || !c.amount.trim())
    )
      return false;

    return true;
  };

  const handleSave = async () => {
    const payload: MedicinePayload = {
      ten_thuoc: name.trim(),
      mo_ta: desc.trim(),
      don_vi: form,
      quy_che: pack.trim(),
      cach_dung: usage.trim(),
      url: imageUri || "",
      Thanh_phan: components.map((c) => ({
        ten_thanh_phan: c.name.trim(),
        ham_luong: c.amount.trim(),
      })),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/medicines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Lỗi", errorData.message || "Cập nhật thuốc thất bại");
        return;
      }

      navigation.navigate("MedicineLibrary", {
        successMessage: "Cập nhật thông tin thuốc thành công",
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Chỉnh sửa thuốc</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.imageAndInfoContainer}>
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

              <View style={{ flex: 0.8, marginTop: 8 }}>
                <Text style={styles.label}>Quy chế</Text>
                <TextInput
                  ref={packInputRef}
                  placeholder="Kích cỡ"
                  value={pack}
                  onChangeText={setPack}
                  style={[styles.textInput, { height: 45, paddingLeft: 8 }]}
                />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Mô tả ngắn</Text>
        <TextInput
          placeholder="Nhập mô tả về thuốc"
          value={desc}
          onChangeText={setDesc}
          multiline
          onContentSizeChange={(event) =>
            setDescHeight(event.nativeEvent.contentSize.height)
          }
          style={[
            styles.textInput,
            {
              height: Math.max(40, descHeight),
              textAlignVertical: "top",
              marginBottom: 20,
            },
          ]}
        />

        <View style={styles.componentsHeader}>
          <Text style={{ fontWeight: "600", fontSize: 16, flex: 1 }}>
            Thành phần
          </Text>
          <TouchableOpacity onPress={addComponent}>
            <AntDesign name="pluscircleo" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>

        <View style={styles.componentsTable}>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ flex: 2, fontWeight: "600" }}>Tên thành phần</Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>Hàm lượng (mg)</Text>
            <View style={{ width: 24 }} />
          </View>

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

      <TouchableOpacity
        disabled={!isSaveEnabled()}
        style={[
          styles.saveButton,
          { backgroundColor: isSaveEnabled() ? "#2563eb" : "#9ca3af" },
        ]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>

      <NavBar activeTab="library" iconSize={20} navigation={navigation} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
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

export default EditMedicine;
