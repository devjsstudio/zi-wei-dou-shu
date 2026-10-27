import { L, LocaleSwitch } from '@/components/LocaleProvider';

export const metadata = { title: 'Điều khoản dịch vụ · Lá Số Tử Vi', description: 'Điều khoản dịch vụ và thỏa thuận người dùng của Lá Số Tử Vi (紫微命盘服务条款)' };

const H2 = { fontSize: 18, marginTop: 32, marginBottom: 12 } as const;
const BOX = { background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 } as const;

const ZH = (
  <>
    <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>服务条款</h1>
    <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>最后更新：2026年4月</p>

    <h2 style={H2}>1. 服务概述</h2>
    <p>紫微命盘（以下简称"本平台"）基于倪海厦《天纪》紫微斗数体系提供命盘排盘与解读服务。本平台所有命理内容仅供参考，<strong>不构成任何医疗、投资、法律、心理咨询或人生重大决策建议</strong>。</p>

    <h2 style={H2}>2. 用户行为规范</h2>
    <p>使用本平台即表示您同意：</p>
    <ul style={{ paddingLeft: 24 }}>
      <li>仅出于合法、个人参考目的使用本平台</li>
      <li>不传播本平台内容用于商业销售、转载或公开发布</li>
      <li>不进行扰乱平台正常运行的行为</li>
      <li>提交的出生信息真实有效；本平台对错误信息导致的解读偏差不承担责任</li>
    </ul>

    <h2 style={H2}>3. 知识产权与禁止条款 · 反爬反训练</h2>
    <p style={BOX}>
      <strong>本平台所有命理内容、知识库（含 14 主星 × 12 宫 × 男女 × 四化 × 大限流年的全部解读文本）、UI 设计、算法整合方案、案例库均为本平台原创或经合法整理。</strong><br/><br/>
      严格禁止以下行为，违者保留追究民事赔偿与刑事责任的权利：<br/>
      ① 通过爬虫、自动化脚本、批量调用 API 等任何技术手段抓取本平台内容；<br/>
      ② 将本平台生成的命盘解读、文本、API 响应数据**用于训练任何机器学习模型**（含但不限于大语言模型、命理生成模型、文本生成模型等）；<br/>
      ③ 将本平台生成的内容转售、发布到其他网站、APP、自媒体账号；<br/>
      ④ 反编译、复制、修改本平台前端或后端代码并以"自营"方式提供同类服务。<br/><br/>
      本平台输出文本嵌入有指纹追溯水印，违规复制 / 训练所产生的输出可被检测追溯。一经发现违规，本平台有权要求 <strong>每例违约赔偿 100 万元人民币</strong>，并保留向法院提起诉讼及配合公安机关调查的权利。
    </p>

    <h2 style={H2}>4. 免责声明</h2>
    <p>本平台命理内容基于传统紫微斗数与倪海厦体系的知识整理，<strong>不保证 100% 准确</strong>。命运受天、地、人三才共同影响，本平台输出仅作为认识自我的参考，使用者应理性看待，不应过度依赖任何单一命理判断。</p>
    <p>因使用本平台内容产生的任何后果（包括但不限于决策失误、心理影响、关系变化等），本平台不承担法律责任。</p>

    <h2 style={H2}>5. 服务变更与终止</h2>
    <p>本平台保留随时调整、暂停或终止部分或全部服务的权利。重大变更将以站内公告或邮件方式通知用户。</p>

    <h2 style={H2}>6. 法律适用与争议解决</h2>
    <p>本条款适用中华人民共和国法律。若发生争议，双方应友好协商；协商不成的，提交本平台运营主体所在地有管辖权的人民法院诉讼解决。</p>

    <h2 style={H2}>7. 联系方式</h2>
    <p>如有疑问，请通过本平台公布的客服微信 / 邮箱联系。</p>
  </>
);

