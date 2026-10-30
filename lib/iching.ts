/** Kinh Dịch — 8 quẻ đơn (bát quái) + 64 quẻ kép, dùng cho trang /gieo-que. */

export interface Trigram { id: number; name: string; symbol: string; element: string; bits: [number, number, number]; } // bits: hào dưới→trên, 1=Dương

export const TRIGRAMS: Trigram[] = [
  { id: 0, name: 'Càn', symbol: '☰', element: 'Thiên', bits: [1, 1, 1] },
  { id: 1, name: 'Đoài', symbol: '☱', element: 'Trạch', bits: [1, 1, 0] },
  { id: 2, name: 'Ly', symbol: '☲', element: 'Hỏa', bits: [1, 0, 1] },
  { id: 3, name: 'Chấn', symbol: '☳', element: 'Lôi', bits: [1, 0, 0] },
  { id: 4, name: 'Tốn', symbol: '☴', element: 'Phong', bits: [0, 1, 1] },
  { id: 5, name: 'Khảm', symbol: '☵', element: 'Thủy', bits: [0, 1, 0] },
  { id: 6, name: 'Cấn', symbol: '☶', element: 'Sơn', bits: [0, 0, 1] },
  { id: 7, name: 'Khôn', symbol: '☷', element: 'Địa', bits: [0, 0, 0] },
];

/** Tìm chỉ số bát quái từ 3 hào (dưới→trên). */
export function trigramIndex(l1: number, l2: number, l3: number): number {
  return TRIGRAMS.findIndex((t) => t.bits[0] === l1 && t.bits[1] === l2 && t.bits[2] === l3);
}

export interface Hexagram { num: number; name: string; y: string; }

