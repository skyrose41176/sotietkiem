import { Progress } from "@routes/interfaces";
import {
  EnumCapMoiTaiCap,
  EnumKenhTiepThi,
  EnumKetQuaTiepThi,
  EnumKhMoiHienHuu,
  EnumLoaiKhachHang,
  EnumLoaiTheTinDung,
  EnumMucDichVay,
  EnumThoiHanCapTD,
  EnumTrangThaiCHB,
  EnumTTCoHoiGuiTKBhnt,
  EnumTTCoHoiGuiTKBhpnt,
  EnumTTCoHoiGuiTKHuyDong,
  EnumTTCoHoiVay,
  EnumTTMoTheTinDung,
  EnumVayHanMucTungLan,
  TabKey,
} from "./enum";
export const ProgressStatusDummy: Progress[] = [
  {
    num: 0,
    label: "Đóng",
    color: "red",
    icon: undefined,
  },
  {
    num: 1,
    label: "Mở",
    color: "green",
    icon: undefined,
  },
];

export const Progressdummy: Progress[] = [
  {
    num: 0,
    label: "Chờ trưởng đơn vị duyệt",
    color: "magenta",
    icon: undefined,
  },
  {
    num: 1,
    label: "Từ chối",
    color: "purple",
    icon: undefined,
  },
  {
    num: 2,
    label: "Trả về",
    color: "green",
    icon: undefined,
  },
  {
    num: 3,
    label: "Chờ nhân sự phân công xử lý",
    color: "blue",
    icon: undefined,
  },
  {
    num: 4,
    label: "Nhân sự phân công xử lý",
    color: "yellow",
    icon: undefined,
  },
  {
    num: 5,
    label: "Chờ cấp kiểm soát duyệt",
    color: "green",
    icon: undefined,
  },
  {
    num: 6,
    label: "Đang phân công nhân sự",
    color: "red",
    icon: undefined,
  },
  {
    num: 7,
    label: "PHCQT đang xử lý",
    color: "green",
    icon: undefined,
  },
  {
    num: 8,
    label: "Hoàn thành",
    color: "red",
    icon: undefined,
  },
  {
    num: 9,
    label: "Hủy",
    color: "red",
    icon: undefined,
  },
];

