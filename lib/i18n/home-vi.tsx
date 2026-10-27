// 首页越南语文案（中文原文仍在 app/page.tsx 内，这里只放对应译文）。

export const FEATURES_VI = [
  {
    tag: 'Hệ thống an sao',
    title: 'Tử Vi Đẩu Số\nchính tông Nghê Hải Hạ',
    subtitle: 'Không phải bản giản lược, tuân thủ nghiêm ngặt truyền thừa của thầy Nghê Hải Hạ',
    points: [
      'Khởi cục theo Nạp âm Ngũ hành, không dùng các thuật toán giản lược trên mạng',
      'Cung Mệnh đếm nghịch đến giờ sinh, cung Thân đếm thuận đến giờ sinh, đúng quy tắc giảng dạy',
      'Mười bốn chính tinh và Tứ hóa phi tinh an theo phép gốc, cấu trúc đầy đủ, có thể kiểm chứng',
    ],
  },
  {
    tag: 'Trình bày lá số',
    title: 'Đủ 14 chính tinh\nTứ hóa phi tinh',
    subtitle: 'Cấu trúc rõ ràng, nhìn qua là thấy trục chính và trọng điểm',
    points: [
      'Mười bốn chính tinh nhập cung đầy đủ, quan hệ giữa các chính tinh rõ ràng, dễ đọc',
      'Phụ tinh và sát tinh hiển thị cùng lúc, không bỏ sót thông tin quan trọng',
      'Độ sáng Miếu, Vượng, Lợi, Hãm được phân cấp, nhận ra ngay sao mạnh hay yếu',
      'Nhấn vào bất kỳ chính tinh nào để xem lời giải chi tiết của thầy Nghê Hải Hạ về sao đó',
    ],
  },
  {
    tag: 'Luận giải AI',
    title: 'Giải lá số chuyên sâu\nkhông chỉ là tính toán',
    subtitle: 'Kho kiến thức hệ Nghê Hải Hạ × Claude AI',
    points: [
      'Phân tích mệnh cách: xuất phát từ chính tinh cung Mệnh, kết hợp tam phương tứ chính, đánh giá toàn diện tính cách và cục diện đời người',
      'Luận giải sáu phương diện: sự nghiệp, tình cảm hôn nhân, tài vận, sức khỏe, gia đình, duyên con cái',
      'Theo dõi đại hạn và lưu niên: trọng điểm của đại hạn 10 năm hiện tại, gợi ý cụ thể và đề xuất hành động cho cung lưu niên năm nay',
      'Hỏi tự do: đặt câu hỏi thẳng về lá số của bạn, như «Năm nay có nên đổi việc không?», «Khi nào vận hôn nhân tốt nhất?»',
    ],
  },
  {
    tag: 'Nhận diện cách cục',
    title: 'Tự động phát hiện\ncách cục lá số',
    subtitle: 'Tìm ra điều đã định sẵn từ tổ hợp các sao',
    points: [
      'Tự động nhận diện 11 cách cục kinh điển: Tử Phủ đồng cung, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Liêm Tướng, Vũ Khúc Thất Sát…',
      'Phát hiện chính xác các cách cục đặc biệt như Phụ Bật giáp Mệnh, Nhật Nguyệt giáp Mệnh, kèm lời giải chuẩn theo hệ Nghê Hải Hạ',
      'Tự động đánh dấu các trường hợp Tứ hóa nhập cung Mệnh, cung Thiên Di, nhắc những vấn đề đời người cần lưu ý',
      'Cách cục được xếp theo mức cát hung, giúp bạn thấy ngay ưu thế và thách thức trong lá số của mình',
    ],
  },
];

/** 4 大学习板块：按 key 对应 app/page.tsx 的 SECTIONS */
export const SECTIONS_VI: Record<string, { name: string; desc: string; when: string; note: string }> = {
  ziwei:  { name: 'Tử Vi',   desc: '14 chính tinh · 13 cung · luận giải AI', when: 'Tháng 5', note: '' },
  tianji: { name: 'Thiên Kỷ', desc: 'Tử Vi · Chu Dịch · Kỳ Môn Độn Giáp', when: 'Tháng 6', note: '' },
  diji:   { name: 'Địa Kỷ',  desc: 'Sự nghiệp dang dở của thầy Nghê · hậu bối chú giải', when: 'Tháng 6', note: 'Nghiên cứu di cảo' },
  renji:  { name: 'Nhân Kỷ', desc: 'Nội Kinh · Thương Hàn · Kim Quỹ · Châm cứu', when: 'Tháng 7', note: '' },
};

