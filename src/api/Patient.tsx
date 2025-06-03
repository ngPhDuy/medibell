const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
export async function getUserById(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về thông tin người dùng
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    throw error;
  }
}
