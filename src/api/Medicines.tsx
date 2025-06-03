const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
export const fetchMedicines = async (userID: string | number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/medicines?userID=${userID}`
  );
  if (!response.ok) {
    throw new Error("Lỗi khi tải danh sách thuốc");
  }
  const data = await response.json();
  return data;
};

export const deleteMedicine = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/medicines/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Xóa thuốc thất bại");
  }
  return true;
};

export const getMedicineDetail = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/medicines/${id}`);
  if (!response.ok) {
    throw new Error("Lấy dữ liệu thất bại");
  }
  return await response.json();
};

export async function fetchMedicinesByUser(userID: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/medicines?userID=${userID}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy danh sách thuốc:", error);
    throw error;
  }
}
