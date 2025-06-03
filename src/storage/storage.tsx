import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAuthData = async (
  userId: string,
  token: string,

  username: string,
  fullName: string,
  avtUrl: string
) => {
  try {
    console.log("Lưu thông tin đăng nhập:");
    await AsyncStorage.setItem("user_id", userId);
    await AsyncStorage.setItem("auth_token", token);

    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("full_name", fullName);
    await AsyncStorage.setItem("avt_url", avtUrl ?? "");
  } catch (error) {
    console.error("Lỗi khi lưu token:", error);
  }
};

/**Lấy Auth data */
export const getAuthData = async () => {
  try {
    const userId = await AsyncStorage.getItem("user_id");
    const token = await AsyncStorage.getItem("auth_token");

    const username = await AsyncStorage.getItem("username");
    const fullName = await AsyncStorage.getItem("full_name");
    const avtUrl = await AsyncStorage.getItem("avt_url");

    return { userId, token, username, fullName, avtUrl };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đăng nhập:", error);
    return null;
  }
};

/**
 * Lưu user ID vào AsyncStorage
 */
export const storeUserID = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("user_id", userId);
  } catch (error) {
    console.error("Lỗi khi lưu user ID:", error);
  }
};

/**
 * Lấy user ID từ AsyncStorage
 */
export const getUserID = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("user_id");
  } catch (error) {
    console.error("Lỗi khi lấy user ID:", error);
    return null;
  }
};
/**
 * Xóa user ID khỏi AsyncStorage (Đăng xuất)
 */
export const removeUserID = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("user_id");
  } catch (error) {
    console.error("Lỗi khi xóa user ID:", error);
  }
};

/**
 * Lấy JWT Token từ AsyncStorage
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("auth_token");
  } catch (error) {
    console.error("Lỗi khi lấy token:", error);
    return null;
  }
};

/**
 * Xóa JWT Token khỏi AsyncStorage (Đăng xuất)
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("auth_token");
  } catch (error) {
    console.error("Lỗi khi xóa token:", error);
  }
};

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 */
export const isUserLoggedIn = async (): Promise<boolean> => {
  const userId = await getUserID();
  const token = await getToken();

  return !!userId && !!token; // Trả về `true` nếu cả user ID và token đều tồn tại
};

/*
 * xóa tất cả dữ liệu trong AsyncStorage
 */
export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("✅ Đã xóa tất cả dữ liệu trong AsyncStorage!");
  } catch (error) {
    console.error("❌ Lỗi khi xóa dữ liệu:", error);
  }
};
