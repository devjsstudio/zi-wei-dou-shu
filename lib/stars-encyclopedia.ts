/** Bách khoa tinh đẩu — dữ liệu sao tiếng Việt cho trang /bach-khoa. */

export type StarCat = 'chinh-tinh' | 'luc-cat' | 'luc-sat' | 'tu-hoa';
export type Element = 'Thổ' | 'Mộc' | 'Thủy' | 'Kim' | 'Hỏa' | 'Kim / Hỏa' | 'Thủy / Mộc';

export interface StarEntry {
  id: string;
  name: string;
  cat: StarCat;
  element: Element;
  hoa: string;          // Hóa khí
  mieu: string;         // Vị trí miếu vượng
  power: number;        // 0-100
  prestige: number;     // 0-100
  desc: string;         // Ý nghĩa
}

/** Ảnh tarot Stitch theo id sao (nếu có). */
export const STAR_IMG: Record<string, string> = {
  'tu-vi': '/_assets/stitch/img08.png',
  'thien-phu': '/_assets/stitch/img04.png',
  'vu-khuc': '/_assets/stitch/img11.png',
  'thai-duong': '/_assets/stitch/img10.png',
  'thai-am': '/_assets/stitch/img12.png',
  'that-sat': '/_assets/stitch/img07.png',
  'hoa-loc': '/_assets/stitch/img06.png',
  'kinh-duong': '/_assets/stitch/img13.png',
};

export const CAT_LABEL: Record<StarCat, string> = {
  'chinh-tinh': '14 Chính Tinh',
  'tu-hoa': 'Tứ Hóa',
  'luc-cat': 'Lục Cát',
  'luc-sat': 'Lục Sát',
};

export const ELEMENT_COLOR: Record<string, string> = {
  'Thổ': '#F59E0B', 'Mộc': '#10B981', 'Thủy': '#38BDF8', 'Kim': '#E2E8F0', 'Hỏa': '#F43F5E',
  'Kim / Hỏa': '#E2E8F0', 'Thủy / Mộc': '#38BDF8',
};

