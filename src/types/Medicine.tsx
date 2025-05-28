export interface MedicineIntake {
  id: number;
  time: string; // gio
  date: string; // ngay
  prescriptionId: number; // don_thuoc
  reminder?: boolean; // nhac_nho
  takenAt: string | null; // thoi_diem_da_uong
  period: string; // buoi_uong
}

export interface MedicineIntakeDetail {
  id: number;
  gio: string;
  ngay: string;
  don_thuoc: number;
  thoi_diem_da_uong: string | null;
  buoi_uong: string;

  // Thay đổi tên cho đúng với API trả về
  Thuoc_trong_mot_lan_uong: {
    id: number;
    id_lan_uong: number;
    thuoc: string; // có thể là ID (string hoặc number tùy backend)
    so_luong: number;
  }[];

  Don_thuoc: {
    id: number;
    id_nguoi_dung: number;
    ngay_bat_dau: string;
    ngay_ket_thuc: string;
    trang_thai: string;
    ten_don_thuoc: string;
  };
}

export interface MedicineScheduleIntake {
  id: number; // id của lần uống thuốc
  time: string; // "gio"
  date: string; // "ngay"
  prescriptionId: number; // "don_thuoc"
  takenAt: string | null; // "thoi_diem_da_uong"
  period: string; // "buoi_uong"

  // Thuộc tính kế thừa từ đơn thuốc (schedule)
  startDate: string; // "ngay_bat_dau"
  endDate: string; // "ngay_ket_thuc"
  status: string; // "trang_thai"
  prescriptionName: string; // "ten_don_thuoc"
  patientId: number; // "id_nguoi_dung"
}

export interface MedicineSchedule {
  id: number;
  // Nếu không có id_ket_qua thì có thể bỏ hoặc để optional
  diagnosisResultId?: number;
  startDate: string; // ngay_bat_dau
  endDate: string; // ngay_ket_thuc
  status: string; // trang_thai
  note?: string; // ghi_chu - không có trong response, optional
  prescriptionName: string; // ten_don_thuoc
  patientId: number; // id_nguoi_dung
  intakes: MedicineIntake[]; // Lan_uong
}
