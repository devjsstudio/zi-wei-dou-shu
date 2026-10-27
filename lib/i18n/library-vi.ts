// 知识库 / 古籍库的越南语对照。古籍正文、白话、倪师注保持中文原文，不在此翻译。

import type { TopicKey } from '@/lib/ziwei/db-analysis';

export const TOPIC_LABEL_VI: Record<TopicKey, string> = {
  overview:    'Tổng quan mệnh cách',
  personality: 'Tính cách',
  love:        'Tình cảm hôn nhân',
  career:      'Sự nghiệp',
  wealth:      'Tài vận',
  health:      'Sức khỏe',
  family:      'Anh em, hợp tác',
  children:    'Duyên con cái',
  move:        'Di chuyển, xuất ngoại',
  friends:     'Quan hệ, quý nhân',
  home:        'Nhà đất, bất động sản',
  spirit:      'Tinh thần, phúc đức',
  parents:     'Cha mẹ, bề trên',
};

export const STAR_BRIEF_SEO_VI: Record<string, string> = {
  '紫微': 'Tử Vi là đế tinh, chủ tôn quý, hóa khí là Tôn. Thủ Mệnh thì có khí chất lãnh đạo, hợp nền tảng lớn, vị trí cao.',
  '天机': 'Thiên Cơ là trí tuệ tinh, chủ linh hoạt biến hóa, hóa khí là Thiện. Thủ Mệnh thì thông minh lanh lợi, hợp phò tá, hoạch định.',
  '太阳': 'Thái Dương là nam quý tinh, chủ danh dự và việc công, hóa khí là Quý. Thủ Mệnh thì quang minh lỗi lạc, hợp công chức, danh tiếng.',
  '武曲': 'Vũ Khúc là tài tinh, chủ cương nghị quả quyết, hóa khí là Tài. Thủ Mệnh thì giỏi quản lý tiền bạc, hợp sản xuất, tài chính.',
  '天同': 'Thiên Đồng là phúc tinh, chủ ôn hòa hưởng thụ, hóa khí là Phúc. Thủ Mệnh thì tính tình ôn hòa, có phúc khí.',
  '廉贞': 'Liêm Trinh là thứ đào hoa tinh, văn võ kiêm toàn, hóa khí là Tù. Thủ Mệnh thì đa tài đa nghệ, tình cảm phong phú.',
  '天府': 'Thiên Phủ là sao giữ kho của Nam đế, chủ vững vàng thận trọng, hóa khí là Lệnh. Thủ Mệnh thì phẩm hạnh đoan chính, giỏi giữ của.',
  '太阴': 'Thái Âm là sao phú quý của mặt trăng, chủ điền trạch phú quý, hóa khí là Phú. Thủ Mệnh thì tình cảm tinh tế, mệnh nữ tốt nhất.',
  '贪狼': 'Tham Lang là sao đào hoa dục vọng, đa tài, giỏi giao tiếp, hóa khí là Đào hoa. Thủ Mệnh thì nhiều tài nghệ, quan hệ rộng.',
  '巨门': 'Cự Môn là sao thị phi khẩu tài, chủ biện luận, truyền thông, hóa khí là Ám. Thủ Mệnh thì ăn nói giỏi, hợp luật sư, giáo viên.',
  '天相': 'Thiên Tướng là ấn tinh phò tá, chủ trung hậu thật thà, hóa khí là Ấn. Thủ Mệnh thì phẩm hạnh đoan chính, hợp hành chính, pháp vụ.',
  '天梁': 'Thiên Lương là lão nhân tinh, ấm tinh, giỏi gặp hung hóa cát, hóa khí là Ấm. Thủ Mệnh thì từ bi lương thiện, hợp pháp luật, y học.',
  '七杀': 'Thất Sát là tướng tinh, chủ cô độc, quả quyết, mạo hiểm, hóa khí là Túc sát. Thủ Mệnh thì cương nghị quả quyết, hợp quân đội, công an, khởi nghiệp.',
  '破军': 'Phá Quân là sao phá cũ đổi mới, chủ duyên lục thân mỏng, hóa khí là Hao. Thủ Mệnh thì khai sáng biến động, hợp chuyên môn kỹ thuật.',
};

