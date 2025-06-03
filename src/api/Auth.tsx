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

export const uploadFilesToCloud = async (files: File[], folderName: string) => {
  try {
    const formData = new FormData();

    // Thêm từng file vào form-data (trường "files")
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Thêm tên thư mục
    formData.append("folderName", folderName);

    const response = await fetch(`${API_BASE_URL}/api/cloud/uploadAPI`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      // Dữ liệu dạng: [{ url: ..., type: ... }, ...]
      console.log("Tải lên thành công:", data);
      return { success: true, data };
    } else {
      return {
        success: false,
        message: data.message || "Tải tệp lên thất bại",
      };
    }
  } catch (error) {
    console.error("Lỗi khi tải lên file:", error);
    return {
      success: false,
      message: "Không thể kết nối đến server",
    };
  }
};