export const NI_TEACHINGS_VI = [
  {
    title: 'Cung Mệnh là gốc, tam phương là dụng',
    body: 'Thầy Nghê luôn nhấn mạnh: xem mệnh trước hết phải xem cung Mệnh. Chính tinh cung Mệnh quyết định cục diện cơ bản và tính cách bẩm sinh của một người, còn tam phương (Tài Bạch, Quan Lộc, Thiên Di) quyết định «đất dụng võ» của người đó. Bốn cung liên động mới là bức tranh đời người hoàn chỉnh.',
  },
  {
    title: 'Mượn sao cung đối, không thể bỏ qua',
    body: 'Điểm độc đáo của thầy Nghê là coi trọng «cung đối». Cung nào vô chính diệu đều phải mượn sao ở cung đối để luận đoán; đối diện cung Mệnh là cung Thiên Di, hai cung ảnh hưởng lẫn nhau — đây là điểm then chốt mà nhiều người mới học dễ bỏ sót.',
  },
  {
    title: 'Tứ hóa mới là bàn tay của vận mệnh',
    body: 'Sao chỉ là nền tảng, Tứ hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) mới là then chốt quyết định vận thế tốt xấu. Cùng một sao, gặp Hóa Lộc hay Hóa Kỵ thì quỹ đạo đời người có thể hoàn toàn khác nhau. Thầy Nghê nhắc đi nhắc lại: không xem Tứ hóa thì mới giải được một nửa lá số.',
  },
  {
    title: 'Đại hạn mười năm, vận thế có nhịp',
    body: 'Thầy Nghê chia đời người thành 12 đại hạn, mỗi đại hạn 10 năm. Ông cho rằng ở mỗi cung đại hạn, cảnh ngộ của con người hoàn toàn khác nhau. Biết mình đang đi đại hạn nào, cung đó có những sao gì, mới thật sự nắm được vận thế hiện tại.',
  },
];

/** 四化简介：key 与 app/page.tsx 的 SIHUA_BRIEF 相同 */
export const SIHUA_BRIEF_VI: Record<string, { attr: string; brief: string }> = {
  '化禄': { attr: 'Cát hóa · tăng ích', brief: 'Phúc tinh đến cung, chủ tài vận và phúc khí tăng thêm. Sự việc ở cung đó thuận lợi, năng lực được tăng cường; là hóa tinh được ưa chuộng nhất trên lá số.' },
  '化权': { attr: 'Cát hóa · uy quyền', brief: 'Quyền tinh đến cung, chủ khả năng nắm quyền và lãnh đạo. Cung đó mạnh mẽ, quyết đoán; thích nhập cung Quan Lộc và cung Mệnh, chủ thực quyền trong sự nghiệp.' },
  '化科': { attr: 'Cát hóa · danh dự', brief: 'Khoa danh tinh đến cung, chủ thanh danh và duyên quý nhân. Cung đó chủ văn danh và vận thi cử, có quý nhân nâng đỡ; hợp học thuật, thi cử và nơi công chúng.' },
  '化忌': { attr: 'Hung hóa · trở ngại', brief: 'Kiếp số tinh đến cung, chủ chấp niệm và trở ngại. Cung đó cần đặc biệt lưu ý; bài học đời người của cung này sẽ trở thành thử thách quan trọng.' },
};