export const STARS: StarEntry[] = [
  // ─── 14 Chính Tinh ───
  { id: 'tu-vi', name: 'Tử Vi', cat: 'chinh-tinh', element: 'Thổ', hoa: 'Tôn Tinh · Đế Tinh', mieu: 'Miếu tại Ngọ', power: 99, prestige: 98,
    desc: 'Đế tinh thống lĩnh chư tinh, chủ về quyền quý, lãnh đạo, tôn nghiêm. Cần tả hữu phụ tá mới thành đại khí, đơn thủ dễ cô độc.' },
  { id: 'thien-co', name: 'Thiên Cơ', cat: 'chinh-tinh', element: 'Mộc', hoa: 'Thiện Tinh · Trí Tuệ', mieu: 'Miếu tại Mão Dậu Thìn Tuất', power: 86, prestige: 84,
    desc: 'Sao trí tuệ, mưu lược, linh hoạt, thiện biến. Hợp tham mưu, kế hoạch; nhược điểm là hay thay đổi, thiếu kiên định.' },
  { id: 'thai-duong', name: 'Thái Dương', cat: 'chinh-tinh', element: 'Hỏa', hoa: 'Quang Minh · Quan Tinh', mieu: 'Miếu tại Dần Tị Ngọ', power: 94, prestige: 96,
    desc: 'Chủ quang minh, danh dự, quý hiển, bác ái. Nam mệnh chủ quý, nữ mệnh chủ phu quý tử vinh. Hãm địa dễ lao lực.' },
  { id: 'vu-khuc', name: 'Vũ Khúc', cat: 'chinh-tinh', element: 'Kim', hoa: 'Tài Tinh · Dũng Kiệt', mieu: 'Miếu tại Thìn Tuất Sửu Mùi', power: 92, prestige: 90,
    desc: 'Chính tài tinh, cương nghị quả quyết, giỏi quản lý tiền bạc. Tính cứng rắn, hợp võ chức, tài chính; cần tránh cô khắc.' },
  { id: 'thien-dong', name: 'Thiên Đồng', cat: 'chinh-tinh', element: 'Thủy', hoa: 'Phúc Tinh · Ôn Hòa', mieu: 'Miếu tại Tị Hợi', power: 80, prestige: 82,
    desc: 'Phúc tinh, ôn hòa, hưởng thụ, tùy duyên, nhân hậu. Dễ an phận, thiếu ý chí tiến thủ nếu không gặp sao kích phát.' },
  { id: 'liem-trinh', name: 'Liêm Trinh', cat: 'chinh-tinh', element: 'Hỏa', hoa: 'Tù Tinh · Đào Hoa Quan Lộc', mieu: 'Miếu tại Dần Thân', power: 90, prestige: 85,
    desc: 'Thứ đào hoa kiêm quan lộc, đa tài đa nghệ, cá tính mạnh. Cát thì phú quý, hung thì thị phi, quan tụng.' },
  { id: 'thien-phu', name: 'Thiên Phủ', cat: 'chinh-tinh', element: 'Thổ', hoa: 'Lệnh Tinh · Bảo Khố', mieu: 'Miếu tại Dần Thân', power: 95, prestige: 97,
    desc: 'Nam đẩu chủ, kho tàng tài lộc, ổn trọng, bảo thủ, giỏi tích lũy. Chủ phú, thận trọng, thích an toàn.' },
  { id: 'thai-am', name: 'Thái Âm', cat: 'chinh-tinh', element: 'Thủy', hoa: 'Phú Tinh · Nhu Thuận', mieu: 'Miếu tại Dậu Tuất Hợi', power: 91, prestige: 95,
    desc: 'Chủ phú, điền trạch, mẹ và vợ, nhu mỹ tinh tế. Vượng địa chủ giàu sang thanh quý; hãm địa chủ lao tâm.' },
  { id: 'tham-lang', name: 'Tham Lang', cat: 'chinh-tinh', element: 'Thủy / Mộc', hoa: 'Đào Hoa · Dục Vọng', mieu: 'Miếu tại Thìn Tuất Sửu Mùi', power: 89, prestige: 83,
    desc: 'Chính đào hoa, dục vọng, đa tài đa nghệ, giao tế rộng. Hợp kinh doanh, nghệ thuật; dễ sa đà tửu sắc.' },
  { id: 'cu-mon', name: 'Cự Môn', cat: 'chinh-tinh', element: 'Thủy', hoa: 'Ám Tinh · Khẩu Thiệt', mieu: 'Miếu tại Mão Dậu Dần', power: 84, prestige: 80,
    desc: 'Ám tinh chủ khẩu thiệt, nghiên cứu, lý luận. Giỏi ăn nói, pháp lý, chuyên môn; dễ thị phi, hoài nghi.' },
  { id: 'thien-tuong', name: 'Thiên Tướng', cat: 'chinh-tinh', element: 'Thủy', hoa: 'Ấn Tinh · Phụ Tá', mieu: 'Miếu tại Tý Ngọ Dần Thân', power: 87, prestige: 88,
    desc: 'Ấn tinh, phụ tá, công chính, từ thiện, trọng lễ nghĩa. Hợp hành chính, trung gian; cần chính tinh tốt hội chiếu.' },
  { id: 'thien-luong', name: 'Thiên Lương', cat: 'chinh-tinh', element: 'Thổ', hoa: 'Ấm Tinh · Trường Thọ', mieu: 'Miếu tại Tý Ngọ Sửu Mùi', power: 85, prestige: 86,
    desc: 'Ấm tinh, che chở, trường thọ, nguyên tắc, y dược. Chủ hóa giải tai ách, có phong thái trưởng thượng, thanh cao.' },
  { id: 'that-sat', name: 'Thất Sát', cat: 'chinh-tinh', element: 'Kim / Hỏa', hoa: 'Tướng Tinh · Quyền Uy', mieu: 'Miếu tại Dần Thân Tý Ngọ', power: 96, prestige: 88,
    desc: 'Tướng tinh, quyền uy, quả quyết, khai phá. Chủ biến động lớn, hợp sự nghiệp độc lập; cá tính cô khắc, mạnh mẽ.' },
  { id: 'pha-quan', name: 'Phá Quân', cat: 'chinh-tinh', element: 'Thủy', hoa: 'Hao Tinh · Khai Sáng', mieu: 'Miếu tại Tý Ngọ', power: 88, prestige: 82,
    desc: 'Hao tinh chủ phá cũ lập mới, tiên phong, biến cách. Dám nghĩ dám làm, hợp khởi nghiệp; dễ hao tổn, thăng trầm.' },
  // ─── Tứ Hóa ───
  { id: 'hoa-loc', name: 'Hóa Lộc', cat: 'tu-hoa', element: 'Mộc', hoa: 'Thần Tài · Cát Tinh', mieu: 'Miếu vượng tùy Can', power: 89, prestige: 94,
    desc: 'Chủ tài lộc, nhân duyên, hanh thông, cơ hội. Sao nào hóa Lộc thì phát về lĩnh vực sao đó.' },
  { id: 'hoa-quyen', name: 'Hóa Quyền', cat: 'tu-hoa', element: 'Hỏa', hoa: 'Quyền Lực · Chủ Động', mieu: 'Miếu vượng tùy Can', power: 88, prestige: 90,
    desc: 'Chủ quyền lực, nắm quyền, chủ động, thăng tiến. Tăng cường khí thế và địa vị cho sao được hóa.' },
  { id: 'hoa-khoa', name: 'Hóa Khoa', cat: 'tu-hoa', element: 'Thủy', hoa: 'Văn Tinh · Danh Tiếng', mieu: 'Miếu vượng tùy Can', power: 82, prestige: 92,
    desc: 'Chủ khoa danh, học thức, danh tiếng, quý nhân. Gặp nạn có quý nhân phù trợ, thi cử hanh thông.' },
  { id: 'hoa-ky', name: 'Hóa Kỵ', cat: 'tu-hoa', element: 'Thủy', hoa: 'Chướng Ngại · Chấp Niệm', mieu: 'Tùy Can', power: 70, prestige: 55,
    desc: 'Chủ trở ngại, thị phi, chấp niệm, hao tổn. Sao nào hóa Kỵ thì vướng mắc lĩnh vực đó; cũng là động lực nếu biết hóa giải.' },
  // ─── Lục Cát ───
  { id: 'van-xuong', name: 'Văn Xương', cat: 'luc-cat', element: 'Kim', hoa: 'Văn Tinh · Khoa Giáp', mieu: 'Miếu tại Tị Dậu Sửu', power: 80, prestige: 88,
    desc: 'Văn tinh chủ văn chương, khoa cử, lễ nghi, tài hoa. Chủ thông minh, hợp học hành, công danh bằng chữ nghĩa.' },
  { id: 'van-khuc', name: 'Văn Khúc', cat: 'luc-cat', element: 'Thủy', hoa: 'Văn Tinh · Khẩu Tài', mieu: 'Miếu tại Tị Dậu Sửu', power: 79, prestige: 86,
    desc: 'Văn tinh chủ khẩu tài, nghệ thuật, biện luận, đa tài. Hợp nghề dùng miệng lưỡi, nghệ thuật trình diễn.' },
  { id: 'ta-phu', name: 'Tả Phụ', cat: 'luc-cat', element: 'Thổ', hoa: 'Phụ Tá · Quý Nhân', mieu: 'Đắc địa đa cung', power: 78, prestige: 85,
    desc: 'Sao phụ tá, quý nhân, trợ lực. Đi cùng chính tinh làm tăng phúc lực, được người giúp đỡ.' },
  { id: 'huu-bat', name: 'Hữu Bật', cat: 'luc-cat', element: 'Thủy', hoa: 'Phụ Tá · Quý Nhân', mieu: 'Đắc địa đa cung', power: 78, prestige: 85,
    desc: 'Cặp với Tả Phụ, chủ trợ giúp âm thầm, quý nhân hậu thuẫn. Tăng sự ổn định và viên mãn cho mệnh.' },
  { id: 'thien-khoi', name: 'Thiên Khôi', cat: 'luc-cat', element: 'Hỏa', hoa: 'Quý Nhân · Dương Quý', mieu: 'Quý nhân ban ngày', power: 81, prestige: 87,
    desc: 'Thiên Ất quý nhân (dương), chủ quý nhân giúp đỡ công khai, cơ hội thăng tiến, hóa giải tai ách.' },
  { id: 'thien-viet', name: 'Thiên Việt', cat: 'luc-cat', element: 'Hỏa', hoa: 'Quý Nhân · Âm Quý', mieu: 'Quý nhân ban đêm', power: 81, prestige: 87,
    desc: 'Ngọc Đường quý nhân (âm), chủ quý nhân phù trợ kín đáo, duyên may bất ngờ, đề bạt.' },
  // ─── Lục Sát ───
  { id: 'kinh-duong', name: 'Kình Dương', cat: 'luc-sat', element: 'Kim', hoa: 'Hình Khắc · Sát Tinh', mieu: 'Đắc tại Thìn Tuất Sửu Mùi', power: 88, prestige: 62,
    desc: 'Sát tinh chủ hình thương, cương bạo, quyết liệt. Nhập miếu hóa thành uy quyền; hãm địa chủ tai thương, thị phi.' },
  { id: 'da-la', name: 'Đà La', cat: 'luc-sat', element: 'Kim', hoa: 'Triền Nhiễu · Âm Sát', mieu: 'Đắc tại Thìn Tuất Sửu Mùi', power: 82, prestige: 58,
    desc: 'Sát tinh chủ dây dưa, trì trệ, phiền muộn ngấm ngầm. Làm việc chậm, dễ vướng mắc kéo dài.' },
  { id: 'hoa-tinh', name: 'Hỏa Tinh', cat: 'luc-sat', element: 'Hỏa', hoa: 'Bạo Liệt · Cương Mãnh', mieu: 'Đắc tại Dần Ngọ Tuất', power: 84, prestige: 60,
    desc: 'Sát tinh chủ nóng nảy, đột biến, bạo phát. Gặp Tham Lang thành "Hỏa Tham" bạo phát tài lộc; hãm thì tai họa bất ngờ.' },
  { id: 'linh-tinh', name: 'Linh Tinh', cat: 'luc-sat', element: 'Hỏa', hoa: 'Âm Hỏa · Kỳ Dị', mieu: 'Đắc tại Dần Ngọ Tuất', power: 80, prestige: 57,
    desc: 'Sát tinh chủ âm hỏa, kỳ dị, cô khắc. Cặp Linh Tham cũng chủ bạo phát; thường chủ phiền não nội tâm.' },
  { id: 'dia-khong', name: 'Địa Không', cat: 'luc-sat', element: 'Hỏa', hoa: 'Không Vong · Phá Hao', mieu: 'Kỵ nhập tài quan', power: 76, prestige: 52,
    desc: 'Sát tinh chủ hư không, phá hao, tư tưởng khác thường. Hợp tu hành, sáng tạo; kỵ nhập cung tài quan.' },
  { id: 'dia-kiep', name: 'Địa Kiếp', cat: 'luc-sat', element: 'Hỏa', hoa: 'Kiếp Sát · Hao Tổn', mieu: 'Kỵ nhập tài quan', power: 76, prestige: 52,
    desc: 'Sát tinh chủ kiếp đoạt, hao tổn, biến cố. Làm việc dễ "được rồi lại mất"; cần chính tinh vượng chế hóa.' },
];