/** 古籍元信息（书名、朝代、作者、简介），按 slug */
export const BOOK_VI: Record<string, { title: string; dynasty: string; author: string; intro: string }> = {
  quanshu: {
    title: 'Tử Vi Đẩu Số Toàn Thư',
    dynasty: 'Đời Minh',
    author: 'La Hồng Tiên biên soạn',
    intro: 'Cổ thư Tử Vi Đẩu Số có hệ thống nhất, nhấn mạnh quan hệ giữa mười hai cung và Tứ hóa. Là giáo trình chính của giới học Tử Vi từ đời Thanh trở đi.',
  },
  quanji: {
    title: 'Tử Vi Đẩu Số Toàn Tập',
    dynasty: 'Đời Minh',
    author: 'Tương truyền do tổ sư Trần Đoàn truyền lại',
    intro: 'Một trong những cổ thư Tử Vi Đẩu Số có thẩm quyền nhất, tương truyền do tổ sư Trần Đoàn đời Tống truyền dạy. Là nguồn dẫn chứng cốt lõi của hệ «Thiên Kỷ» Nghê Hải Hạ.',
  },
  gusuifu: {
    title: 'Cốt Tủy Phú',
    dynasty: 'Đời Minh',
    author: 'Truyền thừa cổ thư Tử Vi Đẩu Số (không rõ tác giả)',
    intro: 'Khẩu quyết cốt lõi cô đọng nhất của Tử Vi Đẩu Số, toàn văn khoảng 1.500 chữ. «Thiên Kỷ» của Nghê Hải Hạ nhiều lần dẫn bài phú này; là kinh điển bắt buộc phải đọc với người học Tử Vi.',
  },
};

/** 章节标题 / 副标题：中文原文 → 越南语 */
export const CHAPTER_TEXT_VI: Record<string, string> = {
  // 标题
  '十二宫论·命宫': 'Luận mười hai cung · cung Mệnh',
  '十二宫论·财帛宫': 'Luận mười hai cung · cung Tài Bạch',
  '十二宫论·官禄宫': 'Luận mười hai cung · cung Quan Lộc',
  '十二宫论·夫妻宫': 'Luận mười hai cung · cung Phu Thê',
  '四化论': 'Luận Tứ hóa',
  '机月同梁格': 'Cách Cơ Nguyệt Đồng Lương',
  '双禄朝垣格': 'Cách Song Lộc triều viên',
  '卷一·总论': 'Quyển 1 · Tổng luận',
  '卷二·紫微星论': 'Quyển 2 · Luận sao Tử Vi',
  '卷三·南斗六星论': 'Quyển 3 · Luận sáu sao Nam Đẩu',
  '卷四·北斗六星论': 'Quyển 4 · Luận sáu sao Bắc Đẩu',
  '卷五·四化与格局论': 'Quyển 5 · Luận Tứ hóa và cách cục',
  '总论篇': 'Thiên tổng luận',
  '紫微星论': 'Luận sao Tử Vi',
  '七杀星论': 'Luận sao Thất Sát',
  '杀破狼格': 'Cách Sát Phá Tham',
  '机月同梁': 'Cơ Nguyệt Đồng Lương',
  '四化星论': 'Luận sao Tứ hóa',
  '辅弼魁钺论': 'Luận Phụ Bật Khôi Việt',
  '六煞星论': 'Luận sáu sát tinh',
  '十二宫论': 'Luận mười hai cung',
  // 副标题
  '看命之根本': 'Gốc rễ của việc xem mệnh',
  '财源所在': 'Nơi có nguồn tài',
  '事业之根': 'Gốc của sự nghiệp',
  '配偶气场': 'Khí trường của người phối ngẫu',
  '化禄化权化科化忌': 'Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ',
  '稳定累积之命': 'Mệnh ổn định, tích lũy',
  '富比陶朱': 'Giàu sánh Đào Chu',
  '紫微斗数的基本立法': 'Phép lập căn bản của Tử Vi Đẩu Số',
  '帝座之尊': 'Sự tôn quý của ngôi đế',
  '天府、太阴、贪狼、巨门、天相、天梁': 'Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương',
  '紫微、天机、太阳、武曲、廉贞、破军': 'Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Liêm Trinh, Phá Quân',
  '四化之力与重要格局': 'Sức mạnh của Tứ hóa và các cách cục quan trọng',
  '紫微斗数的基本立论': 'Lập luận căn bản của Tử Vi Đẩu Số',
  '帝座之尊，得辅则贵': 'Ngôi đế tôn quý, được phò tá thì quý',
  '将星孤独，宜武职': 'Tướng tinh cô độc, hợp nghiệp võ',
  '开创闯荡，变动之命': 'Mệnh khai sáng, xông pha, biến động',
  '稳定累积，宜公职': 'Ổn định tích lũy, hợp công chức',
  '化禄化权化科化忌之吉凶': 'Cát hung của Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ',
  '六吉星之贵': 'Sự quý hiển của sáu cát tinh',
  '羊陀火铃空劫之凶': 'Cái hung của Dương, Đà, Hỏa, Linh, Không, Kiếp',
  '各宫主象与吉凶': 'Chủ tượng và cát hung của từng cung',
};

export const chapterVi = (zh: string) => CHAPTER_TEXT_VI[zh] ?? zh;
