// Văn án giao diện (các thành phần liên quan trang lá số). Chỉ còn tiếng Việt.
// Thuật ngữ (tên sao, tên cung, can chi…) không đặt ở đây, xem ./terms-vi.ts.

export type Locale = 'vi';

const vi = {
  chartPage: {
    title: 'Lập lá số Tử Vi Đẩu Số',
    intro: 'Nhập ngày giờ sinh, bộ máy an sao mã nguồn mở sẽ lập lá số ngay lập tức.',
    introNote: '(Đây là trang demo của bộ máy an sao. Giao diện đầy đủ của bản thương mại không nằm trong phần mã nguồn mở; phần lõi an sao được mở hoàn toàn.)',
    restart: '← Lập lá số khác',
  },
  form: {
    heading: '── Nhập ngày giờ sinh ──',
    name: 'Họ tên (không bắt buộc)',
    namePlaceholder: 'Nhập họ tên',
    birthDate: 'Ngày sinh (dương lịch)',
    year: 'Năm',
    month: 'Tháng',
    day: 'Ngày',
    monthOption: (m: number) => `Tháng ${m}`,
    dayOption: (d: number) => `Ngày ${d}`,
    errYear: 'Vui lòng chọn năm sinh',
    errYearRange: 'Năm hợp lệ: 1900–2026',
    errMonth: 'Vui lòng chọn tháng',
    errDay: 'Vui lòng chọn ngày',
    errNoSuchDay: (m: number, d: number) => `Tháng ${m} không có ngày ${d}`,
    place: 'Nơi sinh (để hiệu chỉnh giờ mặt trời thực)',
    province: 'Tỉnh / thành phố',
    city: 'Tỉnh cũ / khu vực',
    pickProvinceFirst: 'Chọn tỉnh trước',
    pickCity: '(Chọn khu vực)',
    locationInfo: (lng: string, offset: string) => `Kinh độ ${lng}°E · lệch ${offset} phút`,
    placeHint: '* Chọn nơi sinh để tự hiệu chỉnh sang giờ mặt trời thực. Tỉnh theo đơn vị hành chính từ 7/2025; ô thứ hai là các tỉnh cũ đã sáp nhập.',
    birthTime: 'Giờ sinh (giờ Việt Nam, UTC+7)',
    hourOption: (h: string) => `${h} giờ`,
    minuteOption: (m: string) => `${m} phút`,
    trueSolar: 'Giờ mặt trời thực → ',
    shichen: (branch: string) => `Giờ ${branch}`,
    unknownTime: 'Không biết giờ sinh, lập lá số theo giờ Tý (23:00–01:00)',
    unknownTimeShort: 'Không rõ giờ',
    gender: 'Giới tính',
    male: 'Nam',
    female: 'Nữ',
    summaryDate: (y: number, m: number, d: number) => `${d}/${m}/${y}`,
    submitting: 'Đang lập lá số…',
    submit: 'Lập lá số ngay',
  },
  timeNav: {
    natal: 'Bản mệnh',
    daxian: 'Đại hạn',
    liunian: 'Lưu niên',
    overlayHead: (when: string, stem: string) => `${when} · Tứ hóa năm ${stem}:`,
    huaStar: (star: string, sh: string) => `${star} hóa ${sh}`,
  },
  board: {
    title: 'Lá số Tử Vi Đẩu Số',
    center: 'Tử Vi Đẩu Số',
    mingGong: 'Cung Mệnh',
    shenGong: 'Cung Thân',
    currentDaxian: 'Đại hạn hiện tại',
    ageRange: (a: number, b: number) => `${a}–${b} tuổi`,
    leap: 'nhuận ',
    legend: ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'] as [string, string, string, string],
    hint: 'Nhấn vào cung để xem tam phương tứ chính',
    overlayDaxian: 'ĐH',
    overlayLiunian: 'LN',
  },
  palace: {
    mingTag: 'Mệnh',
    shenTag: 'Thân',
    empty: 'Vô chính diệu',
  },
  insight: {
    topics: { overview: 'Mệnh cách', love: 'Tình cảm', career: 'Sự nghiệp', wealth: 'Tài vận', health: 'Sức khỏe', personality: 'Tính cách' },
    loading: 'Đang tạo luận giải…',
    header: 'Luận giải',
    placeholder: 'Hỏi tiếp, ví dụ: năm nay có nên đổi việc không?',
    send: 'Hỏi',
    apiMissing: 'Bản mã nguồn mở không có API luận giải AI (/api/interpret); bạn cần tự viết API này mới dùng được, xem phần «Bắt đầu nhanh» trong README. Riêng việc lập lá số không cần API key nào.',
    failed: 'Luận giải thất bại, vui lòng thử lại sau.',
    settings: 'Cấu hình AI',
    needKey: 'Chưa có API key. Nhấn ⚙ ở góc trên bên phải để nhập Anthropic API Key rồi bắt đầu luận giải (key chỉ lưu trong trình duyệt của bạn).',
  },
};

export type Messages = typeof vi;

export const MESSAGES: Record<Locale, Messages> = { vi };