const VI = (
  <>
    <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Điều khoản dịch vụ</h1>
    <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 8 }}>Cập nhật lần cuối: tháng 4/2026</p>
    <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32, fontStyle: 'italic' }}>
      Đây là bản dịch tham khảo; bản tiếng Trung (chuyển sang 中文 ở góc trên) là bản gốc.
    </p>

    <h2 style={H2}>1. Tổng quan dịch vụ</h2>
    <p>Lá Số Tử Vi (sau đây gọi là "nền tảng") cung cấp dịch vụ lập và luận giải lá số dựa trên hệ thống Tử Vi Đẩu Số «Thiên Kỷ» của Nghê Hải Hạ. Mọi nội dung mệnh lý trên nền tảng chỉ để tham khảo, <strong>không cấu thành bất kỳ lời khuyên nào về y tế, đầu tư, pháp lý, tư vấn tâm lý hay các quyết định lớn trong đời</strong>.</p>

    <h2 style={H2}>2. Quy tắc ứng xử của người dùng</h2>
    <p>Khi sử dụng nền tảng, bạn đồng ý:</p>
    <ul style={{ paddingLeft: 24 }}>
      <li>Chỉ sử dụng nền tảng cho mục đích hợp pháp, tham khảo cá nhân</li>
      <li>Không phát tán nội dung của nền tảng để bán thương mại, đăng lại hoặc công bố công khai</li>
      <li>Không có hành vi gây rối hoạt động bình thường của nền tảng</li>
      <li>Thông tin ngày sinh cung cấp là chính xác; nền tảng không chịu trách nhiệm về sai lệch luận giải do thông tin sai</li>
    </ul>

    <h2 style={H2}>3. Sở hữu trí tuệ và điều khoản cấm · chống thu thập dữ liệu, chống huấn luyện</h2>
    <p style={BOX}>
      <strong>Toàn bộ nội dung mệnh lý, kho kiến thức (gồm toàn bộ văn bản luận giải 14 chính tinh × 12 cung × nam nữ × Tứ hóa × đại hạn lưu niên), thiết kế giao diện, phương án tích hợp thuật toán và kho ví dụ của nền tảng đều do nền tảng sáng tạo hoặc biên soạn hợp pháp.</strong><br/><br/>
      Nghiêm cấm các hành vi sau; nền tảng bảo lưu quyền truy cứu trách nhiệm bồi thường dân sự và trách nhiệm hình sự đối với người vi phạm:<br/>
      ① Thu thập nội dung của nền tảng bằng bất kỳ phương tiện kỹ thuật nào như crawler, script tự động, gọi API hàng loạt;<br/>
      ② Dùng nội dung luận giải lá số, văn bản, dữ liệu phản hồi API do nền tảng tạo ra <strong>để huấn luyện bất kỳ mô hình học máy nào</strong> (bao gồm nhưng không giới hạn ở mô hình ngôn ngữ lớn, mô hình sinh nội dung mệnh lý, mô hình sinh văn bản…);<br/>
      ③ Bán lại, đăng nội dung do nền tảng tạo ra lên các trang web, ứng dụng, tài khoản mạng xã hội khác;<br/>
      ④ Dịch ngược, sao chép, sửa đổi mã frontend hoặc backend của nền tảng để cung cấp dịch vụ tương tự dưới danh nghĩa "tự vận hành".<br/><br/>
      Văn bản đầu ra của nền tảng có gắn dấu vân tay truy vết; đầu ra phát sinh từ việc sao chép / huấn luyện trái phép có thể bị phát hiện và truy vết. Khi phát hiện vi phạm, nền tảng có quyền yêu cầu <strong>bồi thường 1 triệu nhân dân tệ cho mỗi trường hợp vi phạm</strong>, đồng thời bảo lưu quyền khởi kiện ra tòa và phối hợp điều tra với cơ quan công an.
    </p>

    <h2 style={H2}>4. Tuyên bố miễn trừ trách nhiệm</h2>
    <p>Nội dung mệnh lý của nền tảng được biên soạn từ kiến thức Tử Vi Đẩu Số truyền thống và hệ Nghê Hải Hạ, <strong>không bảo đảm chính xác 100%</strong>. Vận mệnh chịu ảnh hưởng chung của tam tài Thiên, Địa, Nhân; kết quả của nền tảng chỉ là tham khảo để hiểu bản thân, người dùng nên nhìn nhận lý trí, không nên quá phụ thuộc vào bất kỳ nhận định mệnh lý đơn lẻ nào.</p>
    <p>Nền tảng không chịu trách nhiệm pháp lý đối với bất kỳ hậu quả nào phát sinh từ việc sử dụng nội dung của nền tảng (bao gồm nhưng không giới hạn ở quyết định sai lầm, ảnh hưởng tâm lý, thay đổi trong các mối quan hệ…).</p>

    <h2 style={H2}>5. Thay đổi và chấm dứt dịch vụ</h2>
    <p>Nền tảng bảo lưu quyền điều chỉnh, tạm ngừng hoặc chấm dứt một phần hay toàn bộ dịch vụ vào bất kỳ lúc nào. Thay đổi quan trọng sẽ được thông báo cho người dùng qua thông báo trên trang hoặc email.</p>

    <h2 style={H2}>6. Luật áp dụng và giải quyết tranh chấp</h2>
    <p>Điều khoản này áp dụng pháp luật nước Cộng hòa Nhân dân Trung Hoa. Khi phát sinh tranh chấp, hai bên cần thương lượng thiện chí; nếu thương lượng không thành, tranh chấp được đưa ra tòa án nhân dân có thẩm quyền tại nơi đặt trụ sở của đơn vị vận hành nền tảng.</p>

    <h2 style={H2}>7. Thông tin liên hệ</h2>
    <p>Nếu có thắc mắc, vui lòng liên hệ qua WeChat / email hỗ trợ mà nền tảng đã công bố.</p>
  </>
);

export default function TermsPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span><L zh="返回首页" vi="Về trang chủ" /></span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}><L zh="紫微命盘" vi="Lá Số Tử Vi" /></span>
        <div style={{ flex: 1 }} />
        <LocaleSwitch />
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <L zh={ZH} vi={VI} />
        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}><L zh="隐私政策" vi="Chính sách quyền riêng tư" /></a> · <a href="/" style={{ color: 'var(--ac)' }}><L zh="返回首页" vi="Về trang chủ" /></a>
        </p>
      </main>
    </>
  );
}