export const LoaiKhachHangDummy = [
  {
    value: EnumLoaiKhachHang.CN,
    label: "Cá nhân",
  },
  {
    value: EnumLoaiKhachHang.DN,
    label: "Doanh nghiệp",
  },
];
export const LoaiKhachHangMoiHienHuuDummy = [
  {
    value: EnumKhMoiHienHuu.Moi,
    label: "Mới",
  },
  {
    value: EnumKhMoiHienHuu.HienHuu,
    label: "Hiện hữu",
  },
];
export const TrangThaiCHBDummy = [
  {
    value: EnumTrangThaiCHB.Mo,
    label: "Mở",
  },
  {
    value: EnumTrangThaiCHB.Dong,
    label: "Đóng",
  },
];
export const KenhTiepThiDummy = [
  {
    value: EnumKenhTiepThi.TiepThiTrucTiep,
    label: "Tiếp thị trực tiếp",
  },
  {
    value: EnumKenhTiepThi.TiepThiQuaDienThoai,
    label: "Tiếp thị qua điện thoại",
  },
  {
    value: EnumKenhTiepThi.KhHienHuuGioiThieu,
    label: "KH hiện hữu giới thiệu",
  },
  {
    value: EnumKenhTiepThi.KhDoHoPhanBo,
    label: "KH do HO phân bổ",
  },
  {
    value: EnumKenhTiepThi.Khac,
    label: "Khác",
  },
];
export const KetQuaTiepThiDummy = [
  {
    value: EnumKetQuaTiepThi.CanNhac,
    label: "Cân nhắc",
  },
  {
    value: EnumKetQuaTiepThi.DongY,
    label: "Đồng ý",
  },
  {
    value: EnumKetQuaTiepThi.TuChoi,
    label: "Từ chối",
  },
];
export const ThoiHanCapTinDungDummy = [
  {
    value: EnumThoiHanCapTD.NganHan,
    label: "Ngắn hạn",
  },
  {
    value: EnumThoiHanCapTD.TrungDaiHan,
    label: "Trung dài hạn",
  },
];
export const CapMoiTaiCapDummy = [
  {
    value: EnumCapMoiTaiCap.CapMoi,
    label: "Cấp mới",
  },
  {
    value: EnumCapMoiTaiCap.TaiCap,
    label: "Tái cấp",
  },
];
export const MucDichVayDummy = [
  {
    value: EnumMucDichVay.MuaBDS,
    label: "Mua BĐS",
  },
  {
    value: EnumMucDichVay.TaiTroXSKD,
    label: "Tài trợ SXKD",
  },
  {
    value: EnumMucDichVay.BoSunggVonLuuDong,
    label: "Bổ sung vốn lưu động",
  },
  {
    value: EnumMucDichVay.CamCoSTK,
    label: "Cầm cố STK",
  },
  {
    value: EnumMucDichVay.TieuDung,
    label: "Tiêu dùng",
  },
  {
    value: EnumMucDichVay.VayMuaXe,
    label: "Vay mua xe",
  },
];
export const VayHanMucTungLanDummy = [
  {
    value: EnumVayHanMucTungLan.HanMuc,
    label: "Hạn mức",
  },
  {
    value: EnumVayHanMucTungLan.TungLan,
    label: "Từng lần",
  },
];
export const TTCoHoiVayDummy = [
  {
    value: EnumTTCoHoiVay.BinhThuong,
    label: "Bình thường",
  },
  {
    value: EnumTTCoHoiVay.PhatSinhVuongMac,
    label: "Phát sinh vướng mắc",
  },
  {
    value: EnumTTCoHoiVay.ThanhCong,
    label: "Thành công",
  },
  {
    value: EnumTTCoHoiVay.Huy,
    label: "Hủy",
  },
];
export const LoaiTheTinDungDummy = [
  {
    value: EnumLoaiTheTinDung.CreditCard,
    label: "Credit Card",
  },
  {
    value: EnumLoaiTheTinDung.DebitCard,
    label: "Debit Card",
  },
  {
    value: EnumLoaiTheTinDung.CreditDebit,
    label: "Credit & Debit",
  },
];
export const TTMoTheTinDungDummy = [
  {
    value: EnumTTMoTheTinDung.BinhThuong,
    label: "Bình thường",
  },
  {
    value: EnumTTMoTheTinDung.PhatSinhVuongMac,
    label: "Phát sinh vướng mắc",
  },
  {
    value: EnumTTMoTheTinDung.ThanhCong,
    label: "Thành công",
  },
  {
    value: EnumTTMoTheTinDung.Huy,
    label: "Hủy",
  },
];
export const TTCoHoiGuiTKHuyDongDummy = [
  {
    value: EnumTTCoHoiGuiTKHuyDong.BinhThuong,
    label: "Bình thường",
  },
  {
    value: EnumTTCoHoiGuiTKHuyDong.PhatSinhVuongMac,
    label: "Phát sinh vướng mắc",
  },
  {
    value: EnumTTCoHoiGuiTKHuyDong.ThanhCong,
    label: "Thành công",
  },
  {
    value: EnumTTCoHoiGuiTKHuyDong.Huy,
    label: "Hủy",
  },
];
export const TTCoHoiGuiTKBhntDummy = [
  {
    value: EnumTTCoHoiGuiTKBhnt.BinhThuong,
    label: "Bình thường",
  },
  {
    value: EnumTTCoHoiGuiTKBhnt.PhatSinhVuongMac,
    label: "Phát sinh vướng mắc",
  },
  {
    value: EnumTTCoHoiGuiTKBhnt.ThanhCong,
    label: "Thành công",
  },
  {
    value: EnumTTCoHoiGuiTKBhnt.Huy,
    label: "Hủy",
  },
];
export const TTCoHoiGuiTKBhpntDummy = [
  {
    value: EnumTTCoHoiGuiTKBhpnt.BinhThuong,
    label: "Bình thường",
  },
  {
    value: EnumTTCoHoiGuiTKBhpnt.PhatSinhVuongMac,
    label: "Phát sinh vướng mắc",
  },
  {
    value: EnumTTCoHoiGuiTKBhpnt.ThanhCong,
    label: "Thành công",
  },
  {
    value: EnumTTCoHoiGuiTKBhpnt.Huy,
    label: "Hủy",
  },
];

