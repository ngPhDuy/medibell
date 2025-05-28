const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
import {
  MedicineIntake,
  MedicineSchedule,
  MedicineIntakeDetail,
} from "../types/Medicine";

export const fetchMedicineSchedule = async (
  patientId: string,
  startDate: string,
  endDate: string
): Promise<MedicineSchedule[]> => {
  try {
    console.log(
      `${API_BASE_URL}/api/medicine_schedules?userID=${patientId}&startDate=${startDate}&endDate=${endDate}`
    );
    const res = await fetch(
      `${API_BASE_URL}/api/medicine_schedules?userID=${patientId}&startDate=${startDate}&endDate=${endDate}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch medicine schedule");
    }

    const data = await res.json();
    const mappedData: MedicineSchedule[] = data.map((item: any) => ({
      id: item.id,
      // Nếu không có id_ket_qua thì có thể bỏ dòng sau:
      // diagnosisResultId: item.id_ket_qua,
      startDate: item.ngay_bat_dau,
      endDate: item.ngay_ket_thuc,
      status: item.trang_thai,
      // note: item.ghi_chu, // nếu không có ghi_chu
      prescriptionName: item.ten_don_thuoc,
      patientId: item.id_nguoi_dung,
      intakes: item.Lan_uong.map(
        (intake: any): MedicineIntake => ({
          id: intake.id,
          time: intake.gio,
          date: intake.ngay,
          prescriptionId: intake.don_thuoc,
          takenAt: intake.thoi_diem_da_uong,
          period: intake.buoi_uong,
          // reminder: intake.nhac_nho, // nếu API không trả về thì không cần
        })
      ),
    }));

    return mappedData;
  } catch (error) {
    console.error("Error fetching medicine schedule:", error);
    return [];
  }
};

export const updateTakenTime = async (
  scheduleId: number,
  isoDateTime: string
) => {
  try {
    const date = new Date(isoDateTime);
    const newTime = date.toTimeString().split(" ")[0]; // Chuyển về "HH:mm:ss"

    const response = await fetch(
      `${API_BASE_URL}/api/medicine_schedule/${scheduleId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newTime }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Lỗi khi cập nhật lịch uống thuốc");
    }

    const resData = await response.json();
    return resData;
  } catch (error) {}
};

export const toggleMedicineSchedule = async (scheduleId: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/medicine_schedules/toggle/${scheduleId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Lỗi khi toggle trạng thái thuốc");
    }

    const resData = await response.json();

    return resData.thoi_diem_da_uong;
  } catch (error) {
    console.error("Lỗi khi gọi API toggleMedicineSchedule:", error);
    throw error;
  }
};

export const fetchMedicineScheduleById = async (scheduleId: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/medicine_schedules/${scheduleId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MedicineIntakeDetail = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching medicine schedule:", error);
    throw error;
  }
};
