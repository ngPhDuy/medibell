import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  UIManager,
  findNodeHandle,
  Modal,
  StyleSheet,
} from "react-native";
import NavBar from "../components/NavBar";
import { FontAwesome5, AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import ListMedicine from "../components/ListMedicine";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

const MedicineLibrary = ({ navigation, route }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const bannerOpacity = useRef(new Animated.Value(0)).current;

  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(
    null
  );
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [medicineIdToDelete, setMedicineIdToDelete] = useState<string | null>(
    null
  );

  // null = sort mặc định theo id giảm dần
  // true = tên tăng dần
  // false = tên giảm dần
  const [sortByName, setSortByName] = useState<boolean | null>(null);

  useEffect(() => {
    if (route.params?.successMessage) {
      showBanner(route.params.successMessage);
      navigation.setParams({ successMessage: null });
    }
  }, [route.params]);

  const showBanner = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessBanner(true);

    Animated.timing(bannerOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(bannerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSuccessBanner(false);
        setSuccessMessage("");
      });
    }, 3000);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);
    try {
      const userID = await AsyncStorage.getItem("user_id");
      const response = await fetch(
        `${API_BASE_URL}/api/medicines?userID=${userID}`
      );
      if (!response.ok) {
        console.log(response);
        throw new Error("Lỗi khi tải danh sách thuốc");
      }
      const data = await response.json();
      setMedicines(data);
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const deleteMedicine = async (id: string) => {
    setLoadingDelete(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/medicines/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Xóa thuốc thất bại");
      }
      setMedicines((prev) => prev.filter((med) => med.id !== id));
      setSelectedMedicineId(null);
      showBanner("Xóa thuốc thành công");
    } catch (error: any) {
      alert(error.message || "Lỗi khi xóa thuốc");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleMenuPress = (id: string, ref: any) => {
    if (!ref) return;
    const handle = findNodeHandle(ref);
    if (handle) {
      UIManager.measure(handle, (fx, fy, width, height, px, py) => {
        setMenuPos({ x: px + width - 48, y: py + height + 4 });
        setSelectedMedicineId(id);
      });
    }
  };

  const hideMenu = () => {
    setSelectedMedicineId(null);
  };

  const onPressDeleteButton = () => {
    setMedicineIdToDelete(selectedMedicineId);
    setConfirmModalVisible(true);
    hideMenu();
  };

  const onConfirmDelete = async () => {
    if (!medicineIdToDelete) return;
    setConfirmModalVisible(false);
    await deleteMedicine(medicineIdToDelete);
    setMedicineIdToDelete(null);
  };

  const handlePressMedicine = (id: string) => {
    navigation.navigate("MedicineDetailLibrary", { id });
  };

  // Toggle sortByName: null -> true -> false -> null -> ...
  const toggleSortByName = () => {
    setSortByName((prev) => {
      if (prev === null) return true;
      if (prev === true) return false;
      return null;
    });
  };

  // Sắp xếp danh sách tùy trạng thái sortByName
  const sortedMedicines = [...medicines].sort((a, b) => {
    if (sortByName === null) {
      // Mặc định sort theo id giảm dần
      return Number(b.id) - Number(a.id);
    }
    if (sortByName) {
      // Tên tăng dần
      return a.ten_thuoc.localeCompare(b.ten_thuoc);
    } else {
      // Tên giảm dần
      return b.ten_thuoc.localeCompare(a.ten_thuoc);
    }
  });

  const filteredMedicines = sortedMedicines.filter((med) =>
    med.ten_thuoc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userButton}>
          <FontAwesome5 name="user" size={16} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Thư viện thuốc</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddMedicine")}
          style={styles.addButton}
        >
          <AntDesign name="plussquareo" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather
            name="search"
            size={18}
            color="black"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Nhấn Enter để tìm kiếm"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        <Feather
          name="filter"
          size={20}
          color="black"
          style={{ marginLeft: 12, marginRight: 8 }}
        />
        <Ionicons
          name="swap-vertical"
          size={20}
          color={sortByName === null ? "black" : "#2563eb"}
          onPress={toggleSortByName}
        />
      </View>

      {/* Result count */}
      <Text style={styles.resultCount}>{filteredMedicines.length} kết quả</Text>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#2563eb" />}

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredMedicines.map((item) => (
          <ListMedicine
            key={item.id}
            id={item.id}
            name={item.ten_thuoc}
            description={item.mo_ta}
            image={item.url ? { uri: item.url } : undefined}
            onMenuPress={handleMenuPress}
            onPress={() => handlePressMedicine(item.id)}
          />
        ))}
      </ScrollView>

      {/* Dropdown menu button tròn đỏ */}
      {selectedMedicineId && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={hideMenu}
          style={styles.dropdownOverlay}
        >
          <View
            style={[styles.dropdownMenu, { top: menuPos.y, left: menuPos.x }]}
          >
            <TouchableOpacity
              onPress={onPressDeleteButton}
              disabled={loadingDelete}
              style={styles.deleteButton}
            >
              {loadingDelete ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <AntDesign name="delete" size={22} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Confirm delete modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setConfirmModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Bạn có chắc muốn xóa thuốc này không?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setConfirmModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirmDelete}
                disabled={loadingDelete}
                style={[styles.modalButton, styles.confirmButton]}
              >
                {loadingDelete ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>Xóa</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Success banner */}
      {showSuccessBanner && (
        <Animated.View
          style={[styles.successBanner, { opacity: bannerOpacity }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="checkcircle" size={20} color="white" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        </Animated.View>
      )}

      {/* Bottom NavBar */}
      <NavBar activeTab="library" iconSize={20} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  resultCount: {
    marginBottom: 12,
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
  },
  errorText: { color: "red", marginBottom: 12, textAlign: "center" },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  dropdownMenu: {
    position: "absolute",
    width: 48,
    height: 48,
    backgroundColor: "white",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#b91c1c",
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    width: 260,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
  },
  modalText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 10,
    backgroundColor: "#6b7280",
  },
  confirmButton: {
    marginLeft: 10,
    backgroundColor: "#ef4444",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  successBanner: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: "#34d399",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  successText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
});

export default MedicineLibrary;
