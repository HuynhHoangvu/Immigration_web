import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { settingsApi } from "@/services/api";

interface Policy {
  slug: string;
  title: string;
  displayInFooter: boolean;
  content: string;
  order: number;
}

const defaultContent: Record<string, string> = {
  "terms-of-service": `# Điều khoản Sử dụng Dịch Vụ Fly Labour

Cập nhật lần cuối: 01/01/2025

## 1. Giới thiệu

Flyabour là nền tảng kết nối lao động quốc tế, cung cấp dịch vụ tuyển dụng và hỗ trợ người lao động Việt Nam tìm kiếm việc làm tại các nước như Úc, Canada, New Zealand.

Bằng cách truy cập hoặc sử dụng website/ứng dụng của chúng tôi, bạn đồng ý tuân thủ các điều khoản này.

## 2. Cam K承Đáp

Fly Labour cam kết:
- Cung cấp thông tin tuyển dụng chính xác, minh bạch
- Bảo vệ thông tin cá nhân và quyền lợi của người sử dụng
- Xử lý mọi tranh chấp một cách công bằng

## 3. Trách Nhiệm Của Người Dùng

Bạn đồng ý:
- Cung cấp thông tin chính xác khi đăng ký tài khoản
- Không sử dụng dịch vụ cho mục đích bất hợp pháp
- Tuân thủ luật pháp của các nước có liên quan

## 4. Giới Hạn Trách Nhiệm

Fly Labour không chịu trách nhiệm về:
- Chất lượng dịch vụ của nhà tuyển dụng
- Quyết định tuyển dụng của nhà tuyển dụng
- Các tranh chấp lao động sau khi kí hợp đồng

## 5. Hủy Bỏ Tài Khoản

Bạn có quyền yêu cầu hủy bỏ tài khoản bất cứ lúc nào bằng cách liên hệ admin@flylabour.com.`,
  "privacy-policy": `# Chính Sách Bảo Mật

Cập nhật lần cuối: 01/01/2025

## 1. Thông Tin Chúng Tôi Thu Thập

Khi sử dụng dịch vụ, chúng tôi thu thập:
- Thông tin cá nhân: Họ tên, ngày sinh, địa chỉ, email, số điện thoại
- Thông tin hồ sơ: CV, kinh nghiệm, bằng cấp
- Thông tin thanh toán (nếu có)
- Dữ liệu sử dụng: Log truy cập, địa chỉ IP

## 2. Cách Chúng Tôi Sử Dụng Dữ Liệu

Dữ liệu được sử dụng cho:
- Xử lý đơn ứng tuyển
- Giúp bạn tìm việc phù hợp
- Cải thiện dịch vụ
- Tuân thủ pháp luật

## 3. Bảo Vệ Dữ Liệu

Chúng tôi sử dụng:
- Mã hóa SSL
- Firewall bảo vệ
- Kiểm tra bảo mật định kỳ

## 4. Chia Sẻ Dữ Liệu

Thông tin chỉ được chia sẻ với:
- Nhà tuyển dụng (khi bạn nộp đơn)
- Đối tác thanh toán (nếu cần)
- Cơ quan pháp luật (khi yêu cầu)

## 5. Quyền Của Bạn

Bạn có quyền:
- Truy cập dữ liệu của mình
- Yêu cầu chỉnh sửa
- Yêu cầu xóa dữ liệu
- Phản đối xử lý dữ liệu`,
  "return-policy": `# Chính Sách Hoàn Tiền

Cập nhật lần cuối: 01/01/2025

## 1. Điều Kiện Hoàn Tiền

Bạn có thể yêu cầu hoàn tiền trong 30 ngày nếu:
- Dịch vụ không được cung cấp như quảng cáo
- Xảy ra lỗi kỹ thuật từ phía Fly Labour

## 2. Quy Trình Yêu Cầu

1. Liên hệ support@flylabour.com
2. Cung cấp chứng cứ
3. Chúng tôi xem xét trong 5-7 ngày làm việc
4. Hoàn tiền qua phương thức thanh toán gốc

## 3. Các Trường Hợp Không Hoàn Tiền

Không hoàn tiền nếu:
- Bạn từ chối việc làm
- Khiếu nại sau 30 ngày
- Lỗi từ phía nhà tuyển dụng (ngoài Fly Labour)`,
};

export default function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicy();
  }, [slug]);

  const loadPolicy = async () => {
    setLoading(true);
    try {
      const result = await settingsApi.getAll();
      const policies = result?.data?.policies
        ? JSON.parse(result.data.policies)
        : [];
      const found = policies.find((p: Policy) => p.slug === slug);
      if (found) {
        setPolicy(found);
      } else {
        // Fallback
        setPolicy(null);
      }
    } catch {
      setPolicy(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  const title = policy?.title || "Không tìm thấy trang";
  const markdown =
    policy?.content || defaultContent[slug!] || "Nội dung không có sẵn";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f00] via-brand-dark to-brand-dark" />
        <div className="relative max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-muted hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={18} /> Quay lại
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-brand-muted">Cập nhật lần cuối: 01/01/2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <div className="prose prose-invert max-w-none">
          <div className="text-brand-muted leading-relaxed whitespace-pre-wrap">
            {markdown.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h1
                    key={i}
                    className="text-3xl font-bold text-white mt-8 mb-4"
                  >
                    {line.slice(2)}
                  </h1>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-2xl font-bold text-white mt-6 mb-3"
                  >
                    {line.slice(3)}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-xl font-bold text-white mt-4 mb-2"
                  >
                    {line.slice(4)}
                  </h3>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="ml-6 mb-2">
                    {line.slice(2)}
                  </li>
                );
              }
              if (line.trim() === "") {
                return <div key={i} className="mb-4" />;
              }
              return (
                <p key={i} className="mb-3">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 px-6 border-t border-brand-border text-center bg-brand-card">
        <p className="text-brand-muted text-sm mb-4">
          Có câu hỏi hay nhận xét?
        </p>
        <Link
          to="/contact"
          className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
        >
          Liên hệ chúng tôi
        </Link>
      </section>
    </div>
  );
}