export const SanPhamDummy = [
  {
    value: 0,
    label: "Tín dụng",
  },
  {
    value: 1,
    label: "Thẻ tín dụng",
  },
  {
    value: 2,
    label: "Huy động",
  },
  {
    value: 3,
    label: "Bảo hiểm nhân thọ",
  },
  {
    value: 4,
    label: "Bảo hiểm phi nhân thọ",
  },
  {
    value: 5,
    label: "Sản phẩm khác",
  },
];
export const PhanLoaiNganSachDummy = [
  { value: 0, label: "Trong kế hoạch & Trong ngân sách" },
  { value: 1, label: "Ngoài kế hoạch & Ngoài ngân sách" },
  { value: 2, label: "Trong kế hoạch & Ngoài ngân sách" },
  { value: 3, label: "Ngoài kế hoạch & Trong ngân sách" },
];
export const ThongTinHangHoaDummy = [
  { value: 0, label: "Hàng hóa/dịch vụ lần đầu" },
  { value: 1, label: "Hàng hóa/dịch vụ đã qua mua sắm" },
  { value: 2, label: "Gia hạn dịch vụ" },
];
export const currencyTypeDummy = [
  { value: 0, label: "VND" },
  { value: 1, label: "USD" },
];
export const persentDummy = [
  { valueReal: 0, label: "0%", value: 0 },
  { valueReal: 0.08, label: "8%", value: 1 },
  { valueReal: 0.1, label: "10%", value: 2 },
];
export const requestTypeDummy = [
  { value: 0, label: "Yêu cầu mua sắm" },
  { value: 1, label: "Yêu cầu khảo sát" },
  { value: 2, label: "Yêu cầu chỉnh sửa yêu cầu mua sắm" },
  { value: 3, label: "Chọn yêu cầu" },
];
export interface Tab {
  key: TabKey;
  label: string;
}
export const TabsArrayDummy: Tab[] = [
  { key: TabKey.LIST, label: "Danh sách nhân sự" },
  { key: TabKey.CKS, label: "Cấp kiểm soát" },
  { key: TabKey.PHANCONG, label: "Nhân sự phân công" },
  { key: TabKey.XULY, label: "Nhân sự xử lý" },
];
const currentYear = new Date().getFullYear();
const length = new Date().getFullYear() - 2022;
const yearsList = Array.from(
  { length: length },
  (_, index) => currentYear - index
);
export const ListYearDummy = yearsList.map((item) => ({
  label: "Năm " + item,
  value: item,
}));

export const ListWeekDummy = (year: number | undefined) => {
  const weeksList = [];
  const currentYear = new Date().getFullYear();
  if (year && year === currentYear) {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    let weekCount = 1;
    // Đảm bảo tuần bắt đầu từ thứ Hai
    const firstMonday = new Date(startOfYear);
    const dayOfWeek = firstMonday.getDay();
    if (dayOfWeek !== 1) {
      firstMonday.setDate(firstMonday.getDate() + ((1 - dayOfWeek + 7) % 7));
    }
    while (firstMonday <= currentDate) {
      weeksList.push({
        label: "Tuần " + weekCount,
        value: weekCount,
      });

      // Di chuyển đến tuần tiếp theo
      firstMonday.setDate(firstMonday.getDate() + 7);
      weekCount++;
    }
  } else if (year && year < currentYear) {
    const lastDate = new Date(year, 11, 31); // Ngày cuối cùng của năm
    const startOfYear = new Date(year, 0, 1);
    const firstMonday = new Date(startOfYear);
    let weekCount = 1;
    while (firstMonday <= lastDate) {
      weeksList.push({
        label: "Tuần " + weekCount,
        value: weekCount,
      });

      // Di chuyển đến tuần tiếp theo
      firstMonday.setDate(firstMonday.getDate() + 7);
      weekCount++;
    }
  }

  return weeksList.reverse();
};
