import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import NavBar from "../components/NavBar";
import { getMedicineDetail } from "../api/Medicines";
import { AntDesign } from "@expo/vector-icons";
interface Ingredient {
  ten_thanh_phan: string;
  ham_luong: string;
}

interface MedicineDetailData {
  id: number;
  ten_thuoc: string;
  mo_ta: string;
  don_vi: string;
  quy_che: string;
  cach_dung: string;
  url: string;
  Thanh_phan: Ingredient[];
}

const MedicineDetailLibrary = ({ navigation, route }: any) => {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [medicine, setMedicine] = useState<MedicineDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMedicineDetail(id);
        setMedicine(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !medicine) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "#374151" }}>
          {error || "Không có dữ liệu thuốc"}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16 }}
        >
          <Text style={{ color: "#2563eb" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={32} color="black" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{medicine.ten_thuoc}</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("EditMedicine", { id })}
          style={styles.editButton}
        >
          <Feather name="edit-2" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card chứa ảnh, tên thuốc, dạng, quy cách */}
        <View style={styles.card}>
          <Image
            source={{ uri: medicine.url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={styles.name}>{medicine.ten_thuoc}</Text>
            <Text style={styles.subText}>{medicine.don_vi}</Text>
            <Text style={styles.subText}>{medicine.quy_che}</Text>
          </View>
        </View>

        {/* Mô tả ngắn */}
        <Text style={styles.sectionTitle}>Mô tả ngắn</Text>
        <Text style={[styles.description, styles.descriptionBox]}>
          {medicine.mo_ta}
        </Text>

        {/* Thành phần */}
        <Text style={styles.sectionTitle}>Thành phần</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text
              style={[
                styles.tableCell,
                styles.cellWithBorder,
                styles.tableHeaderText,
              ]}
            >
              Thành phần
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.cellPaddingLeft,
                styles.tableHeaderText,
              ]}
            >
              Hàm lượng
            </Text>
          </View>

          {/* Rows */}
          {medicine.Thanh_phan.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.tableRow,
                idx % 2 === 1 ? styles.tableRowAlt : undefined,
                idx !== medicine.Thanh_phan.length - 1 && styles.tableRowBorder,
              ]}
            >
              <Text style={[styles.tableCell, styles.cellWithBorder]}>
                {item.ten_thanh_phan}
              </Text>
              <Text style={[styles.tableCell, styles.cellPaddingLeft]}>
                {item.ham_luong}
              </Text>
            </View>
          ))}
        </View>

        {/* Cách dùng */}
        <Text style={styles.sectionTitle}>Cách dùng</Text>
        <Text style={[styles.description, styles.descriptionBox]}>
          {medicine.cach_dung}
        </Text>
      </ScrollView>
    </View>
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
    backgroundColor: "#f3f4f6",
  },
  editButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f6ef",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },
  name: {
    fontWeight: "700",
    fontSize: 18,
    color: "#374151",
  },
  subText: {
    color: "#6b7280",
    fontWeight: "600",
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
    color: "#374151",
  },
  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: "rgba(209, 213, 219, 0.6)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableRowAlt: {
    backgroundColor: "#ffffff",
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    paddingVertical: 4,
    borderStyle: "solid",
  },
  cellWithBorder: {
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    paddingRight: 12,
    borderStyle: "solid",
  },
  cellPaddingLeft: {
    paddingLeft: 16,
  },
  tableHeaderText: {
    fontWeight: "600",
  },
});

export default MedicineDetailLibrary;
