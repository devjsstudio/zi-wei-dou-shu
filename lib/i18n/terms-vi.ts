// 术语中→越（汉越音）对照表 —— 只用于显示层，排盘引擎内部一律保持 zh-CN 名称。
// 星曜 / 宫位 / 干支 / 局名的译名取自 iztro 自带的 vi-VN 语言包，
// 本仓库自有的星名（副旬、副截）及 iztro 未收录的亮度等级为手工补充。

const STARS: Record<string, string> = {
  // 14 主星
  '紫微': 'Tử Vi', '天机': 'Thiên Cơ', '太阳': 'Thái Dương', '武曲': 'Vũ Khúc',
  '天同': 'Thiên Đồng', '廉贞': 'Liêm Trinh', '天府': 'Thiên Phủ', '太阴': 'Thái Âm',
  '贪狼': 'Tham Lang', '巨门': 'Cự Môn', '天相': 'Thiên Tướng', '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát', '破军': 'Phá Quân',
  // 六吉 / 六煞 / 禄马
  '左辅': 'Tả Phù', '右弼': 'Hữu Bật', '文昌': 'Văn Xương', '文曲': 'Văn Khúc',
  '天魁': 'Thiên Khôi', '天钺': 'Thiên Việt', '禄存': 'Lộc Tồn', '天马': 'Thiên Mã',
  '擎羊': 'Kình Dương', '陀罗': 'Đà La', '火星': 'Hỏa Tinh', '铃星': 'Linh Tinh',
  '地空': 'Địa Không', '地劫': 'Địa Kiếp',
  // 杂曜
  '红鸾': 'Hồng Loan', '天喜': 'Thiên Hỷ', '天姚': 'Thiên Diêu', '咸池': 'Hàm Trì',
  '天刑': 'Thiên Hình', '天空': 'Thiên Không', '孤辰': 'Cô Thần', '寡宿': 'Quả Tú',
  '劫煞': 'Kiếp Sát', '封诰': 'Phong Cáo', '台辅': 'Đài Phụ', '天巫': 'Thiên Vu',
  '天福': 'Thiên Phúc', '天官': 'Thiên Quan', '三台': 'Tam Thai', '八座': 'Bát Tọa',
  '恩光': 'Ân Quang', '天贵': 'Thiên Quý', '龙池': 'Long Trì', '凤阁': 'Phụng Các',
  '天哭': 'Thiên Khốc', '天虚': 'Thiên Hư', '天伤': 'Thiên Thương', '天使': 'Thiên Sứ',
  '解神': 'Giải Thần', '年解': 'Niên Giải', '月德': 'Nguyệt Đức', '天德': 'Thiên Đức',
  '龙德': 'Long Đức', '阴煞': 'Âm Sát', '大耗': 'Đại Hao', '蜚廉': 'Phi Liêm',
  '破碎': 'Phá Toái', '天月': 'Thiên Nguyệt', '天厨': 'Thiên Trù', '天才': 'Thiên Tài',
  '天寿': 'Thiên Thọ', '华盖': 'Hoa Cái',
  // 旬空 / 截空（本仓库额外排出副旬、副截）
  '旬空': 'Tuần', '副旬': 'Tuần (phụ)', '截空': 'Triệt', '副截': 'Triệt (phụ)',
};

const PALACES: Record<string, string> = {
  '命': 'Mệnh', '身': 'Thân', '兄弟': 'Huynh Đệ', '夫妻': 'Phu Thê', '子女': 'Tử Nữ',
  '财帛': 'Tài Bạch', '疾厄': 'Tật Ách', '迁移': 'Thiên Di', '交友': 'Nô Bộc', '仆役': 'Nô Bộc',
  '官禄': 'Quan Lộc', '田宅': 'Điền Trạch', '福德': 'Phúc Đức', '父母': 'Phụ Mẫu',
};

const STEMS: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
};

const BRANCHES: Record<string, string> = {
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
  '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
};

const SIHUA: Record<string, string> = { '禄': 'Lộc', '权': 'Quyền', '科': 'Khoa', '忌': 'Kỵ' };

const BRIGHTNESS: Record<string, string> = {
  '庙': 'Miếu', '旺': 'Vượng', '得': 'Đắc', '利': 'Lợi', '平': 'Bình',
  '不': 'Bất', '闲': 'Nhàn', '陷': 'Hãm', '地': 'Địa',
};

const MISC: Record<string, string> = {
  '水二局': 'Thủy Nhị Cục', '木三局': 'Mộc Tam Cục', '金四局': 'Kim Tứ Cục',
  '土五局': 'Thổ Ngũ Cục', '火六局': 'Hỏa Lục Cục',
  '阳男': 'Dương Nam', '阴男': 'Âm Nam', '阳女': 'Dương Nữ', '阴女': 'Âm Nữ',
};

/** 星名 → 越文；查不到时原样返回 */
export const starVi = (name: string) => STARS[name] ?? name;

/** 宫名（带不带「宫」字均可）→ 越文 */
export const palaceVi = (name: string) => PALACES[name.replace(/宫$/, '')] ?? name;

export const stemVi = (s: string) => STEMS[s] ?? s;
export const branchVi = (b: string) => BRANCHES[b] ?? b;
export const sihuaVi = (s: string) => SIHUA[s] ?? s;
export const brightnessVi = (b: string) => BRIGHTNESS[b] ?? b;

/** 通用：按星 → 宫 → 局名/阴阳 → 单字干支四化 的顺序查找 */
export function termVi(zh: string): string {
  return STARS[zh] ?? PALACES[zh.replace(/宫$/, '')] ?? MISC[zh]
    ?? STEMS[zh] ?? BRANCHES[zh] ?? SIHUA[zh] ?? BRIGHTNESS[zh] ?? zh;
}
