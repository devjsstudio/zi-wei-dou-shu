import type { ProvinceInfo } from './cities';

/**
 * 越南出生地表（真太阳时校正用）。
 *
 * 一级：2025-07-01 合并后的 34 个省级单位；二级：并入该省的旧省（63 省时期）
 * 及河西（Hà Tây，2008 年并入河内）——出生证明上通常写旧省名。
 * 经度取各（旧）省省会。
 */

/** 钟表时间所用标准经线：越南 UTC+7 → 105°E */
export const CLOCK_MERIDIAN = 105;

export const VN_PROVINCES: ProvinceInfo[] = [
  // ─── 未合并的 11 个省市 ─────────────────────────────────
  { name: 'Hà Nội', cities: [{ name: 'Hà Nội', longitude: 105.85 }, { name: 'Hà Tây (cũ)', longitude: 105.78 }] },
  { name: 'Huế', cities: [{ name: 'Huế', longitude: 107.59 }] },
  { name: 'Lai Châu', cities: [{ name: 'Lai Châu', longitude: 103.46 }] },
  { name: 'Điện Biên', cities: [{ name: 'Điện Biên', longitude: 103.02 }] },
  { name: 'Sơn La', cities: [{ name: 'Sơn La', longitude: 103.91 }] },
  { name: 'Lạng Sơn', cities: [{ name: 'Lạng Sơn', longitude: 106.76 }] },
  { name: 'Quảng Ninh', cities: [{ name: 'Quảng Ninh', longitude: 107.08 }] },
  { name: 'Thanh Hóa', cities: [{ name: 'Thanh Hóa', longitude: 105.78 }] },
  { name: 'Nghệ An', cities: [{ name: 'Nghệ An', longitude: 105.69 }] },
  { name: 'Hà Tĩnh', cities: [{ name: 'Hà Tĩnh', longitude: 105.90 }] },
  { name: 'Cao Bằng', cities: [{ name: 'Cao Bằng', longitude: 106.26 }] },

  // ─── 合并后的 23 个省市（二级为旧省） ─────────────────────
  { name: 'Tuyên Quang', cities: [{ name: 'Tuyên Quang', longitude: 105.22 }, { name: 'Hà Giang', longitude: 104.98 }] },
  { name: 'Lào Cai', cities: [{ name: 'Lào Cai', longitude: 103.97 }, { name: 'Yên Bái', longitude: 104.87 }] },
  { name: 'Thái Nguyên', cities: [{ name: 'Thái Nguyên', longitude: 105.84 }, { name: 'Bắc Kạn', longitude: 105.83 }] },
  { name: 'Phú Thọ', cities: [{ name: 'Phú Thọ', longitude: 105.40 }, { name: 'Vĩnh Phúc', longitude: 105.60 }, { name: 'Hòa Bình', longitude: 105.34 }] },
  { name: 'Bắc Ninh', cities: [{ name: 'Bắc Ninh', longitude: 106.08 }, { name: 'Bắc Giang', longitude: 106.19 }] },
  { name: 'Hưng Yên', cities: [{ name: 'Hưng Yên', longitude: 106.05 }, { name: 'Thái Bình', longitude: 106.34 }] },
  { name: 'Hải Phòng', cities: [{ name: 'Hải Phòng', longitude: 106.68 }, { name: 'Hải Dương', longitude: 106.33 }] },
  { name: 'Ninh Bình', cities: [{ name: 'Ninh Bình', longitude: 105.97 }, { name: 'Hà Nam', longitude: 105.91 }, { name: 'Nam Định', longitude: 106.17 }] },
  { name: 'Quảng Trị', cities: [{ name: 'Quảng Trị', longitude: 107.10 }, { name: 'Quảng Bình', longitude: 106.60 }] },
  { name: 'Đà Nẵng', cities: [{ name: 'Đà Nẵng', longitude: 108.22 }, { name: 'Quảng Nam', longitude: 108.47 }] },
  { name: 'Quảng Ngãi', cities: [{ name: 'Quảng Ngãi', longitude: 108.80 }, { name: 'Kon Tum', longitude: 108.00 }] },
  { name: 'Gia Lai', cities: [{ name: 'Gia Lai', longitude: 108.00 }, { name: 'Bình Định', longitude: 109.22 }] },
  { name: 'Khánh Hòa', cities: [{ name: 'Khánh Hòa', longitude: 109.19 }, { name: 'Ninh Thuận', longitude: 108.99 }] },
  { name: 'Lâm Đồng', cities: [{ name: 'Lâm Đồng', longitude: 108.44 }, { name: 'Đắk Nông', longitude: 107.69 }, { name: 'Bình Thuận', longitude: 108.10 }] },
  { name: 'Đắk Lắk', cities: [{ name: 'Đắk Lắk', longitude: 108.05 }, { name: 'Phú Yên', longitude: 109.30 }] },
  { name: 'TP. Hồ Chí Minh', cities: [{ name: 'TP. Hồ Chí Minh', longitude: 106.70 }, { name: 'Bình Dương', longitude: 106.65 }, { name: 'Bà Rịa – Vũng Tàu', longitude: 107.08 }] },
  { name: 'Đồng Nai', cities: [{ name: 'Đồng Nai', longitude: 106.82 }, { name: 'Bình Phước', longitude: 106.90 }] },
  { name: 'Tây Ninh', cities: [{ name: 'Tây Ninh', longitude: 106.10 }, { name: 'Long An', longitude: 106.41 }] },
  { name: 'Cần Thơ', cities: [{ name: 'Cần Thơ', longitude: 105.78 }, { name: 'Sóc Trăng', longitude: 105.97 }, { name: 'Hậu Giang', longitude: 105.47 }] },
  { name: 'Vĩnh Long', cities: [{ name: 'Vĩnh Long', longitude: 105.97 }, { name: 'Bến Tre', longitude: 106.38 }, { name: 'Trà Vinh', longitude: 106.34 }] },
  { name: 'Đồng Tháp', cities: [{ name: 'Đồng Tháp', longitude: 105.63 }, { name: 'Tiền Giang', longitude: 106.36 }] },
  { name: 'Cà Mau', cities: [{ name: 'Cà Mau', longitude: 105.15 }, { name: 'Bạc Liêu', longitude: 105.72 }] },
  { name: 'An Giang', cities: [{ name: 'An Giang', longitude: 105.43 }, { name: 'Kiên Giang', longitude: 105.08 }] },
];