/** 主星简介：key 与 app/page.tsx 的 STAR_BRIEF 相同 */
export const STAR_BRIEF_VI: Record<string, { attr: string; brief: string }> = {
  '紫微': { attr: 'Thổ · Đế tinh', brief: 'Quý tinh thiên hoàng, thống lĩnh các sao. Người Tử Vi thủ Mệnh có khí chất cô ngạo, chủ uy quyền hiển đạt, bẩm sinh có tố chất lãnh đạo, hợp vị trí tự mình gánh vác một phương.' },
  '天机': { attr: 'Mộc · Trí tuệ tinh', brief: 'Ích thọ tinh, chủ mưu trí và biến động. Thông minh lanh lợi, giỏi trù tính, tâm tư tinh tế; hợp công việc hoạch định, tư vấn, kỹ thuật.' },
  '太阳': { attr: 'Hỏa · Chủ Quan Lộc', brief: 'Chủ tinh Quan Lộc, chủ danh tiếng và uy vọng. Rộng rãi hào phóng, coi trọng hình ảnh trước công chúng, lợi cho quan trường và công chức; mệnh nam lực mạnh, nhập miếu thì quang minh lỗi lạc.' },
  '武曲': { attr: 'Kim · Chủ Tài Bạch', brief: 'Chủ tinh Tài Bạch, chủ tài chính và quyết đoán. Ý chí kiên định, hành động quả cảm; hợp nghề tài chính, ngân hàng, quân đội, công an; là sao cô khắc, lợi kết hôn muộn.' },
  '天同': { attr: 'Thủy · Phúc tinh', brief: 'Chủ tinh Phúc Đức, chủ hưởng thụ và nhân duyên. Tính tình ôn hòa, rất được lòng người, chú trọng chất lượng cuộc sống, tình cảm tinh tế, hậu vận tốt.' },
  '廉贞': { attr: 'Hỏa · Tài nghệ tinh', brief: 'Thứ đào hoa tinh, chủ tài nghệ và tình dục. Tài hoa xuất chúng, tình cảm phong phú; hợp nghệ thuật, chính trường; đa tài đa nghệ nhưng cần đề phòng thị phi đào hoa.' },
  '天府': { attr: 'Thổ · Tài khố tinh', brief: 'Chủ tinh Nam Đẩu, chủ kho tiền và tích lũy. Vững vàng, thận trọng, giỏi quản lý tiền bạc; là lực lượng ổn định của lá số, hợp quản lý tài chính và hành chính.' },
  '太阴': { attr: 'Thủy · Chủ Điền Trạch', brief: 'Chủ tinh Điền Trạch, chủ tài sản và sự nhu hòa. Tinh tế dịu dàng, cảm nhận nhạy bén, mệnh nữ càng tốt; lợi bất động sản và tích lũy, hợp văn nghệ hoặc ngành dịch vụ.' },
  '贪狼': { attr: 'Mộc Thủy · Đào hoa', brief: 'Đào hoa tinh, chủ dục vọng và tài nghệ. Đa tài đa nghệ, dục vọng mạnh, giao tiếp năng động; hợp nghệ thuật, quan hệ công chúng, kinh doanh; nhân duyên rất tốt.' },
  '巨门': { attr: 'Thủy · Thị phi tinh', brief: 'Ám tinh, chủ khẩu tài và thị phi. Ăn nói xuất sắc, tư duy biện luận mạnh; hợp luật sư, giáo dục, truyền thông; cần chú ý thị phi miệng lưỡi, lập thân bằng tài biện luận.' },
  '天相': { attr: 'Thủy · Ấn tinh', brief: 'Ấn tinh, chủ phò tá và ấn thụ. Giỏi điều phối, trọng lễ tiết, chính trực, tuân thủ pháp luật; hợp làm tham mưu, hành chính, pháp luật; vận quý nhân tốt.' },
  '天梁': { attr: 'Thổ · Ấm tinh', brief: 'Ấm tinh, chủ sự lão luyện và che chở. Chính trực vững vàng, lòng từ bi lớn, được trời phù hộ; hợp y tế, công tác xã hội, tôn giáo.' },
  '七杀': { attr: 'Kim Hỏa · Tướng tinh', brief: 'Tướng tinh, chủ cương liệt và khai sáng. Tính cách cương nghị, hành động mạnh mẽ, dám đương đầu thử thách; hợp khởi nghiệp, quân đội, công an, ngành cạnh tranh; gặp hung hóa cát.' },
  '破军': { attr: 'Thủy · Hao tinh', brief: 'Hao tinh, chủ biến động và khai phá. Dám đột phá, không ngại thay đổi; cả đời nhiều biến động nhưng có khí phách; hợp công việc khai phá, đi con đường người khác chưa đi.' },
};

