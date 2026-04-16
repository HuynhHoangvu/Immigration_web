import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Thông tin chúng tôi thu thập",
    content: `Khi bạn sử dụng dịch vụ của Fly Labour, chúng tôi có thể thu thập các loại thông tin sau:

• **Thông tin cá nhân:** Họ tên, ngày sinh, địa chỉ, số điện thoại, email, ảnh chân dung
• **Thông tin hồ sơ nghề nghiệp:** Kinh nghiệm làm việc, trình độ học vấn, chứng chỉ, CV
• **Thông tin giấy tờ pháp lý:** Số CCCD/CMND, hộ chiếu (chỉ dùng cho mục đích xử lý hồ sơ)
• **Thông tin kỹ thuật:** Địa chỉ IP, loại trình duyệt, thời gian truy cập (thống kê ẩn danh)`,
  },
  {
    title: "2. Mục đích sử dụng thông tin",
    content: `Thông tin của bạn được sử dụng cho các mục đích sau:

• Kết nối bạn với nhà tuyển dụng phù hợp ở nước ngoài
• Xử lý hồ sơ visa và giấy tờ pháp lý theo yêu cầu
• Liên lạc và hỗ trợ trong suốt quá trình đăng ký
• Gửi thông báo về cơ hội việc làm mới (nếu bạn đồng ý)
• Cải thiện chất lượng dịch vụ của chúng tôi`,
  },
  {
    title: "3. Chia sẻ thông tin với bên thứ ba",
    content: `Chúng tôi **không bán** thông tin cá nhân của bạn cho bất kỳ bên nào. Thông tin chỉ được chia sẻ trong các trường hợp:

• **Nhà tuyển dụng đối tác:** Chỉ chia sẻ thông tin cần thiết để xem xét ứng tuyển, với sự đồng ý của bạn
• **Cơ quan nhà nước:** Khi có yêu cầu hợp pháp từ cơ quan chức năng Việt Nam hoặc nước ngoài
• **Đơn vị dịch vụ:** Công ty dịch thuật, y tế, vận tải phục vụ cho hồ sơ của bạn (có ràng buộc bảo mật)`,
  },
  {
    title: "4. Bảo mật thông tin",
    content: `Fly Labour áp dụng các biện pháp bảo mật nghiêm ngặt:

• Mã hóa SSL/TLS cho toàn bộ dữ liệu truyền tải
• Kiểm soát quyền truy cập nội bộ theo cấp bậc
• Hệ thống lưu trữ được bảo vệ và sao lưu định kỳ
• Nhân viên được đào tạo về bảo mật thông tin
• Không lưu trữ mật khẩu dưới dạng văn bản thô`,
  },
  {
    title: "5. Quyền của bạn",
    content: `Bạn có đầy đủ các quyền sau đối với thông tin cá nhân của mình:

• **Quyền truy cập:** Yêu cầu xem thông tin chúng tôi đang lưu giữ về bạn
• **Quyền chỉnh sửa:** Cập nhật hoặc sửa thông tin không chính xác
• **Quyền xóa:** Yêu cầu xóa tài khoản và dữ liệu (trừ trường hợp pháp luật yêu cầu lưu giữ)
• **Quyền phản đối:** Từ chối nhận thông tin tiếp thị bất cứ lúc nào
• **Quyền khiếu nại:** Gửi khiếu nại đến chúng tôi hoặc cơ quan bảo vệ dữ liệu có thẩm quyền`,
  },
  {
    title: "6. Cookie & Dữ liệu phiên",
    content: `Website sử dụng cookie để:

• Duy trì trạng thái đăng nhập của bạn
• Ghi nhớ tùy chọn ngôn ngữ
• Phân tích lưu lượng truy cập (Google Analytics — dữ liệu ẩn danh)

Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng của website có thể bị ảnh hưởng.`,
  },
  {
    title: "7. Thời gian lưu trữ dữ liệu",
    content: `• Tài khoản đang hoạt động: Dữ liệu được lưu suốt thời gian sử dụng dịch vụ
• Sau khi xóa tài khoản: Dữ liệu được xóa trong vòng 30 ngày (trừ dữ liệu cần lưu theo pháp luật)
• Hồ sơ đã nộp: Lưu tối đa 3 năm phục vụ mục đích pháp lý và giải quyết tranh chấp`,
  },
  {
    title: "8. Liên hệ về bảo mật",
    content: `Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:

• **Email:** privacy@flylabour.com
• **Điện thoại:** 0901 234 567
• **Địa chỉ:** 219A Nơ Trang Long, P.12, Q. Bình Thạnh, TP.HCM

Chúng tôi cam kết phản hồi trong vòng 5 ngày làm việc.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Shield size={40} className="text-amber-500 dark:text-brand-gold mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Chính sách Bảo mật
          </h1>
          <p className="text-slate-500 dark:text-gray-300">Cập nhật lần cuối: 01/01/2025</p>
          <p className="text-slate-600 dark:text-gray-300 text-sm mt-3 max-w-xl mx-auto">
            Fly Labour cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Trang này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {SECTIONS.map((s) => (
            <div
              key={s.title}
              className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-2xl p-6 transition-colors"
            >
              <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-4">{s.title}</h2>
              <div className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {s.content.split("\n").map((line, i) => {
                  if (line.startsWith("• **")) {
                    const parts = line.replace("• **", "").split(":**");
                    return (
                      <p key={i} className="flex gap-2 mt-2">
                        <span className="text-amber-500 dark:text-brand-gold shrink-0">•</span>
                        <span>
                          <strong className="text-slate-900 dark:text-white">{parts[0]}:</strong>
                          {parts[1]}
                        </span>
                      </p>
                    );
                  }
                  if (line.startsWith("• ")) {
                    return (
                      <p key={i} className="flex gap-2 mt-2">
                        <span className="text-amber-500 dark:text-brand-gold shrink-0">•</span>
                        <span>{line.slice(2)}</span>
                      </p>
                    );
                  }
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className="font-semibold text-slate-900 dark:text-white mt-2">
                        {line.slice(2, -2)}
                      </p>
                    );
                  }
                  return line ? <p key={i} className="mt-1">{line}</p> : <br key={i} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-12 px-6 border-t border-slate-200 dark:border-brand-border bg-slate-100/50 dark:bg-brand-card/20 transition-colors text-center">
        <p className="text-slate-600 dark:text-gray-300 text-sm mb-4">
          Có câu hỏi về chính sách bảo mật?
        </p>
        <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
          Liên hệ chúng tôi
        </Link>
      </div>
    </div>
  );
}
