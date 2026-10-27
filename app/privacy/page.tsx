import { L, LocaleSwitch } from '@/components/LocaleProvider';

export const metadata = { title: 'Chính sách quyền riêng tư · Lá Số Tử Vi', description: 'Chính sách quyền riêng tư của Lá Số Tử Vi (紫微命盘隐私政策)' };

const H2 = { fontSize: 18, marginTop: 32, marginBottom: 12 } as const;

const ZH = (
  <>
    <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>隐私政策</h1>
    <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>最后更新：2026年4月</p>

    <h2 style={H2}>1. 我们收集的信息</h2>
    <p>为提供紫微命盘排盘与解读服务，我们可能收集以下信息：</p>
    <ul style={{ paddingLeft: 24 }}>
      <li><strong>命盘必要信息</strong>：姓名（选填）、出生公历年月日、出生时辰、性别、出生地经度</li>
      <li><strong>账号信息（注册后）</strong>：手机号（用于短信验证与会员服务）</li>
      <li><strong>交互信息</strong>：你在站内的点击、浏览、命盘历史记录</li>
      <li><strong>反馈信息</strong>：你对解读内容的"准 / 不准"打分与文字反馈</li>
      <li><strong>支付信息</strong>：购买会员或单项服务时通过第三方支付（支付宝 / 微信支付）处理，本平台不存储完整卡号或密码</li>
    </ul>

    <h2 style={H2}>2. 我们如何使用信息</h2>
    <ul style={{ paddingLeft: 24 }}>
      <li>命盘信息仅用于本次解读与你账号下的历史命盘记录</li>
      <li>手机号用于注册、登录、订单通知</li>
      <li>反馈信息用于持续改进命理内容质量（脱敏后聚合分析）</li>
      <li>聚合数据可能用于行业研究与平台优化</li>
    </ul>

    <h2 style={H2}>3. 信息共享与第三方</h2>
    <p>除以下情形外，我们不会向第三方共享你的个人信息：</p>
    <ul style={{ paddingLeft: 24 }}>
      <li>支付服务商（支付宝 / 微信支付）：处理订单结算</li>
      <li>短信服务商（如阿里云短信）：发送验证码</li>
      <li>云服务商（如 Vercel / Cloudflare / 阿里云）：技术承载</li>
      <li>AI 解读服务（如 Anthropic Claude）：处理你的"自由追问"对话（已做匿名化）</li>
      <li>司法机关或政府部门基于法律法规的合法要求</li>
    </ul>

    <h2 style={H2}>4. 信息安全</h2>
    <p>我们采取业界常见的技术与管理手段保护你的信息（HTTPS 传输加密、数据库加密存储、访问权限控制等）。但请注意，互联网传输无法保证 100% 安全。</p>

    <h2 style={H2}>5. 你的权利</h2>
    <ul style={{ paddingLeft: 24 }}>
      <li><strong>查询</strong>：可通过账号中心查看你的所有历史命盘与订单</li>
      <li><strong>删除</strong>：联系客服删除账号下指定命盘 / 注销账号</li>
      <li><strong>导出</strong>：可申请导出你的全部个人数据</li>
    </ul>

    <h2 style={H2}>6. Cookie 与本地存储</h2>
    <p>本站使用 cookie / localStorage 用于：保存你的暗黑/亮色主题偏好、最近的命盘历史、会员登录状态。你可在浏览器设置中关闭，但部分功能可能受影响。</p>

    <h2 style={H2}>7. 未成年人</h2>
    <p>本平台命理内容面向 18 岁以上成年用户。未成年人请在监护人同意下使用，并不得将解读用于重大人生决策。</p>

    <h2 style={H2}>8. 政策变更</h2>
    <p>本政策可能不定期更新。重大变更将以显著方式通知。继续使用即表示同意更新后的版本。</p>
  </>
);

