import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";

const FAQS = [
  {
    category: "Về chương trình",
    items: [
      {
        q: "Fly Labour là gì?",
        a: "Fly Labour là nền tảng kết nối lao động Việt Nam với nhà tuyển dụng ở nước ngoài, chủ yếu tại Úc, Canada và New Zealand. Chúng tôi hỗ trợ toàn bộ quy trình từ tìm việc, chuẩn bị hồ sơ, xin visa cho đến khi bạn xuất cảnh và bắt đầu làm việc.",
      },
      {
        q: "Fly Labour có được cấp phép hoạt động không?",
        a: "Có. Fly Labour được Bộ Lao động – Thương binh và Xã hội (LĐTBXH) cấp phép hoạt động đưa người lao động đi làm việc ở nước ngoài theo hợp đồng. Chúng tôi hoạt động hoàn toàn hợp pháp và minh bạch.",
      },
      {
        q: "Chi phí sử dụng dịch vụ là bao nhiêu?",
        a: "Việc tìm kiếm và ứng tuyển công việc hoàn toàn miễn phí. Các chi phí liên quan đến visa, giấy tờ pháp lý sẽ được thông báo rõ ràng và minh bạch trước khi bạn đồng ý. Chúng tôi không thu phí môi giới trái phép.",
      },
    ],
  },
  {
    category: "Điều kiện & Yêu cầu",
    items: [
      {
        q: "Tôi cần đáp ứng những điều kiện gì để đi lao động nước ngoài?",
        a: "Điều kiện cơ bản: Công dân Việt Nam, tuổi từ 18–45 (tùy vị trí), sức khỏe tốt, không có tiền án tiền sự, hộ chiếu còn hạn ít nhất 2 năm. Yêu cầu cụ thể về kinh nghiệm, ngôn ngữ tùy thuộc từng vị trí và quốc gia.",
      },
      {
        q: "Không biết tiếng Anh có được không?",
        a: "Nhiều vị trí không yêu cầu tiếng Anh cao, đặc biệt trong lĩnh vực nông nghiệp, chế biến thực phẩm, xây dựng. Fly Labour có chương trình đào tạo tiếng Anh giao tiếp cơ bản dành riêng cho người lao động trước khi xuất cảnh.",
      },
      {
        q: "Tôi có thể mang gia đình đi cùng không?",
        a: "Tùy thuộc vào loại visa và chương trình. Một số chương trình tại Canada và Úc có pathway cho phép bảo lãnh người thân sau một thời gian làm việc. Tư vấn viên sẽ hỗ trợ bạn tìm hiểu từng trường hợp cụ thể.",
      },
    ],
  },
  {
    category: "Quy trình & Thời gian",
    items: [
      {
        q: "Từ khi nộp hồ sơ đến khi xuất cảnh mất bao lâu?",
        a: "Thông thường từ 2–6 tháng tùy vị trí và quốc gia. Cụ thể: xét duyệt hồ sơ 1–2 tuần, phỏng vấn 1–2 tuần, làm visa 1–3 tháng, chuẩn bị xuất cảnh 2–4 tuần.",
      },
      {
        q: "Hợp đồng lao động thường có thời hạn bao lâu?",
        a: "Đa số hợp đồng có thời hạn từ 1–3 năm, có thể gia hạn tùy nhu cầu của nhà tuyển dụng và nguyện vọng của người lao động. Một số chương trình có lộ trình định cư lâu dài.",
      },
      {
        q: "Tôi có thể về nước trước khi hết hợp đồng không?",
        a: "Có thể, nhưng cần thông báo trước và có thể phát sinh chi phí phá vỡ hợp đồng. Trong trường hợp khẩn cấp (gia đình, sức khỏe), Fly Labour sẽ hỗ trợ giải quyết trực tiếp với nhà tuyển dụng.",
      },
    ],
  },
  {
    category: "Quyền lợi & Bảo hiểm",
    items: [
      {
        q: "Người lao động được hưởng những quyền lợi gì?",
        a: "Người lao động được hưởng đầy đủ quyền lợi theo luật lao động của nước sở tại: lương tối thiểu theo quy định, bảo hiểm y tế, bảo hiểm tai nạn lao động, ngày nghỉ phép, nghỉ lễ có lương.",
      },
      {
        q: "Lương có được trả đúng không?",
        a: "Hợp đồng lao động được ký kết rõ ràng về mức lương, thời gian làm việc và các khoản phụ cấp. Fly Labour giám sát việc thực thi hợp đồng và có cơ chế khiếu nại nếu nhà tuyển dụng vi phạm.",
      },
      {
        q: "Nếu gặp vấn đề ở nước ngoài, tôi liên hệ với ai?",
        a: "Fly Labour có đường dây hỗ trợ 24/7 cho người lao động đang ở nước ngoài. Ngoài ra, Đại sứ quán/Lãnh sự quán Việt Nam tại từng quốc gia cũng hỗ trợ trong các trường hợp khẩn cấp.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-brand-border bg-white dark:bg-brand-card shadow-sm dark:shadow-none rounded-2xl overflow-hidden transition-colors">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
      >
        <span className="text-slate-900 dark:text-white text-sm font-medium">{q}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 dark:text-gray-300 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 dark:border-brand-border/60 bg-slate-50/50 dark:bg-transparent">
          <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 dark:opacity-10 pointer-events-none"
          style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-4">
            FAQ
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5">
            Câu hỏi
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              thường gặp
            </span>
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-lg">
            Giải đáp mọi thắc mắc về quy trình đi lao động nước ngoài cùng Fly Labour.
          </p>
        </div>
      </div>

      {/* FAQ list */}
      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {FAQS.map((group) => (
            <div key={group.category}>
              <h2 className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-4">
                {group.category}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6 border-t border-slate-200 dark:border-brand-border bg-slate-100/50 dark:bg-brand-card/20 transition-colors">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Chưa tìm được câu trả lời?
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-8">
            Liên hệ trực tiếp với đội ngũ tư vấn — chúng tôi luôn sẵn sàng hỗ trợ bạn.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Liên hệ ngay <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
