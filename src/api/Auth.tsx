import { storeAuthData } from "../storage/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Gọi storeAuthData để lưu thông tin vào AsyncStorage
      await storeAuthData(
        String(data.id),
        data.token,

        username,
        data.fullName,
        data.avtUrl
      );
      console.log("Đăng nhập thành công:", data);
      return { success: true, data };
    } else {
      return { success: false, message: data.message || "Đăng nhập thất bại" };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API đăng nhập:", error);
    return { success: false, message: "Không thể kết nối đến server" };
  }
};

export const signupUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ten_dang_nhap: username,
        mat_khau: password,
        ho_va_ten: username,
        gioi_tinh: "nam",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return {
        success: false,
        message: data.message || "Tạo tài khoản thất bại!",
      };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API tạo tài khoản:", error);
    return { success: false, message: "Không thể kết nối đến server" };
  }
};