/** Khóa "upperLower" (chỉ số bát quái 0-7) → quẻ kép. */
export const HEX: Record<string, Hexagram> = {
  // Upper Càn (0)
  '00': { num: 1, name: 'Thuần Càn', y: 'Vạn vật hanh thông, thời cơ chín muồi, rồng bay trên trời xanh.' },
  '01': { num: 43, name: 'Trạch Thiên Quải', y: 'Quyết đoán dứt khoát, cương quyết loại trừ tiểu nhân, giữ chính nghĩa.' },
  '02': { num: 14, name: 'Hỏa Thiên Đại Hữu', y: 'Đại thịnh, của cải dồi dào, sáng rực, nắm giữ nhiều phúc lộc.' },
  '03': { num: 34, name: 'Lôi Thiên Đại Tráng', y: 'Khí thế mạnh mẽ, tráng kiện, nhưng chớ dùng sức thái quá.' },
  '04': { num: 9, name: 'Phong Thiên Tiểu Súc', y: 'Tích tụ dần nhỏ, chờ thời, chưa đến lúc hành động lớn.' },
  '05': { num: 5, name: 'Thủy Thiên Nhu', y: 'Chờ đợi đúng thời, nhẫn nại dưỡng sức, ắt được hanh thông.' },
  '06': { num: 26, name: 'Sơn Thiên Đại Súc', y: 'Súc tích lớn, nuôi dưỡng tài đức, chứa đức chờ dùng.' },
  '07': { num: 11, name: 'Địa Thiên Thái', y: 'Thái hòa, trên dưới giao hòa, vận thông, mọi sự cát tường.' },
  // Upper Đoài (1)
  '10': { num: 10, name: 'Thiên Trạch Lý', y: 'Dẫm đuôi cọp mà không bị cắn; thận trọng, giữ lễ nghĩa.' },
  '11': { num: 58, name: 'Thuần Đoài', y: 'Hòa duyệt vui vẻ, giao tiếp thuận lợi, lấy niềm vui cảm hóa.' },
  '12': { num: 38, name: 'Hỏa Trạch Khuê', y: 'Xa cách bất đồng, việc nhỏ thì cát, cần hòa giải dị biệt.' },
  '13': { num: 54, name: 'Lôi Trạch Quy Muội', y: 'Về nhà chồng; chớ vọng động, giữ thủ phận mới yên.' },
  '14': { num: 61, name: 'Phong Trạch Trung Phu', y: 'Thành tín trong lòng, lấy chữ tín cảm người, ắt thông đạt.' },
  '15': { num: 60, name: 'Thủy Trạch Tiết', y: 'Tiết chế có chừng mực, điều độ thì hanh, thái quá thì khổ.' },
  '16': { num: 41, name: 'Sơn Trạch Tổn', y: 'Bớt dưới thêm trên, giảm bớt hiện tại để lợi lâu dài.' },
  '17': { num: 19, name: 'Địa Trạch Lâm', y: 'Lớn mạnh tiến tới, giám sát cai quản, cát nhưng đề phòng về sau.' },
  // Upper Ly (2)
  '20': { num: 13, name: 'Thiên Hỏa Đồng Nhân', y: 'Đồng lòng hợp sức, kết giao rộng rãi, chung chí thì thành.' },
  '21': { num: 49, name: 'Trạch Hỏa Cách', y: 'Cách mạng đổi mới, bỏ cũ lập mới đúng thời thì được tin theo.' },
  '22': { num: 30, name: 'Thuần Ly', y: 'Sáng rực nương tựa chính đạo, nuôi đức thuận hòa thì lợi.' },
  '23': { num: 55, name: 'Lôi Hỏa Phong', y: 'Thịnh lớn huy hoàng, như mặt trời đứng bóng, giữ cho bền.' },
  '24': { num: 37, name: 'Phong Hỏa Gia Nhân', y: 'Người nhà, trị gia nghiêm chính, lợi cho nữ, gia đạo êm ấm.' },
  '25': { num: 63, name: 'Thủy Hỏa Ký Tế', y: 'Việc đã thành, lúc viên mãn; phòng loạn sinh từ an.' },
  '26': { num: 22, name: 'Sơn Hỏa Bí', y: 'Trang sức văn vẻ, vẻ đẹp bên ngoài, lợi việc nhỏ.' },
  '27': { num: 36, name: 'Địa Hỏa Minh Di', y: 'Ánh sáng bị che, thời khó; giấu tài, giữ chính mà bền chí.' },
  // Upper Chấn (3)
  '30': { num: 25, name: 'Thiên Lôi Vô Vọng', y: 'Không vọng cầu, giữ chính thì hanh; càn quấy ắt gặp họa.' },
  '31': { num: 17, name: 'Trạch Lôi Tùy', y: 'Tùy thời thuận theo, đi theo lẽ chính thì được lớn hanh thông.' },
  '32': { num: 21, name: 'Hỏa Lôi Phệ Hạp', y: 'Cắn hợp phá trở ngại, trừ kẻ gian, lợi việc hình ngục.' },
  '33': { num: 51, name: 'Thuần Chấn', y: 'Sấm động chấn kinh, lo sợ mà tu tỉnh thì được phúc.' },
  '34': { num: 42, name: 'Phong Lôi Ích', y: 'Thêm lợi ích, bớt trên thêm dưới, lợi cho việc lớn, tiến tới.' },
  '35': { num: 3, name: 'Thủy Lôi Truân', y: 'Khởi đầu gian nan, như mầm nhú đất; kiên trì sẽ thông.' },
  '36': { num: 27, name: 'Sơn Lôi Di', y: 'Nuôi dưỡng, giữ gìn lời ăn tiếng nói và cách tự dưỡng.' },
  '37': { num: 24, name: 'Địa Lôi Phục', y: 'Dương khí trở lại, phục hồi, vận tốt dần, đi về đều lợi.' },
  // Upper Tốn (4)
  '40': { num: 44, name: 'Thiên Phong Cấu', y: 'Gặp gỡ bất ngờ, âm mới sinh; phòng tiểu nhân xâm nhập.' },
  '41': { num: 28, name: 'Trạch Phong Đại Quá', y: 'Quá mức, rường cột cong; thời phi thường cần ứng biến.' },
  '42': { num: 50, name: 'Hỏa Phong Đỉnh', y: 'Vạc đỉnh, đổi mới dưỡng hiền, đại cát, hanh thông ổn định.' },
  '43': { num: 32, name: 'Lôi Phong Hằng', y: 'Bền lâu kiên định, giữ đạo thường hằng thì hanh, lợi bền chí.' },
  '44': { num: 57, name: 'Thuần Tốn', y: 'Thuận nhập khiêm hòa, mềm mỏng thấm dần, lợi có nơi để đến.' },
  '45': { num: 48, name: 'Thủy Phong Tỉnh', y: 'Giếng nước nuôi người, nguồn đức không cạn, giữ đạo bền.' },
  '46': { num: 18, name: 'Sơn Phong Cổ', y: 'Sửa chữa tệ nạn hư hỏng, chỉnh đốn lại thì được đại hanh.' },
  '47': { num: 46, name: 'Địa Phong Thăng', y: 'Thăng tiến đi lên, như mầm vươn cao, gặp đại nhân thì cát.' },
  // Upper Khảm (5)
  '50': { num: 6, name: 'Thiên Thủy Tụng', y: 'Tranh tụng kiện cáo, dừng lại giữa chừng thì cát, cố chấp thì hung.' },
  '51': { num: 47, name: 'Trạch Thủy Khốn', y: 'Khốn cùng bế tắc, người quân tử giữ chí thì vẫn hanh.' },
  '52': { num: 64, name: 'Hỏa Thủy Vị Tế', y: 'Việc chưa xong, đang dang dở; thận trọng ắt dần tới thành.' },
  '53': { num: 40, name: 'Lôi Thủy Giải', y: 'Giải trừ bế tắc, cởi nút khó khăn, sớm xử lý thì cát.' },
  '54': { num: 59, name: 'Phong Thủy Hoán', y: 'Ly tán rồi tụ hợp, hóa giải lòng người, lợi vượt sông lớn.' },
  '55': { num: 29, name: 'Thuần Khảm', y: 'Hiểm chồng hiểm, giữ lòng thành tín vượt nguy thì có công.' },
  '56': { num: 4, name: 'Sơn Thủy Mông', y: 'Mông muội cần khai sáng, cầu học thành tâm thì hanh thông.' },
  '57': { num: 7, name: 'Địa Thủy Sư', y: 'Dụng binh quần chúng, cần tướng tài chính trực thì không lỗi.' },
  // Upper Cấn (6)
  '60': { num: 33, name: 'Thiên Sơn Độn', y: 'Lui ẩn đúng lúc, tránh thời bất lợi, giữ mình thì hanh.' },
  '61': { num: 31, name: 'Trạch Sơn Hàm', y: 'Cảm ứng giao hòa, nam nữ tương cảm, cưới gả thì cát.' },
  '62': { num: 56, name: 'Hỏa Sơn Lữ', y: 'Lữ khách tha hương, nhỏ nhẹ cẩn trọng thì được chút hanh.' },
  '63': { num: 62, name: 'Lôi Sơn Tiểu Quá', y: 'Hơi quá chút ít, việc nhỏ thì nên, việc lớn chớ vọng động.' },
  '64': { num: 53, name: 'Phong Sơn Tiệm', y: 'Tiến dần từng bước, như chim bay theo thứ tự, nữ gả thì cát.' },
  '65': { num: 39, name: 'Thủy Sơn Kiển', y: 'Gặp hiểm trở bước, nên dừng và cầu đại nhân giúp đỡ.' },
  '66': { num: 52, name: 'Thuần Cấn', y: 'Dừng lại đúng chỗ, tĩnh tâm an định, không vọng cầu thì yên.' },
  '67': { num: 15, name: 'Địa Sơn Khiêm', y: 'Khiêm nhường, càng hạ mình càng được tôn; quân tử hữu chung.' },
  // Upper Khôn (7)
  '70': { num: 12, name: 'Thiên Địa Bĩ', y: 'Bế tắc không thông, trên dưới cách trở; ẩn nhẫn chờ thời.' },
  '71': { num: 45, name: 'Trạch Địa Tụy', y: 'Tụ hội đông người, gặp đại nhân thì hanh, cúng tế thì cát.' },
  '72': { num: 35, name: 'Hỏa Địa Tấn', y: 'Tiến lên sáng tỏ, như mặt trời mọc, được ban thưởng trọng dụng.' },
  '73': { num: 16, name: 'Lôi Địa Dự', y: 'Vui vẻ an nhàn, thuận thời động, lợi dựng nghiệp, hành quân.' },
  '74': { num: 20, name: 'Phong Địa Quán', y: 'Quan sát chiêm ngưỡng, lấy đức cảm người, thành kính thì được tin.' },
  '75': { num: 8, name: 'Thủy Địa Tỷ', y: 'Thân gần giúp đỡ, kết thân đúng người thì cát, chậm thì hung.' },
  '76': { num: 23, name: 'Sơn Địa Bác', y: 'Tước lột suy bại, âm thịnh dương suy; chớ hành, nên giữ.' },
  '77': { num: 2, name: 'Thuần Khôn', y: 'Đất dày chở vật, nhu thuận bền chính, theo sau thì được chủ.' },
};

export const TOPICS = [
  { key: 'tai', label: 'Tài Vận Liên Doanh', icon: 'payments' },
  { key: 'duyen', label: 'Tình Duyên – Hợp Hôn', icon: 'favorite' },
  { key: 'quan', label: 'Quan Lộc – Kiện Tụng', icon: 'gavel' },
  { key: 'xuat', label: 'Xuất Hành – Trạch Cát', icon: 'explore' },
];

/** Gieo 1 hào bằng 3 đồng xu → {yang, moving}. */
export function castLine(): { yang: boolean; moving: boolean } {
  let sum = 0;
  for (let i = 0; i < 3; i++) sum += Math.random() < 0.5 ? 2 : 3; // sấp=2, ngửa=3
  // 6 lão âm(động→dương), 7 thiếu dương, 8 thiếu âm, 9 lão dương(động→âm)
  return { yang: sum === 7 || sum === 9, moving: sum === 6 || sum === 9 };
}