/** 天·地·人：顺序与 app/page.tsx 相同 */
export const THREE_VI = [
  {
    glyph: 'Thiên', label: 'Vận mệnh tiên thiên', sub: 'Lá số · sao · ngũ hành',
    desc: 'Điều Tử Vi Đẩu Số tiết lộ là cục diện lá số tiên thiên của một người — sự phân bố các sao, cục ngũ hành, chính tinh cung Mệnh do thời điểm sinh quyết định. Đây chỉ là một phần ba vận mệnh, là nền của đời người chứ không phải toàn cảnh.',
  },
  {
    glyph: 'Địa', label: 'Môi trường địa lý', sub: 'Vùng đất · phong thủy · môi trường',
    desc: 'Môi trường địa lý nơi bạn sống, thành phố, quốc gia, cục diện phong thủy, cho đến hoàn cảnh gia đình và cấu trúc xã hội, cùng tạo nên phương diện thứ hai của vận mệnh. Cùng một lá số, sinh ở nơi khác nhau, cảnh ngộ có thể khác nhau một trời một vực.',
  },
  {
    glyph: 'Nhân', label: 'Lòng người, ý niệm', sub: 'Ý chí · lựa chọn · hành động',
    desc: 'Ý chí, tâm thái, lựa chọn và hành động của mỗi người mới là sức mạnh chủ động nhất để thay đổi vận mệnh. Thầy Nghê nhấn mạnh: hiểu lá số là để sống tốt hơn, chứ không phải ngồi chờ số phận an bài. Không ngừng tu dưỡng bản thân là cách phá cục mạnh nhất.',
  },
];

/** 倪海厦生平段落（带强调格式，需要主题金色） */
export function NiBioVi({ gold }: { gold: string }) {
  return (
    <>
      <p>
        <strong style={{ color: gold }}>Tiểu sử</strong>: Thầy Nghê Hải Hạ (1954–2012) sinh ra ở Đài Loan, thuở trẻ theo học nhiều danh y Trung y, chuyên nghiên cứu phái Kinh phương (truyền thừa «Thương Hàn Luận»).
        Tuổi trung niên sang Mỹ hành nghề y, sáng lập <strong>Học viện Trung y Hán Đường</strong> tại Mỹ, hơn hai mươi năm giảng dạy có hệ thống Trung y và thuật số truyền thống.
        Ngày 31/1/2012, ông qua đời tại Đài Loan vì ung thư gan, hưởng thọ 58 tuổi.
      </p>
      <p>
        <strong style={{ color: gold }}>Hệ thống giảng dạy</strong>: Thầy Nghê hệ thống hóa sở học cả đời thành hai loạt bài giảng công khai.
        <strong> «Nhân Kỷ»</strong> gồm «Châm Cứu Đại Thành», «Thần Nông Bản Thảo Kinh», «Hoàng Đế Nội Kinh», «Thương Hàn Luận», «Kim Quỹ Yếu Lược» —
        đây là «kỷ của con người», đặt nền con đường học Trung y hoàn chỉnh;
        <strong> «Thiên Kỷ»</strong> gồm Tử Vi Đẩu Số và «Kinh Dịch» — đây là «kỷ của trời», thành quả hệ thống hóa việc nghiên cứu thuật số.
        Hai phần hợp lại là di sản truyền thừa đầy đủ nhất thầy Nghê để lại cho đời sau.
      </p>
      <p>
        <strong style={{ color: gold }}>Lập trường Tử Vi</strong>: Về Tử Vi Đẩu Số, thầy Nghê rõ ràng thuộc <strong>Nam phái Tam Hợp</strong>, chủ trương «lấy cung Mệnh làm gốc, tam phương tứ chính làm dụng, Tứ hóa làm cương lĩnh».
        Trong khóa «Thiên Kỷ», ông nói thẳng: «<em>phi tinh (Tứ hóa) bay tới bay lui quá phức tạp, không theo lối đó, dù sao đại đạo vốn giản dị</em>» —
        lập trường này phân biệt rõ ông với phái Phi Tinh rườm rà.
      </p>
      <p>
        <strong style={{ color: gold }}>Thái độ học thuật</strong>: Thầy Nghê phản đối học thuộc lòng khẩu quyết, nhấn mạnh «hiểu nguyên lý hơn học thuộc», «logic kiểm chứng được hơn huyền học thần bí».
        Thái độ này đưa Tử Vi Đẩu Số từ một hệ thống khép kín truyền riêng thầy trò thành hệ thống tri thức hiện đại, có hệ thống, kiểm chứng được và học được.
      </p>
      <p>
        <strong style={{ color: gold }}>Ảnh hưởng ngày nay</strong>: Video bài giảng của thầy Nghê lan truyền rộng rãi trên Bilibili, YouTube và các nền tảng lớn, được thế hệ mới yêu mệnh lý và Trung y xem là bài nhập môn bắt buộc.
        Ông không chỉ là người truyền thừa Tử Vi Đẩu Số, mà còn là một trong những nhân vật then chốt đưa mệnh lý truyền thống và Trung y vào hệ thống tri thức hiện đại.
      </p>
    </>
  );
}