const VI = (
  <>
    <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Chính sách quyền riêng tư</h1>
    <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 8 }}>Cập nhật lần cuối: tháng 4/2026</p>
    <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32, fontStyle: 'italic' }}>
      Đây là bản dịch tham khảo; bản tiếng Trung (chuyển sang 中文 ở góc trên) là bản gốc.
    </p>

    <h2 style={H2}>1. Thông tin chúng tôi thu thập</h2>
    <p>Để cung cấp dịch vụ lập và luận giải lá số Tử Vi, chúng tôi có thể thu thập các thông tin sau:</p>
    <ul style={{ paddingLeft: 24 }}>
      <li><strong>Thông tin cần cho lá số</strong>: họ tên (không bắt buộc), ngày tháng năm sinh dương lịch, giờ sinh, giới tính, kinh độ nơi sinh</li>
      <li><strong>Thông tin tài khoản (sau khi đăng ký)</strong>: số điện thoại (dùng để xác minh qua SMS và cho dịch vụ thành viên)</li>
      <li><strong>Thông tin tương tác</strong>: lượt nhấp, lượt xem và lịch sử lá số của bạn trên trang</li>
      <li><strong>Thông tin phản hồi</strong>: đánh giá "đúng / không đúng" và phản hồi bằng chữ của bạn về nội dung luận giải</li>
      <li><strong>Thông tin thanh toán</strong>: khi mua gói thành viên hoặc dịch vụ lẻ, việc thanh toán do bên thứ ba (Alipay / WeChat Pay) xử lý; nền tảng không lưu số thẻ đầy đủ hay mật khẩu</li>
    </ul>

    <h2 style={H2}>2. Chúng tôi sử dụng thông tin như thế nào</h2>
    <ul style={{ paddingLeft: 24 }}>
      <li>Thông tin lá số chỉ dùng cho lần luận giải này và lịch sử lá số trong tài khoản của bạn</li>
      <li>Số điện thoại dùng để đăng ký, đăng nhập và thông báo đơn hàng</li>
      <li>Thông tin phản hồi dùng để liên tục cải thiện chất lượng nội dung mệnh lý (phân tích tổng hợp sau khi ẩn danh)</li>
      <li>Dữ liệu tổng hợp có thể được dùng cho nghiên cứu ngành và tối ưu nền tảng</li>
    </ul>

    <h2 style={H2}>3. Chia sẻ thông tin và bên thứ ba</h2>
    <p>Ngoài các trường hợp dưới đây, chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba:</p>
    <ul style={{ paddingLeft: 24 }}>
      <li>Nhà cung cấp dịch vụ thanh toán (Alipay / WeChat Pay): xử lý thanh toán đơn hàng</li>
      <li>Nhà cung cấp dịch vụ SMS (như Alibaba Cloud SMS): gửi mã xác minh</li>
      <li>Nhà cung cấp dịch vụ đám mây (như Vercel / Cloudflare / Alibaba Cloud): hạ tầng kỹ thuật</li>
      <li>Dịch vụ luận giải AI (như Anthropic Claude): xử lý các cuộc hội thoại "hỏi tự do" của bạn (đã ẩn danh)</li>
      <li>Yêu cầu hợp pháp của cơ quan tư pháp hoặc cơ quan nhà nước theo quy định pháp luật</li>
    </ul>

    <h2 style={H2}>4. Bảo mật thông tin</h2>
    <p>Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phổ biến trong ngành để bảo vệ thông tin của bạn (mã hóa truyền tải HTTPS, lưu trữ mã hóa trong cơ sở dữ liệu, kiểm soát quyền truy cập…). Tuy nhiên, xin lưu ý rằng truyền tải qua Internet không thể bảo đảm an toàn 100%.</p>

    <h2 style={H2}>5. Quyền của bạn</h2>
    <ul style={{ paddingLeft: 24 }}>
      <li><strong>Tra cứu</strong>: xem toàn bộ lịch sử lá số và đơn hàng của bạn trong trung tâm tài khoản</li>
      <li><strong>Xóa</strong>: liên hệ bộ phận hỗ trợ để xóa lá số cụ thể trong tài khoản hoặc hủy tài khoản</li>
      <li><strong>Xuất dữ liệu</strong>: có thể yêu cầu xuất toàn bộ dữ liệu cá nhân của bạn</li>
    </ul>

    <h2 style={H2}>6. Cookie và lưu trữ cục bộ</h2>
    <p>Trang dùng cookie / localStorage để: lưu lựa chọn giao diện tối/sáng, ngôn ngữ, lịch sử lá số gần đây và trạng thái đăng nhập thành viên của bạn. Bạn có thể tắt trong cài đặt trình duyệt, nhưng một số tính năng có thể bị ảnh hưởng.</p>

    <h2 style={H2}>7. Người chưa thành niên</h2>
    <p>Nội dung mệnh lý của nền tảng dành cho người dùng từ 18 tuổi trở lên. Người chưa thành niên cần có sự đồng ý của người giám hộ khi sử dụng, và không được dùng nội dung luận giải cho các quyết định lớn trong đời.</p>

    <h2 style={H2}>8. Thay đổi chính sách</h2>
    <p>Chính sách này có thể được cập nhật không định kỳ. Thay đổi quan trọng sẽ được thông báo rõ ràng. Việc tiếp tục sử dụng đồng nghĩa với việc bạn đồng ý với phiên bản đã cập nhật.</p>
  </>
);

export default function PrivacyPage() {
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
          <a href="/terms" style={{ color: 'var(--ac)' }}><L zh="服务条款" vi="Điều khoản dịch vụ" /></a> · <a href="/" style={{ color: 'var(--ac)' }}><L zh="返回首页" vi="Về trang chủ" /></a>
        </p>
      </main>
    </>
  );
}
