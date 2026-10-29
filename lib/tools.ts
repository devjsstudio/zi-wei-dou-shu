/** Tiện ích dùng chung cho 6 màn "Pháp Khí" (trạch nhật, gia phả, định giờ, gieo quẻ, sự nghiệp, âm nhạc). */

export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export const HANH_COLOR: Record<NguHanh, string> = {
  Thổ: '#F59E0B', Mộc: '#10B981', Thủy: '#38BDF8', Kim: '#E2E8F0', Hỏa: '#F43F5E',
};
export const HANH_ICON: Record<NguHanh, string> = {
  Thổ: 'public', Mộc: 'forest', Thủy: 'water_drop', Kim: 'diamond', Hỏa: 'local_fire_department',
};

export const STEM_VI = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const BRANCH_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

/** 12 canh giờ: tên + khoảng giờ đồng hồ. */
export const CANH_GIO = BRANCH_VI.map((b, i) => ({
  branch: i,
  name: `Giờ ${b}`,
  range: i === 0 ? '23:00–01:00' : `${String((i * 2 - 1 + 24) % 24).padStart(2, '0')}:00–${String((i * 2 + 1) % 24).padStart(2, '0')}:00`,
}));

/** Nạp âm ngũ hành của 30 cặp giáp tý (khớp NAYIN_ELEMENTS trong constants, nhưng tên tiếng Việt). */
const NAYIN: { name: string; hanh: NguHanh }[] = [
  { name: 'Hải Trung Kim', hanh: 'Kim' }, { name: 'Lư Trung Hỏa', hanh: 'Hỏa' },
  { name: 'Đại Lâm Mộc', hanh: 'Mộc' }, { name: 'Lộ Bàng Thổ', hanh: 'Thổ' },
  { name: 'Kiếm Phong Kim', hanh: 'Kim' }, { name: 'Sơn Đầu Hỏa', hanh: 'Hỏa' },
  { name: 'Giản Hạ Thủy', hanh: 'Thủy' }, { name: 'Thành Đầu Thổ', hanh: 'Thổ' },
  { name: 'Bạch Lạp Kim', hanh: 'Kim' }, { name: 'Dương Liễu Mộc', hanh: 'Mộc' },
  { name: 'Tuyền Trung Thủy', hanh: 'Thủy' }, { name: 'Ốc Thượng Thổ', hanh: 'Thổ' },
  { name: 'Tích Lịch Hỏa', hanh: 'Hỏa' }, { name: 'Tùng Bách Mộc', hanh: 'Mộc' },
  { name: 'Trường Lưu Thủy', hanh: 'Thủy' }, { name: 'Sa Trung Kim', hanh: 'Kim' },
  { name: 'Sơn Hạ Hỏa', hanh: 'Hỏa' }, { name: 'Bình Địa Mộc', hanh: 'Mộc' },
  { name: 'Bích Thượng Thổ', hanh: 'Thổ' }, { name: 'Kim Bạc Kim', hanh: 'Kim' },
  { name: 'Phú Đăng Hỏa', hanh: 'Hỏa' }, { name: 'Thiên Hà Thủy', hanh: 'Thủy' },
  { name: 'Đại Dịch Thổ', hanh: 'Thổ' }, { name: 'Thoa Xuyến Kim', hanh: 'Kim' },
  { name: 'Tang Đố Mộc', hanh: 'Mộc' }, { name: 'Đại Khê Thủy', hanh: 'Thủy' },
  { name: 'Sa Trung Thổ', hanh: 'Thổ' }, { name: 'Thiên Thượng Hỏa', hanh: 'Hỏa' },
  { name: 'Thạch Lựu Mộc', hanh: 'Mộc' }, { name: 'Đại Hải Thủy', hanh: 'Thủy' },
];

/** Chỉ số can chi (0-59) của năm dương lịch. */
export function yearGanZhiIndex(year: number): number {
  return ((year - 4) % 60 + 60) % 60;
}

export function yearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}
export function yearBranchIndex(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

/** Can Chi năm, ví dụ "Quý Dậu". */
export function yearGanZhi(year: number): string {
  return `${STEM_VI[yearStemIndex(year)]} ${BRANCH_VI[yearBranchIndex(year)]}`;
}

/** Nạp âm của năm: { name, hanh }. */
export function nayinOf(year: number): { name: string; hanh: NguHanh } {
  return NAYIN[Math.floor(yearGanZhiIndex(year) / 2)];
}

/** Âm/Dương của năm (can chẵn = Dương). */
export function amDuong(year: number): 'Dương' | 'Âm' {
  return yearStemIndex(year) % 2 === 0 ? 'Dương' : 'Âm';
}

const ORDER: NguHanh[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

/** Quan hệ ngũ hành của a đối với b: a sinh b / a khắc b / b sinh a / b khắc a / tỷ hòa. */
export function hanhRelation(a: NguHanh, b: NguHanh): {
  type: 'sinh-xuất' | 'sinh-nhập' | 'khắc-xuất' | 'khắc-nhập' | 'tỷ-hòa';
  label: string;
  score: number; // -2..+2 (lợi cho a)
} {
  const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
  if (ia === ib) return { type: 'tỷ-hòa', label: `${a} tỷ hòa ${b}`, score: 1 };
  if ((ia + 1) % 5 === ib) return { type: 'sinh-xuất', label: `${a} sinh ${b}`, score: -1 };      // a hao tổn nuôi b
  if ((ib + 1) % 5 === ia) return { type: 'sinh-nhập', label: `${b} sinh ${a}`, score: 2 };        // a được b nuôi
  if ((ia + 2) % 5 === ib) return { type: 'khắc-xuất', label: `${a} khắc ${b}`, score: 0 };        // a khắc b
  return { type: 'khắc-nhập', label: `${b} khắc ${a}`, score: -2 };                                 // a bị b khắc
}

/** Hành mà `a` sinh ra (sinh xuất). */
export function hanhSinh(a: NguHanh): NguHanh { return ORDER[(ORDER.indexOf(a) + 1) % 5]; }
/** Hành mà `a` khắc (khắc xuất). */
export function hanhKhac(a: NguHanh): NguHanh { return ORDER[(ORDER.indexOf(a) + 2) % 5]; }

/** Chi tam hợp (địa chi cách nhau 4 cung) — dùng cho hợp tuổi. */
export function tamHop(branch: number): [number, number, number] {
  return [branch, (branch + 4) % 12, (branch + 8) % 12];
}
/** Chi lục hợp. */
const LUC_HOP: Record<number, number> = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };
export function lucHop(a: number, b: number): boolean { return LUC_HOP[a] === b; }
/** Chi xung (đối cung). */
export function xungChi(a: number, b: number): boolean { return (a + 6) % 12 === b; }
